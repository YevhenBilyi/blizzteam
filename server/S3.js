require('dotenv').config({
    path: '../.dev.env'
})

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY,
    region: process.env.AWS_REGION
})

const S3 = new AWS.S3()

function uploadPhoto(req, res) {
    console.log('photo in back', req.body.filename, process.env.AWS_ACCESSKEY)
    let photo = req.body,
        buf = new Buffer(photo.file.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Body: buf,
            Key: photo.filename,
            ContentType: photo.filetype,
            ACL: 'public-read'
        }

    console.log(buf)

    S3.upload(params, (err, data) => {
        if (err){
            res.status(500).send(err)
        }else{
           const db=req.app.get('db')
           //uploading picture to my s3 and saving link on my database
           db.upload_profile_picture([data.Location,req.user.id])
           .then(()=>res.status(200).send(data))
        }


    })
}

module.exports = function (app) {
    app.post('/api/photoUpload', uploadPhoto)
}