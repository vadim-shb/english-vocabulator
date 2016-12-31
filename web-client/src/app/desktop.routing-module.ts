import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/desktop/dashboard/dashboard.component";
import {LearningComponent} from "./components/desktop/learning/learning.component";
import {WordBundlesComponent} from "./components/desktop/word-bundles/word-bundles.component";

const DESKTOP_ROUTES: Routes = [
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
  imports: [RouterModule.forRoot(DESKTOP_ROUTES)],
  exports: [RouterModule]
})
export class DesktopAppRoutingModule {
}
