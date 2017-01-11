import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/mobile/dashboard/dashboard.component";
import {WordAndBundleEditorComponent} from "./components/mobile/word-and-bundle-editor/word-and-bundle-editor.component";
import {MobileRootComponent} from "./components/mobile/mobile-root/mobile-root.component";

const MOBILE_ROUTES: Routes = [
  {
    path: '',
    component: MobileRootComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'word-bundles',
        component: WordAndBundleEditorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(MOBILE_ROUTES)],
  exports: [RouterModule]
})
export class MobileAppRoutingModule {
}
