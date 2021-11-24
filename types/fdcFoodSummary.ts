export interface FdcFoodSummary {
  id: number;
  description: string;
  portionName: string | null;
  portionGrams: number;
  calories: number;
  carbs: number;
  sugar: number;
  fat: number;
  protein: number;
  fiber: number;
}
