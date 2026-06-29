// Laravel DB columns se exact match — snake_case
export interface Attachment {
  id: number;
  ticket_id: number;
  user_id: number;
  file_name: string;   // file_name
  file_path: string;   // file_path
  file_type: string;   // file_type (mime)
  file_size: number;   // file_size (bytes)
  created_at: string;  // upload date
  updated_at: string;
}