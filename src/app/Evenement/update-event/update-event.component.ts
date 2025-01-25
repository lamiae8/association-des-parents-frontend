import { Component ,OnInit} from '@angular/core';
import { Evenement, EvenementService, Produit, Distribution } from '../../swaggerFiles';
import { CommonModule } from '@angular/common';
import {NgForm, FormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [EvenementService],
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.css'
})
export class UpdateEventComponent implements OnInit{
  constructor(private route: ActivatedRoute, private eventService: EvenementService,private router: Router){}
  evenementId?:any ;
  evenement: Evenement={avecEleve: false};

  produit: Produit={"option":false};
  distribution: Distribution={};

  produits: Produit[] = [];
  distributions: Distribution[] = [];
  auMoinsOptionFalse: any=false;

  ngOnInit() {   
    this.evenementId= this.route.snapshot.queryParamMap.get('id');
    this.eventService.evenementIdGet(this.evenementId).subscribe(res =>{
      this.evenement=res;
      console.log(this.evenement)
    })

    this.produit={};
    this.evenement?.produitList?.push(this.produit);
    this.distribution={};
    this.evenement?.distributionList?.push(this.distribution);
   }
 /* addProduct(){
    // Find the maximum id from existing products
  const maxId = this.evenement?.produitList?.reduce((max, produit) => (produit.id && produit.id > max) ? produit.id : max, 0);
  
    const newProduit: Produit = {
      id: maxId! + 1, // Generate a unique ID
      option: false, // or whatever default values you want
    };
    this.evenement?.produitList?.push(newProduit);
  }
  removeProduct(index: any){
    this.evenement?.produitList?.splice(index,1);
  }
  addDistribution(){
    this.distribution={
      id:this.evenement!.distributionList!.length +1,
    };
    this.evenement?.distributionList?.push(this.distribution);
  }
  removeDistribution(index: any){
    this.evenement?.distributionList?.splice(index,1);
  }
  */
  auMoinsUnProduitAOptionFalse(): boolean {
    // Check if produitList is defined and not null
    if (this.evenement && this.evenement.produitList) {
      // Use optional chaining to safely access produitList and some()
      return this.evenement.produitList.some(produit => !produit.option);
    } else {
      // Return false if produitList is undefined or null
      return false;
    }
  }

  updateEvent(){
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
    // si l'option n'est pas checker returner false au lieu de undefined
    this.produits.forEach((produit) => {
      if(  produit.option === undefined ){
        produit.option=false

      }}); 
      
console.log(this.evenement)
this.auMoinsOptionFalse = this.auMoinsUnProduitAOptionFalse();
    console.log(this.evenement)
    if (this.auMoinsOptionFalse) {
this.eventService.evenementPut(this.evenement as Evenement).subscribe(() => {
  console.log(this.evenement)
  this.router.navigateByUrl(`/event`);
});
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
