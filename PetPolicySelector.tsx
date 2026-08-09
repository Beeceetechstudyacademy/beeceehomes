import { cn } from "@/lib/utils";
import type { PetPolicy } from "../types";

const OPTIONS: { value: PetPolicy | "All"; label: string; icon: string }[] = [
  { value: "All", label: "All", icon: "" },
  { value: "Pets Allowed", label: "Pets Allowed", icon: "🐾" },
  { value: "No Pets Allowed", label: "No Pets", icon: "🚫" },
  { value: "On Request", label: "On Request", icon: "🐾" },
];

export function PetPolicySelector({
  value,
  onChange,
  includeAll = false,
  size = "md",
}: {
  value: PetPolicy | "All";
  onChange: (value: PetPolicy | "All") => void;
  includeAll?: boolean;
  size?: "sm" | "md";
}) {
  const visibleOptions = includeAll
    ? OPTIONS
    : OPTIONS.filter((o) => o.value !== "All");

  return (
    <div className="flex flex-wrap gap-2">
      {visibleOptions.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border-2 font-medium transition-all duration-200 active:scale-95",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              isActive
                ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            )}
          >
            {option.icon && <span className="text-sm">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}