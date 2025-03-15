import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1, // Limit each IP to 1 request per windowMs
  message:
    "Too many coupon claims from this IP, please try again after 24 hours",
});

export { limiter };
