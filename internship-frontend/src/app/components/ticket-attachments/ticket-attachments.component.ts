import { Component, Input, OnInit } from '@angular/core';
import { Attachment } from '../../models/attachment.model';
import { AttachmentService } from '../../services/attachment.service';
// TODO: apna existing notification service import karo
// import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-ticket-attachments',
  templateUrl: './ticket-attachments.component.html',
  styleUrls: ['./ticket-attachments.component.scss']
})
export class TicketAttachmentsComponent implements OnInit {
  @Input() ticketId!: number;

  attachments: Attachment[] = [];
  selectedFiles: File[] = [];
  isUploading = false;
  isLoading = false;

  constructor(
    private attachmentService: AttachmentService
    // TODO: private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments(): void {
    this.isLoading = true;
    this.attachmentService.getAttachments(this.ticketId).subscribe({
      next: (data) => {
        this.attachments = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // TODO: this.notificationService.error('Failed to load attachments');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  uploadFiles(): void {
    // Validation: file select hua ya nahi
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      // TODO: this.notificationService.error('Please select at least one file to upload.');
      return;
    }

    this.isUploading = true;
    this.attachmentService.uploadAttachments(this.ticketId, this.selectedFiles).subscribe({
      next: () => {
        // TODO: this.notificationService.success('File(s) uploaded successfully!');
        this.selectedFiles = [];
        this.isUploading = false;
        this.loadAttachments(); // list refresh
      },
      error: () => {
        // TODO: this.notificationService.error('File upload failed. Please try again.');
        this.isUploading = false;
      }
    });
  }

  downloadFile(attachment: Attachment): void {
    this.attachmentService.downloadAttachment(attachment.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        // TODO: this.notificationService.error('Failed to download file.');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}