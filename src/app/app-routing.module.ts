import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { ConverterComponent } from './converter/converter.component';
import { WalletComponent } from './wallet/wallet.component';
import { CryptoPlatformComponent } from "./crypto-platform/crypto-platform.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'watchlist',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CryptoPlatformComponent,
    children: [
      {
        path: 'watchlist',
        component: WatchlistComponent
      },
      {
        path: 'converter',
        component: ConverterComponent
      },
      {
        path: 'wallet',
        component: WalletComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
