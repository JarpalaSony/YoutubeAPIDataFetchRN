require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Video = require("./models/Video");
const app = express();
const axios = require("axios");

app.use(cors());

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true})
.then(()=>console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err) )

app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

app.get("/videos",async(req,res)=>{
    try{
        const videos = await Video.find({});
        const videoIds = videos.map(v => v.videoId).join(",");
        if(!videoIds) return res.json([]);

        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`;
        const {data} = await axios.get(url);

        const enriched = data.items.map(item => ({
              videoId:item.id,
              title:item.snippet.title,
              channel:item.snippet.channelTitle,
              thumbnail:item.snippet.thumbnails.medium.url,
              duration:item.contentDetails.duration,

        }));
      
        res.json(enriched);

    }
    catch(err){
        console.error("❌ Error fetching videos:", err);
        res.status(500).json({error:"Internal Server Error"});
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`🚀 Server running on port ${PORT}`));