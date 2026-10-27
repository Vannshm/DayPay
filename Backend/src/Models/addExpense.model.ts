import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Expense ammount is required"],
      min: [0.01, "Ammount must be greater than zero"],
    },

    category: {
      type: String,
      required: [true, "Expense category is required"],
      trim: true,
      enum: [
        "food",
        "transport",
        "shopping",
        "bills",
        "health",
        "entertainment",
        "education",
        "other",
      ],
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
      maxLength: [500, "Note canot exceed 500 characters"],
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank_transfer", "other"],
      default: "other",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const expenseModel = mongoose.model("expense", expenseSchema);
