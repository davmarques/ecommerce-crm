"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import type { BrandingMediaKind } from "@/lib/api";

interface InlineMediaEditorProps {
  label: string;
  kind: BrandingMediaKind;
  accept?: string;
  value: string;
  position?: string;
  onFileChange: (kind: BrandingMediaKind, file?: File) => void;
  onPositionChange?: (newPosition: string) => void;
  isUploading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function InlineMediaEditor({
  label,
  kind,
  accept = "image/*",
  value,
  position = "50% 50%",
  onFileChange,
  onPositionChange = () => {},
  isUploading = false,
  children,
  className = "",
}: InlineMediaEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clamp = (val: number) => Math.min(100, Math.max(0, val));
  const parsePosition = (val: string | undefined) => {
    const match = val?.match(/^(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
    if (!match) return { x: 50, y: 50 };
    return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) };
  };
  const formatPosition = (x: number, y: number) =>
    `${clamp(x).toFixed(1)}% ${clamp(y).toFixed(1)}%`;

  const pos = parsePosition(position);

  const updatePositionFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onPositionChange(formatPosition(x, y));
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer ${className}`}
      >
        {children}
      </div>

      {/* Media Edit Modal (Mounted at document.body via Portal) */}
      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Editar {label}</h3>
                  <p className="text-xs text-slate-400">Faça upload da imagem e ajuste o ponto focal</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Selecionar Novo Arquivo
                  </label>
                  <input
                    type="file"
                    accept={accept}
                    onChange={(e) => onFileChange(kind, e.target.files?.[0])}
                    disabled={isUploading}
                    className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white file:cursor-pointer hover:file:bg-blue-700 cursor-pointer"
                  />
                  {isUploading && (
                    <p className="mt-1 text-xs text-blue-400 animate-pulse">Enviando imagem para o storage...</p>
                  )}
                </div>

                {value && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Ponto focal: <strong>{pos.x.toFixed(0)}% x {pos.y.toFixed(0)}%</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => onPositionChange("50% 50%")}
                        className="rounded border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-white transition"
                      >
                        Centralizar
                      </button>
                    </div>

                    <div
                      className={`relative mt-2 h-44 overflow-hidden rounded-xl border border-dashed border-slate-700 bg-black ${
                        isDragging ? "cursor-grabbing ring-2 ring-blue-500" : "cursor-grab"
                      }`}
                      style={{ touchAction: "none" }}
                      onPointerDown={(e) => {
                        setIsDragging(true);
                        e.currentTarget.setPointerCapture(e.pointerId);
                        updatePositionFromPointer(e);
                      }}
                      onPointerMove={(e) => {
                        if (!isDragging) return;
                        updatePositionFromPointer(e);
                      }}
                      onPointerUp={(e) => {
                        setIsDragging(false);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={value}
                        alt={label}
                        draggable={false}
                        className="h-full w-full select-none object-cover"
                        style={{ objectPosition: position || "50% 50%" }}
                      />
                      <div
                        className="pointer-events-none absolute inset-y-0 w-px bg-white/70"
                        style={{ left: `${pos.x}%`, transform: "translateX(-0.5px)" }}
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 h-px bg-white/70"
                        style={{ top: `${pos.y}%`, transform: "translateY(-0.5px)" }}
                      />
                      <div
                        className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Arraste com o mouse para posicionar o foco principal da imagem.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  Concluir
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
