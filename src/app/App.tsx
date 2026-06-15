import React, { useState } from "react";
import { MobileShell } from "./components/shared/MobileShell";
import { SupervisorApp } from "./components/supervisor/SupervisorApp";
import { ConstructionApp } from "./components/construction/ConstructionApp";
import { DroneApp } from "./components/drone/DroneApp";
import { DroneLeaderApp } from "./components/droneleader/DroneLeaderApp";
import { Shield, HardHat, Navigation, Users, ChevronRight, Lock } from "lucide-react";

{/* MARKER-MAKE-KIT-INVOKED */}

type Role = "supervisor" | "construction" | "drone" | "droneleader" | null;

const ROLES = [
  {
    key: "supervisor" as Role,
    label: "监理",
    sublabel: "安全生产监督管理",
    icon: <Shield size={28} />,
    color: "#006BFF",
    bg: "rgba(0,107,255,0.11)",
    border: "rgba(0,107,255,0.36)",
    accent: "#006BFF",
    badge: "监理端",
  },
  {
    key: "construction" as Role,
    label: "施工负责人",
    sublabel: "整改工单接收与反馈",
    icon: <HardHat size={28} />,
    color: "#FF7A00",
    bg: "rgba(255,122,0,0.12)",
    border: "rgba(255,122,0,0.38)",
    accent: "#FF7A00",
    badge: "施工端",
  },
  {
    key: "droneleader" as Role,
    label: "飞手团队负责人",
    sublabel: "接收指派与分配飞手",
    icon: <Users size={28} />,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.11)",
    border: "rgba(124,58,237,0.34)",
    accent: "#7C3AED",
    badge: "飞手队长端",
  },
  {
    key: "drone" as Role,
    label: "飞手",
    sublabel: "执行飞拍复核任务",
    icon: <Navigation size={28} />,
    color: "#00A3FF",
    bg: "rgba(0,163,255,0.12)",
    border: "rgba(0,163,255,0.36)",
    accent: "#00A3FF",
    badge: "飞手端",
  },
];

function LoginScreen({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--background)" }}
    >
      {/* Logo Area */}
      <div
        className="flex flex-col items-center pt-10 pb-8 px-6"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, var(--background) 100%)",
        }}
      >
        {/* Logo mark */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative"
          style={{
            background: "linear-gradient(135deg, #006BFF 0%, #00A3FF 100%)",
            boxShadow: "0 8px 22px rgba(0,107,255,0.26)",
          }}
        >
          <Shield size={32} color="#fff" />
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "var(--warning)" }}
          >
            <Navigation size={11} color="#1f2937" />
          </div>
        </div>
        <h1
          className="font-bold text-center"
          style={{ fontSize: 20, color: "var(--foreground)", letterSpacing: "0.02em" }}
        >
          工地低空安全监管平台
        </h1>
        <p className="text-xs mt-1 text-center" style={{ color: "var(--muted-foreground)" }}>
          云百智航 · 阳光城 A-C 地块项目
        </p>
        {/* Divider line */}
        <div
          className="mt-5 w-24 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)" }}
        />
      </div>

      {/* Role Selection */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <p
          className="text-xs font-semibold mb-4 tracking-widest uppercase"
          style={{ color: "var(--muted-foreground)" }}
        >
          选择登录角色
        </p>
        <div className="space-y-3">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => onSelect(role.key)}
              className="w-full rounded-2xl p-4 flex items-center gap-4 text-left active:opacity-80 transition-all"
              style={{
                background: role.bg,
                border: `1px solid ${role.border}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${role.color}22`, color: role.color }}
              >
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {role.label}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ background: `${role.color}22`, color: role.color }}
                  >
                    {role.badge}
                  </span>
                </div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {role.sublabel}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: role.color, flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Bottom info */}
        <div
          className="mt-8 rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "rgba(47,125,246,0.06)",
            border: "1px solid rgba(47,125,246,0.12)",
          }}
        >
          <Lock size={16} color="var(--muted-foreground)" />
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            本系统数据加密传输，请使用企业账号登录。违规操作将被记录并追溯。
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>
          v2.1.0 · © 2025 云百智航
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>(null);

  return (
    <MobileShell>
      {role === null && <LoginScreen onSelect={setRole} />}
      {role === "supervisor" && <SupervisorApp />}
      {role === "construction" && <ConstructionApp />}
      {role === "drone" && <DroneApp />}
      {role === "droneleader" && <DroneLeaderApp />}
    </MobileShell>
  );
}
