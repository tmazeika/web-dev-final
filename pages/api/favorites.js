import { dbConnect } from '../../apiUtils/dbConnect';
import { FdcFoodModel } from '../../apiUtils/dbModels';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  await dbConnect();
  return res.status(200).json(
    await FdcFoodModel.find({ favorites: { $gt: 0 } })
      .sort({ favorites: -1, name: 1 })
      .limit(10)
      .exec(),
  );
}
