import { connect } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '../../api/db';

interface Data {
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await connect(process.env.DB_URL ?? '');
  const doc = new UserModel({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png',
  });
  await doc.save();
  res.status(200).json({ email: doc.email });
}
