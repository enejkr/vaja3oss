const CommentController = require('./commentController'); // Uvozi commentController

var PhotoModel = require('../models/photoModel.js');
var CommentModel = require('../models/commentModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
            .populate('postedBy')
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.', error: err
                    });
                }
                var data = [];
                data.photos = photos;
                //return res.render('photo/list', data);
                return res.json(photos);
            });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.', error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
            name: req.body.name,
            description: req.body.description,
            path: "/images/" + req.file.filename,
            postedBy: req.session.userId,
            views: 0,
            likes: [],
            dislikes: [],
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo', error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },
    addComment: function (req, res) {
        console.log('Prejeto telo:', req.body); // Tukaj boš zdaj dobil vrednosti iz FormData

        const comment = new CommentModel({
            title: req.body.title,
            content: req.body.content,
            belongsTo: req.session.userId,
        });
        const id = req.params.id;
        comment.save((err) => {
            if (err) return res.status(500).json({ error: 'Napaka pri shranjevanju komentarja' });

            PhotoModel.findByIdAndUpdate(
                req.params.id,
                { $push: { comments: comment } },
                { new: true },
                (err, photo) => {
                    if (err || !photo) return res.status(500).json({ error: 'Slika ni najdena' });
                    return res.status(201).json(comment);
                }
            );
        });
    },


    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo', error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
            photo.path = req.body.path ? req.body.path : photo.path;
            photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
            photo.views = req.body.views ? req.body.views : photo.views;
            photo.likes = req.body.likes ? req.body.likes : photo.likes;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.', error: err
                    });
                }

                return res.json(photo);
            });
        });
    },


    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.', error: err
                });
            }

            return res.status(204).json();
        });
    },


    like: function (req, res) {
        const photoId = req.params.id;
        const userId = req.session.userId;  // Predpostavljamo, da imamo uporabnikovo ID v req.user
        console.log("neakjhkohwjsdklhjsalkhjd lshjf olhjsdf");
        PhotoModel.findById(photoId, (err, photo) => {
            // Če je prišlo do napake pri iskanju slike
            if (err) {
                return res.status(500).json({message: 'Server error'});
            }

            // Če slika ne obstaja
            if (!photo) {
                return res.status(404).json({message: 'Photo not found'});
            }

            // Preverimo, če je uporabnik že likal
            if (photo.likes.includes(userId)) {
                return res.status(400).json({message: 'You have already liked this photo'});
            }

            // Preverimo, če je uporabnik prej dal dislike, ga odstranimo in dodamo like
            if (photo.dislikes.includes(userId)) {
                photo.dislikes.pull(userId);  // Odstrani uporabnika iz dislikes
            }

            // Dodamo uporabnika v likes
            photo.likes.push(userId);

            // Shranimo posodobljeno sliko
            photo.save((err, updatedPhoto) => {
                if (err) {
                    return res.status(500).json({message: 'Failed to save photo'});
                }
                res.status(200).json({message: 'Like added', photo: updatedPhoto});
            });
        });
    },

    // Funkcija za Dislike
    dislike: function (req, res) {
        const photoId = req.params.id;
        const userId = req.session.userId;  // Predpostavljamo, da imamo uporabnikovo ID v req.user

        PhotoModel.findById(photoId, (err, photo) => {
            // Če je prišlo do napake pri iskanju slike
            if (err) {
                return res.status(500).json({message: 'Server error'});
            }

            // Če slika ne obstaja
            if (!photo) {
                return res.status(404).json({message: 'Photo not found'});
            }

            // Preverimo, če je uporabnik že dal dislike
            if (photo.dislikes.includes(userId)) {
                return res.status(400).json({message: 'You have already disliked this photo'});
            }

            // Preverimo, če je uporabnik prej dal like, ga odstranimo in dodamo dislike
            if (photo.likes.includes(userId)) {
                photo.likes.pull(userId);  // Odstrani uporabnika iz likes
            }

            // Dodamo uporabnika v dislikes
            photo.dislikes.push(userId);

            // Shranimo posodobljeno sliko
            photo.save((err, updatedPhoto) => {
                if (err) {
                    return res.status(500).json({message: 'Failed to save photo'});
                }
                res.status(200).json({message: 'Dislike added', photo: updatedPhoto});
            });
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    }

};
