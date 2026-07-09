import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // User data from API
  user: any = null;
  isLoadingUser = true;

  // Edit Profile
  isEditingProfile = false;
  editForm!: FormGroup;
  isUpdatingProfile = false;

  // Change Password
  showChangePassword = false;
  passwordForm!: FormGroup;
  isChangingPassword = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  submittedPassword = false;

  // Photo Upload
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  isUploadingPhoto = false;

  // Skills (static)
  skills = ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'JavaScript', 'Git & GitHub'];

  // Notification Preferences
  preferences = {
    ticket_created: false,
    ticket_assigned: false,
    status_changed: false,
    comment_added: false
  };
  isLoadingPrefs = false;
  isSavingPrefs = false;

  // Notification
  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadPreferences();
    this.initForms();
  }

  initForms() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  get pf() { return this.passwordForm.controls; }
  get ef() { return this.editForm.controls; }

  // ===== LOAD USER PROFILE =====
  loadUserProfile() {
    this.isLoadingUser = true;
    this.http.get<any>(`${this.apiUrl}/me`).subscribe({
      next: (res) => {
        this.user = res.data || res;
        this.isLoadingUser = false;
        // Pre-fill edit form
        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email
        });
      },
      error: () => {
        // Fallback to static data
        this.user = {
          name: 'Harshita Gupta',
          email: 'hg4579655@gmail.com',
          role: 'admin',
          department: 'Not Assigned'
        };
        this.isLoadingUser = false;
        this.editForm.patchValue({
          name: this.user.name,
          email: this.user.email
        });
      }
    });
  }

  getInitial(): string {
    return (this.user?.name || 'U')[0].toUpperCase();
  }

  getRoleLabel(): string {
    switch (this.user?.role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'employee': return 'Employee';
      default: return this.user?.role || 'User';
    }
  }

  getDepartmentLabel(): string {
    return this.user?.department?.name || this.user?.department || 'Not Assigned';
  }

  // ===== EDIT PROFILE =====
  openEditProfile() {
    this.isEditingProfile = true;
    this.editForm.patchValue({
      name: this.user?.name || '',
      email: this.user?.email || ''
    });
  }

  cancelEditProfile() {
    this.isEditingProfile = false;
    this.editForm.reset({
      name: this.user?.name || '',
      email: this.user?.email || ''
    });
  }

  saveProfile() {
    if (this.editForm.invalid) return;
    this.isUpdatingProfile = true;

    this.http.put(`${this.apiUrl}/profile`, this.editForm.value).subscribe({
      next: (res: any) => {
        this.user = { ...this.user, ...this.editForm.value };
        this.isUpdatingProfile = false;
        this.isEditingProfile = false;
        this.showNotif('success', 'Profile updated successfully!');
      },
      error: () => {
        this.isUpdatingProfile = false;
        this.showNotif('error', 'Failed to update profile. Please try again.');
      }
    });
  }

  // ===== PHOTO UPLOAD =====
  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedPhoto = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedPhoto);
    }
  }

  uploadPhoto() {
    if (!this.selectedPhoto) return;
    const formData = new FormData();
    formData.append('photo', this.selectedPhoto);
    this.isUploadingPhoto = true;

    this.http.post(`${this.apiUrl}/profile/photo`, formData).subscribe({
      next: (res: any) => {
        if (res.photo_url) {
          this.user = { ...this.user, photo_url: res.photo_url };
        }
        this.isUploadingPhoto = false;
        this.selectedPhoto = null;
        this.showNotif('success', 'Profile photo updated!');
      },
      error: () => {
        this.isUploadingPhoto = false;
        this.showNotif('error', 'Failed to upload photo.');
      }
    });
  }

  // ===== CHANGE PASSWORD =====
  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    this.passwordForm.reset();
    this.submittedPassword = false;
  }

  onChangePassword() {
    this.submittedPassword = true;
    if (this.passwordForm.invalid) return;
    this.isChangingPassword = true;

    this.http.put(`${this.apiUrl}/profile/password`, {
  current_password: this.passwordForm.value.current_password,
  new_password: this.passwordForm.value.password,
  new_password_confirmation: this.passwordForm.value.password_confirmation
})
    .subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.submittedPassword = false;
        this.passwordForm.reset();
        this.showChangePassword = false;
        this.showNotif('success', 'Password changed successfully!');
      },
      error: (err) => {
        this.isChangingPassword = false;
        const msg = err.error?.message || 'Failed to change password.';
        this.showNotif('error', msg);
      }
    });
  }

  getPasswordStrength(): { label: string; color: string; width: string } {
    const pass = this.passwordForm.get('password')?.value || '';
    if (pass.length === 0) return { label: '', color: '#ccc', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: '#e74c3c', width: '25%' };
    if (pass.length < 8) return { label: 'Fair', color: '#f39c12', width: '50%' };
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass))
      return { label: 'Strong', color: '#1D9E75', width: '100%' };
    return { label: 'Good', color: '#3498db', width: '75%' };
  }

  // ===== NOTIFICATION PREFERENCES =====
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
      error: () => { this.isLoadingPrefs = false; }
    });
  }

  savePreferences() {
    this.isSavingPrefs = true;
    this.http.put(`${this.apiUrl}/user/notification-preferences`, this.preferences).subscribe({
      next: () => {
        this.isSavingPrefs = false;
        this.showNotif('success', 'Notification preferences saved successfully!');
      },
      error: () => {
        this.isSavingPrefs = false;
        this.showNotif('error', 'Failed to save preferences. Please try again.');
      }
    });
  }

  onToggle(key: keyof typeof this.preferences) {
    this.preferences[key] = !this.preferences[key];
    this.savePreferences();
  }

  // ===== NOTIFICATION HELPER =====
  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;
    setTimeout(() => { this.showNotification = false; }, 3000);
  }
}