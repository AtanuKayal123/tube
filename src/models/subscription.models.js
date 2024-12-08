// id string pk
//   subscriber ObjectId users
//   channel ObjectId users
//   createdAt Date
//   updatedAt Date

import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: 'User',
        required: true,
    },
    channel: {
        type: Schema.Types.ObjectId, // one who is being subscribed to 
        ref: 'User',
        required: true,
    },
},
{
    timestamps: true,// createdAt and updatedAt fields
}

)

export const Subscription = mongoose.model('Subscription', subscriptionSchema);