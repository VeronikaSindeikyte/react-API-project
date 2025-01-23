import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const PurchasedItemSchema = new Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: String,
        required: true
    }
});


const UserSchema = new Schema({
    userId: {
        type: Number,
        required: false,
        unique: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    purchasedItems: [PurchasedItemSchema]
});

export default mongoose.model('User', UserSchema);
