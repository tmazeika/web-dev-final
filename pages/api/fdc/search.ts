import type { NextApiRequest } from 'next';
import type { SearchResultFood } from '../../../apiUtils/fdcApi';
import { searchFoods } from '../../../apiUtils/fdcApi';
import type { ApiResponse } from '../../../types/apiResponse';
import type { FdcSearchResponse } from '../../../types/fdcSearchResponse';

export default async function handler(
  req: NextApiRequest,
  res: ApiResponse<FdcSearchResponse>,
) {
  const query = typeof req.query.q === 'string' ? req.query.q : null;
  if (query === null) {
    return res.status(400).json({ error: 'Invalid query' });
  }
  const searchRes = await searchFoods(query);
  res.status(200).json({
    count: searchRes.totalHits,
    page: searchRes.currentPage,
    pageCount: searchRes.totalPages,
    results: searchRes.foods
      .filter((food) => food.foodMeasures.length > 0)
      .map((food) => {
        const portion = food.foodMeasures[0];
        const portionGrams = portion.gramWeight ?? 0;
        return {
          id: food.fdcId,
          description: food.description,
          portionName:
            portion.disseminationText === 'Quantity not specified'
              ? null
              : portion.disseminationText,
          portionGrams,
          calories: getNutrientValue(food, 'Energy') * portionGrams,
          carbs:
            getNutrientValue(food, 'Carbohydrate, by difference') *
            portionGrams,
          sugar:
            getNutrientValue(food, 'Sugars, total including NLEA') *
            portionGrams,
          fat: getNutrientValue(food, 'Total lipid (fat)') * portionGrams,
          protein: getNutrientValue(food, 'Protein') * portionGrams,
          fiber: getNutrientValue(food, 'Fiber, total dietary') * portionGrams,
          all: food,
        };
      }),
  });
}

const getNutrientValue = (food: SearchResultFood, name: string): number =>
  (food.foodNutrients.find((n) => n.nutrientName === name)?.value ?? 0) / 100;
