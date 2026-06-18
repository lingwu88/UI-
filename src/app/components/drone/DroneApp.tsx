import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { TaskRouteMap } from "../shared/TaskRouteMap";
import {
  LayoutGrid, ClipboardList, User,
  MapPin, Clock, ChevronRight,
  Navigation, CheckCircle2, AlertTriangle,
  Wifi, Signal, Battery, XCircle,
} from "lucide-react";

// ─── Drone Pilot App ─────────────────────────────────────────

type PilotTaskStatus = "pending" | "accepted" | "rejected" | "completed" | "exception";

type PilotTask = {
  id: string;
  workOrderId: string;
  type: string;
  location: string;
  gps: string;
  deadline: string;
  status: PilotTaskStatus;
  requirement: string;
  acceptedAt?: string;
  completedAt?: string;
  rejectedReason?: string;
};

const initialPilotTasks: PilotTask[] = [
  {
    id: "TASK-20250612-01",
    workOrderId: "WO-20250612-002",
    type: "整改复核飞拍",
    location: "B区基坑-东侧",
    gps: "30.567890, 114.305678",
    deadline: "2025-06-12 16:00",
    status: "pending",
    requirement: "对B区基坑东侧高空作业区域进行复核拍摄，重点拍摄作业人员安全绳佩戴情况。",
  },
  {
    id: "TASK-20250612-03",
    workOrderId: "WO-20250612-005",
    type: "临边防护复核",
    location: "C区4号楼-临边作业面",
    gps: "30.566218, 114.307912",
    deadline: "2025-06-13 16:00",
    status: "accepted",
    acceptedAt: "09:18",
    requirement: "复核临边护栏、警示标识和作业人员活动区域，按指定航线完成现场飞拍。",
  },
  {
    id: "TASK-20250611-02",
    workOrderId: "WO-20250611-003",
    type: "日常巡查飞拍",
    location: "D区施工现场",
    gps: "30.564321, 114.308765",
    deadline: "2025-06-11 15:00",
    status: "completed",
    acceptedAt: "昨日 10:20",
    completedAt: "昨日 14:36",
    requirement: "D区全面巡查，重点检查消防通道畅通情况。",
  },
];

function PilotTaskStatusBadge({ status }: { status: PilotTaskStatus }) {
  const statusMap: Record<PilotTaskStatus, { label: string; bg: string; color: string }> = {
    pending: { label: "待接收", bg: "rgba(255,224,71,0.18)", color: "var(--caution)" },
    accepted: { label: "已接受", bg: "rgba(0,107,255,0.12)", color: "var(--primary)" },
    rejected: { label: "已拒绝", bg: "rgba(255,74,74,0.12)", color: "var(--danger)" },
    completed: { label: "已完成", bg: "rgba(53,208,127,0.14)", color: "var(--success)" },
    exception: { label: "异常上报", bg: "rgba(255,122,0,0.14)", color: "var(--caution)" },
  };
  const item = statusMap[status];

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold"
      style={{ background: item.bg, color: item.color, padding: "2px 8px", fontSize: 11 }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
      {item.label}
    </span>
  );
}

function RejectTaskPage({
  task,
  onBack,
  onSubmit,
}: {
  task: PilotTask;
  onBack: () => void;
  onSubmit: (taskId: string, reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="flex flex-col h-full">
      <NavBar title="拒绝任务" subtitle={task.id} onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,74,74,0.08)", border: "1px solid rgba(255,74,74,0.22)" }}>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={17} color="var(--danger)" />
            <div className="text-sm font-semibold" style={{ color: "var(--danger)" }}>请填写拒绝原因</div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            拒绝原因会同步给飞手团队负责人，便于重新安排任务。
          </p>
        </div>

        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{task.type}</div>
            <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
          </div>
          <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <MapPin size={12} />
            <span style={{ fontSize: 12 }}>{task.location}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
            <Clock size={12} />
            <span style={{ fontSize: 12 }}>截止 {task.deadline}</span>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>拒绝理由</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={5}
            placeholder="例如：设备维护中、当前已有任务冲突、天气条件不满足飞行要求..."
            className="mt-2 w-full rounded-xl p-3 text-sm resize-none outline-none"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </label>
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          disabled={!reason.trim()}
          onClick={() => onSubmit(task.id, reason.trim())}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{
            background: reason.trim() ? "var(--danger)" : "var(--secondary)",
            color: reason.trim() ? "#fff" : "var(--muted-foreground)",
          }}
        >
          提交拒绝原因
        </button>
      </div>
    </div>
  );
}

function TaskDetail({
  task,
  onBack,
  onComplete,
  onReportException,
}: {
  task: PilotTask;
  onBack: () => void;
  onComplete: (taskId: string) => void;
  onReportException: (taskId: string, reason: string) => void;
}) {
  const [showException, setShowException] = useState(false);
  const [exceptionText, setExceptionText] = useState("");
  const [exceptionSubmitted, setExceptionSubmitted] = useState(false);

  if (showException && !exceptionSubmitted) {
    return (
      <div className="flex flex-col h-full">
        <NavBar title="提交异常反馈" onBack={() => setShowException(false)} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-xl p-4" style={{ background: "rgba(255,224,71,0.08)", border: "1px solid rgba(255,224,71,0.25)" }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} color="var(--warning)" />
              <span className="text-sm font-semibold" style={{ color: "var(--caution)" }}>任务异常上报</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              如遇天气限制、场地无法进入、设备故障等情况，请及时上报。
            </p>
          </div>

          <div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>异常类型</div>
            <div className="grid grid-cols-2 gap-2">
              {["天气原因", "场地限制", "设备故障", "其他原因"].map((type) => (
                <button
                  key={type}
                  className="py-2.5 rounded-xl text-sm font-medium border"
                  style={{ background: "var(--secondary)", color: "var(--foreground)", borderColor: "var(--border)" }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>异常描述</div>
            <textarea
              value={exceptionText}
              onChange={(event) => setExceptionText(event.target.value)}
              rows={5}
              placeholder="请详细描述异常情况，包括时间、地点和具体原因..."
              className="w-full rounded-xl p-3 text-sm resize-none outline-none"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>
        <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            disabled={!exceptionText.trim()}
            onClick={() => {
              onReportException(task.id, exceptionText.trim());
              setExceptionSubmitted(true);
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{
              background: exceptionText.trim() ? "var(--caution)" : "var(--secondary)",
              color: exceptionText.trim() ? "#111820" : "var(--muted-foreground)",
            }}
          >
            提交异常反馈
          </button>
        </div>
      </div>
    );
  }

  if (exceptionSubmitted) {
    return (
      <div className="flex flex-col h-full">
        <NavBar title="任务详情" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,224,71,0.15)" }}>
            <AlertTriangle size={32} color="var(--warning)" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>异常已上报</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              已通知飞手负责人和监理，等待进一步指示
            </div>
          </div>
          <button onClick={onBack} className="mt-4 px-8 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            返回任务列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <NavBar title="任务详情" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold text-base" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
            </div>
            <PilotTaskStatusBadge status={task.status} />
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            关联工单: <span style={{ color: "var(--accent)" }}>{task.workOrderId}</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs mb-1 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <MapPin size={11} />拍摄位置
                </div>
                <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{task.location}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--accent)" }}>{task.gps}</div>
              </div>
              <div>
                <div className="text-xs mb-1 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <Clock size={11} />截止时间
                </div>
                <div className="text-sm font-medium" style={{ color: task.status === "accepted" ? "var(--caution)" : "var(--foreground)" }}>
                  {task.deadline}
                </div>
              </div>
            </div>
            <TaskRouteMap location={task.location} gps={task.gps} currentLabel="飞手位置" targetLabel="任务地点" />
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>拍摄要求</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{task.requirement}</p>
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>任务状态</h3>
            <div className="space-y-2">
              {[
                { label: "接收状态", value: task.status === "accepted" ? "已接受，可执行" : task.status === "completed" ? "已完成" : "异常已上报" },
                { label: "接受时间", value: task.acceptedAt ?? "刚刚" },
                { label: "完成时间", value: task.completedAt ?? "未完成" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.label}</span>
                  <span className="text-xs font-medium text-right" style={{ color: "var(--foreground)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {task.status === "completed" && (
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.3)" }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>任务已完成</div>
                <div className="text-xs" style={{ color: "rgba(53,208,127,0.7)" }}>已同步任务完成状态</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {task.status === "accepted" && (
        <div className="p-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowException(true)}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(255,224,71,0.12)", color: "var(--caution)" }}
          >
            上报异常
          </button>
          <button
            onClick={() => onComplete(task.id)}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            完成
          </button>
        </div>
      )}
    </div>
  );
}

function IncomingTaskTab({
  tasks,
  rejectedTasks,
  onAccept,
  onReject,
}: {
  tasks: PilotTask[];
  rejectedTasks: PilotTask[];
  onAccept: (taskId: string) => void;
  onReject: (task: PilotTask) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="rounded-xl p-3 flex items-center justify-between"
        style={{ background: "rgba(0,107,255,0.08)", border: "1px solid rgba(0,107,255,0.18)" }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>待接收任务</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>先接受或拒绝，接受后进入任务页</div>
        </div>
        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{tasks.length}</span>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-xl p-4 text-left"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
            </div>
            <PilotTaskStatusBadge status={task.status} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{task.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
              <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {task.deadline}</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed mt-3 pt-3" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
            {task.requirement}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              onClick={() => onReject(task)}
              className="py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
              style={{ background: "rgba(255,74,74,0.10)", color: "var(--danger)" }}
            >
              <XCircle size={15} />
              拒绝
            </button>
            <button
              type="button"
              onClick={() => onAccept(task.id)}
              className="py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              <CheckCircle2 size={15} />
              接受
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div
          className="rounded-xl p-8 text-center text-sm"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
        >
          暂无待接收任务
        </div>
      )}

      {rejectedTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>已拒绝记录</h3>
          {rejectedTasks.map((task) => (
            <div key={task.id} className="rounded-xl p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{task.type}</div>
                <PilotTaskStatusBadge status="rejected" />
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{task.rejectedReason}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskListTab({ tasks, onSelect }: { tasks: PilotTask[]; onSelect: (task: PilotTask) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onSelect(task)}
          className="w-full rounded-xl p-4 text-left active:opacity-80"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
            </div>
            <PilotTaskStatusBadge status={task.status} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{task.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {task.deadline}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {task.status === "accepted" ? "可查看任务详情并完成任务" : "可查看任务状态"}
            </span>
            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent)" }}>
              任务详情
              <ChevronRight size={14} />
            </span>
          </div>
        </button>
      ))}

      {tasks.length === 0 && (
        <div
          className="rounded-xl p-8 text-center text-sm"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
        >
          接受任务后，会在这里查看任务详情和状态
        </div>
      )}
    </div>
  );
}

function DroneHomeTab({
  pendingCount,
  activeCount,
  completedCount,
  latestTask,
  onIncoming,
  onTasks,
}: {
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  latestTask?: PilotTask;
  onIncoming: () => void;
  onTasks: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110, border: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eaf4ff 58%, #f4f7fb 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>飞手端</div>
          <div className="font-bold" style={{ fontSize: 18, color: "var(--foreground)" }}>你好，王飞手</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>鹰眼一队 · 设备在线，等待任务</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Navigation size={72} color="var(--accent)" />
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-xl p-4 grid grid-cols-3 gap-3"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col items-center gap-1">
          <Wifi size={18} color="var(--success)" />
          <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>5G</span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>网络</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Battery size={18} color="var(--success)" />
          <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>87%</span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>电量</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Signal size={18} color="var(--accent)" />
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>强</span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>信号</span>
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "待接收", value: pendingCount, color: "var(--caution)", bg: "rgba(255,224,71,0.12)", action: onIncoming },
          { label: "执行中", value: activeCount, color: "var(--primary)", bg: "rgba(0,107,255,0.10)", action: onTasks },
          { label: "已完成", value: completedCount, color: "var(--success)", bg: "rgba(53,208,127,0.1)", action: onTasks },
        ].map((item) => (
          <button key={item.label} onClick={item.action} className="rounded-xl p-3 flex flex-col items-center active:opacity-80" style={{ background: item.bg }}>
            <span className="font-bold" style={{ fontSize: 24, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>当前任务</h3>
          <button onClick={onTasks} style={{ color: "var(--accent)", fontSize: 12 }}>查看任务</button>
        </div>
        {latestTask ? (
          <button
            onClick={onTasks}
            className="w-full rounded-xl p-4 text-left"
            style={{ background: "var(--card)", border: "1px solid rgba(0,107,255,0.24)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{latestTask.type}</div>
              <PilotTaskStatusBadge status={latestTask.status} />
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{latestTask.location}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
                <Clock size={12} />
                <span style={{ fontSize: 12 }}>截止 {latestTask.deadline}</span>
              </div>
              <span style={{ color: "var(--accent)", fontSize: 12 }}>任务详情</span>
            </div>
          </button>
        ) : (
          <div className="rounded-xl p-6 text-center text-sm"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
            暂无已接受任务
          </div>
        )}
      </div>
    </div>
  );
}

export function DroneApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [tasks, setTasks] = useState<PilotTask[]>(initialPilotTasks);
  const [selectedTask, setSelectedTask] = useState<PilotTask | null>(null);
  const [rejectingTask, setRejectingTask] = useState<PilotTask | null>(null);

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const acceptedTasks = tasks.filter((task) => ["accepted", "completed", "exception"].includes(task.status));
  const activeTasks = tasks.filter((task) => task.status === "accepted");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const rejectedTasks = tasks.filter((task) => task.status === "rejected");
  const latestTask = activeTasks[0] ?? completedTasks[0];

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "incoming", label: "待接收", icon: <ClipboardList size={20} />, badge: pendingTasks.length },
    { key: "tasks", label: "任务", icon: <Navigation size={20} />, badge: activeTasks.length },
    { key: "profile", label: "我的", icon: <User size={20} /> },
  ];

  const acceptTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: "accepted", acceptedAt: "刚刚" }
          : task,
      ),
    );
    setActiveTab("tasks");
  };

  const rejectTask = (taskId: string, reason: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: "rejected", rejectedReason: reason }
          : task,
      ),
    );
    setRejectingTask(null);
    setActiveTab("incoming");
  };

  const completeTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: "completed", completedAt: "刚刚" }
          : task,
      ),
    );
    setSelectedTask((current) =>
      current && current.id === taskId
        ? { ...current, status: "completed", completedAt: "刚刚" }
        : current,
    );
  };

  const reportException = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: "exception" }
          : task,
      ),
    );
  };

  if (rejectingTask) {
    return (
      <RejectTaskPage
        task={rejectingTask}
        onBack={() => setRejectingTask(null)}
        onSubmit={rejectTask}
      />
    );
  }

  if (selectedTask) {
    return (
      <TaskDetail
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
        onComplete={completeTask}
        onReportException={reportException}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && <NavBar title={tabs.find((tab) => tab.key === activeTab)?.label ?? ""} />}
      {activeTab === "home" && (
        <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>飞手 · 王大鹏</div>
            <div className="font-semibold" style={{ color: "var(--foreground)" }}>飞拍任务管理</div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
            style={{ background: "rgba(95,180,255,0.15)", color: "var(--accent)" }}>王</div>
        </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "home" && (
          <DroneHomeTab
            pendingCount={pendingTasks.length}
            activeCount={activeTasks.length}
            completedCount={completedTasks.length}
            latestTask={latestTask}
            onIncoming={() => setActiveTab("incoming")}
            onTasks={() => setActiveTab("tasks")}
          />
        )}
        {activeTab === "incoming" && (
          <IncomingTaskTab
            tasks={pendingTasks}
            rejectedTasks={rejectedTasks}
            onAccept={acceptTask}
            onReject={setRejectingTask}
          />
        )}
        {activeTab === "tasks" && (
          <TaskListTab
            tasks={acceptedTasks}
            onSelect={setSelectedTask}
          />
        )}
        {activeTab === "profile" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold"
              style={{ background: "rgba(95,180,255,0.12)", color: "var(--accent)", fontSize: 28 }}>王</div>
            <div className="text-center">
              <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>王大鹏</div>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>飞手 · 鹰眼一队</div>
            </div>
            <div className="w-full rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              {[
                { label: "飞行时长", value: "128 小时" },
                { label: "执行任务", value: "34 次" },
                { label: "认证级别", value: "CAAC 四旋翼" },
                { label: "当前状态", value: activeTasks.length > 0 ? "任务执行中" : "在岗待命" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{item.label}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomTab tabs={tabs} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
