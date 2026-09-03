"use client";

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import type { SelectProps } from "./Select.types";
import { useSelect } from "./useSelect";

export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção...",
  icon,
  className = "",
  triggerClassName = "",
  dropdownClassName = "",
  disabled = false,
  size = "sm",
}: SelectProps) {
  const { isOpen, containerRef, toggle, selectOption } = useSelect(onChange);

  const selectedOption = options.find((opt) => opt.value === value);

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3 py-2 text-sm gap-2",
  }[size];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={`group flex items-center justify-between rounded-xl border border-white/20 bg-black/80 text-white shadow-lg backdrop-blur-md transition-all hover:border-blue-400 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${triggerClassName}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {icon && <span className="shrink-0 text-blue-400">{icon}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate font-medium text-slate-100">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-white ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 z-50 mt-1.5 min-w-[180px] max-h-60 overflow-y-auto rounded-2xl border border-white/15 bg-slate-900/95 p-1.5 text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;

            return (
              <button
                key={opt.value || "default"}
                type="button"
                onClick={() => selectOption(opt.value)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                  isSelected
                    ? "bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <div className="truncate">
                    <span className="block truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="block text-[10px] text-slate-400 font-normal truncate">
                        {opt.description}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-400 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
