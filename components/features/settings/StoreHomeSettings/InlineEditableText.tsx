"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

interface InlineEditableTextProps {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  rows?: number;
  label?: string;
}

export function InlineEditableText({
  value,
  onChange,
  placeholder = "Clique para editar...",
  className = "",
  multiline = false,
  as: Component = "span",
  rows = 2,
  label,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const safeValue = value ?? "";

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  if (isEditing) {
    if (multiline) {
      return (
        <span className="relative inline-block w-full">
          {label && (
            <span className="mb-1 block text-[11px] font-medium text-blue-400">
              {label}
            </span>
          )}
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={safeValue}
            rows={rows}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsEditing(false);
            }}
            className={`w-full rounded-xl border-2 border-blue-500 bg-black/80 p-2 text-inherit text-white shadow-xl outline-none ring-4 ring-blue-500/20 backdrop-blur-md transition ${className}`}
          />
        </span>
      );
    }

    return (
      <span className="relative inline-block w-full">
        {label && (
          <span className="mb-1 block text-[11px] font-medium text-blue-400">
            {label}
          </span>
        )}
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={safeValue}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") setIsEditing(false);
          }}
          className={`w-full rounded-xl border-2 border-blue-500 bg-black/80 px-3 py-1 text-inherit text-white shadow-xl outline-none ring-4 ring-blue-500/20 backdrop-blur-md transition ${className}`}
        />
      </span>
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      className={`group relative inline-flex cursor-pointer items-center rounded-lg border border-transparent transition hover:border-dashed hover:border-blue-400/80 hover:bg-blue-500/10 hover:ring-2 hover:ring-blue-400/20 ${className}`}
    >
      <span className={!safeValue ? "italic opacity-60" : ""}>
        {safeValue || placeholder}
      </span>
      <span className="pointer-events-none ml-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-600/90 text-white opacity-0 shadow-sm transition-all group-hover:scale-105 group-hover:opacity-100">
        <Pencil className="h-3 w-3" />
      </span>
    </Component>
  );
}
