import {Routes, RouterModule} from "@angular/router";
import {SignUpComponent} from "./components/responsive/sign-up/sign-up.component";
import {SignInComponent} from "./components/responsive/sign-in/sign-in.component";
import {NgModule} from "@angular/core";
import {LearnComponent} from "./components/responsive/learn/learn.component";

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
    path: 'learn',
    component: LearnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(CORE_ROUTES)],
  exports: [RouterModule]
})
export class CoreAppRoutingModule {
}
