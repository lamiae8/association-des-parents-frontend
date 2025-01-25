import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthentificationService} from "../authentification.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isUserMenuOpen = false;
  isAdminMenuOpen = false;
  constructor(private authService: AuthentificationService, private router: Router,private authenService: AuthentificationService) {

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }
  derouleUser() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  derouleAdmin() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }
  isLoggedIn(){
    return this.authenService.isLoggedIn();
  }

}
