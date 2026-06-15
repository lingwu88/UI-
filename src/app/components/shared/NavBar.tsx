import React from "react";
import { ChevronLeft } from "lucide-react";
// import { Bell } from "lucide-react";

interface NavBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  badge?: number;
}

export function NavBar({ title, subtitle, onBack, rightAction, badge }: NavBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, var(--background) 100%)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 w-10">
        {onBack && (
          <button onClick={onBack} className="p-1 rounded-lg active:opacity-60" style={{ color: "var(--secondary-foreground)" }}>
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <div className="text-center flex-1">
        <div className="font-semibold text-base" style={{ color: "var(--foreground)" }}>{title}</div>
        {subtitle && <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{subtitle}</div>}
      </div>
      <div className="w-10 flex justify-end">
        {rightAction}
        {/*
          通知铃铛入口暂时移除。
          后续如需要做系统通知中心，可恢复 Bell 图标、badge 角标和点击事件。

          {!rightAction && (
            <div className="relative">
              <Bell size={20} style={{ color: "var(--secondary-foreground)" }} />
              {badge && badge > 0 ? (
                <span
                  className="absolute -top-1 -right-1 text-xs text-white rounded-full flex items-center justify-center"
                  style={{ background: "var(--destructive)", minWidth: 16, height: 16, fontSize: 10, padding: "0 3px" }}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </div>
          )}
        */}
      </div>
    </div>
  );
}
