import {Routes, RouterModule} from "@angular/router";
import {SignUpComponent} from "./components/responsive/sign-up/sign-up.component";
import {SignInComponent} from "./components/responsive/sign-in/sign-in.component";
import {NgModule} from "@angular/core";
import {ActivateAccountInvitationComponent} from "./components/responsive/activate-account-invitation/activate-account-invitation.component";
import {RegistrationCompleteComponent} from "./components/responsive/registration-complete/registration-complete.component";

const CORE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'activate-account-invitation',
    component: ActivateAccountInvitationComponent
  },
  {
    path: 'registration-complete',
    component: RegistrationCompleteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(CORE_ROUTES)],
  exports: [RouterModule]
})
export class CoreAppRoutingModule {
}
