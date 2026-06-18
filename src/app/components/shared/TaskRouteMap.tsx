import React, { useState } from "react";
import { MapPin, Minus, Navigation, Plus } from "lucide-react";

interface TaskRouteMapProps {
  location: string;
  gps: string;
  currentLabel?: string;
  targetLabel?: string;
}

export function TaskRouteMap({
  location,
  gps,
  currentLabel = "当前位置",
  targetLabel = "任务地点",
}: TaskRouteMapProps) {
  const zoomLevels = [0.9, 1.08, 1.26];
  const [zoomIndex, setZoomIndex] = useState(1);
  const zoom = zoomLevels[zoomIndex];

  return (
    <div
      className="mt-3 rounded-lg overflow-hidden relative"
      style={{
        height: 140,
        border: "1px solid var(--border)",
        background: "#eef6ff",
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-200"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          background:
            "linear-gradient(135deg, rgba(0,107,255,0.10), rgba(0,163,255,0.06)), repeating-linear-gradient(0deg, transparent 0 23px, rgba(100,115,134,0.16) 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(100,115,134,0.16) 24px)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            left: "27%",
            top: "60%",
            width: "48%",
            height: 3,
            background: "var(--primary)",
            transform: "rotate(-18deg)",
            transformOrigin: "left center",
            opacity: 0.72,
          }}
        />

        <div className="absolute left-5 bottom-5 flex flex-col items-center gap-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--primary)", color: "#fff", boxShadow: "0 4px 12px rgba(0,107,255,0.28)" }}
          >
            <Navigation size={15} />
          </div>
          <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>{currentLabel}</span>
        </div>

        <div className="absolute right-5 top-12 flex flex-col items-center gap-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--danger)", color: "#fff", boxShadow: "0 4px 12px rgba(230,0,18,0.24)" }}
          >
            <MapPin size={15} />
          </div>
          <span className="text-xs font-semibold" style={{ color: "var(--danger)" }}>{targetLabel}</span>
        </div>
      </div>

      <div
        className="absolute left-3 top-3 right-24 rounded-md px-2 py-1"
        style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(213,224,235,0.88)" }}
      >
        <div className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{location}</div>
        <div className="text-xs font-mono truncate" style={{ color: "var(--muted-foreground)" }}>{gps}</div>
      </div>

      <div
        className="absolute right-3 top-3 flex rounded-lg overflow-hidden"
        style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(213,224,235,0.9)" }}
      >
        <button
          type="button"
          title="缩小地图"
          aria-label="缩小地图"
          disabled={zoomIndex === 0}
          onClick={() => setZoomIndex((current) => Math.max(0, current - 1))}
          className="w-8 h-8 flex items-center justify-center active:opacity-70"
          style={{ color: zoomIndex === 0 ? "var(--muted-foreground)" : "var(--foreground)", opacity: zoomIndex === 0 ? 0.45 : 1 }}
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          title="放大地图"
          aria-label="放大地图"
          disabled={zoomIndex === zoomLevels.length - 1}
          onClick={() => setZoomIndex((current) => Math.min(zoomLevels.length - 1, current + 1))}
          className="w-8 h-8 flex items-center justify-center active:opacity-70"
          style={{
            color: zoomIndex === zoomLevels.length - 1 ? "var(--muted-foreground)" : "var(--foreground)",
            opacity: zoomIndex === zoomLevels.length - 1 ? 0.45 : 1,
            borderLeft: "1px solid rgba(213,224,235,0.9)",
          }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
