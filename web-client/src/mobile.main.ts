import "./polyfills.ts";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import {environment} from "./environments/environment";
import {MobileAppModule} from "./app/mobile.app.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MobileAppModule);
