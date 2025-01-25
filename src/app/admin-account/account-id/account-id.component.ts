import { Component, OnInit } from '@angular/core';
import { Adulte, Eleve, AdulteService, } from '../../swaggerFiles';
import { ActivatedRoute } from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {AuthentificationService} from "../../authentification.service";

@Component({
  selector: 'app-account-id',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './account-id.component.html',
  styleUrl: './account-id.component.css',
  providers: [AdulteService,]
})
export class AccountIdComponent implements OnInit {
  adulteId: any;
  isAdmin: boolean = false;
  adultes: Adulte[]=[];
  adulte: Adulte = {} as Adulte;
  eleve: Eleve[]=[ ]

  constructor(private route: ActivatedRoute, private adulteService: AdulteService,
    private authenService: AuthentificationService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.adulteId = Number(params['id']);
      this.adulteId= this.route.snapshot.queryParamMap.get('id'); 
      console.log(this.adulteId);
    });
    this.loadAdultes();
console.log(this.adulte)

  }
  loadAdultes(): void {
    this.adulteService.adulteIdGet(this.adulteId).subscribe((data:Adulte) => {
      this.adulte=data;

    }
    //, error => {
    //  console.error('Error fetching adults:', error);
    //});
    )
  }
}
