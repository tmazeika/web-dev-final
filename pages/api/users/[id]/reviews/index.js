import {
  FdcFoodModel,
  NutritionistModel,
  UserModel,
} from '../../../../../api/dbModels';
import { dbConnect } from '../../../../../api/dbConnect';
import { getFoodDetails } from '../../../../../api/fdcApi';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET': {
      const { id } = req.query;
      if (typeof id !== 'string') {
        return res.status(403).end();
      }
      const user = await UserModel.findOne({
        firebaseId: id,
        nutritionistId: { $ne: null },
      }).exec();
      const reviews = (
        await NutritionistModel.findOne({ userId: user._id }).exec()
      ).reviews;
      return res.status(200).json(reviews);
    }
    case 'PATCH': {
      const { id: userId } = req.query;
      const { fdcId, good } = req.body;
      if (
        typeof userId !== 'string' ||
        typeof fdcId !== 'string' ||
        (typeof good !== 'boolean' && good !== null)
      ) {
        return res.status(403).end();
      }
      await dbConnect();
      const fdcName =
        good !== null
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
      const user = await UserModel.findOne({
        firebaseId: userId,
        nutritionistId: { $ne: null },
      }).exec();
      const reviews = (
        await NutritionistModel.findOne({ userId: user._id }).exec()
      ).reviews;
      const previousGood =
        reviews.find((review) => review.fdcId === fdcId)?.good ?? null;
      await NutritionistModel.updateOne(
        { userId: user._id },
        { $pull: { reviews: { fdcId } } },
      );
      if (good !== null) {
        await NutritionistModel.updateOne(
          { userId: user._id },
          { $addToSet: { reviews: { fdcId, authorId: user._id, good } } },
        );
      }
      const fdcFood = await FdcFoodModel.findOne({ fdcId }).exec();
      if (fdcFood === null && good !== null) {
        await FdcFoodModel.create({
          fdcId,
          name: fdcName,
          goodReviews: good ? 1 : 0,
          badReviews: !good ? 1 : 0,
        });
      } else if (fdcFood !== null) {
        if (previousGood === true) {
          await FdcFoodModel.updateOne(
            { fdcId },
            { $inc: { goodReviews: -1 } },
          );
        }
        if (previousGood === false) {
          await FdcFoodModel.updateOne({ fdcId }, { $inc: { badReviews: -1 } });
        }
        if (good === true) {
          await FdcFoodModel.updateOne({ fdcId }, { $inc: { goodReviews: 1 } });
        }
        if (good === false) {
          await FdcFoodModel.updateOne({ fdcId }, { $inc: { badReviews: 1 } });
        }
      }
      return res.status(204).end();
    }
    default:
      return res.status(405).end();
  }
}
