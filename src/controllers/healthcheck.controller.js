import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const healthcheck =  asyncHandler( async (req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(null, "API OK", 200));
})

export { healthcheck };