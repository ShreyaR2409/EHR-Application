import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  username: string;
  userData: any;
  profileImage: string ='';
  constructor(private authService: AuthService){
    this.username = sessionStorage.getItem("username")!;
  }

  ngOnInit(): void{
    this.getUser();
  }

logout() {
  console.log('Logging out...');
  this.authService.logoutUser();
}

getUser(){
  this.authService.getUserByUsername(this.username).subscribe({
    next:(data)=>{
      this.userData = data;
      this.profileImage = this.userData.ProfileImage;
    },
    error:(error)=>{
      console.log(error);
    }
  })
}


changePassword() {
  console.log('Navigating to change password page...');
}
}
