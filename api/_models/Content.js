import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'home', 
        'collection', 
        'about', 
        'contact', 
        'faq', 
        'testimonials', 
        'privacy', 
        'terms', 
        'settings', 
        'banners'
      ]
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {}
    }
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);

export default Content;
