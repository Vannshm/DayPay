import {
  TrendingUp,
  CalendarDays,
  Target,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import "./ComingSoonPage.css";
import ComingSoonPage  , { type ComingSoonContent } from "../CommingSoon/ComingSoonPage";

const reportsContent: ComingSoonContent = {
  pageName: "Reports",
  eyebrow: "INSIGHTS THAT MOVE YOU FORWARD",
  title: "Make sense of",
  subtitle: "your spending habits.",
  description:
    "Explore your spending over time with clear summaries and comparisons. Spot changes, understand your habits, and make more informed financial decisions.",
  statusLabel: "COMING SOON",
  features: [
    {
      title: "Monthly trends",
      description: "Follow how your expenses change over time.",
      icon: TrendingUp,
    },
    {
      title: "Period comparisons",
      description: "Compare this month with previous months.",
      icon: CalendarDays,
    },
    {
      title: "Spending insights",
      description: "Find your highest-spending periods and categories.",
      icon: Target,
    },
  ],
};

export default function ReportPage(){
  return(
    <ComingSoonPage content={reportsContent}/>
  );
}