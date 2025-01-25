import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';
import { AdulteService } from '../swaggerFiles';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {AuthentificationService} from "../authentification.service";




@Component({
  selector: 'app-inscription',
  standalone: true,
  templateUrl: './inscription.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [AdulteService],
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;

  constructor(private fb: FormBuilder, private adulteService: AdulteService,private router: Router,private authenService: AuthentificationService) {
    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      telephone: [''],
      eleves: this.fb.array([])
    });
  }


  get eleves() {
    return this.inscriptionForm.get('eleves') as FormArray;
  }


  ajouterEleve() {
    const eleveForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      niveau: ['', Validators.required],
    });
    this.eleves.push(eleveForm);
  }



  supprimerEleve(index: number) {
    this.eleves.removeAt(index);
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      const elevesAvecDatesConverties = this.inscriptionForm.value.eleves.map((eleve: any) => ({
        ...eleve,
        dateNaissance: this.authenService.convertirDateFormat(eleve.dateNaissance)

      }));

      const adulteData = {
        ...this.inscriptionForm.value,
        role: 'PARENT',
        eleves: elevesAvecDatesConverties
      };

      this.adulteService.adultePost(adulteData).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription', error);
        }
      });
    }
  }

}
