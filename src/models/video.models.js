/*id string pk
owner ObjectId users
videoFile string
thumbnail string
title string
description string
duration number
views number
isPublished boolean
createdAt Date
updatedAt Date
*/

import mongoose, {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
      owner: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        videoFile: {
            type: String, // URL cloudinary
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,      
         },
    },
    {
        timestamps: true,   // createdAt and updatedAt fields
    }
)

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);