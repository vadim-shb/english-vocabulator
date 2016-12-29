import {NgModule} from "@angular/core";
import {RootComponent} from "./components/responsive/root/root.component";
import {DashboardComponent} from "./components/desktop/dashboard/dashboard.component";
import {LearningComponent} from "./components/desktop/learning/learning.component";
import {WordBundlesComponent} from "./components/desktop/word-bundles/word-bundles.component";
import {SignUpComponent} from "./components/responsive/sign-up/sign-up.component";
import {SignInComponent} from "./components/responsive/sign-in/sign-in.component";
import {WordBundlePickerComponent} from "./components/desktop/word-bundles/word-bundle-picker/word-bundle-picker.component";
import {WordBundleEditorComponent} from "./components/desktop/word-bundles/word-bundle-editor/word-bundle-editor.component";
import {WordsInBundleComponent} from "./components/desktop/word-bundles/words-in-bundle/words-in-bundle.component";
import {WordEditorComponent} from "./components/desktop/word-bundles/word-editor/word-editor.component";
import {AppCoreModule} from "./core.app.module";
import {DesktopAppRoutingModule} from "./desktop.routing-module";

@NgModule({
  declarations: [
    RootComponent,
    SignUpComponent,
    SignInComponent,
    DashboardComponent,
    LearningComponent,
    WordBundlesComponent,
    WordBundlePickerComponent,
    WordBundleEditorComponent,
    WordsInBundleComponent,
    WordEditorComponent
  ],
  imports: [
    AppCoreModule,
    DesktopAppRoutingModule
  ],
  bootstrap: [RootComponent]
})
export class DesktopAppModule {
}
