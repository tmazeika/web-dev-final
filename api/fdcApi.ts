export interface SearchResult {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: SearchResultFood[];
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

export interface FoodNutrient {
  nutrientName: string;
  unitName: string;
  value: number;
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
