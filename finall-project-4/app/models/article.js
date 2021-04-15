const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      
      
    },
    description1: {
      type: String,
      require: true,
      
    },
    description2: {
      type: String,
      require: true,
      
    },
    image: {
      type: String,
      require: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  },
  { timestamps: true }
);

articleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Article', articleSchema);
