import type { FdcFoodSummary } from './fdcFoodSummary';

export interface FdcSearchResponse {
  count: number;
  page: number;
  pageCount: number;
  results: FdcFoodSummary[];
}
