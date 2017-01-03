import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ErrorHandleService} from "./services/error-handle/error-handle.service";
import {SecurityService} from "./services/security/security.service";
import {UserService} from "./services/user/user.service";
import {WordService} from "./services/word/word.service";
import {SecureHttpService} from "./services/secure-http/secure-http.service";
import {WordBundleService} from "./services/word-bundle/word-bundle.service";
import {WordBundleDao} from "./dao/word-bundle/word-bundle.dao";
import {WordDao} from "./dao/word/word.dao";
import {WordLearnQueueService} from "./services/word-learn-queue/word-learn-queue.service";
import {CoreAppRoutingModule} from "./core.routing-module";
import {SignInComponent} from "./components/responsive/sign-in/sign-in.component";
import {SignUpComponent} from "./components/responsive/sign-up/sign-up.component";
import {RouterModule} from "@angular/router";
import {WordKnowledgeTestService} from "./services/word-knowledge-test/word-knowledge-test.service";
import {WordKnowledgeTestDao} from "./dao/word-knowledge-test/word-knowledge-test.dao";
import {RootComponent} from "./components/responsive/root/root.component";
import {LearnComponent} from "./components/responsive/learn/learn.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreAppRoutingModule
  ],
  declarations: [
    RootComponent,
    SignUpComponent,
    SignInComponent,
    LearnComponent
  ],
  providers: [
    ErrorHandleService,
    SecurityService,
    SecureHttpService,
    UserService,
    WordService,
    WordBundleService,
    WordLearnQueueService,
    WordKnowledgeTestService,
    WordDao,
    WordBundleDao,
    WordKnowledgeTestDao
  ],
  exports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule
  ]
})
export class AppCoreModule {
}
