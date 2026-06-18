import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { StatusBadge } from "../shared/StatusBadge";
import {
  LayoutGrid, ClipboardList, Send, PieChart,
  Camera, MapPin, Clock, User, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle,
  Zap, Shield, TrendingUp, Users, Navigation, Plus,
  MessageCircle, Search, PanelLeftOpen, PanelLeftClose,
  CalendarRange, Download, FileSpreadsheet, DatabaseBackup,
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

type WorkOrder = {
  id: string;
  type: string;
  location: string;
  status: "rectifying" | "re-review" | "completed";
  deadline: string;
  unit: string;
  reviewStage?: "needs-assignment" | "ready-review";
  reviewMaterials?: {
    violation: { title: string; time: string; img: string; desc: string };
    rectification: { title: string; time: string; img: string; desc: string };
    drone: { title: string; time: string; img: string; desc: string };
  };
};

const workOrders: WorkOrder[] = [
  { id: "WO-20250612-001", type: "未佩戴安全帽", location: "A区3号楼", status: "rectifying", deadline: "2025-06-13", unit: "华建总承包" },
  {
    id: "WO-20250612-002",
    type: "高空作业未系安全绳",
    location: "B区基坑",
    status: "re-review",
    deadline: "2025-06-12",
    unit: "华建总承包",
    reviewStage: "ready-review",
    reviewMaterials: {
      violation: {
        title: "初次违规影像",
        time: "2025-06-12 09:41",
        img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop&auto=format",
        desc: "AI识别高空作业区域存在未系安全绳行为，已生成整改工单。",
      },
      rectification: {
        title: "施工整改反馈",
        time: "2025-06-12 13:20",
        img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&auto=format",
        desc: "施工负责人反馈已完成安全绳佩戴与现场交底，提交整改后照片。",
      },
      drone: {
        title: "飞手复拍资料",
        time: "2025-06-12 15:36",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=300&fit=crop&auto=format",
        desc: "鹰眼一队回传同区域飞拍复核影像，等待监理复审确认。",
      },
    },
  },
  {
    id: "WO-20250612-005",
    type: "临边防护缺失",
    location: "C区4号楼",
    status: "re-review",
    deadline: "2025-06-13",
    unit: "华建总承包",
    reviewStage: "needs-assignment",
  },
  { id: "WO-20250611-003", type: "消防通道占用", location: "D区施工现场", status: "completed", deadline: "2025-06-11", unit: "兴盛分包" },
  { id: "WO-20250610-004", type: "脚手架缺失防护", location: "A区2号楼", status: "completed", deadline: "2025-06-11", unit: "华建总承包" },
];

const droneTeams = [
  { id: "T001", name: "鹰眼一队", leader: "孙大志", available: 3, total: 5, status: "待命" },
  { id: "T002", name: "鹰眼二队", leader: "张明远", available: 1, total: 4, status: "执行中" },
  { id: "T003", name: "天巡三队", leader: "刘海峰", available: 2, total: 4, status: "待命" },
  { id: "T004", name: "云瞰应急组", leader: "陈启航", available: 1, total: 3, status: "待命" },
];

type FlightTask = {
  id: string;
  workOrderId?: string;
  type: string;
  location: string;
  gps: string;
  deadline: string;
  status: "pending-assignment" | "assigned" | "completed";
  supervisorName: string;
  requirement: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedLeader?: string;
  assignedAt?: string;
};

const initialFlightTasks: FlightTask[] = [
  {
    id: "FT-20250612-001",
    workOrderId: "WO-20250612-005",
    type: "整改复核飞拍",
    location: "C区4号楼-临边作业面",
    gps: "30.566218, 114.307912",
    deadline: "2025-06-13 16:00",
    status: "pending-assignment",
    supervisorName: "李建国",
    requirement: "复核C区4号楼临边防护恢复情况，需拍摄临边护栏、警示标识和作业人员活动区域。",
  },
  {
    id: "FT-20250612-002",
    type: "日常巡查飞拍",
    location: "A区3号楼-材料堆场",
    gps: "30.568120, 114.304560",
    deadline: "2025-06-12 18:00",
    status: "pending-assignment",
    supervisorName: "李建国",
    requirement: "巡检材料堆场消防通道、临时用电和人员通行路线，回传全景与重点隐患近景。",
  },
  {
    id: "FT-20250611-003",
    workOrderId: "WO-20250610-004",
    type: "整改复核飞拍",
    location: "A区2号楼-脚手架外立面",
    gps: "30.565600, 114.302880",
    deadline: "2025-06-11 15:00",
    status: "assigned",
    supervisorName: "李建国",
    requirement: "复核脚手架防护网补设情况，重点拍摄二至四层外立面连续防护。",
    assignedTeamId: "T002",
    assignedTeamName: "鹰眼二队",
    assignedLeader: "张明远",
    assignedAt: "2025-06-11 09:20",
  },
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

function createAssignedLeaderThread(teamId: string, sourceId: string, messageText?: string): SupervisorLeaderThread | null {
  const team = droneTeams.find((item) => item.id === teamId);
  if (!team) return null;

  return {
    id: `team-${team.id}`,
    teamName: team.name,
    leader: team.leader,
    assigned: true,
    status: team.status === "执行中" ? "busy" : "online",
    tag: "已指派",
    workOrder: sourceId,
    unread: 0,
    lastActive: "刚刚",
    messages: [
      {
        id: `m-${Date.now()}`,
        from: "me",
        text: messageText ?? `${team.leader}，${sourceId} 已指派给 ${team.name}，请安排飞手并保持任务同步。`,
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

function FlightTaskStatusBadge({ status }: { status: FlightTask["status"] }) {
  const map = {
    "pending-assignment": { label: "待指派", bg: "rgba(255,224,71,0.16)", color: "var(--caution)" },
    assigned: { label: "已派发", bg: "rgba(0,107,255,0.12)", color: "var(--primary)" },
    completed: { label: "已完成", bg: "rgba(53,208,127,0.14)", color: "var(--success)" },
  };
  const item = map[status];
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: item.bg, color: item.color }}>
      {item.label}
    </span>
  );
}

function FlightTaskTab({
  tasks,
  onCreate,
  onAssign,
}: {
  tasks: FlightTask[];
  onCreate: () => void;
  onAssign: (id: string) => void;
}) {
  const pendingTasks = tasks.filter((task) => task.status === "pending-assignment");
  const assignedTasks = tasks.filter((task) => task.status !== "pending-assignment");

  const renderTaskCard = (task: FlightTask) => (
    <div key={task.id} className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{task.type}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
        </div>
        <FlightTaskStatusBadge status={task.status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <MapPin size={11} />巡检位置
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: "var(--foreground)" }}>{task.location}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: "var(--accent)" }}>{task.gps}</div>
        </div>
        <div>
          <div className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <Clock size={11} />指定截止时间
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: "var(--caution)" }}>{task.deadline}</div>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{task.requirement}</p>

      <div className="flex items-center justify-between gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
          {task.workOrderId ? `关联工单：${task.workOrderId}` : "自主巡检任务"}
          {task.assignedTeamName ? ` · ${task.assignedTeamName}` : ""}
        </div>
        {task.status === "pending-assignment" ? (
          <button
            type="button"
            onClick={() => onAssign(task.id)}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 flex-shrink-0"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <Users size={12} />
            指派团队
          </button>
        ) : (
          <span className="text-xs flex-shrink-0" style={{ color: "var(--primary)" }}>{task.assignedLeader}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-4 flex-shrink-0 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "待指派", value: pendingTasks.length, color: "var(--caution)", bg: "rgba(255,224,71,0.12)" },
            { label: "已派发", value: assignedTasks.length, color: "var(--primary)", bg: "rgba(0,107,255,0.10)" },
            { label: "团队数", value: droneTeams.length, color: "var(--success)", bg: "rgba(53,208,127,0.10)" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: item.bg }}>
              <div className="font-bold" style={{ fontSize: 22, color: item.color }}>{item.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="w-full rounded-xl p-4 flex items-center gap-3 text-left active:opacity-80"
          style={{ background: "linear-gradient(135deg, rgba(0,107,255,0.12), rgba(95,180,255,0.10))", border: "1px solid rgba(0,107,255,0.26)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)", color: "#fff" }}>
            <Plus size={20} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>创建飞行任务</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>录入巡检位置、GPS、指定截止时间和拍摄要求</div>
          </div>
          <ChevronRight size={16} color="var(--primary)" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>待指派飞行任务</h3>
            <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(255,224,71,0.14)", color: "var(--caution)" }}>
              {pendingTasks.length} 项
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map(renderTaskCard)}
            {pendingTasks.length === 0 && (
              <div className="rounded-xl p-6 text-center text-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                暂无待指派飞行任务
              </div>
            )}
          </div>
        </section>

        {assignedTasks.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>已派发飞行任务</h3>
            <div className="space-y-3">
              {assignedTasks.map(renderTaskCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function FlightTaskCreatePage({
  onBack,
  onCreate,
  initialTask,
}: {
  onBack: () => void;
  onCreate: (task: FlightTask) => void;
  initialTask?: Partial<FlightTask> | null;
}) {
  const [location, setLocation] = useState(initialTask?.location ?? "B区基坑-东侧");
  const [gps, setGps] = useState(initialTask?.gps ?? "30.567890, 114.305678");
  const [deadline, setDeadline] = useState("2025-06-12T16:00");
  const [requirement, setRequirement] = useState(initialTask?.requirement ?? "对指定区域进行飞拍巡检，回传全景、近景和带GPS水印的影像资料。");
  const canSubmit = location.trim() && gps.trim() && deadline && requirement.trim();

  const submit = () => {
    if (!canSubmit) return;
    const normalizedDeadline = deadline.replace("T", " ");
    onCreate({
      id: `FT-${Date.now().toString().slice(-8)}`,
      type: initialTask?.type ?? "飞行巡检任务",
      location,
      gps,
      deadline: normalizedDeadline,
      status: "pending-assignment",
      supervisorName: "李建国",
      requirement,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <NavBar title="创建飞行任务" subtitle="巡检位置、截止时间与拍摄要求" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <MapPin size={17} color="var(--primary)" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>巡检位置信息</h3>
          </div>
          <label className="block">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>巡检位置</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2.5 outline-none text-sm"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </label>
          <label className="block">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>GPS坐标</span>
            <input
              value={gps}
              onChange={(event) => setGps(event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2.5 outline-none text-sm font-mono"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </label>
          <label className="block">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>指定截止时间</span>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2.5 outline-none text-sm"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </label>
        </div>

        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>拍摄要求</div>
          <textarea
            value={requirement}
            onChange={(event) => setRequirement(event.target.value)}
            rows={5}
            className="w-full rounded-xl p-3 text-sm resize-none outline-none"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{
            background: canSubmit ? "var(--primary)" : "var(--secondary)",
            color: canSubmit ? "#fff" : "var(--muted-foreground)",
          }}
        >
          创建并进入待指派
        </button>
      </div>
    </div>
  );
}

function AssignFlightTaskModal({
  task,
  onClose,
  onAssigned,
}: {
  task: FlightTask;
  onClose: () => void;
  onAssigned: (teamId: string, taskId: string) => void;
}) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const selectedTeamInfo = droneTeams.find((team) => team.id === selectedTeam);

  const submit = () => {
    if (!selectedTeam) return;
    onAssigned(selectedTeam, task.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <NavBar title="派发飞行任务" onBack={onClose} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(53,208,127,0.15)" }}>
            <CheckCircle2 size={32} color="var(--success)" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>派发成功</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              已通知{selectedTeamInfo?.leader ?? "飞手团队负责人"}分配团队飞手，会话已开启
            </div>
          </div>
          <button onClick={onClose} className="mt-4 px-8 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--primary)", color: "#fff" }}>
            完成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <NavBar title="派发飞行任务" subtitle={task.id} onBack={onClose} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(0,107,255,0.08)", border: "1px solid rgba(0,107,255,0.22)" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--primary)" }}>待派发任务</div>
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{task.type}</div>
          <div className="flex items-center gap-1 mt-2" style={{ color: "var(--muted-foreground)" }}>
            <MapPin size={12} /><span style={{ fontSize: 12 }}>{task.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1" style={{ color: "var(--caution)" }}>
            <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {task.deadline}</span>
          </div>
          <p className="text-xs leading-relaxed mt-2 pt-2" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
            {task.requirement}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>选择飞行团队</h3>
          <div className="space-y-2">
            {droneTeams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setSelectedTeam(team.id)}
                className="w-full rounded-xl p-4 text-left transition-all"
                style={{
                  background: selectedTeam === team.id ? "rgba(0,107,255,0.12)" : "var(--card)",
                  border: `1.5px solid ${selectedTeam === team.id ? "var(--primary)" : "var(--border)"}`,
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
                      background: team.status === "待命" ? "rgba(53,208,127,0.15)" : "rgba(0,107,255,0.12)",
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
          type="button"
          disabled={!selectedTeam}
          onClick={submit}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{
            background: selectedTeam ? "var(--primary)" : "var(--secondary)",
            color: selectedTeam ? "#fff" : "var(--muted-foreground)",
          }}
        >
          确认派发
        </button>
      </div>
    </div>
  );
}

function ReReviewDetail({
  workOrder,
  result,
  onBack,
  onDecision,
}: {
  workOrder: WorkOrder;
  result?: "approved" | "rejected";
  onBack: () => void;
  onDecision: (id: string, decision: "approved" | "rejected", note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [localResult, setLocalResult] = useState<"approved" | "rejected" | undefined>(result);
  const materials = workOrder.reviewMaterials;

  const submitDecision = (decision: "approved" | "rejected") => {
    setLocalResult(decision);
    onDecision(workOrder.id, decision, note);
  };

  if (!materials) {
    return (
      <div className="flex flex-col h-full">
        <NavBar title="工单复审" subtitle={workOrder.id} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            飞手复拍资料尚未回传，请先指派飞行团队完成复核飞拍。
          </div>
        </div>
      </div>
    );
  }

  const materialList = [
    { key: "violation", data: materials.violation, accent: "var(--danger)" },
    { key: "rectification", data: materials.rectification, accent: "var(--caution)" },
    { key: "drone", data: materials.drone, accent: "var(--primary)" },
  ];

  return (
    <div className="flex flex-col h-full">
      <NavBar title="工单复审" subtitle={workOrder.id} onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{workOrder.type}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {workOrder.location} · {workOrder.unit}
              </div>
            </div>
            {localResult ? (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: localResult === "approved" ? "var(--success)" : "var(--danger)",
                  color: "#fff",
                }}
              >
                {localResult === "approved" ? "复审通过" : "复审驳回"}
              </span>
            ) : (
              <StatusBadge status="re-review" small />
            )}
          </div>
          <div className="rounded-lg p-3 text-xs leading-relaxed"
            style={{ background: "rgba(0,107,255,0.08)", color: "var(--secondary-foreground)" }}>
            请对比同一位置的初次违规资料、施工整改反馈资料和飞手复拍资料，判断违规场景是否仍然存在。
          </div>
        </div>

        <div className="space-y-3">
          {materialList.map((item, index) => (
            <div key={item.key} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="relative">
                <img src={item.data.img} alt={item.data.title} className="w-full object-cover" style={{ height: 132 }} />
                <div className="absolute left-3 top-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: item.accent, color: "#fff" }}>
                  {index + 1}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{item.data.title}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.data.time}</div>
                </div>
                <p className="text-xs leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {item.data.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!localResult && (
          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>复审意见</div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="可填写通过或驳回原因，例如仍有人员未规范佩戴安全绳..."
              className="w-full rounded-xl p-3 text-sm resize-none outline-none"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
        )}
      </div>

      {!localResult && (
        <div className="p-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => submitDecision("rejected")}
            className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: "var(--danger)", color: "#fff" }}
          >
            <XCircle size={16} />
            驳回整改
          </button>
          <button
            onClick={() => submitDecision("approved")}
            className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: "var(--success)", color: "#fff" }}
          >
            <CheckCircle2 size={16} />
            复审通过
          </button>
        </div>
      )}
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

function WorkOrderTab({
  onReReview,
  reviewResults,
}: {
  onReReview: (id: string) => void;
  reviewResults: Record<string, "approved" | "rejected">;
}) {
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
              <div className="min-w-0">
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>责任单位: {wo.unit}</span>
                {wo.status === "re-review" && (
                  <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                    {reviewResults[wo.id] === "approved" && "复审通过，流程结束"}
                    {reviewResults[wo.id] === "rejected" && "复审驳回，需重新整改"}
                    {!reviewResults[wo.id] && wo.reviewStage === "ready-review" && "飞手影像已回传，待监理复审"}
                    {!reviewResults[wo.id] && wo.reviewStage === "needs-assignment" && "待复核资料回传"}
                  </div>
                )}
              </div>
              {wo.status === "re-review" && reviewResults[wo.id] === "approved" && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "var(--success)", color: "#fff" }}>
                  已通过
                </span>
              )}
              {wo.status === "re-review" && reviewResults[wo.id] === "rejected" && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "var(--danger)", color: "#fff" }}>
                  已驳回
                </span>
              )}
              {wo.status === "re-review" && !reviewResults[wo.id] && wo.reviewStage === "ready-review" && (
                <button
                  onClick={() => onReReview(wo.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 flex-shrink-0"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  <CheckCircle2 size={12} />
                  进入复审
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

const exportModules = [
  { key: "workorders", label: "整改工单记录", desc: "责任单位、状态、截止时间、复审结果" },
  { key: "metrics", label: "看板统计指标", desc: "整改率、违规类型分布、整体评分" },
];

function HistoryExportPage({ onBack }: { onBack: () => void }) {
  const [rangeMode, setRangeMode] = useState<"single" | "range">("single");
  const [startMonth, setStartMonth] = useState("2025-06");
  const [endMonth, setEndMonth] = useState("2025-06");
  const [format, setFormat] = useState<"xlsx" | "pdf" | "csv">("xlsx");
  const [selectedModules, setSelectedModules] = useState(exportModules.map((item) => item.key));
  const [exported, setExported] = useState(false);

  const normalizedEndMonth = rangeMode === "single" ? startMonth : endMonth;
  const hasMonthRange = Boolean(startMonth && normalizedEndMonth);
  const rangeInvalid = !hasMonthRange || normalizedEndMonth < startMonth;
  const startDate = hasMonthRange ? new Date(`${startMonth}-01T00:00:00`) : null;
  const endDate = hasMonthRange ? new Date(`${normalizedEndMonth}-01T00:00:00`) : null;
  const monthCount = rangeInvalid || !startDate || !endDate ? 0 : ((endDate.getFullYear() - startDate.getFullYear()) * 12) + endDate.getMonth() - startDate.getMonth() + 1;
  const estimatedRecords = monthCount * (selectedModules.length * 36 + 12);
  const selectedLabels = exportModules
    .filter((item) => selectedModules.includes(item.key))
    .map((item) => item.label);
  const fileName = `云百智航_历史监管数据_${startMonth}_${normalizedEndMonth}.${format}`;
  const canExport = !rangeInvalid && selectedModules.length > 0;

  const toggleModule = (key: string) => {
    setExported(false);
    setSelectedModules((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const downloadFile = () => {
    const content = [
      "云百智航历史监管数据导出",
      `时间范围,${startMonth} 至 ${normalizedEndMonth}`,
      `导出格式,${format.toUpperCase()}`,
      `数据模块,${selectedLabels.join(" / ")}`,
      `预计记录,${estimatedRecords} 条`,
      "说明,原型环境生成模拟导出文件",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (!canExport) return;
    setExported(true);
  };

  return (
    <div className="flex flex-col h-full">
      <NavBar title="历史数据导出" subtitle="按月份导出监管数据" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,107,255,0.10)", color: "var(--primary)" }}>
              <CalendarRange size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>导出月份</div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>支持单月或连续月份段</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { key: "single", label: "指定月份" },
              { key: "range", label: "月份段" },
            ].map((item) => {
              const active = rangeMode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setRangeMode(item.key as "single" | "range");
                    setExported(false);
                  }}
                  className="py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: active ? "var(--primary)" : "var(--secondary)",
                    color: active ? "#fff" : "var(--foreground)",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>开始月份</span>
              <input
                type="month"
                value={startMonth}
                onChange={(event) => {
                  setStartMonth(event.target.value);
                  if (rangeMode === "single") setEndMonth(event.target.value);
                  setExported(false);
                }}
                className="w-full rounded-xl px-3 py-2.5 outline-none text-sm"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>结束月份</span>
              <input
                type="month"
                value={normalizedEndMonth}
                disabled={rangeMode === "single"}
                onChange={(event) => {
                  setEndMonth(event.target.value);
                  setExported(false);
                }}
                className="w-full rounded-xl px-3 py-2.5 outline-none text-sm"
                style={{
                  background: rangeMode === "single" ? "rgba(100,115,134,0.08)" : "var(--secondary)",
                  border: "1px solid var(--border)",
                  color: rangeMode === "single" ? "var(--muted-foreground)" : "var(--foreground)",
                }}
              />
            </label>
          </div>
          {rangeInvalid && (
            <div className="text-xs mt-2" style={{ color: "var(--danger)" }}>结束月份不能早于开始月份</div>
          )}
        </div>

        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <DatabaseBackup size={18} color="var(--primary)" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>数据范围</h3>
          </div>
          <div className="space-y-2">
            {exportModules.map((item) => {
              const checked = selectedModules.includes(item.key);
              return (
                <label
                  key={item.key}
                  className="flex items-start gap-3 rounded-xl p-3 transition-all"
                  style={{
                    background: checked ? "rgba(0,107,255,0.12)" : "var(--secondary)",
                    border: `1.5px solid ${checked ? "var(--primary)" : "rgba(100,115,134,0.24)"}`,
                    boxShadow: checked ? "0 8px 18px rgba(0,107,255,0.10)" : "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleModule(item.key)}
                    className="sr-only"
                  />
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: checked ? "var(--primary)" : "#fff",
                      border: `1px solid ${checked ? "var(--primary)" : "var(--border)"}`,
                      color: "#fff",
                    }}
                  >
                    {checked && <CheckCircle2 size={14} />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold" style={{ color: checked ? "var(--primary)" : "var(--foreground)" }}>{item.label}</span>
                    <span className="block text-xs mt-0.5" style={{ color: checked ? "var(--foreground)" : "var(--muted-foreground)" }}>{item.desc}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <FileSpreadsheet size={18} color="var(--success)" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>导出格式</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "xlsx", label: "Excel" },
              { key: "pdf", label: "PDF" },
              { key: "csv", label: "CSV" },
            ].map((item) => {
              const active = format === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setFormat(item.key as "xlsx" | "pdf" | "csv");
                    setExported(false);
                  }}
                  className="py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: active ? "rgba(53,208,127,0.16)" : "var(--secondary)",
                    color: active ? "var(--success)" : "var(--foreground)",
                    border: `1px solid ${active ? "rgba(53,208,127,0.36)" : "var(--border)"}`,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "rgba(47,125,246,0.08)", border: "1px solid rgba(47,125,246,0.22)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>导出预览</div>
            <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(0,107,255,0.10)", color: "var(--primary)" }}>
              {monthCount} 个月
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>时间范围</div>
              <div className="text-sm font-semibold mt-1" style={{ color: "var(--foreground)" }}>{startMonth} 至 {normalizedEndMonth}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>预计记录</div>
              <div className="text-sm font-semibold mt-1" style={{ color: "var(--foreground)" }}>{estimatedRecords} 条</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>文件名</div>
              <div className="text-xs font-mono mt-1 truncate" style={{ color: "var(--primary)" }}>{fileName}</div>
            </div>
          </div>
        </div>

        {exported && (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(53,208,127,0.10)", border: "1px solid rgba(53,208,127,0.30)" }}>
            <CheckCircle2 size={22} color="var(--success)" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>导出文件已生成</div>
              <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{fileName}</div>
            </div>
            <button
              type="button"
              onClick={downloadFile}
              className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1"
              style={{ background: "var(--success)", color: "#fff" }}
            >
              <Download size={13} />
              下载
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}>
        <button
          type="button"
          disabled={!canExport}
          onClick={handleExport}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          style={{
            background: canExport ? "var(--primary)" : "var(--secondary)",
            color: canExport ? "#fff" : "var(--muted-foreground)",
          }}
        >
          <Download size={16} />
          生成导出文件
        </button>
      </div>
    </div>
  );
}

function DashboardTab({ onExport }: { onExport: () => void }) {
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
      <button
        type="button"
        onClick={onExport}
        className="w-full rounded-xl p-4 flex items-center gap-3 text-left active:opacity-80"
        style={{ background: "linear-gradient(135deg, rgba(0,107,255,0.10), rgba(53,208,127,0.08))", border: "1px solid rgba(0,107,255,0.22)" }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary)", color: "#fff" }}>
          <Download size={21} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>历史数据导出</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>导出指定月份或月份段内的监管数据</div>
        </div>
        <ChevronRight size={16} color="var(--primary)" />
      </button>

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredThreads = threads.filter((thread) => {
    const keyword = query.trim();
    if (!keyword) return true;
    return `${thread.teamName}${thread.leader}${thread.workOrder ?? ""}`.includes(keyword);
  });
  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];

  const openThread = (threadId: string) => {
    setActiveId(threadId);
    setSidebarOpen(false);
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
    <div className="flex-1 overflow-hidden flex flex-col relative">
      {!sidebarOpen && (
        <button
          type="button"
          title="打开会话侧栏"
          aria-label="打开会话侧栏"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-0 top-4 z-20 h-11 w-8 rounded-r-xl flex items-center justify-center active:opacity-80"
          style={{ background: "var(--primary)", color: "#fff", boxShadow: "0 8px 18px rgba(0,107,255,0.22)" }}
        >
          <PanelLeftOpen size={17} />
        </button>
      )}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="关闭会话侧栏"
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 z-30"
          style={{ background: "rgba(15,23,42,0.18)" }}
        />
      )}

      <aside
        className="absolute left-0 top-0 bottom-0 z-40 flex flex-col transition-transform duration-200"
        style={{
          width: "82%",
          maxWidth: 328,
          background: "var(--background)",
          borderRight: "1px solid var(--border)",
          boxShadow: sidebarOpen ? "14px 0 32px rgba(15,23,42,0.14)" : "none",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="p-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>现有会话</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              指派飞行团队后自动开启会话
            </div>
          </div>
          <button
            type="button"
            title="收起侧栏"
            aria-label="收起侧栏"
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 rounded-lg flex items-center justify-center active:opacity-70"
            style={{ background: "var(--secondary)", color: "var(--foreground)" }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="px-4 pt-3 flex items-center gap-2 flex-shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "rgba(0,107,255,0.10)", color: "var(--primary)" }}>
            {threads.length} 个已开启
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "rgba(255,122,0,0.12)", color: "var(--caution)" }}>
            {threads.reduce((sum, thread) => sum + thread.unread, 0)} 条未读
          </span>
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl px-3 py-2 flex-shrink-0" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <Search size={15} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索团队或负责人"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--foreground)" }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
      </aside>

      <div className="mx-4 mt-3 rounded-xl p-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <button
          type="button"
          title="切换会话"
          aria-label="切换会话"
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 active:opacity-70"
          style={{ background: "rgba(0,107,255,0.10)", color: "var(--primary)" }}
        >
          <PanelLeftOpen size={18} />
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(95,180,255,0.14)", color: "var(--accent)" }}>
          <Users size={19} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted-foreground)" }}>当前对话对象</div>
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
  onWorkOrderClick,
  onFlightTaskClick,
  onDashboardClick,
  onExportClick,
  onProfileClick,
  pendingCount,
  pendingFlightTaskCount,
  pendingReReviewCount,
}: {
  onReviewClick: () => void;
  onWorkOrderClick: () => void;
  onFlightTaskClick: () => void;
  onDashboardClick: () => void;
  onExportClick: () => void;
  onProfileClick: () => void;
  pendingCount: number;
  pendingFlightTaskCount: number;
  pendingReReviewCount: number;
}) {
  const overviewItems = [
    {
      label: "待审核图片",
      desc: "AI告警确认",
      value: pendingCount,
      icon: <Camera size={18} />,
      color: "var(--caution)",
      bg: "rgba(255,224,71,0.16)",
      border: "rgba(255,177,0,0.32)",
      action: onReviewClick,
    },
    {
      label: "待指派任务",
      desc: "飞行任务派发",
      value: pendingFlightTaskCount,
      icon: <Navigation size={18} />,
      color: "var(--primary)",
      bg: "rgba(0,107,255,0.10)",
      border: "rgba(0,107,255,0.22)",
      action: onFlightTaskClick,
    },
    {
      label: "待复审工单",
      desc: "影像比对复核",
      value: pendingReReviewCount,
      icon: <ClipboardList size={18} />,
      color: "var(--danger)",
      bg: "rgba(255,74,74,0.10)",
      border: "rgba(255,74,74,0.22)",
      action: onWorkOrderClick,
    },
  ];

  const secondaryEntries = [
    {
      label: "数据看板",
      desc: "项目指标、趋势与整改效率",
      icon: <PieChart size={20} />,
      color: "var(--success)",
      bg: "rgba(53,208,127,0.12)",
      action: onDashboardClick,
    },
    {
      label: "历史数据导出",
      desc: "按月份导出整改工单与看板指标",
      icon: <Download size={20} />,
      color: "var(--primary)",
      bg: "rgba(0,107,255,0.10)",
      action: onExportClick,
    },
    {
      label: "我的",
      desc: "账号信息、监管项目与团队概况",
      icon: <User size={20} />,
      color: "var(--foreground)",
      bg: "rgba(100,115,134,0.10)",
      action: onProfileClick,
    },
  ];

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

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>工作概览</h3>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>今日待办</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {overviewItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="min-h-[108px] rounded-xl p-3 active:opacity-70 text-left flex flex-col justify-between"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.78)", color: item.color }}>
                  {item.icon}
                </div>
                <ChevronRight size={14} style={{ color: item.color }} />
              </div>
              <div>
                <div className="font-bold leading-none" style={{ fontSize: 26, color: item.color }}>{item.value}</div>
                <div className="text-xs font-semibold mt-1 leading-tight" style={{ color: "var(--foreground)" }}>{item.label}</div>
                <div className="mt-0.5 leading-tight" style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>次级入口</h3>
        <div className="space-y-2">
          {secondaryEntries.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full rounded-xl p-3 active:opacity-70 text-left flex items-center gap-3"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg, color: item.color }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{item.label}</div>
              <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{item.desc}</div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted-foreground)" }} />
          </button>
          ))}
        </div>
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

function SupervisorProfileTab() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold"
        style={{ background: "rgba(0,107,255,0.12)", color: "var(--primary)", fontSize: 28 }}>李</div>
      <div className="text-center">
        <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>李建国</div>
        <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>领导监理 · 阳光城 A-C地块</div>
      </div>
      <div className="w-full rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {[
          { label: "监管项目", value: "阳光城 A-C地块" },
          { label: "待审核图片", value: `${pendingImages.length} 条` },
          { label: "整改工单", value: `${workOrders.length} 单` },
          { label: "飞行团队", value: `${droneTeams.length} 支` },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{item.label}</span>
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Exported Supervisor App ──────────────────────────────────

export function SupervisorApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [detail, setDetail] = useState<typeof pendingImages[0] | null>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [reReviewId, setReReviewId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [flightTasks, setFlightTasks] = useState<FlightTask[]>(initialFlightTasks);
  const [creatingFlightTask, setCreatingFlightTask] = useState(false);
  const [flightTaskDraft, setFlightTaskDraft] = useState<Partial<FlightTask> | null>(null);
  const [assigningFlightTaskId, setAssigningFlightTaskId] = useState<string | null>(null);
  const [reviewResults, setReviewResults] = useState<Record<string, "approved" | "rejected">>({});
  const [messageThreads, setMessageThreads] = useState<SupervisorLeaderThread[]>(supervisorLeaderThreads);
  const messageUnread = messageThreads.reduce((sum, thread) => sum + thread.unread, 0);
  const pendingFlightTaskCount = flightTasks.filter((task) => task.status === "pending-assignment").length;
  const pendingReReviewCount = workOrders.filter(
    (order) => order.status === "re-review" && order.reviewStage === "ready-review" && !reviewResults[order.id],
  ).length;

  const upsertTeamThread = (nextThread: SupervisorLeaderThread) => {
    setMessageThreads((current) => {
      const existing = current.find((thread) => thread.id === nextThread.id);
      if (!existing) return [nextThread, ...current];

      return current.map((thread) =>
        thread.id === nextThread.id
          ? {
              ...thread,
              assigned: true,
              tag: "已指派",
              workOrder: nextThread.workOrder,
              lastActive: "刚刚",
              messages: [
                ...thread.messages,
                nextThread.messages[0],
              ],
            }
          : thread,
      );
    });
  };

  const handleTeamAssigned = (teamId: string, workOrderId: string) => {
    const nextThread = createAssignedLeaderThread(teamId, workOrderId);
    if (!nextThread) return;

    upsertTeamThread(nextThread);
    setActiveTab("message");
  };

  const handleFlightTaskCreated = (task: FlightTask) => {
    setFlightTasks((current) => [task, ...current]);
    setCreatingFlightTask(false);
    setFlightTaskDraft(null);
    setActiveTab("flight");
  };

  const openFlightTaskCreate = (draft?: Partial<FlightTask>) => {
    setFlightTaskDraft(draft ?? null);
    setCreatingFlightTask(true);
  };

  const handleFlightTaskAssigned = (teamId: string, taskId: string) => {
    const team = droneTeams.find((item) => item.id === teamId);
    const task = flightTasks.find((item) => item.id === taskId);
    if (!team || !task) return;

    setFlightTasks((current) =>
      current.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status: "assigned",
              assignedTeamId: team.id,
              assignedTeamName: team.name,
              assignedLeader: team.leader,
              assignedAt: "刚刚",
            }
          : item,
      ),
    );

    const nextThread = createAssignedLeaderThread(
      teamId,
      taskId,
      `${team.leader}，飞行任务 ${taskId} 已派发给 ${team.name}。位置：${task.location}，截止：${task.deadline}，请安排飞手执行并回传影像资料。`,
    );
    if (nextThread) upsertTeamThread(nextThread);
  };

  const handleReReviewDecision = (id: string, decision: "approved" | "rejected") => {
    setReviewResults((current) => ({ ...current, [id]: decision }));
  };

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "workorder", label: "工单审核", icon: <ClipboardList size={20} /> },
    { key: "review", label: "图片审核", icon: <Camera size={20} />, badge: pendingImages.length },
    { key: "flight", label: "指派任务", icon: <Navigation size={20} />, badge: pendingFlightTaskCount },
    { key: "message", label: "消息", icon: <MessageCircle size={20} />, badge: messageUnread },
  ];
  const pageTitles: Record<string, string> = {
    home: "首页",
    flight: "指派任务",
    message: "消息",
    profile: "我的",
    review: "图片审核",
    workorder: "工单审核",
    dashboard: "数据看板",
  };
  const bottomActive = tabs.some((tab) => tab.key === activeTab) ? activeTab : "home";

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

  if (creatingFlightTask) {
    return (
      <FlightTaskCreatePage
        onBack={() => {
          setCreatingFlightTask(false);
          setFlightTaskDraft(null);
        }}
        onCreate={handleFlightTaskCreated}
        initialTask={flightTaskDraft}
      />
    );
  }

  if (assigningFlightTaskId) {
    const task = flightTasks.find((item) => item.id === assigningFlightTaskId);
    if (task) {
      return (
        <AssignFlightTaskModal
          task={task}
          onClose={() => setAssigningFlightTaskId(null)}
          onAssigned={handleFlightTaskAssigned}
        />
      );
    }
  }

  if (reReviewId) {
    const workOrder = workOrders.find((item) => item.id === reReviewId);
    if (workOrder) {
      return (
        <ReReviewDetail
          workOrder={workOrder}
          result={reviewResults[workOrder.id]}
          onBack={() => setReReviewId(null)}
          onDecision={(id, decision) => handleReReviewDecision(id, decision)}
        />
      );
    }
  }

  if (exporting) {
    return <HistoryExportPage onBack={() => setExporting(false)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && (
        <NavBar
          title={pageTitles[activeTab] ?? ""}
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
          onWorkOrderClick={() => setActiveTab("workorder")}
          onFlightTaskClick={() => setActiveTab("flight")}
          onDashboardClick={() => setActiveTab("dashboard")}
          onExportClick={() => setExporting(true)}
          onProfileClick={() => setActiveTab("profile")}
          pendingCount={pendingImages.length}
          pendingFlightTaskCount={pendingFlightTaskCount}
          pendingReReviewCount={pendingReReviewCount}
        />
      )}
        {activeTab === "flight" && (
          <FlightTaskTab
            tasks={flightTasks}
            onCreate={() => openFlightTaskCreate()}
            onAssign={(id) => setAssigningFlightTaskId(id)}
          />
        )}
        {activeTab === "review" && (
          <ReviewTab onOpenDetail={(img) => setDetail(img)} />
        )}
        {activeTab === "workorder" && (
          <WorkOrderTab
            onReReview={(id) => setReReviewId(id)}
            reviewResults={reviewResults}
          />
        )}
        {activeTab === "message" && <MessageTab threads={messageThreads} setThreads={setMessageThreads} />}
        {activeTab === "dashboard" && <DashboardTab onExport={() => setExporting(true)} />}
        {activeTab === "profile" && <SupervisorProfileTab />}
      </div>
      <BottomTab tabs={tabs} active={bottomActive} onChange={setActiveTab} />
    </div>
  );
}
