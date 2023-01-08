import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {
        type: String,
        required: [true, 'is required'],
        unique: true,
        index: true,
        validate: {
        validator: function(str){
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
      },
      message: props => `${props.value} is not a valid email`
    }
    },
    password: {type: String, required: true, trim: true},
    isAdmin : {type: Boolean, default : false},

}, {timestamps: true})


const User = mongoose.model('user', UserSchema)

export default User