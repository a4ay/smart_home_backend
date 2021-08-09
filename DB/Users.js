const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const Users = new Schema({
  userId: String,
  switch : [{
    pin : Number,
    onUse : Boolean,
    switchName : String,
    state : Boolean
  }]
});

module.exports = mongoose.model('Users',Users)