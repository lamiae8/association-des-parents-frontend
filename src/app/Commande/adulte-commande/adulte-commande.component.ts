import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../swaggerFiles';
import * as jwt_decode from 'jwt-decode';
import { Commande } from '../../swaggerFiles';
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-adulte-commande',
  templateUrl: './adulte-commande.component.html',
  styleUrls: ['./adulte-commande.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  providers: [CommandeService]
})
export class AdulteCommandeComponent implements OnInit {
  commandes: Commande[] = [];
  commandesNonPayees: Commande[] = [];
  commandesPayees: Commande[] = [];

  constructor(private commandeService: CommandeService,private router: Router) {}

  ngOnInit() {
    this.loadCommandes();
  }
  getTotal(produit: any): number {
    return produit.quantite * (produit.produit?.prix ?? 0);
  }

  loadCommandes() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      const adulteId = decodedToken.id;
      this.commandeService.commandeAdulteIdGet(adulteId).subscribe(commandes => {
        this.commandes = commandes;
        this.commandesNonPayees = this.commandes.filter(commande => !commande.payer);
        this.commandesPayees = this.commandes.filter(commande => commande.payer);
      });

    }
  }
  deleteCommandes(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.commandeIdDelete(id).subscribe({
        next: () => {
          console.log('Commande supprimée avec succès');

          this.router.navigate(['/mesCommandes']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => console.error('Erreur lors de la suppression de la commande', error)
      });
    }
  }

}
