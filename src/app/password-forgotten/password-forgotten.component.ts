import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../authentification.service';
import { AuthentificationControllerService } from '../swaggerFiles';

@Component({
  standalone: true,
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.css'],
  providers: [AuthentificationControllerService]
})
export class PasswordForgottenComponent {
  message = '';
  messageType = '';

  constructor(private authenService: AuthentificationService,private authService: AuthentificationControllerService) { }

  sendResetLink() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    this.authService.authRequestPasswordResetPost(email).subscribe(
        () => {
          this.message = 'Le lien de réinitialisation de votre mot de Passe a été envoyé à votre email.';
          this.messageType = 'success';
        },
        () => {
          this.message = "Cet email n'est acossié à aucun compte. Veuillez réessayer.";
          this.messageType = 'error';
        }
      );
  }
}
