import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  studentName: string = 'Harshita Gupta';
  collegeName: string = 'IMS Engineering College';
  year: number = 2026;
}
