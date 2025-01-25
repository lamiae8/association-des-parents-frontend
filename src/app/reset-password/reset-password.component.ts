import { Component } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { AuthentificationControllerService } from '../swaggerFiles';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [AuthentificationControllerService]
})
export class ResetPasswordComponent {
  message = '';
  messageType = '';

  constructor(private authenService: AuthentificationService, private authService: AuthentificationControllerService) { }

  resetPassword() {
    const token = window.location.pathname.split('/').pop();
    const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
    const retypePassword = (document.getElementById('retypePassword') as HTMLInputElement).value;
  
    if (newPassword !== retypePassword) {
      this.message = "Les mots de passe ne correspondent pas. Veuillez réessayer.";
      this.messageType = 'error';
      return;
    }
  
    this.authService.authResetPasswordPost(newPassword, token ).subscribe(
      () => {
        this.message = 'Votre mot de passe a été réinitialisé avec succès.';
        this.messageType = 'success';
      },
      (error) => {
        console.log(error);
        this.message = error.error;
        this.messageType = 'error';
      }
    );
  }
}