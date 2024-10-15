//RailRoad/utils/response.js
exports.successResponse = (res, data, message = 'Success') => {
    return res.status(200).json({ status: 'success', message, data });
  };
  
  exports.errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ status: 'error', message });
  };
  