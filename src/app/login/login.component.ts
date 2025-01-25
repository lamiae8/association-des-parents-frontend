import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Adulte, AuthentificationControllerService} from '../swaggerFiles';
import {Router, RouterLink} from "@angular/router";
import * as jwt_decode from 'jwt-decode';
import {AuthentificationService} from "../authentification.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthentificationControllerService]
})
export class LoginComponent {
  loginForm = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
    motDePasse: new FormControl('', [Validators.required])
  });
  loginError: string | null = null;
  constructor(private authenService: AuthentificationService,private authService: AuthentificationControllerService, private router: Router) {}

  log() {
    if (this.loginForm.valid) {
      const loginCredentials: { motDePasse: string | null | undefined; mail: string | null | undefined } = {
        mail: this.loginForm.value.mail,
        motDePasse: this.loginForm.value.motDePasse
      };
      this.authService.authLoginPost(loginCredentials as Adulte).subscribe({
        next: (response) => {
          const tokenString = response.token.string;
          console.log('Token String:', tokenString);

          try {
            const tokenPayload = jwt_decode.jwtDecode(tokenString);
            console.log(tokenPayload);
            //localStorage.setItem('token', tokenString);
            this.authenService.login(tokenString);
            this.router.navigateByUrl('/event');

          } catch (error) {
            console.error("Erreur lors du décodage du token:", error);
          }
        },
        error: (error) => {
          console.error('Authentication failed:', error);
          this.loginError = "Échec de l'authentification. Veuillez vérifier vos identifiants et essayer de nouveau.";

        }
      });

    }
  }
}

