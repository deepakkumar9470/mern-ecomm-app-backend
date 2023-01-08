import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET)

import express from 'express'
const router = express.Router()



// @ /api/stripe/create-checkout

router.post('/create-checkout-session', async (req, res) => {
  
  const line_items = req.body.cartitems.map((item) =>{
    return {
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image.url],
          description: item.description,
          metadata : {
            id : item.id
          }
        },
        unit_amount: item.price * 100,
      },
      quantity : item.cartQuantity   
    };
  });

    const session = await stripe.checkout.sessions.create({
      line_items,
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'inr',
            },
            display_name: 'Delivery in 2-4 days',
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            }
          }
        },
      ],
      phone_number_collection :{
              enabled : true
      }, 
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
  
    res.send({url : session.url});
  });
  

export default router

