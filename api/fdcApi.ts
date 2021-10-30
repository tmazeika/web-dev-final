interface SearchResult {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: SearchResultFood[];
}

interface SearchResultFood {
  fdcId: number;
  description: string;
  foodNutrients: AbridgedFoodNutrient[];
  brandOwner: string;
}

interface AbridgedFoodNutrient {
  number: number;
  name: string;
  amount: number;
  unitName: string;
}

export async function searchFoods(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?${new URLSearchParams({
      query,
      dataType: 'Survey (FNDDS)',
      api_key: process.env.FDC_API_KEY ?? '',
    }).toString()}`,
    { signal },
  );
  if (!res.ok) {
    throw res.statusText;
  }
  return (await res.json()) as SearchResult;
}
