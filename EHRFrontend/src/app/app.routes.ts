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
import { GoToAppointmentComponent } from './components/go-to-appointment/go-to-appointment.component';
import { ChatComponent } from './components/chat/chat.component';
// export const routes: Routes = [
//     {
//         path: 'landing',
//         component: LandingComponent
//     },
//     {
//         path: 'Login',
//         component: LoginComponent
//     },
//     {
//         path: 'ProviderRegistration',
//         component: ProviderRegistrationComponent,
//         // canActivate: [AuthGuard]
//     },
//     {
//         path : 'PatientRegistration',
//         component: PatientRegistrationComponent,
//         // canActivate: [AuthGuard]
//     },
//     {
//         path : 'PatientDashboard',
//         component: PatientDashboardComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path : 'ProviderDashboard',
//         component: ProviderDashboardComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path: 'Navbar',
//         component: NavbarComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path : 'Profile',
//         component: ProfileComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path: 'ChangePassword',
//         component: ChangePasswordComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path: 'AddAppointment',
//         component: AddAppointmentComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path: 'AddAppointmentPatient',
//         component: AddAppointmentPatientComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path: 'GoToAppointment/:id',
//         component: GoToAppointmentComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path : 'chat/:receiverId',
//         component: ChatComponent
//     },
//     {
//         path: '',
//         component: LandingComponent
//     }
// ];

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
        path: 'PatientRegistration',
        component: PatientRegistrationComponent
    },
    {
        path: '',
        component: LandingComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        component: NavbarComponent, // Shared layout
        canActivate: [AuthGuard],
        children: [
            {
                path: 'PatientDashboard',
                component: PatientDashboardComponent
            },
            {
                path: 'ProviderDashboard',
                component: ProviderDashboardComponent
            },
            {
                path: 'Profile',
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
                path: 'GoToAppointment/:id',
                component: GoToAppointmentComponent
            },
            {
                path: 'chat/:receiverId',
                component: ChatComponent
            }
        ]
    }
];