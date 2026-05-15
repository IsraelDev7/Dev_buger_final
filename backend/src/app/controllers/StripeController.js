import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder_key');

class StripeController {
  async store(request, response) {
    try {
      const { totalAmount } = request.body;

      if (!totalAmount) {
        return response.status(400).json({ error: 'Amount is required' });
      }

      // O Stripe trabalha com a menor unidade da moeda (Centavos).
      const amountInCents = Math.round(totalAmount);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'brl',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return response.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Stripe Error:', error.message);
      return response.status(400).send({ error: error.message });
    }
  }
}

export default new StripeController();
