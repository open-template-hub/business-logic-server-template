/**
 * Error Handler
 */

import { ResponseCode } from "../models/Constant";

export const handle = (exception) => {
  let response = {
    code: ResponseCode.BAD_REQUEST,
    message: exception.message
  };

  if (exception.message === "Error that will be handled") {
    // Overwrite Response Code and Message here
  }

  return response;
}