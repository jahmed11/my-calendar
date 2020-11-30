const express = require("express");
const { check } = require("express-validator");
const eventController = require("../controllers/eventController");
const router = express.Router();

router.get("/getEvents/:id", eventController.getEvents);

router.post(
  "/createEvent",
  [
    check("state").not().isEmpty(),
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("image").not().isEmpty(),
    check("date").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  eventController.addEvent
);

router.delete("/deleteEvent/:id", eventController.deleteEvent);

router.put("/changeEvent/:id", eventController.putEvent);

module.exports = router;
