import {NgModule} from "@angular/core";
import {RootComponent} from "./components/responsive/root/root.component";
import {DashboardComponent} from "./components/desktop/dashboard/dashboard.component";
import {WordBundlePickerComponent} from "./components/desktop/word-and-bundle-editor/word-bundle-picker/word-bundle-picker.component";
import {WordBundleEditorComponent} from "./components/desktop/word-and-bundle-editor/word-bundle-editor/word-bundle-editor.component";
import {WordsInBundleComponent} from "./components/desktop/word-and-bundle-editor/words-in-bundle/words-in-bundle.component";
import {WordEditorComponent} from "./components/desktop/word-and-bundle-editor/word-editor/word-editor.component";
import {AppCoreModule} from "./core.app.module";
import {DesktopAppRoutingModule} from "./desktop.routing-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {WordAndBundleEditorComponent} from "./components/desktop/word-and-bundle-editor/word-and-bundle-editor.component";
import {HeaderComponent} from "./components/desktop/header/header.component";
import {DesktopRootComponent} from "./components/desktop/desktop-root/desktop-root.component";

@NgModule({
  declarations: [
    DesktopRootComponent,
    HeaderComponent,
    DashboardComponent,
    WordAndBundleEditorComponent,
    WordBundlePickerComponent,
    WordBundleEditorComponent,
    WordsInBundleComponent,
    WordEditorComponent
  ],
  imports: [
    AppCoreModule,
    DesktopAppRoutingModule,
    FlexLayoutModule.forRoot()
  ],
  bootstrap: [RootComponent]
})
export class DesktopAppModule {
}
