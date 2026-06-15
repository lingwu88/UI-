import React, { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { StatusBadge } from "../shared/StatusBadge";
import {
  LayoutGrid, ClipboardList, User,
  MapPin, Clock, ChevronRight, Camera,
  CheckCircle2, Upload, AlertCircle, Search,
} from "lucide-react";

const workOrders = [
  {
    id: "WO-20250612-001",
    type: "未佩戴安全帽",
    location: "A区3号楼-5层",
    deadline: "2025-06-13 17:00",
    status: "rectifying" as const,
    assignedTo: "张工",
    remark: "所有施工人员必须佩戴安全帽，立即整改",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-12 09:23",
  },
  {
    id: "WO-20250612-002",
    type: "高空作业未系安全绳",
    location: "B区基坑-东侧",
    deadline: "2025-06-12 17:00",
    status: "re-review" as const,
    assignedTo: "李工",
    remark: "高空作业人员必须系安全绳，违者停工",
    img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-12 09:41",
  },
  {
    id: "WO-20250611-003",
    type: "消防通道占用",
    location: "D区施工现场",
    deadline: "2025-06-11 17:00",
    status: "completed" as const,
    assignedTo: "王工",
    remark: "立即清理消防通道内的堆放物料",
    img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-11 14:10",
  },
];

function WorkOrderDetail({ wo, onBack }: { wo: typeof workOrders[0]; onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 1500);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isEditable = wo.status === "rectifying";

  return (
    <div className="flex flex-col h-full">
      <NavBar title="工单详情" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-4 pt-4 pb-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="font-semibold text-base" style={{ color: "var(--foreground)" }}>{wo.type}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{wo.id}</div>
            </div>
            <StatusBadge status={wo.status} />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} /><span style={{ fontSize: 12 }}>{wo.location}</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {wo.deadline}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Violation Image */}
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>违规现场图片</h3>
            <div className="rounded-xl overflow-hidden">
              <img src={wo.img} alt="" className="w-full object-cover" style={{ height: 160 }} />
            </div>
          </div>

          {/* Rectification Requirements */}
          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>整改要求</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{wo.remark}</p>
            <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
              <AlertCircle size={14} color="var(--warning)" />
              <span className="text-xs" style={{ color: "var(--caution)" }}>
                截止时间: {wo.deadline}，逾期将上报处理
              </span>
            </div>
          </div>

          {/* Responsibility */}
          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>责任人信息</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                style={{ background: "var(--secondary)", color: "var(--accent)" }}>
                {wo.assignedTo[0]}
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{wo.assignedTo}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>华建总承包 · 施工负责人</div>
              </div>
            </div>
          </div>

          {/* Rectification Feedback */}
          {isEditable && !submitted && (
            <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>提交整改反馈</h3>

              {/* Upload photo */}
              <div className="mb-3">
                <div className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>上传整改后现场照片</div>
                <button
                  onClick={handleUpload}
                  className="w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 active:opacity-70"
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
                      <span className="text-xs" style={{ color: "var(--success)" }}>整改照片已上传</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} style={{ color: "var(--muted-foreground)" }} />
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>点击上传整改照片</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text feedback */}
              <div>
                <div className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>整改说明</div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="请描述整改情况，包括具体措施和完成情况..."
                  className="w-full rounded-xl p-3 text-sm resize-none outline-none"
                  style={{
                    background: "var(--secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>
          )}

          {submitted && (
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.3)" }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>整改反馈已提交</div>
                <div className="text-xs" style={{ color: "rgba(53,208,127,0.7)" }}>等待监理安排飞手复核</div>
              </div>
            </div>
          )}

          {wo.status === "re-review" && (
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(95,180,255,0.08)", border: "1px solid rgba(95,180,255,0.25)" }}>
              <Camera size={20} color="var(--accent)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>待飞手复核</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>监理正在安排无人机飞拍复核</div>
              </div>
            </div>
          )}

          {wo.status === "completed" && (
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.3)" }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>整改已通过复核</div>
                <div className="text-xs" style={{ color: "rgba(53,208,127,0.7)" }}>监理已确认整改合格，工单关闭</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditable && !submitted && (
        <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            disabled={!uploaded || !feedback.trim()}
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{
              background: uploaded && feedback.trim() ? "var(--primary)" : "var(--secondary)",
              color: uploaded && feedback.trim() ? "#fff" : "var(--muted-foreground)",
            }}
          >
            提交整改反馈
          </button>
        </div>
      )}
    </div>
  );
}

function WorkOrderListTab({ onSelect }: { onSelect: (wo: typeof workOrders[0]) => void }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = workOrders.filter((w) => {
    const matchesStatus = filter === "all" || w.status === filter;
    const keyword = query.trim().toLowerCase();
    if (!keyword) return matchesStatus;

    const searchable = `${w.id}${w.type}${w.location}${w.deadline}${w.assignedTo}${w.remark}`.toLowerCase();
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
            placeholder="搜索工单编号、类型、位置或责任人"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 flex-shrink-0">
        {["all", "rectifying", "re-review", "completed"].map((f) => {
          const labels: Record<string, string> = { all: "全部", rectifying: "整改中", "re-review": "待复核", completed: "已完成" };
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: filter === f ? "var(--primary)" : "var(--secondary)", color: filter === f ? "#fff" : "var(--muted-foreground)" }}>
              {labels[f]}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {filtered.map((wo) => (
          <button key={wo.id} onClick={() => onSelect(wo)}
            className="w-full rounded-xl overflow-hidden text-left active:opacity-80"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex gap-3 p-4">
              <img src={wo.img} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>{wo.type}</span>
                  <StatusBadge status={wo.status} small />
                </div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{wo.id}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                    <MapPin size={11} /><span style={{ fontSize: 11 }}>{wo.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  <Clock size={11} /><span style={{ fontSize: 11 }}>截止 {wo.deadline.split(" ")[0]}</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--muted-foreground)", alignSelf: "center" }} />
            </div>
          </button>
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

function ConstructionHomeTab({ onViewOrders }: { onViewOrders: () => void }) {
  const pending = workOrders.filter((w) => w.status === "rectifying").length;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110, border: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eaf4ff 58%, #f4f7fb 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--info)" }}>施工团队端</div>
          <div className="font-bold" style={{ fontSize: 18, color: "var(--foreground)" }}>你好，张负责人</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>华建总承包 · 阳光城项目</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <ClipboardList size={72} color="var(--info)" />
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "整改中", value: pending, color: "var(--caution)", bg: "rgba(255,159,28,0.12)" },
          { label: "待复核", value: 1, color: "var(--info)", bg: "rgba(95,180,255,0.1)" },
          { label: "已完成", value: 2, color: "var(--success)", bg: "rgba(53,208,127,0.1)" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-3 flex flex-col items-center" style={{ background: item.bg }}>
            <span className="font-bold" style={{ fontSize: 24, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>最新工单</h3>
          <button onClick={onViewOrders} style={{ color: "var(--accent)", fontSize: 12 }}>查看全部</button>
        </div>
        <div className="space-y-2">
          {workOrders.slice(0, 2).map((wo) => (
            <button key={wo.id} onClick={onViewOrders}
              className="w-full rounded-xl p-3 flex items-center gap-3 text-left active:opacity-70"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={wo.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>{wo.type}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{wo.location}</div>
              </div>
              <StatusBadge status={wo.status} small />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConstructionApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedWo, setSelectedWo] = useState<typeof workOrders[0] | null>(null);

  const tabs: TabItem[] = [
    { key: "home", label: "首页", icon: <LayoutGrid size={20} /> },
    { key: "workorder", label: "工单", icon: <ClipboardList size={20} />, badge: workOrders.filter((w) => w.status === "rectifying").length },
    { key: "profile", label: "我的", icon: <User size={20} /> },
  ];

  if (selectedWo) {
    return <WorkOrderDetail wo={selectedWo} onBack={() => setSelectedWo(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab !== "home" && <NavBar title={tabs.find((t) => t.key === activeTab)?.label ?? ""} />}
      {activeTab === "home" && (
        <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>施工负责人 · 张建国</div>
            <div className="font-semibold" style={{ color: "var(--foreground)" }}>整改工单管理</div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
            style={{ background: "rgba(53,208,127,0.15)", color: "var(--success)" }}>张</div>
        </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "home" && <ConstructionHomeTab onViewOrders={() => setActiveTab("workorder")} />}
        {activeTab === "workorder" && <WorkOrderListTab onSelect={setSelectedWo} />}
        {activeTab === "profile" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold"
              style={{ background: "var(--secondary)", color: "var(--accent)", fontSize: 28 }}>张</div>
            <div className="text-center">
              <div className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>张建国</div>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>施工负责人 · 华建总承包</div>
            </div>
            <div className="w-full rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              {[
                { label: "手机号", value: "138****8888" },
                { label: "所属单位", value: "华建总承包" },
                { label: "负责区域", value: "A区、B区" },
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
