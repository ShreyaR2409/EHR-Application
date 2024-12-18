import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UtilityService } from '../../services/Utility/utility.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule, RouterLink],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.css'
})
export class PatientRegistrationComponent implements OnInit {
  countries: any[] = [];
  states: any[] = [];
  roles: any[] = [];
  genders: any[] = [];
  specialisations: any[] =[];
  bloodGroups: any[] = [];
  selectedFile: File | null = null;
  isLoading = false;
  todayDate = new Date().toISOString().split('T')[0]; 
  
  constructor(private router: Router, private authService: AuthService, private utilityService: UtilityService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getGender();
    this.getBloodGroup();
    this.getSpecialisation();
    this.getRole();
    this.getCountry();
  }

  RegistrationForm = new FormGroup({
    FirstName: new FormControl("", [Validators.required]),
    LastName: new FormControl("", [Validators.required]),
    Dob: new FormControl("", [Validators.required]),
    Email: new FormControl("", [Validators.required, Validators.email]),
    GenderId: new FormControl("", [Validators.required]),
    BloodGroupId: new FormControl("", [Validators.required]),
    Address: new FormControl("", [Validators.required]),
    CountryId: new FormControl("", [Validators.required]),
    City: new FormControl("", [Validators.required]),
    StateId: new FormControl("", [Validators.required]),
    PinCode: new FormControl("", [Validators.required,
      Validators.minLength(6),      
      Validators.maxLength(6)  
    ]),
    UserTypeId: new FormControl(2, [Validators.required]),
    ProfileImage: new FormControl(null, [Validators.required]),
    PhoneNumber: new FormControl("", [  Validators.required, Validators.pattern(/^[0-9]*$/), 
      Validators.minLength(10),      
      Validators.maxLength(10)      
      ])
  })

  validateMaxLength(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10); // Trim input to 10 digits
      this.RegistrationForm.get('PhoneNumber')?.setValue(input.value);
    }
  }
  
  validateMaxLengthPin(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 6) {
      input.value = input.value.slice(0, 6); 
      this.RegistrationForm.get('PinCode')?.setValue(input.value);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.RegistrationForm.patchValue({ ProfileImage: file });
      this.RegistrationForm.get('ProfileImage')?.updateValueAndValidity(); // Fix here
    }
  }
  

  getGender() {
    console.log("Gender called");

    this.utilityService.getAllGenders().subscribe({
      next: (data: any) => {
        this.genders = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  
  getRole(){
    this.utilityService.getAllRoles().subscribe({
      next:(data : any)=>{
        this.roles = data;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getCountry(){
    this.utilityService.getAllCountries().subscribe({
      next:(data)=>{
        this.countries = data;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getStates(event :any){
    this.utilityService.getStatesByCountryId(event.target.value).subscribe({
      next:(data)=>{
        this.states = data;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getSpecialisation(){
    this.utilityService.getAllSpecialisations().subscribe({
      next:(data)=>{
        this.specialisations = data;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getBloodGroup(){
    this.utilityService.getAllBloodGroups().subscribe({
      next:(data)=>{
        this.bloodGroups = data;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  onSubmit(): void{
    console.log(this.RegistrationForm.status); 
    console.log(this.RegistrationForm.value);  
    if (this.RegistrationForm.invalid) {
      this.RegistrationForm.markAllAsTouched();
      console.error('Form is invalid');
    }
    if(this.RegistrationForm.valid && this.selectedFile){
      this.isLoading = true;
      const formData = new FormData();
      formData.append('FirstName', this.RegistrationForm.get('FirstName')?.value ||  '');
      formData.append('LastName', this.RegistrationForm.get('LastName')?.value ||  '');
      formData.append('Dob', this.RegistrationForm.get('Dob')?.value ||  '');
      formData.append('Email', this.RegistrationForm.get('Email')?.value ||  '');
      formData.append('GenderId', this.RegistrationForm.get('GenderId')?.value ||  '');
      formData.append('BloodGroupId', this.RegistrationForm.get('BloodGroupId')?.value ||  '');
      formData.append('Address', this.RegistrationForm.get('Address')?.value ||  '');
      formData.append('CountryId', this.RegistrationForm.get('CountryId')?.value ||  '');
      formData.append('City', this.RegistrationForm.get('City')?.value ||  '');
      formData.append('StateId', this.RegistrationForm.get('StateId')?.value ||  '');
      formData.append('PinCode', this.RegistrationForm.get('PinCode')?.value ||  '');
      formData.append('PhoneNumber', this.RegistrationForm.get('PhoneNumber')?.value ||  '');
      formData.append('ProfileImage', this.selectedFile);
      formData.append('UserTypeId', '2');

      console.log("formData", formData);

      this.authService.registerUser(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('Registration Successful', res);
          this.snackBar.open('User registered successfully. Please Check mail for Username and Password', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.router.navigate(['/Login']); 
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Registration Failed', err);
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
        },
      });
    }
  }
}
