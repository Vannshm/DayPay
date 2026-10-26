import { expenseModel } from "../Models/addExpense.model.js";
import type { RequestHandler } from "express";

export const addExpense: RequestHandler = async (req, res) => {
  const { title, ammount, category, date, note, paymentMethod } = req.body;
  try {
    const expense = await expenseModel.create({
      title,
      ammount,
      category,
      date,
      note,
      paymentMethod,
      userId: req.user!.id,
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

export const getAllExpense: RequestHandler = async (req, res) => {
  try {
    const expenses = await expenseModel.find({
      userId: req.user!.id,
    });

    if (!expenses) {
      return res.status(401).json({
        message: "Something Wend Wrong!",
      });
    }

    return res.status(200).json({
      message: "All expenses found sucessfully",
      expenses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpense: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await expenseModel.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "expense not found!",
      });
    }

    return res.status(200).json({
      message: "Expense found sucessfully",
      expense,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense: RequestHandler = async(req,res)=>{
  const { id } = req.params
  try{

     const expense = await expenseModel.findOneAndUpdate(
      {
        _id:id,
        userId:req.user!.id
      },
      req.body,
      {
        returnDocument:'after',
        runValidators:true
      }
     )

     if(!expense){
      return res.status(404).json({
        message:'expense not found!'
      })
     }

     return res.status(200).json({
      message:'expense updated sucessfully',
      expense
     })

  }catch(err){
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
