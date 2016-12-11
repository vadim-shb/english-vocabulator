import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {StartPageComponent} from "./components/start-page/start-page.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/start-page',
    pathMatch: 'full'
  },
  {
    path: 'start-page',
    component: StartPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
