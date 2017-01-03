import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/mobile/dashboard/dashboard.component";
import {WordBundlesComponent} from "./components/mobile/word-bundles/word-bundles.component";

const MOBILE_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'word-bundles',
    component: WordBundlesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(MOBILE_ROUTES)],
  exports: [RouterModule]
})
export class MobileAppRoutingModule {
}
