import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); // Ensure `user` is fetched
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Token generation failed", error);
    throw new ApiError(500, 'Token generation failed');
  }
};

const loginUsers = asyncHandler(async (req, res) => {
  // get data from the request body
  const { username,email, password } = req.body;

  // validation
  if(!email,username){
    throw new ApiError(400," Email not found")
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }], // Check if email or username already exists
  });
   
  if (!existedUser) {
     throw new ApiError(400," User not Found")
  }

  // validate password 
   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(402," Invalid Credentials")
   }

   const loggedInUser = await User.findById(user._id)
   .select("-password -refreshToken");

   if(!loggedInUser){
    throw new ApiError(402," NOT LOGGED IN USER")
   }
    
   const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
    
  return res 
  .status(200)
  .cookie("accessToken", accessToken,options) 
  .cookie("refreshToken", refreshToken,options) 
  .json( new ApiResponse(200,
    {user:loggedInUser, accessToken,refreshToken},
    "User logged in successfullly"
  ))
});

const logoutUsers = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      }
    },

    {new: true}
   )
   const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200,)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200,{},"User logged out successfully"))

})


const registerUsers = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validate user input
  if ([fullName, email, username, password].some((field) => field === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }], // Check if email or username already exists
  });

  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalPath || !coverImageLocalPath) {
    throw new ApiError(409, 'Avatar and cover image are missing');
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded successfully", avatar);
  } catch (error) {
    console.log("Avatar upload failed", error);
    throw new ApiError(500, 'Avatar upload failed');
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Cover Image uploaded successfully", coverImage);
  } catch (error) {
    console.log("Cover Image upload failed", error);
    throw new ApiError(500, 'Cover Image upload failed');
  }

  try {
    const user = await User.create({
      fullName,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id);

    if (!createdUser) {
      throw new ApiError(500, 'User not created');
    }

    return res
      .status(201)
      .json(new ApiResponse(201, 'User created successfully', createdUser));
  } catch (error) {
    console.log("User creation failed", error);
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(500, 'Something went wrong');
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(404, 'Invalid refresh token');
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(200, 'Token refreshed successfully', {
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
  } catch (error) {
    console.log("Token verification failed", error);
    throw new ApiError(401, 'Invalid token');
  }
});

export { registerUsers, loginUsers, refreshAccessToken,logoutUsers };



