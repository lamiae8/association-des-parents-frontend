import { Component,OnInit } from '@angular/core';
import { Evenement, EvenementService, Produit, Distribution } from '../../swaggerFiles';
import { CommonModule } from '@angular/common';
import {NgForm, FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [EvenementService],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit{
  evenement: Evenement={avecEleve: false};

  produit: Produit={"option":false};
  distribution: Distribution={};

  produits: Produit[] = [];
  distributions: Distribution[] = [];
  auMoinsOptionFalse: any=false;
  constructor(private evenementService: EvenementService, private router: Router) { }

  ngOnInit() {   
   this.produit={};
   this.produits.push(this.produit);
   this.distribution={};
   this.distributions.push(this.distribution);
  }
  addProduct(){
    this.produit={};
    this.produits.push(this.produit);
  }
  removeProduct(index: any){
    this.produits.splice(index,1);
  }
  addDistribution(){
    this.distribution={};
    this.distributions.push(this.distribution);
  }
  removeDistribution(index: any){
    this.distributions.splice(index,1);
  }
  auMoinsUnProduitAOptionFalse(): boolean {
    if (this.produits) {
      // Use optional chaining to safely access produitList and some()
      return this.produits.some(produit => !produit.option);
    } else {
      // Return false if produitList is undefined or null
      return false;
    }
  }
  eventform(form: NgForm) {
    console.log(this.produits)
    this.distributions.forEach((distribution) => {
      distribution.dateDistribution = this.formatDate(distribution.dateDistribution || ""); //respect the date format
    });
    this.produits.forEach((produit) => {
      if(  produit.option === undefined ){
        produit.option=false

      }
       
    }); 
    console.log(form.value);
    this.evenement.nom=form.value.nom,
    this.evenement.dateDebut=format(form.value.dateDebut, 'dd/MM/yyyy'),
    this.evenement.dateFin=format(form.value.dateFin, 'dd/MM/yyyy'),
    this.evenement.datePaiement=format(form.value.datePaiement, 'dd/MM/yyyy'),
    this.evenement.produitList=this.produits || [],
    this.evenement.distributionList=this.distributions,
    this.evenement.valider=false,
    this.evenement.avecEleve=form.value.avecEleve,

    this.auMoinsOptionFalse = this.auMoinsUnProduitAOptionFalse();
    console.log(this.evenement)
    if (this.auMoinsOptionFalse) {
      console.log(this.auMoinsOptionFalse)
      // Soumettez le formulaire ou effectuez d'autres actions nécessaires
      this.evenementService.evenementPost(this.evenement).subscribe(
        (response) => {
          console.log('Event updated successfully:', response);
          //redirect to list events
          this.router.navigateByUrl('/event');
        },
        (error) => {
          console.error('Error updated event:', error);
        }
      );
    } else {
      // Affichez un message d'erreur ou empêchez la soumission du formulaire
      console.log('Erreur: Aucun produit avec option=false trouvé.');
    }
    
  
  }
 formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }


}
