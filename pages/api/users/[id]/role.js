import { UserModel } from '../../../../api/dbModels';
import { dbConnect } from '../../../../api/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(403).end();
  }
  await dbConnect();
  const user = await UserModel.findOne({
    firebaseId: id,
  }).exec();
  if (user === null) {
    return res.status(404).end();
  }
  return res.status(200).json({
    role: user.nutritionistId === null ? 'foodie' : 'nutritionist',
  });
}
