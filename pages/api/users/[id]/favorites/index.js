import { FdcFoodModel, UserModel } from '../../../../../apiUtils/dbModels';
import { dbConnect } from '../../../../../apiUtils/dbConnect';
import { getFoodDetails } from '../../../../../apiUtils/fdcApi';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET': {
      const { id } = req.query;
      if (typeof id !== 'string') {
        return res.status(403).end();
      }
      const favorites = (await UserModel.findOne({ firebaseId: id }).exec())
        .favoriteFdcFoods;
      favorites.sort((a, b) => a.name.localeCompare(b.name));
      return res.status(200).json(favorites);
    }
    case 'PATCH': {
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
      const fdcName = favorite
        ? await (async () => {
            const existingFdcFood = await FdcFoodModel.findOne({
              fdcId,
            }).exec();
            if (existingFdcFood !== null) {
              return existingFdcFood.name;
            } else {
              return (await getFoodDetails(fdcId)).description;
            }
          })()
        : null;
      const isAlreadyFavorite = (
        await UserModel.findOne({ firebaseId: userId }).exec()
      ).favoriteFdcFoods.some((food) => food.fdcId === fdcId);
      if (favorite) {
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
          name: fdcName,
          favorites: 1,
        });
      } else if (fdcFood !== null && favorite && !isAlreadyFavorite) {
        await FdcFoodModel.updateOne({ fdcId }, { $inc: { favorites: 1 } });
      } else if (fdcFood !== null && !favorite && isAlreadyFavorite) {
        await FdcFoodModel.updateOne({ fdcId }, { $inc: { favorites: -1 } });
      }
      return res.status(204).end();
    }
    default:
      return res.status(405).end();
  }
}
