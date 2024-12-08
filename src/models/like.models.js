// id string pk
// video ObjectId videos
// comment ObjectId comments
// tweet ObjectId tweets
// likedBy ObjectId users
// createdAt Date
// updatedAt Date 

import mongoose, {Schema} from "mongoose";
 
const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, 
{
    timestamps: true,
}
)
