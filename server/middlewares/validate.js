import AppError from "../utils/AppError.js";

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      const message = err.errors.map((e) => e.message).join(", ");
      return next(new AppError(message, 400));
    }
    next(err);
  }
};

export default validate;
