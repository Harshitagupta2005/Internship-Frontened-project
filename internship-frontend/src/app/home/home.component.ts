import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  studentName: string = 'Harshita';
  collegeName: string = 'My College';
  year: number = 2025;
}
