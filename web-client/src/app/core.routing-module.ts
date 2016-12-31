import {Routes, RouterModule} from "@angular/router";
import {SignUpComponent} from "./components/responsive/sign-up/sign-up.component";
import {SignInComponent} from "./components/responsive/sign-in/sign-in.component";
import {NgModule} from "@angular/core";

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(CORE_ROUTES)],
  exports: [RouterModule]
})
export class CoreAppRoutingModule {
}
