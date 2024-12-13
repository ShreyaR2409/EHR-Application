import { Component } from '@angular/core';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  Role : string = '';
  constructor(private router: Router,){
    this.Role = sessionStorage.getItem("Role")!;
  }

  NavigateToRegister(){
    if(this.Role == 'Patient'){
      this.router.navigateByUrl('PatientRegistration');
    }
    else{
      this.router.navigateByUrl('ProviderRegistration');
    }
  }
}
