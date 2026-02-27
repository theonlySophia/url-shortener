import express from 'express';
import Url from '../Models/url.js';

import {urlCache , bufferedSave } from '../Utils/utils.js';

const router = express.Router();

// Route to redirect to the original URL
router.get('/:urlId', async(req, res)=>{
    const {urlId} = req.params
    //check cache first
    if (urlCache[urlId]){
        console.log("✅ Cache hit! Serving from memory"); // testing that cache is working
       //urlCache[urlId].clicks++;
        return res.redirect(urlCache[urlId].originalUrl);
    }

    //if not in cache, check database
    try{
        console.log("⚠️ Cache miss! Hitting database"); // testing that cache is working
        const url = await Url.findOne ({urlId});
        if(url && url.clicks < 1 ){
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl);
        }
        if (url && url.clicks >= 1){
            await Url.findOneAndDelete(url);
            return res.status(404).json({error: "Url has been deleted after 1 click"});
        }
        else {
            return res.status(404).json({error: "Url not found"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
})

export default router;