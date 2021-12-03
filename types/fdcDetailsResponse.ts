export interface FdcDetailsResponse {
  id: number;
  description: string;
  favorites: number;
  goodReviews: number;
  badReviews: number;
  portions: FdcPortion[];
  caloriesPerGram: number;
  carbsPerGram: number;
  sugarPerGram: number;
  fatPerGram: number;
  proteinPerGram: number;
  fiberPerGram: number;
  ingredients: FdcIngredient[];
}

export interface FdcPortion {
  id: string;
  name: string;
  grams: number;
}

export interface FdcIngredient {
  id: string;
  fdcId: number | null;
  amount: string;
  name: string;
}
