import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-crypto-platform',
  templateUrl: './crypto-platform.component.html',
  styleUrl: './crypto-platform.component.css'
})
export class CryptoPlatformComponent {

  constructor(
    private router: Router
  ) {}

  protected getCurrentTabName(): string | undefined {
    const currentPath: string = this.router.url.split('/').filter(Boolean).join('/');
    const route = this.routes
      .find(route => currentPath.startsWith(route.path));

    return route?.name;
  }

  protected isCurrentRoute(route: string): boolean {
    return this.getCurrentTabName() === route;
  }

  protected readonly routes = [
    {
      name: 'Watchlist',
      path: 'watchlist'
    },
    {
      name: 'Wallet',
      path: 'wallet'
    },
    {
      name: 'Converter',
      path: 'converter'
    }
  ];
}
