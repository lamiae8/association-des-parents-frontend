import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import {AdulteService, CommandeService, Eleve, EvenementService} from '../../swaggerFiles';
import { Commande, CommandeProduit,Evenement } from '../../swaggerFiles';
import {CommonModule} from "@angular/common";
import {AuthentificationService} from "../../authentification.service";
@Component({
  selector: 'app-modifier-commande',
  templateUrl: './modifier-commande.component.html',
  styleUrls: ['./modifier-commande.component.css'],
  standalone: true,
  providers: [CommandeService,AdulteService,EvenementService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ModifierCommandeComponent implements OnInit {
  commandeId: number | null = null;
  commandeForm: FormGroup;
  commande: Commande | undefined;
  eleves: Array<Eleve> | undefined = [];
  event: Evenement | undefined;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private fb: FormBuilder,
    private adulteService: AdulteService,
    private authService: AuthentificationService,
    private eventService: EvenementService,
    private router: Router
  ) {
    this.commandeForm = this.fb.group({
      commandeProduits: this.fb.array([]),
      eleve: [''],
    });
  }

  ngOnInit(): void {
    this.commandeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.commandeId) {
      this.loadCommande(this.commandeId);
      this.loadEleves();
      this.loadEvent();
    }
  }
  loadEleves(): void {
    console.log(localStorage.getItem('mail'));
    if (localStorage.getItem('mail')) {
      this.adulteService.adulteMailMailGet(this.authService.getMail()).subscribe(adulte => {
        console.log(adulte.eleves);
        this.eleves = adulte.eleves;
      });
    }
  }
  loadEvent(): void {
    if(this.commande?.evenement){
      this.eventService.evenementIdGet(this.commande.evenement).subscribe(evenement =>{
        this.event = evenement;
      })
    }

  }
  deleteCommandeProduit(index: number): void {
    this.commandeProduitsFormArray.removeAt(index);
  }
  loadCommande(id: number): void {
    this.commandeService.commandeIdGet(id).subscribe(data => {
        this.commande = data;
        if (data.commandeProduits) {
          const commandeProduitsFormGroups = data.commandeProduits.map(produit =>
            this.fb.group({
              quantite: [produit.quantite, Validators.required],
            })
          );
          const commandeProduitsFormArray = this.fb.array(commandeProduitsFormGroups);
          this.commandeForm.setControl('commandeProduits', commandeProduitsFormArray);
        }
      },
      error => console.error('Error fetching the commande', error));
  }

  get commandeProduitsFormArray(): FormArray {
    return this.commandeForm.get('commandeProduits') as FormArray;
  }

  saveCommande(): void {
    if (this.commandeForm.valid && this.commande && this.commande.commandeProduits) {
      const updatedCommande: Commande = {
        ...this.commande,
        commandeProduits: this.commandeForm.value.commandeProduits.map((item: { quantite: number }, index: number) => {
          const Produit = this.commande?.commandeProduits?.[index];
          return {
            ...Produit,
            quantite: item.quantite
          };
        }),

      };
      if(this.commandeForm.value.eleve !== ""){
        updatedCommande.eleve = this.commandeForm.value.eleve;
      }

      this.commandeService.commandePut(updatedCommande).subscribe({
        next: () => {
          console.log('Commande updated successfully');
          this.router.navigate(['/mesCommandes']);
        },
        error: (error) =>
          console.error('Error updating the commande', error)
      });
    }
  }



}


