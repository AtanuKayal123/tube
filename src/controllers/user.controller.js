import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUsers = asyncHandler(async (req, res) => {
const{fullName,email,username,password} = req.body;

// validate user input
if ([fullName, email, username, password].some((field) => field === '')) { 
    throw new ApiError(400, 'All fields are required');
}

const existedUser = await User.findOne({
    $or: [{ email }, { username }], // check if email or username already exists in the database
})

if (existedUser) {
throw new ApiError(409, 'User already exists');
}

const avatarLocalPath= req.files?.avatar[0]?.path;
const coverImageLocalPath= req.files?.coverimage[0]?.path;

if (!avatarLocalPath || !coverImageLocalPath) {
    throw new ApiError(409, 'Avatar and cover image are missing');
}
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if(coverImageLocalPath){
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  }

  const user = User.create({
    fullName,
    email,
    username:username.toLowerCase(),
    password,
    avatar:avatar.url,
    coverImage:coverImage?.url || ""
  })
});

export { registerUsers };