import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToAppointmentComponent } from './go-to-appointment.component';

describe('GoToAppointmentComponent', () => {
  let component: GoToAppointmentComponent;
  let fixture: ComponentFixture<GoToAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoToAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoToAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
