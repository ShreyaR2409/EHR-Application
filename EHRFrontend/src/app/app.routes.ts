import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ProviderRegistrationComponent } from './components/provider-registration/provider-registration.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { ProviderDashboardComponent } from './components/provider-dashboard/provider-dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AuthGuard } from './guard/auth.guard';
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { AddAppointmentPatientComponent } from './components/add-appointment-patient/add-appointment-patient.component';
export const routes: Routes = [
    {
        path: 'landing',
        component: LandingComponent
    },
    {
        path: 'Login',
        component: LoginComponent
    },
    {
        path: 'ProviderRegistration',
        component: ProviderRegistrationComponent
    },
    {
        path : 'PatientRegistration',
        component: PatientRegistrationComponent
    },
    {
        path : 'PatientDashboard',
        component: PatientDashboardComponent
    },
    {
        path : 'ProviderDashboard',
        component: ProviderDashboardComponent
    },
    {
        path: 'Navbar',
        component: NavbarComponent
    },
    {
        path : 'Profile',
        component: ProfileComponent
    },
    {
        path: 'ChangePassword',
        component: ChangePasswordComponent
    },
    {
        path: 'AddAppointment',
        component: AddAppointmentComponent
    },
    {
        path: 'AddAppointmentPatient',
        component: AddAppointmentPatientComponent
    },
    {
        path: '',
        component: LandingComponent
    }
];
