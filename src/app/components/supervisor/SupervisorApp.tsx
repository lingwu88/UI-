import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { StatusBadge } from "../shared/StatusBadge";
import {
  LayoutGrid, ClipboardList, Send, PieChart,
  Camera, MapPin, Clock, User, ChevronRight,
  CheckCircle2, XCircle, Drone, AlertTriangle,
  Zap, Shield, TrendingUp, Users, Navigation,
  MessageCircle, Search,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────
const pendingImages = [
  {
    id: "IMG-001",
    type: "未佩戴安全帽",
    location: "A区3号楼-5层",
    time: "2025-06-12 09:23",
    persons: ["张某某", "李某某"],
    confidence: 94,
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&auto=format",
  },
  {
    id: "IMG-002",
    type: "高空作业未系安全绳",
    location: "B区基坑-东侧",
    time: "2025-06-12 09:41",
    persons: ["王某某"],
    confidence: 87,
    img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop&auto=format",
  },
  {
    id: "IMG-003",
    type: "危险区域违规入侵",
    location: "C区临时堆料区",
    time: "2025-06-12 10:05",
    persons: ["赵某某", "陈某某", "刘某某"],
    confidence: 91,
    img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop&auto=format",
  },
];

const workOrders = [
  { id: "WO-20250612-001", type: "未佩戴安全帽", location: "A区3号楼", status: "rectifying" as const, deadline: "2025-06-13", unit: "华建总承包" },
  { id: "WO-20250612-002", type: "高空作业未系安全绳", location: "B区基坑", status: "re-review" as const, deadline: "2025-06-12", unit: "华建总承包" },
  { id: "WO-20250611-003", type: "消防通道占用", location: "D区施工现场", status: "completed" as const, deadline: "2025-06-11", unit: "兴盛分包" },
  { id: "WO-20250610-004", type: "脚手架缺失防护", location: "A区2号楼", status: "completed" as const, deadline: "2025-06-11", unit: "华建总承包" },
];

const droneTeams = [
  { id: "T001", name: "鹰眼一队", leader: "孙大志", available: 3, total: 5, status: "待命" },
  { id: "T002", name: "鹰眼二队", leader: "张明远", available: 1, total: 4, status: "执行中" },
  { id: "T003", name: "天巡三队", leader: "刘海峰", available: 2, total: 4, status: "待命" },
  { id: "T004", name: "云瞰应急组", leader: "陈启航", available: 1, total: 3, status: "待命" },
];

type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

type SupervisorLeaderThread = {
  id: string;
  teamName: string;
  leader: string;
  assigned: boolean;
  status: "online" | "busy" | "offline";
  tag: string;
  workOrder?: string;
  unread: number;
  lastActive: string;
  messages: ChatMessage[];
};

const supervisorLeaderThreads: SupervisorLeaderThread[] = [
  {
    id: "team-T001",
    teamName: "鹰眼一队",
    leader: "孙大志",
    assigned: true,
    status: "online",
    tag: "已指派",
    workOrder: "WO-20250612-002",
    unread: 2,
    lastActive: "刚刚",
    messages: [
      { id: "m1", from: "me", text: "孙队长，B区基坑复核飞拍今天16:00前需要回传，请优先安排。", time: "09:26" },
      { id: "m2", from: "them", text: "收到，王飞手已经在准备电池和航线。", time: "09:28" },
      { id: "m3", from: "them", text: "现场东侧风速偏高，我们会先做安全确认。", time: "09:31" },
    ],
  },
  {
    id: "team-T002",
    teamName: "鹰眼二队",
    leader: "张明远",
    assigned: true,
    status: "busy",
    tag: "已指派",
    workOrder: "WO-20250610-004",
    unread: 0,
    lastActive: "18分钟前",
    messages: [
      { id: "m1", from: "them", text: "A区2号楼脚手架复核图像已上传，等待您审核。", time: "08:46" },
      { id: "m2", from: "me", text: "已看到，辛苦。后续如果施工方补防护网，再补一组近景。", time: "08:51" },
    ],
  },
];

function createAssignedLeaderThread(teamId: string, workOrderId: string): SupervisorLeaderThread | null {
  const team = droneTeams.find((item) => item.id === teamId);
  if (!team) return null;

  return {
    id: `team-${team.id}`,
    teamName: team.name,
    leader: team.leader,
    assigned: true,
    status: team.status === "执行中" ? "busy" : "online",
    tag: "已指派",
    workOrder: workOrderId,
    unread: 0,
    lastActive: "刚刚",
    messages: [
      {
        id: `m-${Date.now()}`,
        from: "me",
        text: `${team.leader}，${workOrderId} 已指派给 ${team.name}，请安排飞手并保持任务同步。`,
        time: "刚刚",
      },
    ],
  };
}

// ─── Sub-screens ─────────────────────────────────────────────

function ImageReviewDetail({ img, onBack, onConfirm, onReject }: {
  img: typeof pendingImages[0];
  onBack: () => void;
  onConfirm: () => void;
  onReject: () => void;
}) {
  const [decision, setDecision] = useState<null | "confirm" | "reject">(null);

  return (
    <div className="flex flex-col h-full">
      <NavBar title="违规图片审核" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        {/* Image */}
        <div className="relative">
          <img src={img.img} alt="violation" className="w-full object-cover" style={{ height: 220 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,19,36,0.9) 0%, transparent 50%)" }} />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{img.type}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "rgba(255,77,79,0.85)", color: "#fff" }}>
                AI置信度 {img.confidence}%
              </span>
            </div>
          </div>
          {/* AI overlay markers */}
          <div className="absolute top-8 left-12 border-2 rounded-sm pointer-events-none"
            style={{ width: 60, height: 80, borderColor: "var(--danger)", boxShadow: "0 0 8px rgba(255,77,79,0.5)" }}>
            <span className="absolute -top-4 left-0 text-xs font-mono" style={{ color: "var(--danger)" }}>违规人员</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="p-4 space-y-3">
          <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>违规信息</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "违规类型", value: img.type, icon: <AlertTriangle size={14} /> },
                { label: "拍摄时间", value: img.time.split(" ")[1], icon: <Clock size={14} /> },
                { label: "拍摄位置", value: img.location, icon: <MapPin size={14} /> },
                { label: "涉事人员", value: img.persons.join("、"), icon: <User size={14} /> },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                    {item.icon}
                    <span style={{ fontSize: 11 }}>{item.label}</span>
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>AI识别结果</h3>
            <div className="space-y-2">
              {["未佩戴安全帽", "人员在高风险区域"].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>{item}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                      <div className="h-full rounded-full" style={{ width: `${i === 0 ? 94 : 78}%`, background: "var(--primary)" }} />
                    </div>
                    <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{i === 0 ? "94%" : "78%"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {decision && (
            <div
              className="rounded-xl p-3 flex items-center gap-2 text-sm font-medium"
              style={{
                background: decision === "confirm" ? "rgba(255,77,79,0.1)" : "rgba(53,208,127,0.1)",
                border: `1px solid ${decision === "confirm" ? "rgba(255,77,79,0.3)" : "rgba(53,208,127,0.3)"}`,
                color: decision === "confirm" ? "var(--danger)" : "var(--success)",
              }}
            >
              {decision === "confirm" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {decision === "confirm" ? "已标记为属实违规，系统将自动生成工单" : "已标记为误判，不进行后续处理"}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!decision && (
        <div className="p-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => { setDecision("reject"); onReject(); }}
            className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
          >
            <XCircle size={16} />
            误判，忽略
          </button>
          <button
            onClick={() => { setDecision("confirm"); onConfirm(); }}
            className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: "var(--destructive)", color: "#fff" }}
          >
            <CheckCircle2 size={16} />
            属实违规，生成工单
          </button>
        </div>
      )}
    </div>
  );
}

function AssignDroneModal({
  workOrderId,
  onClose,
  onAssigned,
}: {
  workOrderId: string;
  onClose: () => void;
  onAssigned: (teamId: string, workOrderId: string) => void;
}) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const selectedTeamInfo = droneTeams.find((team) => team.id === selectedTeam);

  const handleSubmit = () => {
    if (!selectedTeam) return;
    onAssigned(selectedTeam, workOrderId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(53,208,127,0.15)" }}>
          <CheckCircle2 size={32} color="var(--success)" />
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>指派成功</div>
          <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            已通知{selectedTeamInfo?.leader ?? "飞手团队负责人"}分配团队飞手，会话已开启
          </div>
        </div>
        <button onClick={onClose} className="mt-4 px-8 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: "var(--primary)", color: "#fff" }}>
          完成
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <NavBar title="指派飞手团队" subtitle={`工单 ${workOrderId}`} onBack={onClose} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>选择飞手团队</h3>
          <div className="space-y-2">
            {droneTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className="w-full rounded-xl p-4 text-left transition-all"
                style={{
                  background: selectedTeam === team.id ? "rgba(47,125,246,0.15)" : "var(--card)",
                  border: `1px solid ${selectedTeam === team.id ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{team.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      负责人: {team.leader} · 可用飞手 {team.available}/{team.total}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: team.status === "待命" ? "rgba(53,208,127,0.15)" : "rgba(47,125,246,0.15)",
                      color: team.status === "待命" ? "var(--success)" : "var(--primary)",
                    }}
                  >
                    {team.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          disabled={!selectedTeam}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{
            background: selectedTeam ? "var(--primary)" : "var(--secondary)",
            color: selectedTeam ? "#fff" : "var(--muted-foreground)",
          }}
        >
          确认指派团队
        </button>
      </div>
    </div>
  );
}

// ─── Main Tabs ────────────────────────────────────────────────

function ReviewTab({ onOpenDetail }: { onOpenDetail: (img: typeof pendingImages[0]) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>待审核违规图片</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(255,224,71,0.15)", color: "var(--caution)" }}>
            {pendingImages.length} 条待处理
          </span>
        </div>

        {pendingImages.map((img) => (
          <button
            key={img.id}
            onClick={() => onOpenDetail(img)}
            className="w-full rounded-xl overflow-hidden text-left active:opacity-80"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="relative">
              <img src={img.img} alt="" className="w-full object-cover" style={{ height: 140 }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,19,36,0.8) 0%, transparent 50%)" }} />
              <div className="absolute top-2 left-2">
                <StatusBadge status="pending" small />
              </div>
              <div className="absolute bottom-2 left-3 right-3">
                <div className="font-semibold text-white text-sm">{img.type}</div>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <MapPin size={12} />
                  <span style={{ fontSize: 12 }}>{img.location}</span>
                </div>
                <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <Clock size={12} />
                  <span style={{ fontSize: 12 }}>{img.time.split(" ")[1]}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <User size={12} />
                  <span style={{ fontSize: 12 }}>{img.persons.join("、")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>AI置信度</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: img.confidence > 90 ? "var(--danger)" : "var(--warning)" }}>
                    {img.confidence}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end" style={{ color: "var(--accent)" }}>
                <span style={{ fontSize: 12 }}>点击审核</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkOrderTab({ onAssign }: { onAssign: (id: string) => void }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filters = [
    { key: "all", label: "全部" },
    { key: "rectifying", label: "整改中" },
    { key: "re-review", label: "待复核" },
    { key: "completed", label: "已完成" },
  ];

  const filtered = workOrders.filter((w) => {
    const matchesStatus = filter === "all" || w.status === filter;
    const keyword = query.trim().toLowerCase();
    if (!keyword) return matchesStatus;

    const searchable = `${w.id}${w.type}${w.location}${w.deadline}${w.unit}`.toLowerCase();
    return matchesStatus && searchable.includes(keyword);
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 pt-3 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <Search size={15} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工单编号、类型、位置或责任单位"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 flex-shrink-0 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === f.key ? "var(--primary)" : "var(--secondary)",
              color: filter === f.key ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {filtered.map((wo) => (
          <div
            key={wo.id}
            className="rounded-xl p-4 space-y-3"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{wo.type}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{wo.id}</div>
              </div>
              <StatusBadge status={wo.status} small />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <MapPin size={12} /><span style={{ fontSize: 12 }}>{wo.location}</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {wo.deadline}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>责任单位: {wo.unit}</span>
              {wo.status === "re-review" && (
                <button
                  onClick={() => onAssign(wo.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                  style={{ background: "rgba(95,180,255,0.15)", color: "var(--accent)" }}
                >
                  <Navigation size={12} />
                  指派团队
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="rounded-xl p-6 text-center text-sm"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
          >
            未找到匹配的工单
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardTab() {
  const stats = [
    { label: "本月违规", value: 23, unit: "起", color: "var(--danger)", icon: <AlertTriangle size={18} /> },
    { label: "整改完成", value: 18, unit: "起", color: "var(--success)", icon: <CheckCircle2 size={18} /> },
    { label: "待处理", value: 5, unit: "起", color: "var(--caution)", icon: <Clock size={18} /> },
    { label: "飞拍次数", value: 12, unit: "次", color: "var(--info)", icon: <Navigation size={18} /> },
  ];

  const recentTypes = [
    { type: "未佩戴安全帽", count: 8, pct: 35 },
    { type: "高空作业违规", count: 6, pct: 26 },
    { type: "危险区域入侵", count: 5, pct: 22 },
    { type: "消防通道占用", count: 4, pct: 17 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>本月</span>
            </div>
            <div className="font-bold" style={{ fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{s.label}（{s.unit}）</div>
          </div>
        ))}
      </div>

      {/* Violation Types */}
      <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>违规类型分布</h3>
        <div className="space-y-3">
          {recentTypes.map((item) => (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--foreground)" }}>{item.type}</span>
                <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{item.count}起 · {item.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.pct}%`, background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent trend */}
      <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>近7日整改率趋势</h3>
        <div className="flex items-end gap-2 h-16">
          {[65, 72, 68, 80, 75, 88, 78].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(v / 100) * 52}px`,
                  background: i === 6 ? "var(--accent)" : "var(--primary)",
                  opacity: 0.7 + (i / 30),
                }}
              />
              <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>
                {["周一", "周二", "周三", "周四", "周五", "周六", "周日"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 flex items-center gap-3"
        style={{ background: "rgba(47,125,246,0.08)", border: "1px solid rgba(47,125,246,0.2)" }}>
        <Shield size={20} color="var(--primary)" />
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>安全生产整体评分</div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>本月综合评级: <span style={{ color: "var(--success)", fontWeight: 600 }}>良好 B+</span></div>
        </div>
        <div className="ml-auto font-bold" style={{ fontSize: 28, color: "var(--success)" }}>82</div>
      </div>
    </div>
  );
}

function MessageTab({
  threads,
  setThreads,
}: {
  threads: SupervisorLeaderThread[];
  setThreads: React.Dispatch<React.SetStateAction<SupervisorLeaderThread[]>>;
}) {
  const [activeId, setActiveId] = useState(supervisorLeaderThreads[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const filteredThreads = threads.filter((thread) => {
    const keyword = query.trim();
    if (!keyword) return true;
    return `${thread.teamName}${thread.leader}${thread.workOrder ?? ""}`.includes(keyword);
  });
  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];

  const openThread = (threadId: string) => {
    setActiveId(threadId);
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, unread: 0 } : thread,
      ),
    );
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeThread) return;

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              lastActive: "刚刚",
              messages: [
                ...thread.messages,
                { id: `m-${Date.now()}`, from: "me", text, time: "刚刚" },
              ],
            }
          : thread,
      ),
    );
    setDraft("");
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-4 py-3 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>会话列表</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              指派飞行团队后自动开启会话
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "rgba(0,107,255,0.10)", color: "var(--primary)" }}>
            {threads.length} 个已开启
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <Search size={15} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索团队或负责人"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--foreground)" }}
          />
        </div>

        <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 188 }}>
          {filteredThreads.map((thread) => {
            const active = thread.id === activeThread.id;
            return (
              <button
                key={thread.id}
                onClick={() => openThread(thread.id)}
                className="w-full rounded-xl p-3 text-left flex items-center gap-3"
                style={{
                  background: active ? "rgba(0,107,255,0.08)" : "var(--card)",
                  border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                  style={{ background: "rgba(0,176,80,0.12)", color: "var(--success)" }}>
                  {thread.leader[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{thread.leader}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(0,176,80,0.12)", color: "var(--success)" }}>
                      已指派
                    </span>
                  </div>
                  <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                    {thread.teamName}{thread.workOrder ? ` · ${thread.workOrder}` : ""}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{thread.lastActive}</span>
                  {thread.unread > 0 && (
                    <span className="text-white rounded-full flex items-center justify-center"
                      style={{ background: "var(--destructive)", minWidth: 16, height: 16, fontSize: 10 }}>
                      {thread.unread}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          {filteredThreads.length === 0 && (
            <div className="rounded-xl p-4 text-center text-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
              暂无会话，请先在工单中指派飞行团队
            </div>
          )}
        </div>
      </div>

      <div className="mx-4 rounded-xl p-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(95,180,255,0.14)", color: "var(--accent)" }}>
          <Users size={19} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{activeThread.leader}</div>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: activeThread.status === "online" ? "rgba(53,208,127,0.15)" : activeThread.status === "busy" ? "rgba(255,224,71,0.12)" : "var(--secondary)",
                color: activeThread.status === "online" ? "var(--success)" : activeThread.status === "busy" ? "var(--warning)" : "var(--muted-foreground)",
              }}>
              {activeThread.status === "online" ? "在线" : activeThread.status === "busy" ? "任务中" : "离线"}
            </span>
          </div>
          <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
            {activeThread.teamName}{activeThread.workOrder ? ` · ${activeThread.workOrder}` : ""}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {activeThread.messages.map((message) => (
          <div key={message.id} className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className="px-3 py-2"
              style={{
                maxWidth: "78%",
                borderRadius: message.from === "me" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: message.from === "me" ? "var(--primary)" : "var(--card)",
                color: message.from === "me" ? "#fff" : "var(--foreground)",
                border: message.from === "me" ? "1px solid var(--primary)" : "1px solid var(--border)",
              }}
            >
              <div className="text-sm leading-relaxed">{message.text}</div>
              <div className="text-right mt-1" style={{ fontSize: 10, color: message.from === "me" ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)" }}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="输入消息"
            className="flex-1 rounded-xl px-3 py-2.5 outline-none text-sm"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center active:opacity-80"
            style={{
              background: draft.trim() ? "var(--primary)" : "var(--secondary)",
              color: draft.trim() ? "#fff" : "var(--muted-foreground)",
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeTab({
  onReviewClick,
  onMessageClick,
  pendingCount,
  messageUnread,
}: {
  onReviewClick: () => void;
  onMessageClick: () => void;
  pendingCount: number;
  messageUnread: number;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Banner */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110, border: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #ffffff 0%, #eaf4ff 58%, #f4f7fb 100%)",
        }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>安全生产监管平台</div>
          <div className="font-bold" style={{ fontSize: 18, color: "var(--foreground)" }}>你好，李监理</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>2025-06-12 · 阳光城 A-C地块项目</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Shield size={72} color="var(--info)" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 grid grid-cols-4 gap-3">
        {[
          { label: "待审核", icon: <Camera size={22} />, color: "var(--caution)", bg: "rgba(255,224,71,0.12)", badge: pendingCount, action: onReviewClick },
          { label: "工单管理", icon: <ClipboardList size={22} />, color: "var(--primary)", bg: "rgba(47,125,246,0.12)", badge: 0, action: () => {} },
          { label: "即时通信", icon: <MessageCircle size={22} />, color: "var(--info)", bg: "rgba(95,180,255,0.12)", badge: messageUnread, action: onMessageClick },
          { label: "数据看板", icon: <PieChart size={22} />, color: "var(--success)", bg: "rgba(53,208,127,0.12)", badge: 0, action: () => {} },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center gap-2 py-3 rounded-xl active:opacity-70 relative"
            style={{ background: item.bg }}
          >
            <div style={{ color: item.color }}>{item.icon}</div>
            <span style={{ fontSize: 11, color: "var(--foreground)" }}>{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute top-1 right-1 text-white text-xs rounded-full flex items-center justify-center"
                style={{ background: "var(--danger)", minWidth: 16, height: 16, fontSize: 10, padding: "0 3px" }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Latest alerts */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>最新违规告警</h3>
          <button onClick={onReviewClick} style={{ color: "var(--accent)", fontSize: 12 }}>查看全部</button>
        </div>
        <div className="space-y-2">
          {pendingImages.slice(0, 2).map((img) => (
            <button
              key={img.id}
              onClick={onReviewClick}
              className="w-full rounded-xl p-3 flex items-center gap-3 text-left active:opacity-70"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={img.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>{img.type}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{img.location}</div>
              </div>
              <StatusBadge status="pending" small />
            </button>
          ))}
        </div>
      </div>

      {/* Work Order Summary */}
      <div className="px-4 mt-4 mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>工单状态概览</h3>
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="grid grid-cols-3 divide-x" style={{ divideColor: "var(--border)" }}>
            {[
              { label: "整改中", value: 2, color: "var(--caution)" },
              { label: "待复核", value: 1, color: "var(--info)" },
              { label: "已完成", value: 2, color: "var(--success)" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center py-1">
                <span className="font-bold" style={{ fontSize: 22, color: item.color }}>{item.value}</span>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Exported Supervisor App ──────────────────────────────────

export function SupervisorApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [detail, setDetail] = useState<typeof pendingImages[0] | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [messageThreads, setMessageThreads] = useState<SupervisorLeaderThread[]>(supervisorLeaderThreads);
  const messageUnread = messageThreads.reduce((sum, thread) => sum + thread.unread, 0);

  const handleTeamAssigned = (teamId: string, workOrderId: string) => {
    const nextThread = createAssignedLeaderThread(teamId, workOrderId);
    if (!nextThread) return;

    setMessageThreads((current) => {
      const existing = current.find((thread) => thread.id === nextThread.id);
      if (!existing) return [nextThread, ...current];

      return current.map((thread) =>
        thread.id === nextThread.id
          ? {
              ...thread,
              assigned: true,
              tag: "已指派",
              workOrder: workOrderId,
              lastActive: "刚刚",
              messages: [
                ...thread.messages,
                {
                  id: `m-${Date.now()}`,
                  from: "me",
                  text: `${workOrderId} 已重新指派给 ${thread.teamName}，请继续同步任务进展。`,
                  time: "刚刚",
                },
              ],
            }
          : thread,
      );
    });
    setActiveTab("message");
  };

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "review", label: "图片审核", icon: <Camera size={20} />, badge: pendingImages.length },
    { key: "workorder", label: "工单", icon: <ClipboardList size={20} /> },
    { key: "message", label: "通信", icon: <MessageCircle size={20} />, badge: messageUnread },
    { key: "dashboard", label: "数据看板", icon: <PieChart size={20} /> },
  ];

  if (detail) {
    return (
      <ImageReviewDetail
        img={detail}
        onBack={() => setDetail(null)}
        onConfirm={() => setTimeout(() => setDetail(null), 1800)}
        onReject={() => setTimeout(() => setDetail(null), 1400)}
      />
    );
  }

  if (assignId) {
    return (
      <AssignDroneModal
        workOrderId={assignId}
        onClose={() => setAssignId(null)}
        onAssigned={handleTeamAssigned}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && (
        <NavBar
          title={tabs.find((t) => t.key === activeTab)?.label ?? ""}
          badge={activeTab === "review" ? pendingImages.length : 0}
        />
      )}
      {activeTab === "home" && (
        <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>监理端 · 李建国</div>
            <div className="font-semibold" style={{ color: "var(--foreground)" }}>安全生产监管</div>
          </div>
          <div className="relative">
            <button className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--secondary)" }}>
              <span style={{ color: "var(--foreground)", fontSize: 14 }}>李</span>
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "home" && (
        <HomeTab
          onReviewClick={() => setActiveTab("review")}
          onMessageClick={() => setActiveTab("message")}
          pendingCount={pendingImages.length}
          messageUnread={messageUnread}
        />
      )}
        {activeTab === "review" && (
          <ReviewTab onOpenDetail={(img) => setDetail(img)} />
        )}
        {activeTab === "workorder" && (
          <WorkOrderTab onAssign={(id) => setAssignId(id)} />
        )}
        {activeTab === "message" && <MessageTab threads={messageThreads} setThreads={setMessageThreads} />}
        {activeTab === "dashboard" && <DashboardTab />}
      </div>
      <BottomTab tabs={tabs} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
