import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {Adulte} from "./swaggerFiles";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private isAuthenticated = false;
  private Admin = false;
  private SuperAdmin = false;
  private tok: any;
  private isActive: boolean = false;
  private adulte: Adulte | null = null;
  private mail:any;
  constructor() {
    this.initializeUserState();
  }

  private initializeUserState(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.login(token);
    }
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.tok = this.decryptToken(token);
    this.isAuthenticated = true;
    this.Admin = this.tok.role === "ADMIN";
    this.SuperAdmin = this.tok.role === "SUPER_ADMIN";
    this.isActive = this.tok.active;
    this.mail = this.tok.upn;
    localStorage.setItem('mail',this.mail);
  }

  logout(): void {
    localStorage.clear()
    this.isAuthenticated = false;
    this.Admin = false;
    this.SuperAdmin = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
  isAdmin(): boolean{
    return this.Admin;
  }
  isSuperAdmin(): boolean{
    return this.SuperAdmin;
  }

  convertirDateFormat(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }



  convertDateToISOFormat(dateString?: string): string {
    if (!dateString) return '';

    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return "";
  }


  convertDateToISOFormat2(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }


  decryptToken(token:string):any{
    return jwt_decode.jwtDecode(token);
  }

  updateAdulteInfo(updatedAdulte: Adulte) {
    this.adulte = updatedAdulte;
    this.Admin = updatedAdulte.role === 'ADMIN';
    this.SuperAdmin = updatedAdulte.role === 'SUPER_ADMIN';
    this.isActive = updatedAdulte.active === true;
  }
  getAdulte(): Adulte | null{
    return this.adulte;
  }
  getMail():any{
    return this.mail;
  }

}
