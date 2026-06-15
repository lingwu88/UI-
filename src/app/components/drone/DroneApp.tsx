import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { StatusBadge } from "../shared/StatusBadge";
import {
  LayoutGrid, ClipboardList, User,
  MapPin, Clock, ChevronRight,
  Navigation, Upload, CheckCircle2, AlertTriangle,
  Wifi, Signal, Battery,
} from "lucide-react";

// ─── Drone Pilot App ─────────────────────────────────────────

const pilotTasks = [
  {
    id: "TASK-20250612-01",
    workOrderId: "WO-20250612-002",
    type: "整改复核飞拍",
    location: "B区基坑-东侧",
    gps: "30.567890, 114.305678",
    deadline: "2025-06-12 16:00",
    status: "assigned" as const,
    requirement: "对B区基坑东侧高空作业区域进行复核拍摄，重点拍摄作业人员安全绳佩戴情况",
  },
  {
    id: "TASK-20250611-02",
    workOrderId: "WO-20250611-003",
    type: "日常巡查飞拍",
    location: "D区施工现场",
    gps: "30.564321, 114.308765",
    deadline: "2025-06-11 15:00",
    status: "completed" as const,
    requirement: "D区全面巡查，重点检查消防通道畅通情况",
  },
];

function TaskDetail({
  task,
  onBack,
  isLeader,
}: { task: typeof pilotTasks[0]; onBack: () => void; isLeader?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [showException, setShowException] = useState(false);
  const [exceptionText, setExceptionText] = useState("");
  const [exceptionSubmitted, setExceptionSubmitted] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 2000);
  };

  const handleStream = () => setStreaming(!streaming);

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
              如遇天气限制、场地无法进入、设备故障等情况，请及时上报
            </p>
          </div>

          <div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>异常类型</div>
            <div className="grid grid-cols-2 gap-2">
              {["天气原因", "场地限制", "设备故障", "其他原因"].map((type) => (
                <button key={type}
                  className="py-2.5 rounded-xl text-sm font-medium border"
                  style={{ background: "var(--secondary)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>异常描述</div>
            <textarea
              value={exceptionText}
              onChange={(e) => setExceptionText(e.target.value)}
              rows={4}
              placeholder="请详细描述异常情况，包括时间、地点和具体原因..."
              className="w-full rounded-xl p-3 text-sm resize-none outline-none"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>上传佐证材料（可选）</div>
            <button className="w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center gap-2"
              style={{ borderColor: "var(--border)", background: "var(--secondary)" }}>
              <Upload size={18} style={{ color: "var(--muted-foreground)" }} />
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>上传现场照片</span>
            </button>
          </div>
        </div>
        <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            disabled={!exceptionText.trim()}
            onClick={() => setExceptionSubmitted(true)}
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
        {/* Task Header */}
        <div className="px-4 pt-4 pb-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold text-base" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
            </div>
            <StatusBadge status={task.status} />
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            关联工单: <span style={{ color: "var(--accent)" }}>{task.workOrderId}</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Location & Time */}
          <div className="rounded-xl p-4 grid grid-cols-2 gap-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
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
              <div className="text-sm font-medium" style={{ color: task.status !== "completed" ? "var(--warning)" : "var(--foreground)" }}>
                {task.deadline}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>拍摄要求</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{task.requirement}</p>
          </div>

          {/* Live Stream (if assigned) */}
          {task.status === "assigned" && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>实时图传</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" style={{ color: streaming ? "var(--success)" : "var(--muted-foreground)" }}>
                    <Wifi size={12} />
                    <span style={{ fontSize: 11 }}>{streaming ? "5G 已连接" : "未连接"}</span>
                  </div>
                  <button onClick={handleStream}
                    className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: streaming ? "rgba(255,77,79,0.15)" : "rgba(53,208,127,0.15)", color: streaming ? "var(--danger)" : "var(--success)" }}>
                    {streaming ? "断开" : "连接"}
                  </button>
                </div>
              </div>
              <div className="aspect-video flex items-center justify-center" style={{ background: "#050E1C" }}>
                {streaming ? (
                  <div className="w-full h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=225&fit=crop&auto=format"
                      alt="live"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded text-white" style={{ fontSize: 11 }}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE 5G
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {new Date().toLocaleTimeString("zh-CN")}
                    </div>
                    {/* GPS overlay */}
                    <div className="absolute bottom-2 left-2 text-xs font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>
                      GPS: {task.gps}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Navigation size={24} style={{ color: "var(--muted-foreground)" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>点击"连接"开始实时回传</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload */}
          {task.status === "assigned" && (
            <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>上传拍摄成果</h3>
              <button
                onClick={handleUpload}
                className="w-full h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 active:opacity-70"
                style={{
                  borderColor: uploaded ? "rgba(53,208,127,0.5)" : "var(--border)",
                  background: uploaded ? "rgba(53,208,127,0.05)" : "var(--secondary)",
                }}
              >
                {uploading ? (
                  <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>上传中...</div>
                ) : uploaded ? (
                  <>
                    <CheckCircle2 size={20} color="var(--success)" />
                    <span className="text-xs" style={{ color: "var(--success)" }}>复核图像已上传至监理端</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} style={{ color: "var(--muted-foreground)" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>上传拍摄图片/视频（带GPS水印）</span>
                  </>
                )}
              </button>
            </div>
          )}

          {task.status === "completed" && (
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.3)" }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>任务已完成</div>
                <div className="text-xs" style={{ color: "rgba(53,208,127,0.7)" }}>拍摄成果已回传至监理端</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {task.status === "assigned" && !exceptionSubmitted && (
        <div className="p-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowException(true)}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(255,224,71,0.12)", color: "var(--caution)" }}
          >
            上报异常
          </button>
          {uploaded && (
            <button className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: "var(--primary)", color: "#fff" }}>
              提交任务
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskListTab({ onSelect }: { onSelect: (t: typeof pilotTasks[0]) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {pilotTasks.map((task) => (
        <button key={task.id} onClick={() => onSelect(task)}
          className="w-full rounded-xl p-4 text-left active:opacity-80"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{task.id}</div>
            </div>
            <StatusBadge status={task.status} small />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{task.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {task.deadline}</span>
            </div>
          </div>
          <div className="flex justify-end mt-2" style={{ color: "var(--accent)" }}>
            <ChevronRight size={14} />
          </div>
        </button>
      ))}
    </div>
  );
}

function DroneHomeTab({ onView }: { onView: () => void }) {
  const pending = pilotTasks.filter((t) => t.status === "assigned").length;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110, border: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eaf4ff 58%, #f4f7fb 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>飞手端</div>
          <div className="font-bold" style={{ fontSize: 18, color: "var(--foreground)" }}>你好，王飞手</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>鹰眼一队 · 5G图传已就绪</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Navigation size={72} color="var(--accent)" />
        </div>
      </div>

      {/* Device Status */}
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

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {[
          { label: "待执行任务", value: pending, color: "var(--caution)", bg: "rgba(255,224,71,0.1)" },
          { label: "已完成任务", value: 1, color: "var(--success)", bg: "rgba(53,208,127,0.1)" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-3 flex flex-col items-center" style={{ background: item.bg }}>
            <span className="font-bold" style={{ fontSize: 24, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>最新任务</h3>
          <button onClick={onView} style={{ color: "var(--accent)", fontSize: 12 }}>查看全部</button>
        </div>
        {pilotTasks.slice(0, 1).map((task) => (
          <button key={task.id} onClick={onView}
            className="w-full rounded-xl p-4 text-left"
            style={{ background: "var(--card)", border: "1px solid rgba(47,125,246,0.3)" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{task.type}</div>
              <StatusBadge status={task.status} small />
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{task.location}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
                <Clock size={12} />
                <span style={{ fontSize: 12 }}>截止 {task.deadline}</span>
              </div>
              <span style={{ color: "var(--accent)", fontSize: 12 }}>查看详情 →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DroneApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedTask, setSelectedTask] = useState<typeof pilotTasks[0] | null>(null);

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "tasks", label: "我的任务", icon: <ClipboardList size={20} />, badge: pilotTasks.filter((t) => t.status === "assigned").length },
    { key: "profile", label: "我的", icon: <User size={20} /> },
  ];

  if (selectedTask) {
    return <TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && <NavBar title={tabs.find((t) => t.key === activeTab)?.label ?? ""} />}
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
        {activeTab === "home" && <DroneHomeTab onView={() => setActiveTab("tasks")} />}
        {activeTab === "tasks" && <TaskListTab onSelect={setSelectedTask} />}
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
                { label: "当前状态", value: "在岗待命" },
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
