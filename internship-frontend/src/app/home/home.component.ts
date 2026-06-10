import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  studentName = 'Harshita Gupta';
  collegeName = 'IMS Engineering College';
  year = 2026;
}