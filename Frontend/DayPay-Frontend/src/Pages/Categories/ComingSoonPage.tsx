import {
  Tags,
  PieChart,
  CalendarDays,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import ComingSoonPage, { type ComingSoonContent } from "../CommingSoon/ComingSoonPage";
import "./ComingSoonPage.css";

const categoriesContent: ComingSoonContent = {
  pageName: "Categories",
  eyebrow: "SPENDING, ORGANIZED",
  title: "Your expenses,",
  subtitle: "sorted into clear categories.",
  description:
    "See how much you spend on food, transport, shopping, bills, and more. Understand which parts of your lifestyle take the biggest share of your budget.",
  statusLabel: "COMING SOON",
  features: [
    {
      title: "Category breakdown",
      description: "See the total amount spent in every category.",
      icon: Tags,
    },
    {
      title: "Spending percentages",
      description: "Understand each category's share of your spending.",
      icon: PieChart,
    },
    {
      title: "Monthly category view",
      description: "Compare category spending month by month.",
      icon: CalendarDays,
    },
  ],
};


export default function CategoryPage(){
  return(
    <ComingSoonPage content={categoriesContent}/>
  );
}