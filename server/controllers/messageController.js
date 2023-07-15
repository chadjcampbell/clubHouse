const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/messageModel");

const createMessage = [
  // validate request
  body("message").trim().notEmpty().withMessage("Please enter message"),
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    // extract the validation errors from a request
    const errors = validationResult(req);
    // there are errors
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    // create message
    const post = await Message.create({
      user: req.user.id,
      message,
    });
    res.status(201).json(post);
  }),
];

// get all messages
const getMessages = asyncHandler(async (req, res) => {
  const products = await Message.find().sort("-createdAt");
  res.status(200).json(products);
});

// delete message
const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }
    if (req.user.isAdmin !== true) {
      res.status(401);
      throw new Error("User not authorized");
    }

    // remove from mongodb
    await message.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(400);
    throw new Error("Error, product deletion failed");
  }
});

// update message

const updateMessage = [
  // validate request
  body("message").trim().notEmpty().withMessage("Please enter message"),
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    const { id } = req.params;
    // extract the validation errors from a request
    const errors = validationResult(req);
    // there are errors
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }
    let post;
    try {
      post = await Message.findById(id);
      if (!post) {
        res.status(404);
        throw new Error("Message not found");
      }
      if (post.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
      }
    } catch (error) {
      res.status(404);
      throw new Error("Message not found");
    }

    // update message
    const updatedMessage = await Message.findByIdAndUpdate(
      {
        message,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedMessage);
  }),
];

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
  updateMessage,
};
