import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import {
  LayoutGrid, ClipboardList, User,
  MapPin, Clock, ChevronRight,
  Navigation, Users, CheckCircle2, AlertTriangle,
  Send, Shield, PanelLeftOpen, PanelLeftClose,
  RotateCcw,
} from "lucide-react";

type Assignment = {
  id: string;
  workOrderId: string;
  type: string;
  location: string;
  gps: string;
  deadline: string;
  supervisorName: string;
  requirement: string;
};

const assignments: Assignment[] = [
  {
    id: "ASSIGN-001",
    workOrderId: "WO-20250612-002",
    type: "整改复核飞拍",
    location: "B区基坑-东侧",
    gps: "30.567890, 114.305678",
    deadline: "2025-06-12 16:00",
    supervisorName: "李监理",
    requirement: "对B区基坑东侧高空作业区域进行复核拍摄，重点拍摄作业人员安全绳佩戴情况。",
  },
  {
    id: "ASSIGN-004",
    workOrderId: "WO-20250612-005",
    type: "临边防护复核",
    location: "C区4号楼-临边作业面",
    gps: "30.566218, 114.307912",
    deadline: "2025-06-13 16:00",
    supervisorName: "李监理",
    requirement: "复核临边护栏、警示标识和作业人员活动区域，回传同位置全景与近景资料。",
  },
];

type TeamTaskStatus = "pending-acceptance" | "accepted" | "rejected" | "completed";

type TeamFlightTask = Assignment & {
  taskId: string;
  assignedPilot: string;
  assignedAt: string;
  taskStatus: TeamTaskStatus;
  rejectedReason?: string;
  completedAt?: string;
};

type AssignSource = Assignment & Partial<Pick<TeamFlightTask, "taskId" | "assignedPilot" | "taskStatus" | "rejectedReason">>;

const initialTeamTasks: TeamFlightTask[] = [
  {
    id: "ASSIGN-002",
    taskId: "TASK-20250612-002",
    workOrderId: "WO-20250612-006",
    type: "材料堆场巡查飞拍",
    location: "A区3号楼-材料堆场",
    gps: "30.568120, 114.304560",
    deadline: "2025-06-12 18:00",
    supervisorName: "李监理",
    requirement: "巡检材料堆场消防通道、临时用电和人员通行路线，回传全景与重点隐患近景。",
    assignedPilot: "王飞手",
    assignedAt: "09:40",
    taskStatus: "accepted",
  },
  {
    id: "ASSIGN-003",
    taskId: "TASK-20250612-003",
    workOrderId: "WO-20250612-007",
    type: "塔吊周边专项巡检",
    location: "A区塔吊-北侧",
    gps: "30.567210, 114.306010",
    deadline: "2025-06-12 17:30",
    supervisorName: "王监理",
    requirement: "拍摄塔吊周边材料堆放、警戒线和人员通行情况。",
    assignedPilot: "李飞手",
    assignedAt: "09:15",
    taskStatus: "rejected",
    rejectedReason: "当前正在执行上一单任务，预计无法在截止前到场。",
  },
  {
    id: "ASSIGN-005",
    taskId: "TASK-20250611-002",
    workOrderId: "WO-20250611-003",
    type: "消防通道复核",
    location: "D区施工现场",
    gps: "30.564321, 114.308765",
    deadline: "2025-06-11 15:00",
    supervisorName: "李监理",
    requirement: "D区全面巡查，重点检查消防通道畅通情况。",
    assignedPilot: "赵飞手",
    assignedAt: "昨日 10:20",
    taskStatus: "completed",
    completedAt: "昨日 14:36",
  },
];

const exceptionFeedbacks = [
  {
    id: "EX-001",
    taskId: "TASK-20250612-008",
    pilotName: "王飞手",
    type: "整改复核飞拍",
    location: "B区基坑-东侧",
    time: "2025-06-12 10:18",
    reason: "现场东侧阵风较大，飞行姿态不稳定，暂不满足安全起飞条件。",
    status: "待处理",
  },
  {
    id: "EX-002",
    taskId: "TASK-20250611-006",
    pilotName: "赵飞手",
    type: "临边防护复核",
    location: "C区4号楼",
    time: "2025-06-11 16:05",
    reason: "施工升降机区域临时封闭，无法进入安全起飞点。",
    status: "已记录",
  },
];

const pilots = [
  { name: "孙大志", role: "队长", status: "available" as const, hours: 156, tasks: 42, isLeader: true },
  { name: "王飞手", role: "飞手", status: "available" as const, hours: 128, tasks: 34 },
  { name: "李飞手", role: "飞手", status: "busy" as const, hours: 96, tasks: 27 },
  { name: "赵飞手", role: "飞手", status: "available" as const, hours: 72, tasks: 19 },
];

const assignablePilots = pilots.filter((pilot) => !pilot.isLeader);

type LeaderChatMessage = {
  id: string;
  from: "me" | "supervisor";
  text: string;
  time: string;
};

type LeaderSupervisorThread = {
  id: string;
  supervisorName: string;
  project: string;
  source: string;
  status: "online" | "offline";
  unread: number;
  lastActive: string;
  messages: LeaderChatMessage[];
};

const leaderSupervisorThreads: LeaderSupervisorThread[] = [
  {
    id: "sup-li",
    supervisorName: "李建国",
    project: "阳光城 A-C地块",
    source: "WO-20250612-002",
    status: "online",
    unread: 1,
    lastActive: "刚刚",
    messages: [
      { id: "m1", from: "supervisor", text: "孙队长，B区基坑复核飞拍今天16:00前需要回传，请优先安排。", time: "09:26" },
      { id: "m2", from: "me", text: "收到，我会指派可用飞手并同步进展。", time: "09:28" },
      { id: "m3", from: "me", text: "现场东侧风速偏高，我们会先做安全确认。", time: "09:31" },
    ],
  },
  {
    id: "sup-wang",
    supervisorName: "王若琳",
    project: "阳光城 A-C地块",
    source: "临时巡检通知",
    status: "offline",
    unread: 0,
    lastActive: "昨日17:40",
    messages: [
      { id: "m1", from: "supervisor", text: "明天上午塔吊周边会做一次专项巡检，如需飞拍我会在这里同步。", time: "昨日 17:22" },
      { id: "m2", from: "me", text: "好的，我们上午保留一组飞手待命。", time: "昨日 17:40" },
    ],
  },
];

/*
  未主动发起会话的监理不在飞手团队负责人端展示。
  后续如果要做“监理通讯录”，也应由监理发起授权后再进入可对话列表。
*/

function TeamTaskStatusBadge({ status }: { status: TeamTaskStatus }) {
  const map: Record<TeamTaskStatus, { label: string; bg: string; color: string }> = {
    "pending-acceptance": { label: "待飞手确认", bg: "rgba(255,224,71,0.16)", color: "var(--caution)" },
    accepted: { label: "执行中", bg: "rgba(0,107,255,0.12)", color: "var(--primary)" },
    rejected: { label: "已拒绝", bg: "rgba(255,74,74,0.12)", color: "var(--danger)" },
    completed: { label: "已完成", bg: "rgba(53,208,127,0.14)", color: "var(--success)" },
  };
  const item = map[status];

  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: item.bg, color: item.color }}>
      {item.label}
    </span>
  );
}

function AssignTaskModal({
  source,
  onClose,
  onAssignComplete,
}: {
  source: AssignSource;
  onClose: () => void;
  onAssignComplete: (source: AssignSource, pilotName: string) => void;
}) {
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const selectedPilotInfo = assignablePilots.find((pilot) => pilot.name === selectedPilot);
  const isReassign = Boolean(source.taskId);

  const handleSubmit = () => {
    if (!selectedPilot) return;
    onAssignComplete(source, selectedPilot);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <NavBar title={isReassign ? "再次指派" : "指派任务"} onBack={onClose} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(53,208,127,0.15)" }}>
            <CheckCircle2 size={32} color="var(--success)" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>指派成功</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              已向{selectedPilotInfo?.name ?? selectedPilot}下发飞拍任务，等待飞手确认
            </div>
          </div>
          <button onClick={onClose} className="mt-4 px-8 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--primary)", color: "#fff" }}>完成</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <NavBar title={isReassign ? "再次指派任务" : "指派飞手任务"} subtitle={source.workOrderId} onBack={onClose} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(0,107,255,0.08)", border: "1px solid rgba(0,107,255,0.2)" }}>
          <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--accent)" }}>监理派发任务</h3>
          <div className="space-y-1.5">
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{source.type}</div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{source.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
              <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {source.deadline}</span>
            </div>
          </div>
          <p className="text-xs mt-2 pt-2 leading-relaxed" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
            {source.requirement}
          </p>
        </div>

        {source.rejectedReason && (
          <div className="rounded-xl p-4" style={{ background: "rgba(255,74,74,0.08)", border: "1px solid rgba(255,74,74,0.22)" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "var(--danger)" }}>上次拒绝原因</div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {source.assignedPilot}：{source.rejectedReason}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>选择执行飞手</h3>
          <div className="space-y-2">
            {assignablePilots.map((pilot) => (
              <button
                key={pilot.name}
                disabled={pilot.status === "busy"}
                onClick={() => setSelectedPilot(pilot.name)}
                className="w-full rounded-xl p-4 text-left transition-all"
                style={{
                  background: selectedPilot === pilot.name ? "rgba(0,107,255,0.12)" : "var(--card)",
                  border: `1px solid ${selectedPilot === pilot.name ? "var(--primary)" : "var(--border)"}`,
                  opacity: pilot.status === "busy" ? 0.5 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                      style={{ background: "var(--secondary)", color: "var(--accent)" }}>
                      {pilot.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{pilot.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {pilot.role} · {pilot.hours}h · {pilot.tasks}次任务
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: pilot.status === "available" ? "rgba(53,208,127,0.15)" : "rgba(255,224,71,0.12)",
                        color: pilot.status === "available" ? "var(--success)" : "var(--warning)",
                      }}>
                      {pilot.status === "available" ? "空闲" : "执行中"}
                    </span>
                    {selectedPilot === pilot.name && <CheckCircle2 size={16} color="var(--primary)" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>补充说明（可选）</div>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="向飞手补充说明任务注意事项..."
            className="w-full rounded-xl p-3 text-sm resize-none outline-none"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          disabled={!selectedPilot}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{
            background: selectedPilot ? "var(--primary)" : "var(--secondary)",
            color: selectedPilot ? "#fff" : "var(--muted-foreground)",
          }}
        >
          确认指派
        </button>
      </div>
    </div>
  );
}

function LeaderHomeTab({
  pendingAssignments,
  teamTasks,
  exceptionCount,
  onAssign,
  onTasks,
  onExceptions,
}: {
  pendingAssignments: Assignment[];
  teamTasks: TeamFlightTask[];
  exceptionCount: number;
  onAssign: (assignment: Assignment) => void;
  onTasks: () => void;
  onExceptions: () => void;
}) {
  const rejectedCount = teamTasks.filter((task) => task.taskStatus === "rejected").length;
  const activeCount = teamTasks.filter((task) => task.taskStatus === "accepted" || task.taskStatus === "pending-acceptance").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110, border: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eaf4ff 58%, #f4f7fb 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--info)" }}>飞手团队负责人</div>
          <div className="font-bold" style={{ fontSize: 18, color: "var(--foreground)" }}>你好，孙队长</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>鹰眼一队 · 可用飞手 2/3</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Users size={72} color="var(--info)" />
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-4 gap-2">
        {[
          { label: "待指派", value: pendingAssignments.length, color: "var(--caution)", bg: "rgba(255,224,71,0.12)", action: undefined },
          { label: "执行中", value: activeCount, color: "var(--primary)", bg: "rgba(0,107,255,0.10)", action: onTasks },
          { label: "被拒绝", value: rejectedCount, color: "var(--danger)", bg: "rgba(255,74,74,0.10)", action: onTasks },
          { label: "异常", value: exceptionCount, color: "var(--caution)", bg: "rgba(255,122,0,0.12)", action: onExceptions },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="rounded-xl p-3 flex flex-col items-center active:opacity-80"
            style={{ background: item.bg }}
          >
            <span className="font-bold" style={{ fontSize: 22, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>监理待指派任务</h3>
        {pendingAssignments.length === 0 && (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(53,208,127,0.12)", color: "var(--success)" }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>暂无待指派任务</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>监理派发后会在这里进入分配流程</div>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {pendingAssignments.map((assignment) => (
            <div key={assignment.id} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid rgba(0,107,255,0.24)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{assignment.type}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{assignment.workOrderId}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,224,71,0.15)", color: "var(--caution)" }}>
                  待指派
                </span>
              </div>
              <div className="flex items-center gap-1 mb-1" style={{ color: "var(--muted-foreground)" }}>
                <MapPin size={12} /><span style={{ fontSize: 12 }}>{assignment.location}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
                  <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {assignment.deadline}</span>
                </div>
                <button
                  onClick={() => onAssign(assignment)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  指派飞手
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>团队概况</h3>
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {pilots.map((pilot) => (
            <div key={pilot.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
                  style={{ background: "var(--secondary)", color: "var(--accent)" }}>
                  {pilot.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{pilot.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{pilot.role} · {pilot.tasks}次任务</div>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: pilot.status === "available" ? "rgba(53,208,127,0.15)" : "rgba(0,107,255,0.12)",
                  color: pilot.status === "available" ? "var(--success)" : "var(--primary)",
                }}>
                {pilot.status === "available" ? "空闲" : "执行中"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignmentTab({
  pendingAssignments,
  rejectedTasks,
  onAssign,
  onReassign,
}: {
  pendingAssignments: Assignment[];
  rejectedTasks: TeamFlightTask[];
  onAssign: (assignment: Assignment) => void;
  onReassign: (task: TeamFlightTask) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {rejectedTasks.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>被拒绝任务</h3>
          <div className="space-y-3">
            {rejectedTasks.map((task) => (
              <div key={task.taskId} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid rgba(255,74,74,0.22)" }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{task.type}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.taskId}</div>
                  </div>
                  <TeamTaskStatusBadge status={task.taskStatus} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {task.assignedPilot}：{task.rejectedReason}
                </p>
                <button
                  onClick={() => onReassign(task)}
                  className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
                  style={{ background: "var(--primary)", color: "#fff" }}
                >
                  <RotateCcw size={15} />
                  再次指派
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>待指派任务</h3>
        {pendingAssignments.length === 0 ? (
          <div className="rounded-xl p-8 text-center text-sm"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
            暂无监理待指派任务
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{assignment.type}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{assignment.workOrderId}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(255,224,71,0.16)", color: "var(--caution)" }}>
                    待指派
                  </span>
                </div>
                <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <MapPin size={12} /><span style={{ fontSize: 12 }}>{assignment.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
                    <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {assignment.deadline}</span>
                  </div>
                  <button
                    onClick={() => onAssign(assignment)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: "var(--primary)", color: "#fff" }}
                  >
                    指派飞手
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TeamTaskListTab({ tasks }: { tasks: TeamFlightTask[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="rounded-xl p-4 text-left"
          style={{
            background: "var(--card)",
            border: `1px solid ${task.taskStatus === "rejected" ? "rgba(255,74,74,0.24)" : "var(--border)"}`,
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.taskId}</div>
            </div>
            <TeamTaskStatusBadge status={task.taskStatus} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>执行飞手</div>
              <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{task.assignedPilot}</div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>截止时间</div>
              <div className="text-sm font-medium" style={{ color: "var(--caution)" }}>{task.deadline}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3" style={{ color: "var(--muted-foreground)" }}>
            <MapPin size={12} /><span style={{ fontSize: 12 }}>{task.location}</span>
          </div>
          <p className="text-xs leading-relaxed mt-3 pt-3" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
            {task.taskStatus === "rejected" ? `拒绝原因：${task.rejectedReason}` : task.requirement}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExceptionFeedbackTab() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {exceptionFeedbacks.map((feedback) => (
        <div key={feedback.id} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid rgba(255,122,0,0.22)" }}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{feedback.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{feedback.taskId}</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(255,122,0,0.14)", color: "var(--caution)" }}>
              {feedback.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>反馈飞手</div>
              <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{feedback.pilotName}</div>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>反馈时间</div>
              <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{feedback.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3" style={{ color: "var(--muted-foreground)" }}>
            <MapPin size={12} /><span style={{ fontSize: 12 }}>{feedback.location}</span>
          </div>
          <div className="rounded-xl p-3 mt-3" style={{ background: "rgba(255,224,71,0.08)", border: "1px solid rgba(255,224,71,0.18)" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "var(--caution)" }}>异常说明</div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{feedback.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderMessageTab({
  threads,
  setThreads,
}: {
  threads: LeaderSupervisorThread[];
  setThreads: React.Dispatch<React.SetStateAction<LeaderSupervisorThread[]>>;
}) {
  const [activeId, setActiveId] = useState(leaderSupervisorThreads[0].id);
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const unreadCount = threads.reduce((sum, thread) => sum + thread.unread, 0);

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
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>仅显示已由监理发起的会话</div>
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
          {unreadCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: "var(--destructive)", color: "#fff" }}>
              {unreadCount} 条未读
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "rgba(0,107,255,0.10)", color: "var(--primary)" }}>
            {threads.length} 个对象
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {threads.map((thread) => {
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
                  style={{ background: "rgba(0,107,255,0.12)", color: "var(--primary)" }}>
                  {thread.supervisorName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{thread.supervisorName}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(0,176,80,0.12)", color: "var(--success)" }}>
                      可回复
                    </span>
                  </div>
                  <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                    {thread.project} · {thread.source}
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
          style={{ background: "rgba(95,180,255,0.15)", color: "var(--info)" }}>
          <Shield size={19} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted-foreground)" }}>当前对话对象</div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{activeThread.supervisorName}</div>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: activeThread.status === "online" ? "rgba(53,208,127,0.15)" : "var(--secondary)",
                color: activeThread.status === "online" ? "var(--success)" : "var(--muted-foreground)",
              }}>
              {activeThread.status === "online" ? "在线" : "离线"}
            </span>
          </div>
          <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
            {activeThread.project} · {activeThread.source}
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
              <div className="text-right mt-1" style={{ fontSize: 10, color: message.from === "me" ? "rgba(255,255,255,0.72)" : "var(--muted-foreground)" }}>
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
            placeholder="回复监理消息"
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

export function DroneLeaderApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [assigningSource, setAssigningSource] = useState<AssignSource | null>(null);
  const [handledAssignmentIds, setHandledAssignmentIds] = useState<string[]>([]);
  const [teamTasks, setTeamTasks] = useState<TeamFlightTask[]>(initialTeamTasks);
  const [messageThreads, setMessageThreads] = useState<LeaderSupervisorThread[]>(leaderSupervisorThreads);
  // 已隐藏功能：飞手队长通信未在当前版本开放入口
  // const messageUnread = messageThreads.reduce((sum, thread) => sum + thread.unread, 0);
  const pendingAssignments = assignments.filter((assignment) => !handledAssignmentIds.includes(assignment.id));
  const rejectedTasks = teamTasks.filter((task) => task.taskStatus === "rejected");

  const handleAssignComplete = (source: AssignSource, pilotName: string) => {
    if (source.taskId) {
      setTeamTasks((current) =>
        current.map((task) =>
          task.taskId === source.taskId
            ? {
                ...task,
                assignedPilot: pilotName,
                assignedAt: "刚刚",
                taskStatus: "pending-acceptance",
                rejectedReason: undefined,
              }
            : task,
        ),
      );
      return;
    }

    setHandledAssignmentIds((current) =>
      current.includes(source.id) ? current : [...current, source.id],
    );
    setTeamTasks((current) => [
      {
        ...source,
        taskId: source.id.replace("ASSIGN", "TASK"),
        assignedPilot: pilotName,
        assignedAt: "刚刚",
        taskStatus: "pending-acceptance",
      },
      ...current,
    ]);
  };

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "assign", label: "指派", icon: <Users size={20} />, badge: pendingAssignments.length + rejectedTasks.length },
    { key: "tasks", label: "任务", icon: <ClipboardList size={20} />, badge: teamTasks.filter((task) => task.taskStatus === "rejected").length },
    { key: "exceptions", label: "异常", icon: <AlertTriangle size={20} />, badge: exceptionFeedbacks.length },
    // 已隐藏功能：飞手队长通信入口已隐藏
    // { key: "message", label: "消息", icon: <MessageCircle size={20} />, badge: messageUnread },
  ];

  const pageTitles: Record<string, string> = {
    home: "首页",
    assign: "任务指派",
    tasks: "飞拍任务",
    exceptions: "异常反馈",
    message: "消息",
  };

  if (assigningSource) {
    return (
      <AssignTaskModal
        source={assigningSource}
        onClose={() => setAssigningSource(null)}
        onAssignComplete={handleAssignComplete}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && <NavBar title={pageTitles[activeTab] ?? ""} />}
      {activeTab === "home" && (
        <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>飞手负责人 · 孙大志</div>
            <div className="font-semibold" style={{ color: "var(--foreground)" }}>团队任务管理</div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
            style={{ background: "rgba(95,180,255,0.15)", color: "var(--info)" }}>孙</div>
        </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "home" && (
          <LeaderHomeTab
            pendingAssignments={pendingAssignments}
            teamTasks={teamTasks}
            exceptionCount={exceptionFeedbacks.length}
            onAssign={setAssigningSource}
            onTasks={() => setActiveTab("tasks")}
            onExceptions={() => setActiveTab("exceptions")}
          />
        )}
        {activeTab === "assign" && (
          <AssignmentTab
            pendingAssignments={pendingAssignments}
            rejectedTasks={rejectedTasks}
            onAssign={setAssigningSource}
            onReassign={setAssigningSource}
          />
        )}
        {activeTab === "tasks" && (
          <TeamTaskListTab
            tasks={teamTasks}
          />
        )}
        {activeTab === "exceptions" && <ExceptionFeedbackTab />}
        {activeTab === "message" && <LeaderMessageTab threads={messageThreads} setThreads={setMessageThreads} />}
      </div>
      <BottomTab tabs={tabs} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
