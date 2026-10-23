import { expenseModel } from "../Models/addExpense.model.js";
import type { RequestHandler } from "express";

export const addExpense: RequestHandler = async (req, res) => {
  const { title, ammount, category, date, note, paymentMethod } = req.body;
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const expense = await expenseModel.create({
      title,
      ammount,
      category,
      date,
      note,
      paymentMethod,
      userId:req.user.id
    });

    return res.status(200).json({
      message: "Expense added sucessfully",
      expense,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
