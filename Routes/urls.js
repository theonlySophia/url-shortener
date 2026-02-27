import express from 'express';
import {nanoid} from 'nanoid';
import Url from '../Models/url.js';
import {validateUrl} from '../Utils/utils.js';
import {urlCache , bufferedSave } from '../Utils/utils.js';
import QRCode from 'qrcode';

import dotenv from 'dotenv';
dotenv.config();



const router = express.Router();
// Route to create a short URL
router.post('/shorten', async(req, res) =>{
    const {originalUrl} = req.body;
    const baseUrl = process.env.BASE_URL;

    const urlId = nanoid(6);
    console.log("Received URL:", originalUrl);
    if(!validateUrl(originalUrl)){
        return res.status(400).json({error: "Invalid URL or URL contains .xyz domain"});
    }
    console.log("Is valid:", validateUrl(originalUrl));
    try{
        console.log("Entered try block");
        let url = await Url.findOne({originalUrl});
        console.log("Database query done");
        if (url){
            res.status(200).json(url);
        }else {
            const shortUrl = `${baseUrl}/${urlId}`;

     // Generate QR code for the short URL
        const qrCode = await QRCode.toDataURL(shortUrl,{
        width: 300,
        color: {
            dark: '#ffffff',
            light: '#ffb6c1'
        }
    });
    // console.log("QR Code generated:", qrCode);
            url = new Url({
                originalUrl,
                shortUrl,
                urlId,
                qrCode,
                date: new Date().toISOString(),
            });
            
            urlCache[urlId] = url; // Cache the URL in memory
            bufferedSave(url);
            res.status(201).json(url);
        }
    } catch (err){
        console.log("Full error:", err.message);
    console.log("Stack:", err.stack);
        res.status(500).json({error: "Server error"});
    }
});

export default router;
