import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {StartPageComponent} from "./components/start-page/start-page.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LearningComponent} from "./components/learning/learning.component";
import {WordBundlesComponent} from "./components/word-bundles/word-bundles.component";
import {WordsComponent} from "./components/words/words.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/start-page',
    pathMatch: 'full'
  },
  {
    path: 'start-page',
    component: StartPageComponent
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
    path: 'words',
    component: WordsComponent
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
export class AppRoutingModule {
}
