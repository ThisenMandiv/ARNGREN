import mongoose from "mongoose";
const Schema = mongoose.Schema;

const inventoryMovementSchema = new Schema({
productId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Product',
required: true,
index: true
},
changeType: {
type: String,
required: true,
enum: ['initial', 'sale', 'restock', 'manual_update', 'deletion'],
trim: true
},
quantityChange: {
type: Number,
required: true
},
quantityBefore: {
type: Number,
required: true
},
quantityAfter: {
type: Number,
required: true
},
timestamp: {
type: Date,
default: Date.now
},
notes: {
type: String,
trim: true,
maxlength: [200, 'Notes cannot exceed 200 characters']
}
});

export default mongoose.model("InventoryMovement", inventoryMovementSchema);