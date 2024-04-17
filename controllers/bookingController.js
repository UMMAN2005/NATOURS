import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';
import User from '../models/userModel.js';
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from '../controllers/handlerFactory.js';

const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },
        },
      },
    ],
  });

  //3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// const createBookingCheckout = catchAsync(async (req, res, next) => {

//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const webhookCheckout = catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    await Booking.create({
      tour: session.client_reference_id,
      user: (await User.findOne({ email: session.customer_email })).id,
      price: session.amount_total / 100,
    });
  }

  res.status(200).json({ received: true });
});

const createBooking = createOne(Booking);
const getBooking = getOne(Booking);
const getAllBookings = getAll(Booking);
const updateBooking = updateOne(Booking);
const deleteBooking = deleteOne(Booking);

export { getCheckoutSession, webhookCheckout };
