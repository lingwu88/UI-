import React from "react";

interface MobileShellProps {
  children: React.ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(0,107,255,0.14), transparent 34%), #e3eaf2",
      }}
    >
      <div
        className="relative w-[390px] overflow-hidden rounded-[2.25rem] shadow-2xl"
        style={{
          height: "844px",
          background: "var(--background)",
          boxShadow:
            "0 0 0 10px #d8e1ea, 0 0 0 11px rgba(100,116,139,0.28), 0 28px 70px rgba(31,41,55,0.24)",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0"
          style={{ background: "#ffffff", zIndex: 50, position: "relative" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>09:41</span>
          <div className="w-28 h-6 rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" style={{ color: "var(--foreground)" }}>
              <rect x="0" y="4" width="3" height="8" rx="0.5" opacity="0.4"/>
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" opacity="0.6"/>
              <rect x="9" y="1" width="3" height="11" rx="0.5" opacity="0.8"/>
              <rect x="13.5" y="0" width="2.5" height="12" rx="0.5"/>
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor" style={{ color: "var(--foreground)" }}>
              <path d="M7.5 2.5C9.8 2.5 11.8 3.5 13.2 5.1L14.5 3.8C12.7 1.8 10.2 0.5 7.5 0.5C4.8 0.5 2.3 1.8 0.5 3.8L1.8 5.1C3.2 3.5 5.2 2.5 7.5 2.5Z" opacity="0.4"/>
              <path d="M7.5 5.5C9 5.5 10.4 6.2 11.3 7.3L12.6 6C11.3 4.5 9.5 3.5 7.5 3.5C5.5 3.5 3.7 4.5 2.4 6L3.7 7.3C4.6 6.2 6 5.5 7.5 5.5Z" opacity="0.7"/>
              <circle cx="7.5" cy="10" r="1.5"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 rounded-sm border border-current flex items-center px-0.5" style={{ color: "var(--foreground)" }}>
                <div className="w-4 h-1.5 rounded-sm bg-green-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-col overflow-hidden" style={{ height: "calc(844px - 44px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
