import React from "react";

export interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomTabProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
}

export function BottomTab({ tabs, active, onChange }: BottomTabProps) {
  return (
    <div
      className="flex items-center flex-shrink-0"
      style={{
        background: "#ffffff",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        paddingTop: 6,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 relative active:opacity-70"
          >
            <div className="relative">
              <div style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}>{tab.icon}</div>
              {tab.badge && tab.badge > 0 ? (
                <span
                  className="absolute -top-1 -right-2 text-white rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--destructive)",
                    minWidth: 14,
                    height: 14,
                    fontSize: 9,
                    padding: "0 2px",
                  }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span
              className="text-xs"
              style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)", fontSize: 10 }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
