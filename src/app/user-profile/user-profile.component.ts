import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AdulteService, Eleve} from '../swaggerFiles';
import * as jwt_decode from 'jwt-decode';
import { Adulte } from '../swaggerFiles';
import {NgForOf} from "@angular/common";
import {AuthentificationService} from "../authentification.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, RouterLink],
  providers: [AdulteService]
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  isEmailDisabled: boolean = true;
  constructor(private fb: FormBuilder, private adulteService: AdulteService, private router: Router,private authService: AuthentificationService) {
    this.userProfileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: [{ value: '', disabled: this.isEmailDisabled }, [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      eleves: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }
  get eleves(): FormArray {
    return this.userProfileForm.get('eleves') as FormArray;
  }

  newEleve(eleve?: Eleve): FormGroup {
    return this.fb.group({
      id: [eleve?.id],
      nom: [eleve?.nom, Validators.required],
      prenom: [eleve?.prenom, Validators.required],
      dateNaissance: [eleve?.dateNaissance, Validators.required],
      niveau: [eleve?.niveau, Validators.required]
    });
  }

  addEleve(eleve?: Eleve) {
    const eleveFormGroup = this.fb.group({
      id: [eleve?.id || ''],
      nom: [eleve?.nom || '', Validators.required],
      prenom: [eleve?.prenom || '', Validators.required],
      dateNaissance: [eleve?.dateNaissance, Validators.required],
      niveau: [eleve?.niveau || '', Validators.required]
    });
    this.eleves.push(eleveFormGroup);
  }
  removeEleve(index: number) {
    this.eleves.removeAt(index);
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    const adulteJson = localStorage.getItem('adulte');
    if (adulteJson) {
      const adulte: Adulte = JSON.parse(adulteJson);
      this.userProfileForm.patchValue({
        nom: adulte.nom || '',
        prenom: adulte.prenom || '',
        mail: adulte.mail || '',
        telephone: adulte.telephone || ''
      });
      this.eleves.clear();
      adulte.eleves?.forEach(eleve => {
        if (eleve.dateNaissance) {
          eleve.dateNaissance = this.authService.convertDateToISOFormat(eleve.dateNaissance);
        }
        this.addEleve(eleve);
      });

    }
    else if (token) {
      try {
        const decodedToken: any = jwt_decode.jwtDecode(token);
        this.userProfileForm.patchValue({
          nom: decodedToken.nom || '',
          prenom: decodedToken.prenom || '',
          mail: decodedToken.upn || '',
          telephone: decodedToken.telephone || ''
        });

        const elevesFromToken: Eleve[] = JSON.parse(decodedToken.eleves || '[]');
        elevesFromToken.forEach(eleve => {
          if (eleve.dateNaissance) {
            eleve.dateNaissance = this.authService.convertDateToISOFormat(eleve.dateNaissance);
          }
          this.addEleve(eleve);
        });
      } catch (error) {
        console.error("Erreur lors du décodage du JWT", error);
      }
    }
  }

  updateUserProfile() {
    if (this.userProfileForm.valid) {
      const token = localStorage.getItem('token');
      let decodedToken : any;
      if (token) {
        decodedToken = jwt_decode.jwtDecode(token);
      }
      const updatedEleves = this.eleves.value.map((eleve: Eleve) => ({
        ...eleve,
        dateNaissance: eleve.dateNaissance ? this.authService.convertirDateFormat(eleve.dateNaissance):""
      }));
      const updatedUserInfo: Adulte = {
        ...this.userProfileForm.getRawValue(),
        mail: this.userProfileForm.get('mail')?.value,
        role: decodedToken?.role,
        active: decodedToken?.active,
        eleves:updatedEleves
      };

      this.adulteService.adultePut(updatedUserInfo).subscribe({
        next: (response) => {
          console.log('Mise à jour réussie');
          this.authService.updateAdulteInfo(response);
          localStorage.setItem('adulte', JSON.stringify(this.authService.getAdulte()));
          this.router.navigate(['/event']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour', error);
        }
      });
    }
  }
}
