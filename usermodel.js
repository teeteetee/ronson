var mongoose = require("mongoose");

var ItemSchema = new mongoose.Schema({
  login: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  gender: {
    type: String,
    index: true
  },
  city: {
    type: String,
    index: true
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  regdate: {
    type: Date,
     default: Date.now, 
    index: true
  },
  pass: {
    type: String,
    index: true
  },
  age: {
    type: Number,
    index:true
  }
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = {
  Item: Item
}