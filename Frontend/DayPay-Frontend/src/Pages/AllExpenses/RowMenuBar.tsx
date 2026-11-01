import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import type { ExpenseRecord } from "./AllExpensesPage";

interface RowMenuBarProps {
  expense: ExpenseRecord;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  handleEdit: (expense: ExpenseRecord) => void;
  handleDeleteExpense: (expenseId: string) => void;
}

export const RowMenuBar = ({ expense, openMenuId, setOpenMenuId, handleEdit, handleDeleteExpense }:RowMenuBarProps) => {
  return (
    <div className="all-row-menu-wrap">
      <button
        className="all-row-menu-button"
        type="button"
        aria-label={`Actions for ${expense.title}`}
        aria-expanded={openMenuId === expense._id}
        onClick={() =>
          setOpenMenuId((current) =>
            current === expense._id ? null : expense._id,
          )
        }
      >
        <EllipsisVertical size={20} />
      </button>

      {openMenuId === expense._id && (
        <div className="all-row-menu">
          <button type="button" onClick={() => handleEdit(expense)}>
            <Pencil size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteExpense(expense._id)}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
