import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventByIdComponent } from './event-by-id.component';

describe('EventByIdComponent', () => {
  let component: EventByIdComponent;
  let fixture: ComponentFixture<EventByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventByIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
