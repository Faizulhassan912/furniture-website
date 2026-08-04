import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ['Standard', 'Custom'],
      required: true,
    },
    productName: {
      type: String,
    },
    customDesc: {
      type: String,
    },
    image: {
      type: String, // Ref image for custom orders
    },
    amount: {
      type: Number,
      required: true,
    },
    advance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate order number if not exists
orderSchema.pre('validate', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${1000 + count + 1}`;
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
