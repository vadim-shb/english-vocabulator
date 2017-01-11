import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/desktop/dashboard/dashboard.component";
import {WordAndBundleEditorComponent} from "./components/desktop/word-and-bundle-editor/word-and-bundle-editor.component";
import {DesktopRootComponent} from "./components/desktop/desktop-root/desktop-root.component";
import {LearnComponent} from "./components/desktop/learn/learn.component";

const DESKTOP_ROUTES: Routes = [
  {
    path: '',
    component: DesktopRootComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'word-bundles',
        component: WordAndBundleEditorComponent
      },
      {
        path: 'learn',
        component: LearnComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(DESKTOP_ROUTES)],
  exports: [RouterModule]
})
export class DesktopAppRoutingModule {
}
