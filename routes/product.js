import express from "express";
const router = express.Router()

import { addProduct,getProducts,
        getProductById,
        editProduct,
        deleteProduct, 
        getProductCategory, 
        addToCart, 
        removeProductFromCart,
        increaseCartCount,
        decreaseCartCount} from '../controllers/productsController.js'
        
import { isAdmin } from "../middleware/auth-middleware.js";



// @ /api/product
router.post('/',isAdmin, addProduct)

// @ /api/product
router.get('/', getProducts)

// @ /api/product/123
router.get('/:id', getProductById)


// @ /api/product/category/category
router.get('/category/:category', getProductCategory)

// @ /api/product/123/
router.put('/:id', editProduct)

// @ /api/product/123
router.delete('/:id', deleteProduct)


// remove-cart
// increase-product-count
// decrease-product-count
// @ /api/product
router.post('/add-to-cart', addToCart)
router.delete('/remove-cart', removeProductFromCart)
router.post('/increase-product-count', increaseCartCount)
router.post('/decrease-product-count', decreaseCartCount)


export default router