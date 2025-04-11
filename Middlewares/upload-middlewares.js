const multer = require('multer');
const path = require('path')

//set our multer storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads/")
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        //file.fieldname = "image"
        //Date.now() = 1712152123233
        //file.originalname = "cat.png"
        // => image-1712152123233.png
    }
})

//file filter function 
const checkFileFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    } else {
        cb(new Error('Not an image! Please upload only image'))
    }
}

//middlewares
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5*1024*1024 // 5mb
    }
})