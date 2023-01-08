import mongoose from 'mongoose'

const OrderSchema = mongoose.Schema({

  userId: {type: String, required: true},
  customerId: {type: String},
  paymentIntentId: {type: String},
  products :[],

  subtotal: {
    type: Number,required: true
  },
  total: {
    type: Number,required: true  
  },
  shipping: {
    type: Object,required: true
  },
  delivery_status: {
    type: String,
    default:  'processing'
  },
  payment_status: {
    type: String,required: true
  }
}, {timestamps: true});

const Order = mongoose.model('Order', OrderSchema);

export default Order