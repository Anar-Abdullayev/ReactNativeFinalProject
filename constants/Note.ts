export type Note = {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  zIndex: number;
  isEditing?: boolean;
};