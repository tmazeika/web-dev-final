import type { NextApiRequest } from 'next';
import type { FoodResult } from '../../../api/fdcApi';
import { getFoodDetails } from '../../../api/fdcApi';
import type { ApiResponse } from '../../../types/apiResponse';
import type { FdcDetailsResponse } from '../../../types/fdcDetailsResponse';

export default async function handler(
  req: NextApiRequest,
  res: ApiResponse<FdcDetailsResponse>,
) {
  const id = typeof req.query.id === 'string' ? req.query.id : null;
  if (id === null) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const foodRes = await getFoodDetails(id);
  res.status(200).json({
    id: foodRes.fdcId,
    description: foodRes.description,
    portions: foodRes.foodPortions.map((portion) => ({
      id: portion.id,
      name: portion.portionDescription,
      grams: portion.gramWeight,
    })),
    caloriesPerGram: getNutrientValue(foodRes, 'Energy'),
    carbsPerGram: getNutrientValue(foodRes, 'Carbohydrate, by difference'),
    sugarPerGram: getNutrientValue(foodRes, 'Sugars, total including NLEA'),
    fatPerGram: getNutrientValue(foodRes, 'Total lipid (fat)'),
    proteinPerGram: getNutrientValue(foodRes, 'Protein'),
    fiberPerGram: getNutrientValue(foodRes, 'Fiber, total dietary'),
    ingredients: foodRes.inputFoods.map((ingredient) => ({
      id: ingredient.id,
      fdcId: ingredient.inputFood?.fdcId ?? null,
      amount: `${ingredient.amount} ${ingredient.unit}`,
      name: ingredient.foodDescription,
    })),
  });
}

const getNutrientValue = (food: FoodResult, name: string): number =>
  Number(
    food.foodNutrients.find((n) => n.nutrient.name === name)?.amount ?? 0,
  ) / 100;
