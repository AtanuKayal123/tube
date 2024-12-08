// id string pk
//   username string
//   email string
//   fullName string
//   avatar string
//   coverImage string
//   watchHistory ObjectId[] videos
//   password string
//   refreshToken string
//   createdAt Date
//   updatedAt Date

import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
      username: { 
        type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
         index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        avatar: {
            type: String, // URL cloudinary
            default: null,
        },

        coverImage: {
            type: String, // URL cloudinary
           
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        
        password: {
            type: String,
            required: [true,"Password is required"],
        },
         
        refreshToken: {
            type: String,
            required: 
        }
    },
          {
            timestamps: true}
    
)

userSchema.pre('save', async function (next) {
    const user = this;
    if (!this.modified('password')) return next();

        this.password = bcrypt.hash(user.password, 12);
    
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};  

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ 
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
     }, 
       process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ 
        _id: this._id },
         process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

export const User = mongoose.model('User', userSchema);