import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function SortIcon({ currentSort, field }) {
  if (!currentSort) {
    return <ArrowUpDown className="ml-2 h-3 w-3 text-slate-500" />;
  }

  const tokens = currentSort.split(",");
  let dir = null;

  for (let i = 0; i < tokens.length; i += 2) {
    if (tokens[i] === field) {
      dir = tokens[i + 1] || "desc";
      break;
    }
  }

  if (!dir) {
    return <ArrowUpDown className="ml-2 h-3 w-3 text-slate-500" />;
  }

  return dir === "asc" ? (
    <ArrowUp className="ml-2 h-3 w-3 text-black" />
  ) : (
    <ArrowDown className="ml-2 h-3 w-3 text-black" />
  );
}
