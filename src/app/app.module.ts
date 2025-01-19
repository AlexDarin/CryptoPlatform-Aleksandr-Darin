import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { WatchlistComponent } from './watchlist/watchlist.component';
import { ConverterComponent } from './converter/converter.component';
import { WalletComponent } from './wallet/wallet.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SearchPipe } from "./shared/search.pipe";
import { MatIcon } from "@angular/material/icon";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { CryptoPlatformComponent } from './crypto-platform/crypto-platform.component';
import { MatSort, MatSortModule } from "@angular/material/sort";
import { CryptoSearchComponent } from './shared/crypto-search/crypto-search.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { CurrencySelectorComponent } from './shared/currency-selector/currency-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    ConverterComponent,
    WalletComponent,
    SearchPipe,
    CryptoPlatformComponent,
    CryptoSearchComponent,
    ThemeToggleComponent,
    CurrencySelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatIcon,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatSort,
    MatSortModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
