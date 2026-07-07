export interface Ticket {
  id: string | number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  assignedToId?: string;
  createdDate?: string;

  department?: {
    id: number;
    name: string;
  };

  department_id?: number;
}