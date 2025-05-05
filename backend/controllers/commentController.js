var CommentModel = require('../models/commentModel.js');
const mongoose = require("mongoose");

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    /**
     * commentController.list()
     */
    list: function (req, res) {
        CommentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }

            return res.json(comments);
        });
    },

    /**
     * commentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            return res.json(comment);
        });
    },

    /**
     * commentController.create()
     */
    create: function (req, res) {
        var comment = new CommentModel({
			title : req.body.title,
			content : req.body.content,
            user : req.body.user,
            uploaded : new Date(),
        });

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                });
            }

            return res.status(201).json(comment);
        });
    },

    /**
     * commentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            comment.title = req.body.title ? req.body.title : comment.title;
			comment.content = req.body.content ? req.body.content : comment.content;
			
            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    });
                }

                return res.json(comment);
            });
        });
    },

    /**
     * commentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommentModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the comment.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
