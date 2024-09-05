import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.Stripe_Private_API_KEY);
const router = express.Router();

router.post('/create-checkout', async (req, res) => {
    try {
        const { reservation } = req.body;

        // Create a new Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${reservation.car.make} ${reservation.car.model}`,
                            images: reservation.car.images,
                        },
                        unit_amount: reservation.totalRate * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cancel`,
        });

        // Respond with the session ID
        res.json({ id: session.id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
});

export default router;
