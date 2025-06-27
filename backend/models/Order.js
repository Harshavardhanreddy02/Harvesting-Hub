import mongoose from 'mongoose';
import Product from './Product.js';

const orderSchema = new mongoose.Schema({
    userid: { 
        type: String, 
        required: true 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            sellerEmail: { type: String, required: true }, // Ensure seller's email is stored here
            description: { type: String },
            category: { type: String },
            image: { type: String },
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { 
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        phone: String
    },
    status: { 
        type: String, 
        default: "Food Processing" 
    },
    Date: { 
        type: Date, 
        default: Date.now() 
    },
    payment: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// Add post-save hook to update product totalSales when order is completed
orderSchema.post('save', async function() {
    try {
        if (this.status === 'delivered' || this.status === 'completed') {
            // Update the totalSales for each product in the order
            for (const item of this.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { totalSales: item.quantity } },
                    { new: true }
                );
            }
        }
    } catch (error) {
        console.error('Error updating product totalSales:', error);
    }
});

export default mongoose.model('Order', orderSchema);