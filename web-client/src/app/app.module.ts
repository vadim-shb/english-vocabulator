import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {RootComponent} from "./components/root/root.component";
import {StartPageComponent} from "./components/start-page/start-page.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LearningComponent} from "./components/learning/learning.component";
import { WordBundlesComponent } from './components/word-bundles/word-bundles.component';
import { WordsComponent } from './components/words/words.component';

@NgModule({
  declarations: [
    RootComponent,
    StartPageComponent,
    DashboardComponent,
    LearningComponent,
    WordBundlesComponent,
    WordsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {
}
