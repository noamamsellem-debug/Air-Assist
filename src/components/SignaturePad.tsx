"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pad de signature au doigt / souris (pointer events). Renvoie un PNG en
 * data-URL via onChange (ou null si vide).
 */
export function SignaturePad({
  onChange,
  clearLabel,
}: {
  onChange: (dataUrl: string | null) => void;
  clearLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dessine = useRef(false);
  const aDessine = useRef(false);
  const [vide, setVide] = useState(true);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }, []);

  function position(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function down(e: React.PointerEvent) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    dessine.current = true;
    const { x, y } = position(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent) {
    if (!dessine.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = position(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!aDessine.current) {
      aDessine.current = true;
      setVide(false);
    }
  }

  function up() {
    if (!dessine.current) return;
    dessine.current = false;
    const c = canvasRef.current!;
    onChange(aDessine.current ? c.toDataURL("image/png") : null);
  }

  function effacer() {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    aDessine.current = false;
    setVide(true);
    onChange(null);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="h-40 w-full cursor-crosshair touch-none rounded-lg border border-dashed border-slate-300 bg-white"
      />
      <button
        type="button"
        onClick={effacer}
        disabled={vide}
        className="mt-1 text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40"
      >
        {clearLabel}
      </button>
    </div>
  );
}
