import express from 'express';
import { getCheckoutSession } from '../controllers/bookingController.js';
import { protect } from '../controllers/authController.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../controllers/handlerFactory.js';

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

router.route('/').get(getAll).post(createOne);
router.route('/:id').get(getOne).patch(updateOne).delete(deleteOne);

export default router;
