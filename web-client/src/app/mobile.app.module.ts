import {NgModule} from "@angular/core";
import {RootComponent} from "./components/mobile/root/root.component";
import {DashboardComponent} from "./components/mobile/dashboard/dashboard.component";
import {LearningComponent} from "./components/mobile/learning/learning.component";
import {WordBundlesComponent} from "./components/mobile/word-bundles/word-bundles.component";
import {SignUpComponent} from "./components/mobile/sign-up/sign-up.component";
import {SignInComponent} from "./components/mobile/sign-in/sign-in.component";
import {WordBundlePickerComponent} from "./components/mobile/word-bundles/word-bundle-picker/word-bundle-picker.component";
import {WordBundleEditorComponent} from "./components/mobile/word-bundles/word-bundle-editor/word-bundle-editor.component";
import {WordsInBundleComponent} from "./components/mobile/word-bundles/words-in-bundle/words-in-bundle.component";
import {WordEditorComponent} from "./components/mobile/word-bundles/word-editor/word-editor.component";
import {MobileAppRoutingModule} from "./mobile.routing-module";
import {AppCoreModule} from "./core.app.module";

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
    MobileAppRoutingModule
  ],
  bootstrap: [RootComponent]
})
export class MobileAppModule {
}
