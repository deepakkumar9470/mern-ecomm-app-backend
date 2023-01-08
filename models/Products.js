import mongoose from 'mongoose'


const ProductSchema = new mongoose.Schema({
    name: {type: String, required : true},

    description: {type: String, required : true},

    
    price: {type: Number, required : true},
    
    category: {type: String, required : true},

    image: {type: Object,required : true},

 


}, {minimize: false})



const ProductModel = mongoose.model('product', ProductSchema)

export default ProductModel