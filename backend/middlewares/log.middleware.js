import RequestLog from "../models/requestLog.model.js";

export const requestLogger = async (req, res, next) => {
  // on-finish waits until a response is sent to the client
  res.on('finish', async () => {
    try {
      await RequestLog.create({
        // NOTE: accountData is inserted into request object AFTER token authentication (see auth middleware)
        account_id: req.accountData ? req.accountData.id : null,
        method: req.method,
        endpoint: req.originalUrl,
        status_code: res.statusCode,
        client_ip: req.ip,
      });
    } catch (error) {
      console.error(`ERROR: request log create failed: ${error}`)
    }
  });
  next();
}
