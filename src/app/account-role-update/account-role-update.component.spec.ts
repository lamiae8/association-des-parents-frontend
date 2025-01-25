import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRoleUpdateComponent } from './account-role-update.component';

describe('AccountRoleUpdateComponent', () => {
  let component: AccountRoleUpdateComponent;
  let fixture: ComponentFixture<AccountRoleUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountRoleUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountRoleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
