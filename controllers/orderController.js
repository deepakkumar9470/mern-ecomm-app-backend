
import Order from '../models/Order.js'
import User from '../models/User.js'



export const placeOrder = async (req,res) =>{
   
    const {userId, cart, address, country} = req.body
    try {
        
      const user = await User.findById(userId)
      const order = await Order.create({owner : user._id, products : cart, address})
      order.count = cart.count
      order.total = cart.total
      await order.save()
      user.cart  = {count: 0, total : 0}
      user.orders.push(order);
      user.markModified('orders');
      await user.save();
      res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}


export const getAllOrders = async (req,res) =>{
    
      const query = req.query.new;     
    try {
        const orders = query ?
          await Order.find().sort({_id:  -1}).limit(4) : 
          await Order.find().sort({_id:  -1})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
    }

}


export const updateOrder = async (req,res) =>{
  
try {
    const updateorders = await Order.findByIdAndUpdate(req.params.id, 
      {
        $set : req.body
      },
      {new : true}
      )

    res.status(200).json(updateorders)
} catch (error) {
    console.log(error)
}

}


