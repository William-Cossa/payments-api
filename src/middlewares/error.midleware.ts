const errorMiddleware = (err: any, req: any, res: any, next: any) => {
  try {
    let error = { ...err };

    error.message = err.message;

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
