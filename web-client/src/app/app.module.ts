import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {RootComponent} from "./components/root/root.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LearningComponent} from "./components/learning/learning.component";
import {WordBundlesComponent} from "./components/word-bundles/word-bundles.component";
import {ErrorHandleService} from "./services/error-handle/error-handle.service";
import {SecurityService} from "./services/security/security.service";
import {UserService} from "./services/user/user.service";
import {WordService} from "./services/word/word.service";
import {SecureHttpService} from "./services/secure-http/secure-http.service";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {WordBundlePickerComponent} from "./components/word-bundles/word-bundle-picker/word-bundle-picker.component";
import {WordBundleService} from "./services/word-bundle/word-bundle.service";
import {WordBundleDao} from "./dao/word-bundle/word-bundle.dao";
import {WordBundleEditorComponent} from "./components/word-bundles/word-bundle-editor/word-bundle-editor.component";
import {WordsInBundleComponent} from "./components/word-bundles/words-in-bundle/words-in-bundle.component";
import {WordEditorComponent} from "./components/word-bundles/word-editor/word-editor.component";
import {WordDao} from "./dao/word/word.dao";
import {WordLearnQueueService} from "./services/word-learn-queue/word-learn-queue.service";

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
    WordService,
    WordBundleService,
    WordLearnQueueService,
    WordDao,
    WordBundleDao
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
