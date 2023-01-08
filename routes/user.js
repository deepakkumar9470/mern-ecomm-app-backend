import express from "express";
const router = express.Router()

import {userregister,userlogin, getUser,deleteUser, getUserById, editUser} from '../controllers/userController.js'

import { isAdmin } from '../middleware/auth-middleware.js';

// Register Route
// @ /api/user/register

router.post('/register', userregister)


// Login Route
// @ /api/user/login
router.post('/login', userlogin)



// Get all user
// @ /api/user
router.get('/',isAdmin, getUser)


// Get single user
// @ /api/user/find/123
router.get('/find/:id',isAdmin, getUserById)


// update  user
// @ /api/user/123
router.get('/:id',isAdmin, editUser)

// Get all user
// @ /api/user/124
router.delete('/',isAdmin, deleteUser)




export default router