import type { NextApiRequest } from 'next';
import { searchFoods } from '../../../api/fdcApi';
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
    results: searchRes.foods.map((food) => ({
      id: food.fdcId,
      description: food.description,
    })),
  });
}
