import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() message: string = '';
  @Input() show: boolean = false;

  close() {
    this.show = false;
  }

  get icon(): string {
    if (this.type === 'success') return '✅';
    if (this.type === 'error') return '❌';
    return '⚠️';
  }
}