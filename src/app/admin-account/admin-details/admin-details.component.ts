import { Component, OnInit } from '@angular/core';
import { Adulte, AdulteService, Role } from '../../swaggerFiles';
import {NgForOf, NgIf} from "@angular/common";
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  templateUrl: './admin-details.component.html',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrl: './admin-details.component.css',
  providers: [AdulteService]
})
export class AdminDetailsComponent implements OnInit {
  adulte: Adulte={}
  adultes: Adulte[]=[]

  constructor(private adulteService: AdulteService, private router: Router) { }

  ngOnInit(): void {
    this.loadAdultes();
  }

  loadAdultes(): void {
    this.adulteService.adulteGet().subscribe((data: Adulte[]) => {
      this.adultes = data;
    }, error => {
      console.error('Error fetching adults:', error);
    });
  }


  redirectToAdminDetail(id: number | undefined): void {
      this.router.navigateByUrl(`/account/?id=${id}`);
  }
  modifierAdmin(form: NgForm): void {
    if (this.adultes) {
      this.adulteService.adultePut(this.adulte).subscribe(response => {
        console.log('Admin updated successfully:', response);
      }, error => {
        console.error('Error updating admin:', error);
      });
    }
  }

}
