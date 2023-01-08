import jwt from "jsonwebtoken";




export const auth = async (req,res,next) =>{
              
        
        const token = req.header('x-auth-token')
        if(!token){
            return res.status(401).json('Not authenticated, not valid token')

        }
        
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user
            next()
        } catch (error) {
            res.status(400).json('Token Invalid!')
        }

}





export const isAdmin = ( req, res, next ) => {
  auth(req,res, ()=>{
    
    if(req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error('Not authorized as an Admin')
    }
  })

}
export const isUser = ( req, res, next ) => {
    auth(req,res, ()=>{
      
      if(req.user._id === req.params.id || req.user.isAdmin){
          next()
      }else{
          res.status(401)
          throw new Error('Access denied, not authorized')
      }
    })
  
  }