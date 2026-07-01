import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../services/ticket.service';
import { CommentService } from '../services/comment.service';
import { Ticket } from '../models/ticket';
import { Comment } from '../models/comment';
import { Attachment } from '../models/attachment.model';
import { Activity } from '../models/activity.model';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticket: Ticket | undefined;
  isLoading = true;
  errorMessage = '';

  // NOTIFICATION
  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  // ASSIGN DIALOG
  showAssignDialog = false;
  selectedTicketId: string = '';
  selectedTicketAssignedToId: string = '';

  // ===== COMMENTS =====
  comments: Comment[] = [];
  isLoadingComments = true;
  commentForm: FormGroup;
  submittedComment = false;
  isSubmittingComment = false;

  // ===== ATTACHMENTS =====
  attachments: Attachment[] = [];
  selectedAttachmentFiles: File[] = [];
  isLoadingAttachments = false;
  isUploadingAttachment = false;

  // ===== ACTIVITY HISTORY =====
  activities: Activity[] = [];
  isLoadingActivities = false;

  private attachmentBaseUrl = 'http://localhost:8000/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private commentService: CommentService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.loadTicket();
    this.loadComments();
  }

  // ===== TICKET =====

  loadTicket() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.isLoading = true;

    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
        if (!data) {
          this.errorMessage = 'Ticket not found.';
        } else {
          this.loadAttachments();
          this.loadActivities();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load ticket details.';
        this.isLoading = false;
      }
    });
  }

  // ===== NOTIFICATION =====

  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  // ===== ASSIGN TICKET =====

  openAssignDialog() {
    if (!this.ticket) return;
    this.selectedTicketId = String(this.ticket.id);
    this.selectedTicketAssignedToId = this.ticket.assignedToId || '';
    this.showAssignDialog = true;
  }

  closeAssignDialog() {
    this.showAssignDialog = false;
  }

  onAssignResult(result: { success: boolean; message: string }) {
    this.showAssignDialog = false;
    this.showNotif(result.success ? 'success' : 'error', result.message);

    if (result.success) {
      this.loadTicket();
      this.addReassignComment(result.message);
    }
  }

  private addReassignComment(message: string) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.commentService.addComment(id, `🔄 ${message}`).subscribe({
      next: () => {
        this.loadComments();
      },
      error: () => {
        // silent fail
      }
    });
  }

  // ===== COMMENTS =====

  get cf() {
    return this.commentForm.controls;
  }

  loadComments() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.isLoadingComments = true;

    this.commentService.getComments(id).subscribe({
      next: (res) => {
        this.comments = res;
        this.isLoadingComments = false;
      },
      error: () => {
        this.isLoadingComments = false;
        this.showNotif('error', 'Failed to load comments.');
      }
    });
  }

  onSubmitComment() {
    this.submittedComment = true;

    if (this.commentForm.invalid) {
      return;
    }

    const id = this.route.snapshot.paramMap.get('id') || '';
    this.isSubmittingComment = true;

    this.commentService.addComment(id, this.commentForm.value.comment).subscribe({
      next: () => {
        this.isSubmittingComment = false;
        this.submittedComment = false;
        this.commentForm.reset();
        this.showNotif('success', 'Comment added successfully!');
        this.loadComments();
        this.loadActivities();
      },
      error: () => {
        this.isSubmittingComment = false;
        this.showNotif('error', 'Failed to add comment. Please try again.');
      }
    });
  }

  // ===== ATTACHMENTS =====

  loadAttachments() {
    if (!this.ticket) return;
    this.isLoadingAttachments = true;

    this.http.get<{ data: Attachment[] } | Attachment[]>(
      `${this.attachmentBaseUrl}/tickets/${this.ticket.id}/attachments`
    ).subscribe({
      next: (res: any) => {
        this.attachments = Array.isArray(res) ? res : (res.data ?? []);
        this.isLoadingAttachments = false;
      },
      error: (err) => {
        this.isLoadingAttachments = false;
        console.error('❌ Load attachments error:', err.status, err.error);
        this.showNotif('error', 'Failed to load attachments.');
      }
    });
  }

  onAttachmentFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedAttachmentFiles = Array.from(input.files);
    }
  }

  removeSelectedAttachmentFile(index: number) {
    this.selectedAttachmentFiles.splice(index, 1);
  }

  uploadAttachments() {
    if (!this.ticket) return;

    if (!this.selectedAttachmentFiles || this.selectedAttachmentFiles.length === 0) {
      this.showNotif('warning', 'Please select at least one file to upload.');
      return;
    }

    const formData = new FormData();
    // Laravel StoreAttachmentRequest: 'file' => 'required|file'
    formData.append('file', this.selectedAttachmentFiles[0], this.selectedAttachmentFiles[0].name);

    this.isUploadingAttachment = true;

    this.http.post(
      `${this.attachmentBaseUrl}/tickets/${this.ticket.id}/attachments`,
      formData
    ).subscribe({
      next: () => {
        this.isUploadingAttachment = false;
        this.selectedAttachmentFiles = [];
        this.showNotif('success', 'File uploaded successfully!');
        this.loadAttachments();
        this.loadActivities();   // upload ke baad activity bhi refresh karo
      },
      error: (err) => {
        this.isUploadingAttachment = false;
        console.error('❌ Upload error — status:', err.status);
        console.error('❌ Upload error — body:', err.error);

        if (err.status === 422) {
          const validationErrors = err.error?.errors;
          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0];
            const msg = Array.isArray(firstError) ? firstError[0] : String(firstError);
            this.showNotif('error', `Validation failed: ${msg}`);
          } else {
            this.showNotif('error', 'File validation failed. Check file type/size.');
          }
        } else if (err.status === 500) {
          this.showNotif('error', 'Server error. Please check Laravel logs.');
        } else {
          this.showNotif('error', 'File upload failed. Please try again.');
        }
      }
    });
  }

  downloadAttachment(attachment: Attachment) {
    this.http.get(
      `${this.attachmentBaseUrl}/attachments/${attachment.id}/download`,
      { responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.file_name;  // snake_case — Laravel se match
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('❌ Download error:', err.status, err.error);
        this.showNotif('error', 'Failed to download file.');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ===== ACTIVITY HISTORY =====

  loadActivities() {
    if (!this.ticket) return;
    this.isLoadingActivities = true;

    this.http.get<{ data: any[] } | any[]>(
      `${this.attachmentBaseUrl}/tickets/${this.ticket.id}/activity-logs`
    ).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res.data ?? []);
        this.activities = list
          .map((item: any): Activity => ({
            id: item.id,
            ticket_id: item.ticket_id,
            activity_type: this.mapActionToType(item.action),
            description: item.description,
            performed_by: item.user?.name || 'System',
            created_at: item.created_at
          }))
          .sort((a: Activity, b: Activity) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        this.isLoadingActivities = false;
      },
      error: (err) => {
        this.isLoadingActivities = false;
        console.error('❌ Load activities error:', err.status, err.error);
        this.showNotif('error', 'Failed to load activity history.');
      }
    });
  }

  private mapActionToType(action: string): Activity['activity_type'] {
    switch (action) {
      case 'created': return 'Created';
      case 'assigned': return 'Assigned';
      case 'status_changed': return 'StatusChanged';
      case 'comment_added': return 'CommentAdded';
      case 'attachment_added': return 'AttachmentUploaded';
      default: return 'Created';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'Created': return '🆕';
      case 'Assigned': return '👤';
      case 'StatusChanged': return '🔄';
      case 'CommentAdded': return '💬';
      case 'AttachmentUploaded': return '📎';
      default: return '🔹';
    }
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}