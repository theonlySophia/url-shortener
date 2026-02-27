import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    urlId: {
        type: String,
        required: true
    },
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    qrCode: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String,
        default: Date.now
    }
})

export default mongoose.model('Url', urlSchema)