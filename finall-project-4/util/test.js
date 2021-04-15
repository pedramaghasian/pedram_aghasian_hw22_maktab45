const fs = require('fs')

fs.readFile('../public/uploade-image/profile/text.txt','utf8',(err,res)=>{
  if(err){
    return console.log(err)
  }
  console.log(res)
})