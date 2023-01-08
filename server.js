import dotenv from 'dotenv'
dotenv.config()
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET)
import express from 'express'
import cors from 'cors'
import connectDB  from './config/db.js'
const PORT = process.env.PORT || 8000
import path from 'path'
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import orderRoute from './routes/order.js'
import stripeRoute from './routes/stripe.js'

const app = express()


// Serving static files

// if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
//     app.use(express.static("react-ecomm/build"));
//     app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname + "/react-ecomm/build/index.html"));
//     });
// }

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:  true}))



app.use('/api/user', userRoute)

app.use('/api/product', productRoute)


app.use('/api/orders', orderRoute)

app.use('/api/stripe', stripeRoute)


connectDB()


app.get('/', (req,res)=>{
    res.send('Success..')
})

app.listen(PORT, ()=>{
    console.log(`Server started at port http://localhost:${PORT}`)
})


