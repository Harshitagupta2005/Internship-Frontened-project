import { Component } from '@angular/core';
@Component({ selector:'app-profile', templateUrl:'./profile.component.html', styleUrls:['./profile.component.css'] })
export class ProfileComponent {
  profile = {
    name: 'Harshita Gupta',
    role: 'Frontend Intern',
    college: 'IMS Engineering College',
    email: 'hg4579655@gmail.com',
    location: 'India',
    bio: 'Passionate about web development and learning Angular during my internship.'
  };
  skills = ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'Git & GitHub'];
}