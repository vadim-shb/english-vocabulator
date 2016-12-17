import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {RootComponent} from "./components/root/root.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LearningComponent} from "./components/learning/learning.component";
import { WordBundlesComponent } from './components/word-bundles/word-bundles.component';
import { WordsComponent } from './components/words/words.component';
import {ErrorHandleService} from "./services/error-handle/error-handle.service";
import {SecurityService} from "./services/security/security.service";
import {UserService} from "./services/user/user.service";
import {WordService} from "./services/word/word.service";
import {SecureHttpService} from "./services/secure-http/secure-http.service";
import { WordEditorComponent } from './components/word-editor/word-editor.component';
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";

@NgModule({
  declarations: [
    RootComponent,
    SignUpComponent,
    SignInComponent,
    DashboardComponent,
    LearningComponent,
    WordBundlesComponent,
    WordsComponent,
    WordEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    ErrorHandleService,
    SecurityService,
    SecureHttpService,
    UserService,
    WordService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
