import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachment } from '../models/attachment.model';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  // TODO: apna actual base API URL daalo (environment.apiUrl se le sakte ho)
  private baseUrl = 'http://localhost:8000/api/tickets';

  constructor(private http: HttpClient) {}

  getAttachments(ticketId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.baseUrl}/${ticketId}/attachments`);
  }

  uploadAttachments(ticketId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file, file.name));
    return this.http.post(`${this.baseUrl}/${ticketId}/attachments`, formData);
  }

  downloadAttachment(attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
  }
}