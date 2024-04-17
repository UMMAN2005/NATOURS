/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51P6ANm2K5aFeXq66zf5xJzw5HMF8WROtSUF0SyS3u6WBhsJCKtCcOrjmCA6avD78sexJndtscHkh4xO089bhrwdA00B7eVlQIW',
    );
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    // window.location.replace(session.data.session.url);
  } catch (err) {
    showAlert('error', err);
  }
};
