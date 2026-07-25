const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    error: {
      message: `Route not found - ${req.originalUrl}`,
      code: 'NOT_FOUND'
    }
  });
};

module.exports = notFoundMiddleware;
