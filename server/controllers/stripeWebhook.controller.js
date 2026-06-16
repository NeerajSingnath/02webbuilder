import Stripe from 'stripe';
import User from '../models/user.model.js';

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res
      .status(400)
      .send(`Webhook signature verification failed: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;
      const credits = Number(session.metadata.credits);
      const plan = session.metadata.plan;

      await User.findByIdAndUpdate(userId, {
        $inc: { credits: credits },
        plan: plan,
      });
      // Handle successful payment
      console.log('Payment successful:', session);
      return res.status(200).json({ message: 'success', received: true });
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle payment intent succeeded
      console.log('Payment intent succeeded:', paymentIntent);
      return res.status(200).json({ message: 'success', received: true });
    // ... handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};
