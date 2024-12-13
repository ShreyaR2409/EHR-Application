import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ProviderRegistrationComponent } from './components/provider-registration/provider-registration.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';

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
        path: '',
        component: LandingComponent
    }
];
