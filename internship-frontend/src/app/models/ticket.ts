export interface Ticket {
  id: string | number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  assignedToId?: string;   // 👈 ye line add karo
  createdDate?: string;
}