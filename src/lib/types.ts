
export type Vector = {
  id: string;
  values: number[];
  metadata?: {
    text: string;
    pageNumber: number;
    [key: string]: unknown; // allows future expansion
  };
}