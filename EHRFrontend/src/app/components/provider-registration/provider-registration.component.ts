import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UtilityService } from '../../services/Utility/utility.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-provider-registration',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule],
  templateUrl: './provider-registration.component.html',
  styleUrl: './provider-registration.component.css'
})
export class ProviderRegistrationComponent {
  countries: any[] = [];
  states: any[] = [];
  roles: any[] = [];
  genders: any[] = [];
  specialisations: any[] =[];
  bloodGroups: any[] = [];
  selectedFile: File | null = null;
  isLoading = false;
  todayDate = new Date().toISOString().split('T')[0]; 
  
  constructor(private router: Router, private authService: AuthService, private utilityService: UtilityService, private toastr: ToastrService
  ) { }

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
    PinCode: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]*$/), 
      Validators.minLength(6),      
      Validators.maxLength(6)      ]),
    UserTypeId: new FormControl(1, [Validators.required]),
    ProfileImage: new FormControl(null, [Validators.required]),
    PhoneNumber: new FormControl("", [  Validators.required, Validators.pattern(/^[0-9]*$/), 
      Validators.minLength(10),      
      Validators.maxLength(10)      
      ]),
      Qualification: new FormControl("",[Validators.required]),
      SpecialisationId: new FormControl("",[Validators.required]),
      RegistrationNumber: new FormControl("", [Validators.required]),
      VisitingCharge: new FormControl("", [Validators.required])
  })

  validateMaxLength(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10); 
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
      this.RegistrationForm.get('ProfileImage')?.updateValueAndValidity();
    }
  }  

  getGender() {
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
      formData.append('Qualification', this.RegistrationForm.get('Qualification')?.value ||  '');
      formData.append('SpecialisationId', this.RegistrationForm.get('SpecialisationId')?.value ||  '');
      formData.append('RegistrationNumber', this.RegistrationForm.get('RegistrationNumber')?.value ||  '');
      formData.append('VisitingCharge', this.RegistrationForm.get('VisitingCharge')?.value ||  '');
      formData.append('ProfileImage', this.selectedFile);
      formData.append('UserTypeId', '1');

      this.authService.registerUser(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('Registration Successful', res);
          this.toastr.success('Registration Successful. Please check email for username and password', 'Success');
          this.router.navigate(['/Login']); 
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Registration Failed', err);
          this.toastr.error('Registration Failed', 'Error');

        },
      });
    }
  }
}

