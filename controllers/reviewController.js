import Review from '../models/reviewModel.js';
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from '../controllers/handlerFactory.js';

const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = getAll(Review);
const getReview = getOne(Review);
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

export {
  setTourUserIds,
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
