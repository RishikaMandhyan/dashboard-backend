
const mongoose= require("mongoose");

const OrderSchema= new mongoose.Schema({
    buyer: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    orderNo:{
        type: Number,
        default: 81209
    },
    items:[{
        itemId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true,
        }
            
        }],
    transactionFee:{
        type: Number,
        default: 22
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    
})


module.exports = mongoose.model("Order", OrderSchema);