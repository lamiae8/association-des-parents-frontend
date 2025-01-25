import {Component, OnInit} from '@angular/core';
import {Commande, Evenement, EvenementService, CommandeService, Adulte} from "../../swaggerFiles";
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf, NgIf, SlicePipe} from "@angular/common";
import {AuthentificationService} from "../../authentification.service";
import { format } from 'date-fns';


@Component({
  selector: 'app-event-by-id',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SlicePipe
  ],
  templateUrl: './event-by-id.component.html',
  styleUrl: './event-by-id.component.css',
  providers: [EvenementService, CommandeService]
})
export class EventByIdComponent implements OnInit{
  eventId: number = 0;
  evenement: Evenement = {} as Evenement;
  commande: Commande[] = [] as Commande[];
  currentPage: number = 1;
  commandeToValidate: Commande | undefined = {} as Commande;
  isAdmin: boolean = false;
  adulte:Adulte={};
  message = '';
  messageType = '';
  mailSent: boolean = false;


  constructor(private route: ActivatedRoute, private evenementService: EvenementService,
              private commandeService: CommandeService,private authenService: AuthentificationService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = Number(params['id']);
      this.isAdmin = this.isAdm();
    });

    this.loadEvent();
    this.loadCommande();

  }

  loadEvent(): void {
    this.evenementService.evenementIdGet(this.eventId).subscribe((data: Evenement) => {
      this.evenement = data;
      // regler la format du affichage des dates de distributions
      this.evenement?.distributionList?.forEach((distribution) => {
        distribution.dateDistribution = this.formatDate(distribution.dateDistribution || ""); //respect the date format
      });
  
    });
  }

  loadCommande(): void {
    this.commandeService.commandeEvenementIdGet(this.eventId).subscribe((data: Commande[]) => {
      this.commande = data;
    });
  }

  deleteThisEvent(): void {
    this.evenementService.evenementIdDelete(this.eventId).subscribe(() => {
      this.loadEvent();
      location.reload();
    });
  }
  // fonction pour formater la date de distribution en format dd/mm/yyyy hh:mm
  formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  validateEvent(): void {
    this.evenement.valider = true; // valider l'evenement
// format des dates (debut/fin/paiement et distribution)
    this.evenement?.distributionList?.forEach((distribution) => {
      distribution.dateDistribution = this.formatDate(distribution.dateDistribution || ""); //respect the date format
    });

    if (this.evenement.dateDebut) {
      this.evenement.dateDebut = format(new Date(this.evenement.dateDebut), 'dd/MM/yyyy');
    }
    if (this.evenement.dateFin) {
      this.evenement.dateFin = format(new Date(this.evenement.dateFin), 'dd/MM/yyyy');
    }
    if (this.evenement.datePaiement) {
      this.evenement.datePaiement = format(new Date(this.evenement.datePaiement), 'dd/MM/yyyy');
    }
    // modifier l'evenement
    this.evenementService.evenementPut(this.evenement as Evenement).subscribe(() => {
      this.loadEvent();
    });
  }

  validatePaiement(id: number | undefined): void {
    if(id !==undefined){
      this.commandeToValidate = this.findCommandeFromList(id);
        if (this.commandeToValidate !== undefined) {
          this.commandeToValidate.payer = true;
        }
        this.commandeService.commandePut(this.commandeToValidate as Commande).subscribe(() => {
          this.loadCommande();

      });
    }
  }

  validateDistribution(id: number | undefined): void {
    if(id !==undefined){
      this.commandeToValidate = this.findCommandeFromList(id);
      if (this.commandeToValidate !== undefined) {
        this.commandeToValidate.distribuer = true;
      }
      this.commandeService.commandePut(this.commandeToValidate as Commande).subscribe(() => {
        this.loadCommande();
      });
    }
  }

  findCommandeFromList(id: number): Commande | undefined {
    return this.commande.find(commande => commande.id === id);  }

  nextPage(): void {
    if ((this.currentPage * 10) < this.commande.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPageNumbers(): number[] {
    let totalPages = Math.ceil(this.commande.length / 10);

  // Augmenter totalPages d'une unité si le nombre est pair
  if (totalPages % 2 === 0) {
    totalPages += 1;
  }

    return Array.from({ length:totalPages }, (_, i) => i + 1);
  }
  generateAndDownloadCsv() {
    let csvContent = `Nom de l'évènement: ${this.evenement.nom}\n\n`;
    let produitQuantites: { [key: number]: { nom: string; fournisseur: string; quantite: number } } = {};

    this.commande.forEach(commande => {

      (commande.commandeProduits || []).forEach(cp => {
        const produitId = cp.produit?.id;
        if (typeof produitId === 'undefined') return;

        const nom = cp.produit?.nom || 'Produit Inconnu'; // Fournit une valeur par défaut pour `nom`
        const fournisseur = cp.produit?.fournisseur || 'Fournisseur Inconnu';
        const quantite = cp.quantite? cp.quantite : 0;

        if (produitQuantites[produitId]) {
          produitQuantites[produitId].quantite += quantite;
        } else {
          produitQuantites[produitId] = {
            nom,
            fournisseur,
            quantite
          };
        }
      });
    });

    csvContent += "Produit,Fournisseur,Quantité Globale\n";
    Object.values(produitQuantites).forEach((pq: any) => {
      csvContent += `${pq.nom},${pq.fournisseur},${pq.quantite}\n`;
    });

    this.downloadCsv(csvContent, `${this.evenement.nom}-produits.csv`);
  }

  private downloadCsv(csvContent: string, fileName: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  private isAdm(){
    return this.authenService.isSuperAdmin() || this.authenService.isAdmin();
  }

  goToCommandePage() {
    this.router.navigate(['/event/commande/', this.eventId]);
  }

  sendReminderMail() {
    console.log("alo"+this.eventId);
    this.commandeService.commandeSendReminderIdPost(this.eventId).subscribe(
      (response) => {
        this.message = response || "Mail envoyé avec succès.";
        this.messageType = 'success';
      },
      (error) => {
        this.message = error.message || "Une erreur s'est produite.";
        this.messageType = 'error';
      }
    );
  }
}
