const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Event = require("../models/eventSchema");
const User = require("../models/userScehma");
const HttpError = require("../models/httpError");

const getEvents = async (req, res, next) => {
  const uid = req.params.id;
  let userEvents;
  try {
    userEvents = await User.findById(uid).populate("events");
  } catch (err) {
    const error = new HttpError("unable to find task with given user id", 400);
    return next(error);
  }

  res.json({
    userEvents: userEvents.events.map((t) => t.toObject({ getter: true })),
  });
};

const addEvent = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new HttpError("entered event values are invalid", 500);
    return next(error);
  }
  const { state, title, description, image, date, creator } = req.body;
  const newEvent = new Event({
    state,
    title,
    description,
    image,
    date,
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
    console.log(user);
  } catch (err) {
    const error = new HttpError(
      "unable to find user for given creator id",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("user does not exist of given creator id", 404);
    return next(error);
  }

  try {
    await newEvent.save();
    user.events.push(newEvent);
    console.log(user.events);
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "unable to create a new event with creator reference, failed session...try again",
      404
    );
    return next(error);
  }
  res.json({ state, title, id: newEvent.id });
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.id;

  let eventToBeDeleted;
  try {
    eventToBeDeleted = await Event.findById(eventId).populate("creator");
    await eventToBeDeleted.remove();
    eventToBeDeleted.creator.events.pull(eventId);
    await eventToBeDeleted.creator.save();
  } catch (err) {
    const error = new HttpError(
      "unable to delete the event for given event id",
      500
    );
    return next(error);
  }
  res.json({ message: "task removed" });
};

const putEvent = async (req, res, next) => {
  const eventId = req.params.id;

  let updatedEvent;
  if (Object.keys(req.body).length === 2) {
    try {
      updatedEvent = await Event.findByIdAndUpdate(eventId, {
        title: req.body.title,
        description: req.body.description,
      });
    } catch (err) {
      const error = new HttpError(
        "unable to find event and update both values",
        404
      );
      return next(error);
    }
  } else if (Object.keys(req.body).length === 1 && req.body.title) {
    try {
      updatedEvent = await Event.findByIdAndUpdate(eventId, {
        title: req.body.title,
      });
    } catch (err) {
      const error = new HttpError("unable to find event and update title", 404);
      return next(error);
    }
  } else if (Object.keys(req.body).length === 1 && req.body.description) {
    try {
      updatedEvent = await Event.findByIdAndUpdate(eventId, {
        description: req.body.description,
      });
    } catch (err) {
      const error = new HttpError(
        "unable to find event and update description",
        404
      );
      return next(error);
    }
  } else {
    try {
      updatedEvent = await Event.findByIdAndUpdate(eventId, {
        date: req.body.date,
      });
    } catch (err) {
      const error = new HttpError(
        "unable to find event and update description",
        404
      );
      return next(error);
    }
  }
  res.json({ updatedEvent });
};

exports.getEvents = getEvents;
exports.addEvent = addEvent;
exports.deleteEvent = deleteEvent;
exports.putEvent = putEvent;
