type StatusType = "violation" | "pending" | "reviewing" | "rectifying" | "re-review" | "completed" | "exception" | "flying" | "assigned" | "overdue";

const STATUS_MAP: Record<StatusType, { label: string; bg: string; color: string; dot: string }> = {
  violation: { label: "确认违规", bg: "var(--danger)", color: "#fff", dot: "#fff" },
  pending: { label: "待审核", bg: "var(--warning)", color: "#1f2937", dot: "#1f2937" },
  reviewing: { label: "审核中", bg: "var(--primary)", color: "#fff", dot: "#fff" },
  rectifying: { label: "整改中", bg: "var(--caution)", color: "#fff", dot: "#fff" },
  "re-review": { label: "待复核", bg: "var(--info)", color: "#fff", dot: "#fff" },
  completed: { label: "整改完成", bg: "var(--success)", color: "#fff", dot: "#fff" },
  overdue: { label: "逾期", bg: "var(--danger)", color: "#fff", dot: "#fff" },
  exception: { label: "任务异常", bg: "var(--danger)", color: "#fff", dot: "#fff" },
  flying: { label: "飞行中", bg: "var(--info)", color: "#fff", dot: "#fff" },
  assigned: { label: "进行中", bg: "var(--primary)", color: "#fff", dot: "#fff" },
};

interface StatusBadgeProps {
  status: StatusType;
  small?: boolean;
}

export function StatusBadge({ status, small }: StatusBadgeProps) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium"
      style={{
        background: s.bg,
        color: s.color,
        padding: small ? "1px 8px" : "3px 10px",
        fontSize: small ? 11 : 12,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}
