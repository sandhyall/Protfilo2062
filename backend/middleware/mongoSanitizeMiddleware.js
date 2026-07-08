// backend/middleware/mongoSanitizeMiddleware.js
// Lightweight, Express-5-safe replacement for express-mongo-sanitize.
//
// express-mongo-sanitize reassigns req.query wholesale, but in Express 5
// req.query is a getter-only property with no setter — that throws
// "Cannot set property query of #<IncomingMessage> which has only a getter".
// This version mutates objects/arrays in place instead of reassigning them,
// which is safe for req.body, req.params, and req.query alike.

const isPlainObject = (val) =>
  val !== null && typeof val === 'object' && !Array.isArray(val);

const sanitizeInPlace = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    obj.forEach((item) => sanitizeInPlace(item));
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      return;
    }
    const value = obj[key];
    if (isPlainObject(value) || Array.isArray(value)) {
      sanitizeInPlace(value);
    }
  });

  return obj;
};

export const mongoSanitizeMiddleware = (req, res, next) => {
  sanitizeInPlace(req.body);
  sanitizeInPlace(req.params);
  sanitizeInPlace(req.query);
  next();
};

export default mongoSanitizeMiddleware;