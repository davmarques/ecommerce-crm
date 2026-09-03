/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import type { MediaUploadFieldProps } from "./MediaUploadField.types";

export function MediaUploadField({
  label,
  accept,
  kind,
  value,
  position,
  isIcon = false,
  onFileChange,
  onPositionChange,
  isUploading = false,
}: MediaUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);

  const clamp = (val: number) => Math.min(100, Math.max(0, val));

  const parsePosition = (val: string | undefined) => {
    const match = val?.match(/^(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
    if (!match) return { x: 50, y: 50 };
    return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) };
  };

  const formatPosition = (x: number, y: number) =>
    `${clamp(x).toFixed(1)}% ${clamp(y).toFixed(1)}%`;

  const pos = parsePosition(position);
  const canDrag = !isIcon && Boolean(value);

  const updatePositionFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onPositionChange(formatPosition(x, y));
  };

  return (
    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:border-slate-300">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800">{label}</label>
        {isUploading && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
            <span className="h-2 w-2 animate-ping rounded-full bg-blue-600" />
            Enviando...
          </span>
        )}
      </div>

      <input
        type="file"
        accept={accept}
        onChange={(event) => onFileChange(kind, event.target.files?.[0])}
        disabled={isUploading}
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />

      {!isIcon && value && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Ponto Focal: <strong>{pos.x.toFixed(0)}% x {pos.y.toFixed(0)}%</strong>
          </span>
          <button
            type="button"
            onClick={() => onPositionChange("50% 50%")}
            className="rounded-md border border-slate-300 bg-white px-2 py-0.5 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Centralizar
          </button>
        </div>
      )}

      <div
        className={`relative h-28 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white shadow-inner transition ${
          canDrag ? (isDragging ? "cursor-grabbing ring-2 ring-blue-400" : "cursor-grab hover:border-blue-400") : ""
        }`}
        style={canDrag ? { touchAction: "none" } : undefined}
        tabIndex={canDrag ? 0 : -1}
        aria-label={canDrag ? `Preview arrastável de ${label}` : undefined}
        onPointerDown={(event) => {
          if (!canDrag) return;
          setIsDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          updatePositionFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (!isDragging || !canDrag) return;
          updatePositionFromPointer(event);
        }}
        onPointerUp={(event) => {
          if (!canDrag) return;
          setIsDragging(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerLeave={() => {
          if (isDragging) setIsDragging(false);
        }}
        onKeyDown={(event) => {
          if (!canDrag) return;
          const step = event.shiftKey ? 5 : 1;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onPositionChange(formatPosition(pos.x - step, pos.y));
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            onPositionChange(formatPosition(pos.x + step, pos.y));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            onPositionChange(formatPosition(pos.x, pos.y - step));
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            onPositionChange(formatPosition(pos.x, pos.y + step));
          } else if (event.key.toLowerCase() === "c") {
            event.preventDefault();
            onPositionChange("50% 50%");
          }
        }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={`Preview de ${label}`}
              draggable={false}
              className={
                isIcon
                  ? "mx-auto my-auto h-12 w-12 rounded object-contain"
                  : "h-full w-full select-none object-cover"
              }
              style={isIcon ? undefined : { objectPosition: position || "50% 50%" }}
            />
            {canDrag && (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-sm"
                  style={{ left: `${pos.x}%`, transform: "translateX(-0.5px)" }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 h-px bg-white/80 shadow-sm"
                  style={{ top: `${pos.y}%`, transform: "translateY(-0.5px)" }}
                />
                <div
                  className="pointer-events-none absolute h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-600 shadow-md"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center">
            <p className="text-xs text-slate-400">Nenhum arquivo enviado. Selecione uma imagem.</p>
          </div>
        )}
      </div>

      {!isIcon && value && (
        <p className="text-[11px] text-slate-400">
          💡 Dica: Arraste com o mouse para posicionar ou use as setas do teclado (Shift para passos maiores, C para centralizar).
        </p>
      )}
    </div>
  );
}
