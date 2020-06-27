const Photo = require('../models/Photo');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

let getToken = (token) => {
    let tokenAuthorization = token ? token.split(" ")[1] : ' ';
    let user = User.findOne({token: tokenAuthorization});
    return user
};

module.exports.uploadPhoto = async (req, res) => {
    let user = await getToken(req.header('Authorization'));
    if (user) {
        if (req.file) {
            const photo = new Photo({
                name: req.file.filename,
                url: 'http://localhost:3000/uploads/' + req.file.filename,
                owner_id: user._id
            });

            await photo.save();

            let photoArray = {
                id: photo._id,
                name: photo.name,
                url: photo.url
            };

            return res.status(201).json(photoArray)
        } else {
            return res.status(422).json({photo: "Path `photo` is required."})
        }
    } else {
        return res.status(403).json({message: "You need authorization"})
    }
};

module.exports.viewsPhoto = async (req, res) => {
    let user = await getToken(req.header('Authorization'));
    if (user) {
        let photos = await Photo.find({owner_id: user._id}, {_id: 1, name: 1, url: 1, owner_id: 1});
        return  res.status(200).json(photos)
    } else {
        return res.status(403).json({message: "You need authorization"})
    }
};

module.exports.indexPhoto = async (req, res) => {
    let user = await getToken(req.header('Authorization'));
    if (user) {
        let photo = await Photo.findOne(
            {$and: [{_id: req.url.split("/")[2]}, {owner_id: user._id}]},
            {_id: 1, name: 1, url: 1, owner_id: 1}
        );

        return  res.status(200).json(photo);
    } else {
        return res.status(403).json({message: "You need authorization"})
    }
};

module.exports.deletePhoto = async (req, res) => {
    let user = await getToken(req.header('Authorization'));
    if (user) {
        let photo = await Photo.findOne({$and: [{_id: req.url.split("/")[2]}, {owner_id: user._id}]},);
        if(photo){
            photo.remove({});
            fs.unlink(path.join(__dirname, '../uploads/'+ photo.name), err => {
                if (err) return res.status(403).json({error: "File is not defined"});
            });

            return res.status(204).json({});
        }else{
            return res.status(403);
        }
    } else {
        return res.status(403).json({message: "You need authorization"})
    }
}