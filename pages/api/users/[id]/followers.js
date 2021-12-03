import { UserModel } from '../../../../api/dbModels';
import { dbConnect } from '../../../../api/dbConnect';
import { Types } from 'mongoose';

export default async function handler(req, res) {
  const { id } = req.query;
  const { followerId } = req.body;
  if (typeof id !== 'string' || typeof followerId !== 'string') {
    return res.status(403).end();
  }
  await dbConnect();
  const following = await UserModel.findOne({
    _id: Types.ObjectId.createFromHexString(id),
  }).exec();
  const follower = await UserModel.findOne({
    firebaseId: followerId,
  }).exec();
  if (following === null || follower === null) {
    return res.status(404).end();
  }

  switch (req.method) {
    case 'DELETE': {
      await UserModel.updateOne(
        {
          _id: Types.ObjectId.createFromHexString(id),
        },
        {
          $pull: { followerIds: follower._id },
        },
      ).exec();
      await UserModel.updateOne(
        {
          firebaseId: followerId,
        },
        {
          $pull: { followingIds: following._id },
        },
      ).exec();
      return res.status(204).end();
    }
    case 'POST': {
      await UserModel.updateOne(
        {
          _id: Types.ObjectId.createFromHexString(id),
        },
        {
          $push: { followerIds: follower._id },
        },
      ).exec();
      await UserModel.updateOne(
        {
          firebaseId: followerId,
        },
        {
          $push: { followingIds: following._id },
        },
      ).exec();
      return res.status(204).end();
    }
    default:
      return res.status(405).end();
  }
}
