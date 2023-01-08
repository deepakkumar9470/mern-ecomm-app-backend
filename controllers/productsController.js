import dotenv from 'dotenv'
dotenv.config()
import cloudinary from '../utils/cloud.js'
import Product from '../models/Products.js'
import User from '../models/User.js'


export const addProduct = async  (req,res) =>{

  const {name, description ,price, category,image} = req.body

    try {
        if(image) {
          const uploadRes = await cloudinary.uploader.upload(image, {
            upload_preset : 'mern-ecom-app'
          })
         
          if(uploadRes) {
            const newProducts = new Product({
              name,
              description,
              price,
              category,
              image:  uploadRes
            })
            const products = await newProducts.save()
            res.status(201).send(products)
           }
        }
         
    
    } catch (error) {
        console.log(error)
    }

}

export const getProducts = async  (req,res) =>{
   try {
       const products = await Product.find({}).sort({"name" : -1})
       res.status(200).json(products)
   } catch (error) {
    console.log(error)
   }
}


export const editProduct = async (req,res) =>{

    if(req.body.productImage) {
      try {
        const destroyImage = await cloudinary.uploader.destroy(
          req.body.product.image.public_id
        );
  
           if(destroyImage) {
            const uploadRes = await cloudinary.uploader.upload(image, {
              upload_preset : 'mern-ecom-app'
            });
  
            if(uploadRes) {
              const updateProduct = await Product.findById(req.params.id, 
                { $set : {...req.body.product, image: uploadRes }},
                {new: true}
              );
              res.status(200).json(updateProduct)
            }
            
           }
      } catch (error) {
        console.log(error)
      }

    }else{
      try {
        const updateproduct = await Product.findByIdAndUpdate(req.params.id, 
          {$set : req.body.product}, 
          {new : true})
    
        res.status(200).json(updateproduct)
  
     } catch (error) {
      console.log(error)
     }
    }
   
}


export const deleteProduct = async (req,res) =>{
 
  try {
    const product = await Product.findById(req.params.id);
  
    if(!product) return res.status(401).json("You don't have permission");

    if(product.image.public_id){
           const destroyRes = await cloudinary.uploader.destroy(product.image.public_id);
        if(destroyRes) {
          const  deleProduct = await Product.findByIdAndDelete(req.params.id)
          res.status(200).send(deleProduct);
        }
    }else{
      res.status(400).send('Action terminated, Failed to destroy image');
    }
  
  
  } catch (e) {
    res.status(400).send(e.message);
  }
}


export const getProductById = async (req,res) =>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id)
        const similar = await Product.find({category: product.category}).limit(5)
        res.status(200).json(product, similar)
    } catch (error) {
     console.log(error)
    }
}


export const getProductCategory = async (req,res) =>{
    const {category} = req.params
    try {
        let product;
        if(category === "all") {
          product = await Product.find().sort([['date', -1]])
        }else{
        product = await Product.find({category})
        }
     
        res.status(200).json( product)
    } catch (error) {
     console.log(error)
    }
}


export const addToCart = async (req,res) =>{
    const {userId,productId,price} = req.body
  
    try {
        const user = await User.findById(userId)
        const userCart = user.cart;
        if(user.cart[productId]){
            userCart[productId] += 1
        }else{
            userCart[productId] = 1
        }

        userCart.count += 1
        userCart.total = Number(userCart.total) + Number(price)
        user.cart = userCart
        user.markModified('cart')
        await user.save()
        res.status(200).json(user)
    } catch (error) {
     console.log(error)
    }
}



export const increaseCartCount = async (req,res) =>{
    const {userId, productId, price} = req.body;
    try {
      const user = await User.findById(userId);
      const userCart = user.cart;
      userCart.total += Number(price);
      userCart.count += 1;
      userCart[productId] += 1;
      user.cart = userCart;
      user.markModified('cart');
      await user.save();
      res.status(200).json(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
}


export const decreaseCartCount = async (req,res) =>{
    const {userId, productId, price} = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(price);
    userCart.count -= 1;
    userCart[productId] -= 1;
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
}


export const removeProductFromCart = async (req,res) =>{
    const {userId,productId,price} = req.body
  
    try {
        const user = await User.findById(userId)
        const userCart = user.cart;
       
        userCart.total -= Number(userCart[productId]) * Number(price)
        userCart.count -= userCart[productId]
        delete userCart[productId]
        user.cart = userCart
        user.markModified('cart')
        await user.save()
        res.status(200).json(user)
    } catch (error) {
     console.log(error)
    }
}