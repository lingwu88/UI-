import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { StatusBadge } from "../shared/StatusBadge";
import {
  LayoutGrid, ClipboardList, User,
  MapPin, Clock, ChevronRight,
  Navigation, Users, CheckCircle2, AlertTriangle,
  MessageCircle, Send, Shield,
} from "lucide-react";

const assignments = [
  {
    id: "ASSIGN-001",
    workOrderId: "WO-20250612-002",
    type: "整改复核飞拍",
    location: "B区基坑-东侧",
    deadline: "2025-06-12 16:00",
    status: "re-review" as const,
    supervisorName: "李监理",
    requirement: "对B区基坑东侧高空作业区域进行复核拍摄，重点拍摄作业人员安全绳佩戴情况",
  },
];

const feedbacks = [
  {
    id: "FEED-001",
    pilotName: "王飞手",
    taskId: "TASK-20250611-02",
    type: "日常巡查飞拍",
    location: "D区施工现场",
    time: "2025-06-11 14:32",
    status: "completed" as const,
    summary: "D区巡查完成，消防通道已清空，现场符合规范",
  },
];

const pilots = [
  { name: "王飞手", status: "available" as const, hours: 128, tasks: 34 },
  { name: "李飞手", status: "busy" as const, hours: 96, tasks: 27 },
  { name: "赵飞手", status: "available" as const, hours: 72, tasks: 19 },
];

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
      { id: "m2", from: "me", text: "收到，王飞手已经在准备电池和航线。", time: "09:28" },
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

function AssignTaskModal({ assignment, onClose }: { assignment: typeof assignments[0]; onClose: () => void }) {
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <NavBar title="指派任务" onBack={onClose} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(53,208,127,0.15)" }}>
            <CheckCircle2 size={32} color="var(--success)" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>指派成功</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
              已向{selectedPilot}下发飞拍复核任务
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
      <NavBar title="指派飞手任务" subtitle={assignment.workOrderId} onBack={onClose} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Task Info */}
        <div className="rounded-xl p-4" style={{ background: "rgba(47,125,246,0.08)", border: "1px solid rgba(47,125,246,0.2)" }}>
          <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--accent)" }}>监理指派任务</h3>
          <div className="space-y-1.5">
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{assignment.type}</div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{assignment.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
              <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {assignment.deadline}</span>
            </div>
          </div>
          <p className="text-xs mt-2 pt-2 leading-relaxed" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
            {assignment.requirement}
          </p>
        </div>

        {/* Select Pilot */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>选择执行飞手</h3>
          <div className="space-y-2">
            {pilots.map((pilot) => (
              <button
                key={pilot.name}
                disabled={pilot.status === "busy"}
                onClick={() => setSelectedPilot(pilot.name)}
                className="w-full rounded-xl p-4 text-left transition-all"
                style={{
                  background: selectedPilot === pilot.name ? "rgba(47,125,246,0.15)" : "var(--card)",
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
                        {pilot.hours}h · {pilot.tasks}次任务
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

        {/* Note */}
        <div>
          <div className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>补充说明（可选）</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
          onClick={() => setSubmitted(true)}
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

function LeaderHomeTab({ onAssign }: { onAssign: () => void }) {
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

      {/* Quick Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "待指派", value: assignments.length, color: "var(--caution)", bg: "rgba(255,224,71,0.12)" },
          { label: "执行中", value: 1, color: "var(--primary)", bg: "rgba(47,125,246,0.1)" },
          { label: "今日完成", value: 1, color: "var(--success)", bg: "rgba(53,208,127,0.1)" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-3 flex flex-col items-center" style={{ background: item.bg }}>
            <span className="font-bold" style={{ fontSize: 24, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Pending Assignments */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>监理待指派任务</h3>
        {assignments.map((a) => (
          <div key={a.id} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid rgba(47,125,246,0.3)" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{a.type}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.workOrderId}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,224,71,0.15)", color: "var(--caution)" }}>
                待指派
              </span>
            </div>
            <div className="flex items-center gap-1 mb-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{a.location}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1" style={{ color: "var(--caution)" }}>
                <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {a.deadline}</span>
              </div>
              <button onClick={onAssign}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{ background: "var(--primary)", color: "#fff" }}>
                立即指派飞手
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pilot Feedback */}
      <div className="px-4 mt-4 mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>飞手反馈</h3>
        {feedbacks.map((f) => (
          <div key={f.id} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: "rgba(95,180,255,0.12)", color: "var(--accent)" }}>
                  {f.pilotName[0]}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{f.pilotName}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{f.time}</div>
                </div>
              </div>
              <StatusBadge status={f.status} small />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{f.summary}</p>
          </div>
        ))}
      </div>
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

  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const unreadCount = threads.reduce((sum, thread) => sum + thread.unread, 0);

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
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>监理会话</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>仅显示已由监理发起的会话</div>
          </div>
          <div className="flex items-center gap-2">
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
        </div>

        <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 164 }}>
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
      </div>

      <div className="mx-4 rounded-xl p-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(95,180,255,0.15)", color: "var(--info)" }}>
          <Shield size={19} />
        </div>
        <div className="flex-1 min-w-0">
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
  const [assigning, setAssigning] = useState(false);
  const [messageThreads, setMessageThreads] = useState<LeaderSupervisorThread[]>(leaderSupervisorThreads);
  const messageUnread = messageThreads.reduce((sum, thread) => sum + thread.unread, 0);

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "team", label: "团队管理", icon: <Users size={20} /> },
    { key: "message", label: "消息", icon: <MessageCircle size={20} />, badge: messageUnread },
    { key: "profile", label: "我的", icon: <User size={20} /> },
  ];

  if (assigning) {
    return <AssignTaskModal assignment={assignments[0]} onClose={() => setAssigning(false)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && <NavBar title={tabs.find((t) => t.key === activeTab)?.label ?? ""} />}
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
        {activeTab === "home" && <LeaderHomeTab onAssign={() => setAssigning(true)} />}
        {activeTab === "team" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <h3 className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>鹰眼一队成员</h3>
            {pilots.map((pilot) => (
              <div key={pilot.name} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                      style={{ background: "var(--secondary)", color: "var(--accent)", fontSize: 18 }}>
                      {pilot.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{pilot.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        飞行 {pilot.hours}h · {pilot.tasks}次任务
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: pilot.status === "available" ? "rgba(53,208,127,0.15)" : "rgba(47,125,246,0.15)",
                      color: pilot.status === "available" ? "var(--success)" : "var(--primary)",
                    }}>
                    {pilot.status === "available" ? "空闲" : "执行中"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "message" && <LeaderMessageTab threads={messageThreads} setThreads={setMessageThreads} />}
        {activeTab === "profile" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold"
              style={{ background: "rgba(95,180,255,0.12)", color: "var(--info)", fontSize: 28 }}>孙</div>
            <div className="text-center">
              <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>孙大志</div>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>飞手团队负责人 · 鹰眼一队</div>
            </div>
            <div className="w-full rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              {[
                { label: "团队成员", value: "3 人" },
                { label: "本月任务", value: "12 次" },
                { label: "认证级别", value: "CAAC 四旋翼 高级" },
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
