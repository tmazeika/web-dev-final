import { NutritionistModel, UserModel } from '../../../api/dbModels';
import { dbConnect } from '../../../api/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { id, role } = req.body;
  if (typeof id !== 'string' || typeof role !== 'string') {
    return res.status(403).end();
  }
  await dbConnect();
  const user = await UserModel.create({ firebaseId: id });
  if (role === 'nutritionist') {
    const nutritionist = await NutritionistModel.create({ userId: user._id });
    await UserModel.updateOne(
      { _id: user._id },
      { nutritionistId: nutritionist._id },
    );
  }
  return res.status(204).end();
}
