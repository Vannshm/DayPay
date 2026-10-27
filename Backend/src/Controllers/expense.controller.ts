import { expenseModel } from "../Models/addExpense.model.js";
import type { RequestHandler } from "express";

export const addExpense: RequestHandler = async (req, res) => {
  const { title, amount, category, date, note, paymentMethod } = req.body;
  try {
    const expense = await expenseModel.create({
      title,
      amount,
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

export const updateExpense: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await expenseModel.findOneAndUpdate(
      {
        _id: id,
        userId: req.user!.id,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!expense) {
      return res.status(404).json({
        message: "expense not found!",
      });
    }

    return res.status(200).json({
      message: "expense updated sucessfully",
      expense,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpense: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await expenseModel.findOneAndDelete({
      _id: id,
      userId: req.user!.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "something went wrong!",
      });
    }

    return res.status(200).json({
      message: "expense deleted sucessfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//*************************************************************** */

const getQuerryString = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }
  return value.trim();
};

const parseDateOnly = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
};

export const getFilterExpenses: RequestHandler = async (req, res) => {
  try {
    const category = getQuerryString(req.query.category);
    const maxAmountRaw = getQuerryString(req.query.maxAmount);
    const minAmountRaw = getQuerryString(req.query.minAmount);
    const startDateRaw = getQuerryString(req.query.startDate);
    const endDateRaw = getQuerryString(req.query.endDate);

    const minAmount =
      minAmountRaw === undefined ? undefined : Number(minAmountRaw);
    const maxAmount =
      maxAmountRaw === undefined ? undefined : Number(maxAmountRaw);

    if (
      maxAmount !== undefined &&
      (!Number.isFinite(maxAmount) || maxAmount < 0)
    ) {
      return res.status(400).json({
        message: "maxAmount must be a valid non-negative number.",
      });
    }

    if (
      minAmount !== undefined &&
      (!Number.isFinite(minAmount) || minAmount < 0)
    ) {
      return res.status(400).json({
        message: "minAmount must be a valid non-negative number.",
      });
    }

    if (
      minAmount !== undefined &&
      maxAmount !== undefined &&
      minAmount > maxAmount
    ) {
      return res.status(404).json({
        message: "minAmount cannot be greater than maxAmount.",
      });
    }

    if (category !== undefined && category.length > 50) {
      return res.status(404).json({
        message: "Category cannot exceed 50 characters.",
      });
    }

    const startDate =
      startDateRaw === undefined ? null : parseDateOnly(startDateRaw);

    const endDate = endDateRaw === undefined ? null : parseDateOnly(endDateRaw);

    if (
      (startDateRaw !== undefined && !startDate) ||
      (endDateRaw !== undefined && !endDate)
    ) {
      return res.status(400).json({
        message: "Dates must be valid and use YYYY-MM-DD format.",
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        message: "startDate cannot be after endDate.",
      });
    }

    const pageRaw = getQuerryString(req.query.page) ?? "1";
    const limitRaw = getQuerryString(req.query.limit) ?? "10";

    const page = Number(pageRaw);
    const requestedLimit = Number(limitRaw);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(404).json({
        message: "page must be a positive integer.",
      });
    }

    if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
      return res.status(404).json({
        message: "limit must be a positive integer.",
      });
    }

    const limit = Math.min(requestedLimit, 100);
    const skip = (page - 1) * limit;

    const sortBy = getQuerryString(req.query.sortBy) ?? "date";
    const order = getQuerryString(req.query.order) ?? "desc";

    const allowedSortFilter = ["date", "createdAt", "amount", "title"];

    if (!allowedSortFilter.includes(sortBy)) {
      return res.status(404).json({
        message: "Invalid sortBy field.",
        allowedFields: allowedSortFilter,
      });
    }

    if (order !== "asc" && order !== "desc") {
      return res.status(404).json({
        message: "order must be either asc or desc.",
      });
    }

    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;

    const filter: Record<string, any> = {
      userId: req.user!.id,
    };

    if (category !== undefined) {
      filter.category = category;
    }

    if (maxAmount !== undefined || minAmount !== undefined) {
      filter.amount = {};

      if (minAmount !== undefined) {
        filter.amount.$gte = minAmount;
      }

      if (maxAmount !== undefined) {
        filter.amount.$lte = maxAmount;
      }
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = startDate;
      }

      if (endDate) {
        // Include the entire end date by stopping before the next day.
        const endExclusive = new Date(endDate);
        endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

        filter.date.$lt = endExclusive;
      }
    }

    const [expenses , totalExpenses] = await Promise.all([
      expenseModel
      .find(filter)
      .sort({[sortBy]:sortOrder})
      .skip(skip)
      .limit(limit)
      .lean(),

      expenseModel.countDocuments(filter)
    ])

    const totalPages = Math.ceil(totalExpenses/limit)

    return res.status(200).json({
      message:'expenses filtered sucessfully',
      expenses,
      pagination:{
        totalExpenses,
        totalPages
      }
    })

  } catch (err) {
    console.error("Get filtered expenses error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
