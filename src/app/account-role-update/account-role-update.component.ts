import { Component, OnInit } from '@angular/core';
import { AdulteService } from '../swaggerFiles';
import { Adulte } from '../swaggerFiles';
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-role-update',
  templateUrl: './account-role-update.component.html',
  standalone: true,
  styleUrls: ['./account-role-update.component.css'],
  imports: [
    NgIf,
    FormsModule
  ],
  providers: [AdulteService]
})
export class AccountRoleUpdateComponent implements OnInit {
  searchEmail: string = '';
  adulte: Adulte | undefined;
  message: string | undefined;

  constructor(private adulteService: AdulteService, private router: Router) {}

  ngOnInit(): void {
  }

  getAdulteByEmail(email: string): void {
    this.adulteService.adulteMailMailGet(email).subscribe({
      next: (data) => {
        this.adulte = data;
        this.message = undefined;
      },
      error: (err) => {
        this.adulte = undefined;
        this.message = "Le compte n'existe pas.";
        console.error(err);
      }
    });
  }

  updateRole(): void {
    if (this.adulte) {
      this.adulteService.adulteRolePut(this.adulte).subscribe({
        next: (updatedAdulte) => {
          this.adulte = updatedAdulte;
          console.log('Rôle mis à jour avec succès');
          this.router.navigateByUrl('/event');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du rôle', error);
        }
      });
    }
  }
}

