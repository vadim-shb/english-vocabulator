import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/mobile/dashboard/dashboard.component";
import {WordBundlePickerComponent} from "./components/mobile/word-and-bundle-editor/word-bundle-picker/word-bundle-picker.component";
import {WordBundleEditorComponent} from "./components/mobile/word-and-bundle-editor/word-bundle-editor/word-bundle-editor.component";
import {WordsInBundleComponent} from "./components/mobile/word-and-bundle-editor/words-in-bundle/words-in-bundle.component";
import {WordEditorComponent} from "./components/mobile/word-and-bundle-editor/word-editor/word-editor.component";
import {MobileAppRoutingModule} from "./mobile.routing-module";
import {AppCoreModule} from "./core.app.module";
import {RootComponent} from "./components/responsive/root/root.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {WordAndBundleEditorComponent} from "./components/mobile/word-and-bundle-editor/word-and-bundle-editor.component";
import {MobileRootComponent} from "./components/mobile/mobile-root/mobile-root.component";

@NgModule({
  declarations: [
    MobileRootComponent,
    DashboardComponent,
    WordAndBundleEditorComponent,
    WordBundlePickerComponent,
    WordBundleEditorComponent,
    WordsInBundleComponent,
    WordEditorComponent
  ],
  imports: [
    AppCoreModule,
    MobileAppRoutingModule,
    FlexLayoutModule.forRoot()
  ],
  bootstrap: [RootComponent]
})
export class MobileAppModule {
}
