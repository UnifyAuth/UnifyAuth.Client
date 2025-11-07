import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookies-off',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookies-off.component.html',
})
export class CookiesOffComponent {
  reloadPage(): void {
    window.location.reload();
  }
}
