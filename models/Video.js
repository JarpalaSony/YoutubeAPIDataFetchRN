const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    videoId:{type:String,required:true,unique:true},

});
module.exports = mongoose.model("Video",videoSchema,"YoutubeVideoData");