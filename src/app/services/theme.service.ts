import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private renderer: Renderer2;
  private currentTheme: 'light' | 'dark' = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public getTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }

  private setTheme(theme: 'light' | 'dark'): void {
    const body: HTMLElement = document.body;
    this.renderer.removeClass(body, `${this.currentTheme}-theme`);
    this.renderer.addClass(body, `${theme}-theme`);
    this.currentTheme = theme;
  }
}
