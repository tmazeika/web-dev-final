import { NutritionistModel, UserModel } from '../../../../../apiUtils/dbModels';
import { dbConnect } from '../../../../../apiUtils/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  const { id: userId, fdcId } = req.query;
  if (typeof userId !== 'string' || typeof fdcId !== 'string') {
    return res.status(403).end();
  }
  await dbConnect();
  const user = await UserModel.findOne({
    firebaseId: userId,
    nutritionistId: { $ne: null },
  }).exec();
  const nutritionist =
    user !== null
      ? await NutritionistModel.findOne({ userId: user._id }).exec()
      : null;
  return res.status(200).json({
    good:
      nutritionist?.reviews.find((review) => review.fdcId === fdcId)?.good ??
      null,
  });
}
