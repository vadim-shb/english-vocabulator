import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/mobile/dashboard/dashboard.component";
import {LearningComponent} from "./components/mobile/learning/learning.component";
import {WordBundlesComponent} from "./components/mobile/word-bundles/word-bundles.component";
import {SignUpComponent} from "./components/mobile/sign-up/sign-up.component";
import {SignInComponent} from "./components/mobile/sign-in/sign-in.component";

const routes: Routes = [
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
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'word-bundles',
    component: WordBundlesComponent
  },
  {
    path: 'learning',
    component: LearningComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MobileAppRoutingModule {
}
