import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  username: string;
  userData: any;
  profileImage: string ='';
  userRole: string | null = null;
  isProvider : boolean = true;
  constructor(private authService: AuthService){
    this.username = sessionStorage.getItem("username")!;
    this.userRole = sessionStorage.getItem("role");
 this.isAdminFn();
  }

  ngOnInit(): void{
    this.getUser();
  }

  isAdminFn(): boolean {
    console.log("Role",this.userRole )
    if (this.userRole === "Provider") {
      this.isProvider = true;
      return true;
    } else {
      this.isProvider = false;
      return false;
    }
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
