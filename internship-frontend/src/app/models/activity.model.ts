export interface Activity {
  id: number;
  ticket_id: number;
  activity_type: 'Created' | 'Assigned' | 'StatusChanged' | 'CommentAdded' | 'AttachmentUploaded';
  description: string;
  performed_by: string;
  created_at: string;
}