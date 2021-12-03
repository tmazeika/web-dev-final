import type { Model, ObjectId } from 'mongoose';
import { model, models, Schema } from 'mongoose';

export interface Review {
  _id: ObjectId;
  authorId: ObjectId;
  content: string;
}

const reviewSchema = new Schema<Review>({
  authorId: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
});

export const ReviewModel =
  (models.Review as Model<Review> | undefined) ||
  model<Review>('Review', reviewSchema);

export interface FdcFood {
  _id: ObjectId;
  fdcId: string;
  name: string;
  favorites: number;
  reviews: Review[];
  cache: string | null;
}

const fdcFoodSchema = new Schema<FdcFood>({
  fdcId: { type: String, required: true },
  name: { type: String, required: true },
  favorites: { type: Number, default: 0, required: true },
  reviews: { type: [reviewSchema], default: [], required: true },
  cache: { type: String, default: null, required: false },
});

export const FdcFoodModel =
  (models.FdcFood as Model<FdcFood> | undefined) ||
  model<FdcFood>('FdcFood', fdcFoodSchema);

export interface User {
  _id: ObjectId;
  firebaseId: string;
  nutritionistId: ObjectId | null;
  followerIds: ObjectId[];
  followingIds: ObjectId[];
  favoriteFdcFoods: {
    fdcId: string;
    name: string;
  }[];
}

const userSchema = new Schema<User>({
  firebaseId: { type: String, required: true },
  nutritionistId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  followerIds: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: true,
  },
  followingIds: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: true,
  },
  favoriteFdcFoods: {
    type: [
      {
        fdcId: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    default: [],
    required: true,
  },
});

export const UserModel =
  (models.User as Model<User> | undefined) || model<User>('User', userSchema);

export interface Nutritionist {
  _id: ObjectId;
  userId: ObjectId;
  reviews: Review[];
}

const nutritionistSchema = new Schema<Nutritionist>({
  userId: { type: Schema.Types.ObjectId, required: true },
  reviews: { type: [reviewSchema], default: [], required: true },
});

export const NutritionistModel =
  (models.Nutritionist as Model<Nutritionist> | undefined) ||
  model<Nutritionist>('Nutritionist', nutritionistSchema);
