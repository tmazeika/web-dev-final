import { FdcFoodModel, UserModel } from '../../../../../api/dbModels';
import { dbConnect } from '../../../../../api/dbConnect';
import { getFoodDetails } from '../../../../../api/fdcApi';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }
  const { id: userId } = req.query;
  const { fdcId, favorite } = req.body;
  if (
    typeof userId !== 'string' ||
    typeof fdcId !== 'string' ||
    typeof favorite !== 'boolean'
  ) {
    return res.status(403).end();
  }
  await dbConnect();
  const isAlreadyFavorite = (
    await UserModel.findOne({ firebaseId: userId }).exec()
  ).favoriteFdcFoods.some((food) => food.fdcId === fdcId);
  if (favorite) {
    const fdcName = (await getFoodDetails(fdcId)).description;
    await UserModel.updateOne(
      { firebaseId: userId },
      { $addToSet: { favoriteFdcFoods: { fdcId, name: fdcName } } },
    );
  } else {
    await UserModel.updateOne(
      { firebaseId: userId },
      { $pull: { favoriteFdcFoods: { fdcId } } },
    );
  }
  const fdcFood = await FdcFoodModel.findOne({ fdcId }).exec();
  if (fdcFood === null && favorite) {
    await FdcFoodModel.create({
      fdcId,
      favorites: 1,
    });
  } else if (fdcFood !== null && favorite && !isAlreadyFavorite) {
    await FdcFoodModel.updateOne({ fdcId }, { $inc: { favorites: 1 } });
  } else if (fdcFood !== null && !favorite && isAlreadyFavorite) {
    await FdcFoodModel.updateOne({ fdcId }, { $inc: { favorites: -1 } });
  }
  return res.status(204).end();
}
