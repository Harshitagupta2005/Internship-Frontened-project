import { Component, HostListener } from '@angular/core';
@Component({ selector:'app-header', templateUrl:'./header.component.html', styleUrls:['./header.component.css'] })
export class HeaderComponent {
  menuOpen = false;
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header')) this.menuOpen = false;
  }
}