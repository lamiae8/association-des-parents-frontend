import { Component,OnInit } from '@angular/core';
import { Adulte, AdulteService, Role } from '../../swaggerFiles';
import { CommonModule } from '@angular/common';
import {NgForm, FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
  providers: [AdulteService]
})
export class CreateAdminComponent implements OnInit{
  adulte: Adulte={}
  adultes: Adulte[] = [];
  roles: Role[] = ['PROFESSOR','PARENT', 'ADMIN'];
  errorMessage: string = '';

  constructor(private adulteService: AdulteService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.errorMessage = ''; 
      
      const newAdmin: Adulte = {
        nom: form.value.nom,
        prenom: form.value.prenom,
        mail: form.value.mail,
        telephone: form.value.telephone,
        motDePasse: form.value.motDePasse,
        role: form.value.role
        
    };
console.log(newAdmin)
    
      this.adulteService.adultePost(newAdmin).subscribe(
        () => {
          
          this.router.navigateByUrl('/admin-details');
        },
        error => {
          console.error('Error creating account:', error);
          this.errorMessage = 'Error creating account. Please try again.'; 
        }
      );
    } else {
      
      this.errorMessage = 'Please fill out all required fields.';
    }
  }
} 