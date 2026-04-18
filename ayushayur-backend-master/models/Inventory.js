import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema(
  {
    item_name: {
      type: String,
      required: [true, 'Please add item name'],
    },
    category: {
      type: String,
      required: [true, 'Please add category'],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please add unit'],
    },
    min_stock_level: {
      type: Number,
      required: true,
      default: 10,
    },
    cost_per_unit: {
      type: Number,
    },
    supplier: {
      type: String,
    },
    last_restocked_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
