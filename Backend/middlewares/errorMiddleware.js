class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // this.isOperational = true;
  }
}
export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if(err.name === "JsonWebTokenError"){
    const message = "Json Web Token is Invalid, Try Again!!!";
    err = new ErrorHandler(message, 400);
  }
  if(err.name === "TokenExpiredError"){
    const message = "Json Web Token is Expired, Try Again!!!";
    err = new ErrorHandler(message, 400);
  }
  if(err.name === "CastError"){
    const message = `Resource not found, Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors ? Object.values(err.errors).map((error) => error.message).join(" ") : err.message;

    return res.status(err.statusCode).json({
    success: false,
    message: errorMessage || "Internal Server Error",
  });
};

export default ErrorHandler;