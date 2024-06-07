export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  number: number;
}




