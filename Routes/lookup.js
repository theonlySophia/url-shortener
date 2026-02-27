import express from 'express';
import Url from '../Models/url.js';
import {urlCache} from '../Utils/utils.js';

const router = express.Router();

// Route to get original link from short URL
router.get('/:urlId', async(req, res)=>{
    const {urlId} = req.params;
    // check cache first
    if (urlCache[urlId]) {
    return res.json({ originalUrl: urlCache[urlId].originalUrl });
}
    try{
        const url = await Url.findOne({urlId});
        if(url){
            return res.json({originalUrl: url.originalUrl});
        }else {
            return res.status(404).sendFile('404.html', { root: 'public' });
        }
    }catch(err){
        res.status(500).json({error: "Server error"});
    }
})

export default router;