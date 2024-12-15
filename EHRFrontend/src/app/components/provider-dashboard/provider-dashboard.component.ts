import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css'
})
export class ProviderDashboardComponent {

}
