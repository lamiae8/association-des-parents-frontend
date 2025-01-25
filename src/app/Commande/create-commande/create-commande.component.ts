import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  Adulte,
  AdulteService,
  Commande,
  CommandeProduit,
  CommandeService,
  Eleve,
  Evenement,
  EvenementService
} from "../../swaggerFiles";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthentificationService} from "../../authentification.service";

@Component({
  selector: 'app-create-commande',
  standalone: true,
  providers: [CommandeService, AdulteService, EvenementService],
    imports: [
        CurrencyPipe,
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './create-commande.component.html',
  styleUrl: './create-commande.component.css'
})
export class CreateCommandeComponent implements OnInit {
  evenementId: number | null = null;
  commandeForm: FormGroup;
  commande: Commande | undefined;
  evenement: Evenement | undefined;
  eleves: Array<Eleve> | undefined = [];
  adulte: Adulte | undefined;
  errorMessageEnfant: string = '';
  errorMessageProduit: string = '';
  commandeProduit : CommandeProduit | undefined;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private fb: FormBuilder,
    private adulteService: AdulteService,
    private evenementService: EvenementService,
    private authService: AuthentificationService,
    private router: Router
  ) {
    this.commandeForm = this.fb.group({
      commandeProduits: this.fb.array([]),
      eleve: [''],
    });
  }

  ngOnInit(): void {
    this.evenementId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.evenementId) {
      this.loadEvenements(this.evenementId);
      this.loadEleves();
    }
  }
  loadEleves(): void {
    console.log(localStorage.getItem('mail'));
    if (localStorage.getItem('mail')) {
      this.adulteService.adulteMailMailGet(this.authService.getMail()).subscribe(adulte => {
        this.adulte = adulte;
        this.eleves = adulte.eleves;
      });
    }
  }

  loadEvenements(id : number): void{
    this.evenementService.evenementIdGet(id).subscribe(data => {
      this.evenement = data;
      if (data) {
        // @ts-ignore
        const commandeProduitsFormGroups = data.produitList.map(produit =>
          this.fb.group({
            quantite: [0, Validators.required],
          })
        );
        const commandeProduitsFormArray = this.fb.array(commandeProduitsFormGroups);
        this.commandeForm.setControl('commandeProduits', commandeProduitsFormArray);
      }
    });
  }

  get commandeProduitsFormArray(): FormArray {
    return this.commandeForm.get('commandeProduits') as FormArray;
  }

  saveCommande(): void {
    // Vérification préliminaire pour l'événement, l'adulte, et la validité du formulaire
    if (this.evenement && this.adulte && this.commandeForm.valid) {
      // Vérification si un enfant doit être choisi
      if (this.evenement.avecEleve === true && this.commandeForm.value.eleve === "") {
        this.errorMessageEnfant = 'Un enfant doit être choisi';
        return; // Arrête l'exécution de la fonction ici
      }

      // Vérification si au moins un produit a été choisi
      const tousLesProduitsAZero = this.commandeForm.value.commandeProduits.every((item: { quantite: number }) => item.quantite === 0);
      if (tousLesProduitsAZero) {
        this.errorMessageProduit = 'Au moins un produit doit être choisi';
        return; // Arrête l'exécution de la fonction ici
      }

      const filteredProduits = this.commandeForm.value.commandeProduits
        .map((item: { quantite: number }, index: number) => {
          const produit = this.evenement?.produitList?.[index];
          return {
            produit: produit,
            quantite: item.quantite,
          };
        })
        .filter((item: { quantite: number }) => item.quantite > 0);

      const atLeastOneNonOptionalProduct = filteredProduits.some((item: CommandeProduit) => item.produit?.option === false);

      if (!atLeastOneNonOptionalProduct) {
        this.errorMessageProduit = 'Au moins un produit non optionnel doit être choisi';
        return;
      }

      const newCommande: Commande = {
        evenement: this.evenement.id,
        adulte: this.adulte,
        commandeProduits: filteredProduits
      };

      if (this.commandeForm.value.eleve !== "") {
        newCommande.eleve = this.commandeForm.value.eleve;
      }

      this.commandeService.commandePost(newCommande).subscribe({
        next: () => {
          console.log('Commande created successfully');
          this.router.navigate(['/mesCommandes']);
        },
        error: (error) =>
          console.error('Error creating the commande', error)
      });
    }
  }

}
