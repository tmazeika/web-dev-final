import { NutritionistModel, UserModel } from '../../../../api/dbModels';
import { dbConnect } from '../../../../api/dbConnect';
import { getRandomName } from '../../../../util/getRandomName';
import { Types } from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(403).end();
  }
  await dbConnect();
  const objectId = Types.ObjectId.isValid(id)
    ? new Types.ObjectId.createFromHexString(id)
    : null;
  const user = await UserModel.findOne({
    $or: [{ _id: objectId }, { firebaseId: id }],
  }).exec();
  if (user === null) {
    return res.status(404).end();
  }
  const isSelf = id === user.firebaseId;
  /** @type {Review[] | undefined} reviews */
  let reviews = undefined;
  if (user.nutritionistId !== null) {
    const nutritionist = await NutritionistModel.findById(
      user.nutritionistId,
    ).exec();
    reviews = nutritionist.reviews;
  }
  return res.status(200).json({
    id: user._id,
    name: getRandomName(user._id.toHexString()),
    role: user.nutritionistId === null ? 'foodie' : 'nutritionist',
    isSelf,
    reviews,
    favorites: user.favoriteFdcFoods,
    following: user.followingIds.map((id) => ({
      id,
      name: getRandomName(id.toHexString()),
    })),
    followers: user.followerIds.map((id) => ({
      id,
      name: getRandomName(id.toHexString()),
    })),
  });
}
