import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from "../models/User.js";




export const userregister = async (req,res) =>{

    

    try {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(req.body.password, salt)  
      const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hash,
      });
      const userSave = await user.save();
      const token = await jwt.sign(
        {_id:  userSave._id, name : userSave.name, email : userSave.email, isAdmin:  userSave.isAdmin},
        process.env.JWT_SECRET
        )
      res.status(201).send(token);
    } catch (error) {
      console.log(error)
    }
    }


export const userlogin = async (req,res) =>{
  
    try {
      const user = await User.findOne({email : req.body.email});
      if(!user) return res.status(400).json('User alredy exist')

      const isMatch = await bcrypt.compare(req.body.password, user.password)
      if(!isMatch) return res.status(400).json('Invalid credentials')
      const token = await jwt.sign(
        {_id:  user._id, name : user.name, email : user.email,isAdmin:  user.isAdmin},
        process.env.JWT_SECRET
        )
      res.status(200).send(token)
    } catch (e) {
      res.status(400).send(e.message)
    }

    }

 
export const getUser =  async (req,res) =>{
    try {
        const users = await User.find().sort({_id: -1});
        res.status(200).send(users);
        
    } catch (error) {
      res.status(500).send(error);
    }
}    

 
export const getUserById =  async (req,res) =>{
  try {
      const user = await User.findById(req.params.id)
      res.status(200).send({
        _id:  user._id,
        name:  user.name,
        email:  user.email,
        isAdmin:  user.isAdmin,
      });
      
  } catch (error) {
    res.status(500).send(error);
  }
}   

export const deleteUser = async (req,res) =>{
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).send(deleteUser);
  } catch (error) {
    res.status(500).send(error);
  }
}
    

export const editUser = async (req,res) =>{
     try {
      const user = await User.findById(req.params.id);

      if(!(user.email === req.body.email)){
          const emailInUse = await User.findOne({email : req.body.email});
          if(emailInUse) {
            res.status(200).send('Email already taken');
          }
      }

      if(req.user.password && user) {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt) 
        user.password = hashPassword 
      }
      
      const updateUser = await User.findByIdAndUpdate(req.params.id,
        {
          name:  req.body.name,
          email:  req.body.email,
          isAdmin:  req.body.isAdmin,
          password: user.password
        },
        {new : true}
        )
        res.status(200).send({
          _id:  updateUser._id,
          name:  updateUser.name,
          email:  updateUser.email,
          isAdmin:  updateUser.isAdmin,
        });

     } catch (error) {
      res.status(500).send(error);

     }
}

// Get user's orders 
export const getUsersOrder =  async (req,res) =>{
  const {id} = req.params
  try {
      const users = await User.findById(id).populate('orders');
      res.json(users.orders);
      
  } catch (error) {
    console.log(error)
  }
}    
  

