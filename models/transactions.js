const mongoose= require('mongoose');

const TransactionSchema= new mongoose.Schema({

    amount:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    transactionType:{
        type: String,
        enum: ['credit', 'debit'],
        required: true,
    },
    transactionNo:{
        type: Number,
        default: 2345
    },

    })


    module.exports= mongoose.model("Transaction", TransactionSchema);