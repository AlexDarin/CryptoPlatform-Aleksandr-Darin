import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: 'theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {

  constructor(
    private themeService: ThemeService
  ) {}

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected getTheme(): string {
    return this.themeService.getTheme();
  }
}
