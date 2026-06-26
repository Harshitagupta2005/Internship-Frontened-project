import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { CommentService } from '../services/comment.service';
import { Ticket } from '../models/ticket';
import { Comment } from '../models/comment';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
  comment: ['', [Validators.required, Validators.minLength(2)]]   // 1 se 2 kiya
});
  }

  ngOnInit() {
    this.loadTicket();
    this.loadComments();
  }

  loadTicket() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.isLoading = true;

    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
        if (!data) {
          this.errorMessage = 'Ticket not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load ticket details.';
        this.isLoading = false;
      }
    });
  }

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
    }
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
        this.loadComments(); // refresh list
      },
      error: () => {
        this.isSubmittingComment = false;
        this.showNotif('error', 'Failed to add comment. Please try again.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}