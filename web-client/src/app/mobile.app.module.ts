import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/mobile/dashboard/dashboard.component";
import {WordBundlesComponent} from "./components/mobile/word-bundles/word-bundles.component";
import {WordBundlePickerComponent} from "./components/mobile/word-bundles/word-bundle-picker/word-bundle-picker.component";
import {WordBundleEditorComponent} from "./components/mobile/word-bundles/word-bundle-editor/word-bundle-editor.component";
import {WordsInBundleComponent} from "./components/mobile/word-bundles/words-in-bundle/words-in-bundle.component";
import {WordEditorComponent} from "./components/mobile/word-bundles/word-editor/word-editor.component";
import {MobileAppRoutingModule} from "./mobile.routing-module";
import {AppCoreModule} from "./core.app.module";
import {RootComponent} from "./components/responsive/root/root.component";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    DashboardComponent,
    WordBundlesComponent,
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
