import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommandeComponent } from './create-commande.component';

describe('CreateCommandeComponent', () => {
  let component: CreateCommandeComponent;
  let fixture: ComponentFixture<CreateCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
