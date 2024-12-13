import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UtilityService } from '../../services/Utility/utility.service';
// import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.css'
})
export class PatientRegistrationComponent {
  countries: any[] = [];
  states: any[] = [];
  roles: any[] = [];
  genders: any[] = [];
  specialisations: any[] =[];
  bloodGroups: any[] = [];
  selectedFile: File | null = null;
  isLoading = false;
  todayDate: string = '';

  constructor(private router: Router, private authService: AuthService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.getGender();
  }

  RegistrationForm = new FormGroup({
    FirstName: new FormControl("", [Validators.required]),
    LastName: new FormControl("", [Validators.required]),
    Dob: new FormControl("", [Validators.required]),
    Email: new FormControl("", [Validators.required, Validators.email]),
    GenderId: new FormControl(null, [Validators.required]),
    BloodGroupId: new FormControl(null, [Validators.required]),
    Address: new FormControl("", [Validators.required]),
    CountryId: new FormControl(null, [Validators.required]),
    City: new FormControl("", [Validators.required]),
    StateId: new FormControl(null, [Validators.required]),
    PinCode: new FormControl("", [Validators.required]),
    UserTypeId: new FormControl(null, [Validators.required]),
    ProfileImage: new FormControl("", [Validators.required]),
    PhoneNumber: new FormControl("", [Validators.required])
  })

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.RegistrationForm.patchValue({ ProfileImage: file });
      this.RegistrationForm.get('profileimage')?.updateValueAndValidity();
    }
  }

  getGender() {
    console.log("Gender called");

    this.utilityService.getAllGenders().subscribe({
      next: (data: any) => {
        this.genders = data;
      },
      error: (error) => {

      }
    })
  }
  
  getRole(){
    this.utilityService.getAllRoles().subscribe({
      next:(data : any)=>{
        this.roles = data;
      },
      error:(error)=>{

      }
    })
  }

  getCountry(){
    this.utilityService.getAllCountries().subscribe({
      next:(data)=>{
        this.countries = data;
      },
      error:(error)=>{

      }
    })
  }

  getStates(CountryId : number){
    this.utilityService.getStatesByCountryId(CountryId).subscribe({
      next:(data)=>{
        this.states = data;
      },
      error:(error)=>{

      }
    })
  }

  getSpecialisation(){
    this.utilityService.getAllSpecialisations().subscribe({
      next:(data)=>{
        this.specialisations = data;
      },
      error:(error)=>{

      }
    })
  }

  getBloodGroup(){
    this.utilityService.getAllBloodGroups().subscribe({
      next:(data)=>{
        this.bloodGroups = data;
      },
      error:(error)=>{

      }
    })
  }
}
