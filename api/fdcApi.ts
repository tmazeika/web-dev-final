export interface SearchResult {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: SearchResultFood[];
}

export interface FoodResult {
  fdcId: number;
  description: string;
  foodPortions: FoodPortion[];
  inputFoods: InputFood[];
  foodNutrients: {
    id: number | undefined;
    nutrient: FoodNutrient2;
    amount: number | undefined;
  }[];
}

export interface SearchResultFood {
  fdcId: number;
  description: string;
  foodMeasures: FoodMeasure[];
  foodNutrients: FoodNutrient[];
}

export interface FoodMeasure {
  disseminationText: string;
  gramWeight: number;
  rank: number;
}

export interface FoodPortion {
  id: string;
  portionDescription: string;
  gramWeight: number;
}

export interface InputFood {
  id: string;
  foodDescription: string;
  amount: number;
  unit: string;
  inputFood?: {
    fdcId: number;
  };
}

export interface FoodNutrient {
  nutrientName: string;
  unitName: string;
  value: number;
}

export interface FoodNutrient2 {
  name: string;
  unitName: string;
}

export const PAGE_SIZE = 50;

export async function searchFoods(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?${new URLSearchParams({
      query,
      dataType: 'Survey (FNDDS)',
      pageSize: String(PAGE_SIZE),
      api_key: process.env.FDC_API_KEY ?? '',
    }).toString()}`,
    { signal },
  );
  if (!res.ok) {
    throw res.statusText;
  }
  return (await res.json()) as SearchResult;
}

export async function getFoodDetails(
  id: string,
  signal?: AbortSignal,
): Promise<FoodResult> {
  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/food/${id}?${new URLSearchParams({
      api_key: process.env.FDC_API_KEY ?? '',
    }).toString()}`,
    { signal },
  );
  if (!res.ok) {
    throw res.statusText;
  }
  return (await res.json()) as FoodResult;
}
