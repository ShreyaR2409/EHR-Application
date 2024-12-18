import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private router: Router) {}

  setRolePatient(){
    sessionStorage.setItem('role', 'Patient');
  }

  setRoleProvider(){
    sessionStorage.setItem('role', 'Provider');
  }
}
