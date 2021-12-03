import { dbConnect } from '../../../api/dbConnect';
import { NutritionistModel, UserModel } from '../../../api/dbModels';
import { getRandomName } from '../../../util/getRandomName';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(403).end();
  }
  await dbConnect();
  const favorites = await UserModel.find(
    {
      favoriteFdcFoods: { $elemMatch: { fdcId: id } },
    },
    {},
  ).exec();
  const nutritionistsGood = (
    await NutritionistModel.find(
      { reviews: { $elemMatch: { fdcId: id, good: true } } },
      { 'reviews.$': 1 },
    ).exec()
  ).map((n) => n.reviews[0]);
  const nutritionistsBad = (
    await NutritionistModel.find(
      { reviews: { $elemMatch: { fdcId: id, good: false } } },
      { 'reviews.$': 1 },
    ).exec()
  ).map((n) => n.reviews[0]);

  return res.status(200).json({
    favorites: favorites.map((user) => ({
      userId: user._id.toHexString(),
      name: getRandomName(user._id.toHexString()),
    })),
    good: nutritionistsGood.map((n) => ({
      userId: n.authorId.toHexString(),
      name: getRandomName(n.authorId.toHexString()),
    })),
    bad: nutritionistsBad.map((n) => ({
      userId: n.authorId.toHexString(),
      name: getRandomName(n.authorId.toHexString()),
    })),
  });
}
