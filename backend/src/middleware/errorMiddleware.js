export function notFound(req, _res, next) {
  next(Object.assign(new Error(`Route not found: ${req.method} ${req.originalUrl}`), { status: 404 }));
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors).map((item) => item.message).join(". "),
    });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier" });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({
    message: status >= 500 ? "Something went wrong. Please try again." : error.message,
  });
}
