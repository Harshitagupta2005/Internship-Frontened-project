export interface Department {
  id: number | string;
  name: string;
  head?: string;          // department head name (agar available ho)
  headId?: string;
  employeeCount?: number;
}