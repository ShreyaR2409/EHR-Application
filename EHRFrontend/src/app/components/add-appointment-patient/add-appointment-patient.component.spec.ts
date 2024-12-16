import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentPatientComponent } from './add-appointment-patient.component';

describe('AddAppointmentPatientComponent', () => {
  let component: AddAppointmentPatientComponent;
  let fixture: ComponentFixture<AddAppointmentPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAppointmentPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppointmentPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
