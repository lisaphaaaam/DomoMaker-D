/* the job application information */
// TODO: needs to change domo details to job, ensure it can be exported correctly

const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  pay: {
    type: Number,
    min: 0,
    required: true,
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "internship", "volunteer"],
  },
  applied: {
    type: String,
    enum: ["yes", "no"],
  },
  status: {
    type: String,
    enum: ["waiting", "rejected", "interview", "offer", "accepted"],
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  company: doc.company,
  pay: doc.pay,
  type: doc.type,
  applied: doc.applied,
  status: doc.status,
});


const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
