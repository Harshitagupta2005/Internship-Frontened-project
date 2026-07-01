import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile = {
    name: 'Harshita Gupta',
    role: 'Frontend Intern',
    college: 'IMS Engineering College',
    email: 'hg4579655@gmail.com',
    location: 'India',
    bio: 'Passionate about web development and learning Angular during my internship.'
  };

  skills = ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'Git & GitHub'];

  // ===== NOTIFICATION PREFERENCES =====
  preferences = {
    ticket_created: false,
    ticket_assigned: false,
    status_changed: false,
    comment_added: false
  };

  isLoadingPrefs = false;
  isSavingPrefs = false;

  // NOTIFICATION
  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPreferences();
  }

  // ===== NOTIFICATION HELPER =====
  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;
    setTimeout(() => { this.showNotification = false; }, 3000);
  }

  // ===== LOAD PREFERENCES =====
  loadPreferences() {
    this.isLoadingPrefs = true;
    this.http.get<any>(`${this.apiUrl}/user/notification-preferences`).subscribe({
      next: (res) => {
        const data = res.data ?? res;
        this.preferences = {
          ticket_created: !!data.ticket_created,
          ticket_assigned: !!data.ticket_assigned,
          status_changed: !!data.status_changed,
          comment_added: !!data.comment_added
        };
        this.isLoadingPrefs = false;
      },
      error: (err) => {
        this.isLoadingPrefs = false;
        console.error('❌ Load preferences error:', err.status, err.error);
        this.showNotif('error', 'Failed to load notification preferences.');
      }
    });
  }

  // ===== SAVE PREFERENCES (called on every toggle) =====
  savePreferences() {
    this.isSavingPrefs = true;
    this.http.put(`${this.apiUrl}/user/notification-preferences`, this.preferences).subscribe({
      next: () => {
        this.isSavingPrefs = false;
        this.showNotif('success', 'Notification preferences saved successfully!');
      },
      error: (err) => {
        this.isSavingPrefs = false;
        console.error('❌ Save preferences error:', err.status, err.error);
        this.showNotif('error', 'Failed to save preferences. Please try again.');
      }
    });
  }

  // ===== TOGGLE HANDLER =====
  onToggle(key: keyof typeof this.preferences) {
    this.preferences[key] = !this.preferences[key];
    this.savePreferences();
  }
}