import Coupon from "../models/coupon.model.js";
import stripe from "../lib/stripe.js";

export const createCheckOutSession = async (req, res) => {
  try {
    const { orders, couponCode } = req.body;

    if (!orders || orders.length === 0) {
      return res.status(400).json({
        message: "No orders provided",
      });
    }

    let totalPrice = 0;

    const lineItems = orders.map((order) => {
      const { product, quantity } = order;

      totalPrice += product.price * quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      };
    });

    let stripeCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        user: req.user._id,
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({
          message: "Invalid or expired coupon code",
        });
      }

      totalPrice -= Math.round(
        totalPrice * (coupon.discount / 100)
      );

      stripeCoupon = await stripe.coupons.create({
        percent_off: coupon.discount,
        duration: "once",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      discounts: stripeCoupon
        ? [{ coupon: stripeCoupon.id }]
        : [],
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.status(200).json({
      id: session.id,
      url: session.url,
      totalPrice,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};