const Payment = require('../models/Payment');
const Course = require('../models/Course');
const stripe = require('../config/stripe');
const crypto = require('crypto');

// Create sandbox payment (mock payment)
const createSandboxPayment = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Generate unique transaction ID
    const transactionId = 'TXN_' + crypto.randomBytes(8).toString('hex').toUpperCase();

    const payment = await Payment.create({
      userId: req.user._id,
      courseId,
      amount: course.coursePrice,
      currency: process.env.CURRENCY || 'usd',
      paymentMethod: 'sandbox',
      status: 'completed',
      transactionId,
      receiptUrl: `/api/payment/receipt/${transactionId}`
    });

    res.json({ 
      success: true, 
      payment,
      message: 'Sandbox payment successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Stripe payment session
const createStripePayment = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: process.env.CURRENCY || 'usd',
          product_data: {
            name: course.courseTitle,
            description: course.courseDescription,
            images: [course.courseThumbnail]
          },
          unit_amount: course.coursePrice * 100 // Stripe uses cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        courseId: courseId,
        userId: req.user._id.toString()
      }
    });

    // Create pending payment record
    const payment = await Payment.create({
      userId: req.user._id,
      courseId,
      amount: course.coursePrice,
      currency: process.env.CURRENCY || 'usd',
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      status: 'pending',
      transactionId: 'STRIPE_' + session.id
    });

    res.json({ 
      success: true, 
      sessionId: session.id,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const payment = await Payment.findOne({ stripeSessionId: sessionId });

      if (payment) {
        payment.status = 'completed';
        payment.stripePaymentId = session.payment_intent;
        payment.receiptUrl = `/api/payment/receipt/${payment.transactionId}`;
        await payment.save();
      }

      res.json({ 
        success: true, 
        payment,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment receipt
const getReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Payment.findOne({ transactionId })
      .populate('userId', 'name email')
      .populate('courseId', 'courseTitle coursePrice');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user payments
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('courseId', 'courseTitle courseThumbnail')
      .sort({ paymentDate: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSandboxPayment,
  createStripePayment,
  verifyStripePayment,
  getReceipt,
  getUserPayments
};
