import type { Model, ObjectId } from 'mongoose';
import { model, models, Schema } from 'mongoose';

export interface FdcFoodUser {
  userId: string;
  name: string;
}

export interface FollowingFollower {
  id: string;
  name: string;
}

export interface Favorite {
  fdcId: string;
  name: string;
}

export interface UserDetails {
  id: string;
  name: string;
  role: string;
  isSelf: boolean;
  reviews?: Review[];
  favorites?: Favorite[];
  following?: FollowingFollower[];
  followers?: FollowingFollower[];
}

export interface FdcFoodUsers {
  favorites: FdcFoodUser[];
  good: FdcFoodUser[];
  bad: FdcFoodUser[];
}

export interface Review {
  _id: ObjectId;
  fdcId: string;
  name: string;
  authorId: ObjectId;
  good: boolean;
}

const reviewSchema = new Schema<Review>({
  fdcId: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  good: { type: Boolean, required: true },
});

export const ReviewModel =
  (models.Review as Model<Review> | undefined) ||
  model<Review>('Review', reviewSchema);

export interface FdcFood {
  _id: ObjectId;
  fdcId: string;
  name: string;
  favorites: number;
  goodReviews: number;
  badReviews: number;
  cache: string | null;
}

const fdcFoodSchema = new Schema<FdcFood>({
  fdcId: { type: String, required: true },
  name: { type: String, required: true },
  favorites: { type: Number, default: 0, required: true },
  goodReviews: { type: Number, default: 0, required: true },
  badReviews: { type: Number, default: 0, required: true },
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
