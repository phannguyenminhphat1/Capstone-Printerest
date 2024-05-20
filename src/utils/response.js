export const response = (res, data, message, statusCode) => {
  res.status(statusCode).json({
    data,
    message,
    date: new Date(),
  });
};
