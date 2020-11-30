const mongoose = require("mongoose");

const timestamps = {
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const { Schema } = mongoose;
const eventSchema = new Schema(
  {
    state: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps }
);

module.exports = mongoose.model("Event", eventSchema);
