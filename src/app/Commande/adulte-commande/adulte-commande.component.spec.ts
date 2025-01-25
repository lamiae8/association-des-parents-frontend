import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdulteCommandeComponent } from './adulte-commande.component';

describe('AdulteCommandeComponent', () => {
  let component: AdulteCommandeComponent;
  let fixture: ComponentFixture<AdulteCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdulteCommandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdulteCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
