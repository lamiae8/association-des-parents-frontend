import { Component, OnInit } from '@angular/core';
import { Evenement, EvenementService } from '../../../swaggerFiles';
import {NgForOf, NgIf} from "@angular/common";
import { Router } from '@angular/router';
import {AuthentificationService} from "../../../authentification.service";


@Component({
  selector: 'app-event',
  standalone: true,
  templateUrl: './event.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrl: './event.component.css',
  providers: [EvenementService]
})
export class EventComponent implements OnInit {
  evenements: Evenement[] = [];

  constructor(private evenementService: EvenementService, private router: Router,private authService: AuthentificationService) { }

  ngOnInit() {
    this.evenementService.evenementGet().subscribe((data: Evenement[]) => {
      this.evenements = data;
      this.evenements.forEach((evenement) => {
        evenement?.distributionList?.forEach((distribution) => {
        distribution.dateDistribution = this.formatDate(distribution.dateDistribution || ""); //respect the date format
      });
    });
    });
  }
  isAdm():boolean{
    return this.authService.isAdmin() || this.authService.isSuperAdmin();
  }

  redirectToEventDetail(id: number | undefined): void {
    this.router.navigateByUrl(`/event/?id=${id}`);
  }
  redirectToEventUpdate(id: number | undefined): void {
    this.router.navigateByUrl(`/event/update?id=${id}`);
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
