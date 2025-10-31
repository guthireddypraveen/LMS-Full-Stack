const { Clerk } = require('@clerk/express');

const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

module.exports = clerk;
