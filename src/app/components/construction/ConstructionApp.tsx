import { useState } from "react";
import { NavBar } from "../shared/NavBar";
import { BottomTab, TabItem } from "../shared/BottomTab";
import { StatusBadge } from "../shared/StatusBadge";
import {
  LayoutGrid, ClipboardList, User,
  MapPin, Clock, ChevronRight,
  CheckCircle2, Upload, AlertCircle, Search, ChevronDown,
} from "lucide-react";

type ConstructionWorkOrder = {
  id: string;
  type: string;
  site: string;
  location: string;
  deadline: string;
  status: "rectifying" | "re-review" | "completed" | "overdue";
  assignedTo: string;
  assignedRole: string;
  assignedPhone: string;
  unit: string;
  team: string;
  requirement: string;
  img: string;
  issueTime: string;
  aiConfidence: number;
  persons: string[];
  rectificationRound?: 1 | 2;
  rectificationInfo: {
    statusText: string;
    rectifier: string;
    team: string;
    updatedAt: string;
    summary: string;
  };
  firstRectification?: {
    submittedAt: string;
    submitter: string;
    description: string;
    reviewComment: string;
    img: string;
  };
  reviewMaterials?: {
    violation: { title: string; time: string; img: string; desc: string };
    rectification: { title: string; time: string; img: string; desc: string };
  };
  rectificationDetail?: {
    before: { title: string; time: string; img: string; desc: string };
    after: { title: string; time: string; img: string; desc: string };
    manager: string;
    rectifiedAt: string;
    summary: string;
  };
};

type WorkOrderStatusFilter = "all" | ConstructionWorkOrder["status"];

const workOrderStatusOptions: Array<{ value: WorkOrderStatusFilter; label: string }> = [
  { value: "all", label: "全部状态" },
  { value: "rectifying", label: "整改中" },
  { value: "re-review", label: "待审核" },
  { value: "overdue", label: "逾期" },
  { value: "completed", label: "已完成" },
];

const workOrders: ConstructionWorkOrder[] = [
  {
    id: "WO-20250612-001",
    type: "未佩戴安全帽",
    site: "工地A",
    location: "A区3号楼-5层",
    deadline: "2025-06-13 17:00",
    status: "rectifying" as const,
    assignedTo: "张工",
    assignedRole: "工地负责人",
    assignedPhone: "138****8888",
    unit: "华建总承包",
    team: "主体施工班组",
    requirement: "二次整改：所有施工人员必须规范佩戴安全帽，现场入口与楼层作业面需同步复查。",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-12 09:23",
    aiConfidence: 94,
    persons: ["张某某", "李某某"],
    rectificationRound: 2,
    rectificationInfo: {
      statusText: "整改中",
      rectifier: "张工",
      team: "华建总承包主体班组",
      updatedAt: "2025-06-12 14:20",
      summary: "已完成首轮整改，但楼层作业面仍需继续补充巡查照片和佩戴落实说明，当前工单保持整改中。",
    },
    firstRectification: {
      submittedAt: "2025-06-12 11:20",
      submitter: "张工",
      description: "已在A区3号楼入口补充安全帽发放点，并要求班组长现场提醒作业人员佩戴。",
      reviewComment: "监理审核驳回：5层作业面仍发现个别人员安全帽佩戴不规范，需要二次整改并补充楼层巡查照片。",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&auto=format",
    },
  },
  {
    id: "WO-20250612-002",
    type: "高空作业未系安全绳",
    site: "工地B",
    location: "B区基坑-东侧",
    deadline: "2025-06-12 17:00",
    status: "re-review" as const,
    assignedTo: "李工",
    assignedRole: "工地负责人",
    assignedPhone: "138****2202",
    unit: "华建总承包",
    team: "基坑作业班组",
    requirement: "高空作业人员必须系安全绳，补充现场交底和警戒区域设置情况，提交整改资料后待监理审核。",
    img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-12 09:41",
    aiConfidence: 87,
    persons: ["王某某"],
    rectificationInfo: {
      statusText: "整改完成，待监理审核",
      rectifier: "李工",
      team: "华建总承包基坑班组",
      updatedAt: "2025-06-12 13:20",
      summary: "已完成安全绳补佩戴、作业区域警戒线复位和现场交底，整改资料已提交，待监理审核。",
    },
    reviewMaterials: {
      violation: {
        title: "初次违规影像",
        time: "2025-06-12 09:41",
        img: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop&auto=format",
        desc: "高空作业区域存在未系安全绳行为，已生成整改工单。",
      },
      rectification: {
        title: "整改反馈资料",
        time: "2025-06-12 13:20",
        img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&auto=format",
        desc: "工地负责人已提交安全绳佩戴、警戒区域复位和现场交底照片。",
      },
    },
  },
  {
    id: "WO-20250611-003",
    type: "消防通道占用",
    site: "工地D",
    location: "D区施工现场",
    deadline: "2025-06-11 17:00",
    status: "completed" as const,
    assignedTo: "王工",
    assignedRole: "工地负责人",
    assignedPhone: "138****2204",
    unit: "兴盛分包",
    team: "现场保障班组",
    requirement: "立即清理消防通道内的堆放物料，并恢复通道畅通和警示标识。",
    img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-11 14:10",
    aiConfidence: 89,
    persons: ["孙某某", "胡某某"],
    rectificationInfo: {
      statusText: "整改完成",
      rectifier: "王工",
      team: "现场保障班组",
      updatedAt: "2025-06-11 16:42",
      summary: "通道内堆放物料已全部清理，警示线和导向标识已恢复，现场通行正常。",
    },
    rectificationDetail: {
      before: {
        title: "整改前现场",
        time: "2025-06-11 14:10",
        img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop&auto=format",
        desc: "消防通道被物料占用，影响现场正常通行和应急疏散。",
      },
      after: {
        title: "整改后现场",
        time: "2025-06-11 16:42",
        img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400&h=300&fit=crop&auto=format",
        desc: "通道堆物已清理完成，消防通道恢复畅通，现场标识同步复位。",
      },
      manager: "王工",
      rectifiedAt: "2025-06-11 16:42",
      summary: "工地负责人组织班组完成通道清理并复查现场，监理已确认整改合格，工单关闭。",
    },
  },
  {
    id: "WO-20250610-004",
    type: "临边防护缺失",
    site: "工地C",
    location: "C区2号楼-屋面东侧",
    deadline: "2025-06-10 18:00",
    status: "overdue" as const,
    assignedTo: "梁工",
    assignedRole: "工地负责人",
    assignedPhone: "138****2205",
    unit: "华建总承包",
    team: "屋面施工班组",
    requirement: "立即补齐屋面临边护栏和警示带，封控高风险作业区域，并提交整改反馈资料。",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&auto=format",
    issueTime: "2025-06-10 08:31",
    aiConfidence: 92,
    persons: ["冯某某", "张某某"],
    rectificationInfo: {
      statusText: "整改逾期未反馈",
      rectifier: "梁工",
      team: "华建总承包屋面班组",
      updatedAt: "2025-06-11 18:20",
      summary: "该工单已超过整改期限，工地负责人未在指定时间内完成整改反馈和资料上报，需立即跟进处理。",
    },
  },
];

function ConstructionWorkOrderStatusBadge({
  status,
  small,
}: {
  status: ConstructionWorkOrder["status"];
  small?: boolean;
}) {
  if (status !== "re-review") {
    return <StatusBadge status={status} small={small} />;
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium"
      style={{
        background: "var(--info)",
        color: "#fff",
        padding: small ? "1px 8px" : "3px 10px",
        fontSize: small ? 11 : 12,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#fff" }} />
      待审核
    </span>
  );
}

function getConstructionProgressText(wo: ConstructionWorkOrder) {
  if (wo.status === "overdue") return "整改逾期未反馈";
  if (wo.status === "completed") return "整改完成";
  if (wo.status === "re-review") return "待审核";
  if (wo.rectificationRound === 2) return "二次整改中";
  return "整改中";
}

function getConstructionStatusNote(wo: ConstructionWorkOrder) {
  if (wo.status === "overdue") return "当前工单已逾期，系统将自动上报和统计逾期工单。";
  if (wo.status === "re-review") return "整改资料已提交，待监理审核。";
  if (wo.status === "completed") return "监理已确认整改合格，工单关闭。";
  return "请按整改要求完成处理并提交整改资料，监理将按资料进行审核。";
}

function WorkOrderDetail({ wo, onBack }: { wo: ConstructionWorkOrder; onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [showFirstRectification, setShowFirstRectification] = useState(Boolean(wo.firstRectification));
  const isEditable = wo.status === "rectifying";
  const materials = wo.reviewMaterials;

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1500);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col h-full">
      <NavBar title="工单详情" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{wo.type}</div>
                  {wo.rectificationRound === 2 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(255,122,0,0.14)", color: "var(--caution)" }}
                    >
                      二次整改
                    </span>
                  )}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {wo.location} · {wo.unit}
                </div>
              </div>
              <ConstructionWorkOrderStatusBadge status={wo.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>截止时间</div>
                <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{wo.deadline}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>当前进度</div>
                <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{getConstructionProgressText(wo)}</div>
              </div>
            </div>
            <div
              className="rounded-lg p-3 text-xs leading-relaxed"
              style={{
                background: wo.status === "overdue" ? "rgba(255,74,74,0.08)" : "rgba(0,107,255,0.08)",
                color: wo.status === "overdue" ? "var(--danger)" : "var(--secondary-foreground)",
              }}
            >
              {getConstructionStatusNote(wo)}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="relative">
              <img src={wo.img} alt={wo.type} className="w-full object-cover" style={{ height: 220 }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,19,36,0.9) 0%, transparent 50%)" }} />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{wo.type}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(255,77,79,0.85)", color: "#fff" }}
                  >
                    AI置信度 {wo.aiConfidence}%
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>违规现场信息</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "违规类型", value: wo.type, icon: <AlertCircle size={14} /> },
                    { label: "创建时间", value: wo.issueTime, icon: <Clock size={14} /> },
                    { label: "所属工地", value: wo.site, icon: <ClipboardList size={14} /> },
                    { label: "拍摄位置", value: wo.location, icon: <MapPin size={14} /> },
                    { label: "涉事人员", value: wo.persons.join("、"), icon: <User size={14} /> },
                    { label: "工单编号", value: wo.id, icon: <ClipboardList size={14} /> },
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
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>整改要求</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{wo.requirement}</p>
            <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
              <AlertCircle size={14} color={wo.status === "overdue" ? "var(--danger)" : "var(--warning)"} />
              <span className="text-xs" style={{ color: wo.status === "overdue" ? "var(--danger)" : "var(--caution)" }}>
                截止时间: {wo.deadline}，逾期将自动上报和统计
              </span>
            </div>
          </div>

          {wo.firstRectification && (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <button
                type="button"
                onClick={() => setShowFirstRectification((current) => !current)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left active:opacity-80"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>第一次整改记录</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(255,74,74,0.10)", color: "var(--danger)" }}
                    >
                      已驳回
                    </span>
                  </div>
                  <div className="text-xs mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>
                    {wo.firstRectification.submittedAt} · {wo.firstRectification.submitter}
                  </div>
                </div>
                {showFirstRectification ? (
                  <ChevronDown size={17} style={{ color: "var(--muted-foreground)" }} />
                ) : (
                  <ChevronRight size={17} style={{ color: "var(--muted-foreground)" }} />
                )}
              </button>

              {showFirstRectification && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="rounded-xl overflow-hidden mt-3">
                    <img src={wo.firstRectification.img} alt="" className="w-full object-cover" style={{ height: 120 }} />
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>第一次整改说明</div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{wo.firstRectification.description}</p>
                  </div>
                  <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,74,74,0.08)", border: "1px solid rgba(255,74,74,0.18)" }}
                  >
                    <div className="text-xs font-semibold mb-1" style={{ color: "var(--danger)" }}>审核驳回意见</div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{wo.firstRectification.reviewComment}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            {wo.status === "completed" ? (
              <>
                <div className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>整改详情</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "工地负责人", value: wo.rectificationDetail?.manager ?? wo.assignedTo },
                    { label: "整改时间", value: wo.rectificationDetail?.rectifiedAt ?? wo.rectificationInfo.updatedAt },
                    { label: "整改班组", value: wo.rectificationInfo.team },
                    { label: "整改状态", value: wo.rectificationInfo.statusText },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{item.label}</div>
                      <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    wo.rectificationDetail?.before ?? {
                      title: "整改前现场",
                      time: wo.issueTime,
                      img: wo.img,
                      desc: "违规现场原始影像。",
                    },
                    wo.rectificationDetail?.after ?? {
                      title: "整改后现场",
                      time: wo.rectificationInfo.updatedAt,
                      img: wo.img,
                      desc: "整改完成后现场复核影像。",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <img src={item.img} alt={item.title} className="w-full object-cover" style={{ height: 132 }} />
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{item.title}</div>
                          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.time}</div>
                        </div>
                        <div className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>整改详情说明</div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {wo.rectificationDetail?.summary ?? wo.rectificationInfo.summary}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>整改情况</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "整改状态", value: submitted ? "整改反馈已提交" : wo.rectificationInfo.statusText },
                    { label: "整改人", value: wo.rectificationInfo.rectifier },
                    { label: "整改班组", value: wo.rectificationInfo.team },
                    { label: "更新时间", value: submitted ? "刚刚" : wo.rectificationInfo.updatedAt },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{item.label}</div>
                      <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>整改说明</div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {submitted
                      ? "整改反馈已提交，等待监理审核整改资料。"
                      : wo.rectificationInfo.summary}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>工地负责人信息</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "负责人", value: wo.assignedTo },
                { label: "岗位", value: wo.assignedRole },
                { label: "联系方式", value: wo.assignedPhone },
                { label: "责任单位", value: wo.unit },
                { label: "负责班组", value: wo.team },
                { label: "所属工地", value: wo.site },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{item.label}</div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {materials && (
            <div className="space-y-3">
              {Object.values(materials).map((item, index) => (
                <div key={item.title} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div className="relative">
                    <img src={item.img} alt={item.title} className="w-full object-cover" style={{ height: 132 }} />
                    <div
                      className="absolute left-3 top-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: index === 0 ? "var(--danger)" : "var(--primary)", color: "#fff" }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{item.title}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.time}</div>
                    </div>
                    <p className="text-xs leading-relaxed mt-1" style={{ color: "var(--muted-foreground)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isEditable && !submitted && (
            <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--accent)" }}>提交整改反馈</h3>
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
              <div>
                <div className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>整改说明</div>
                <textarea
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  rows={3}
                  placeholder="请描述整改情况，包括具体措施、完成情况和现场确认结果..."
                  className="w-full rounded-xl p-3 text-sm resize-none outline-none"
                  style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
          )}

          {submitted && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.3)" }}
            >
              <CheckCircle2 size={20} color="var(--success)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>整改反馈已提交</div>
                <div className="text-xs" style={{ color: "rgba(53,208,127,0.7)" }}>等待监理审核整改资料</div>
              </div>
            </div>
          )}

          {wo.status === "re-review" && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(95,180,255,0.08)", border: "1px solid rgba(95,180,255,0.25)" }}
            >
              <CheckCircle2 size={20} color="var(--accent)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>待监理审核</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>监理正在审核整改资料</div>
              </div>
            </div>
          )}

          {wo.status === "overdue" && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(255,74,74,0.08)", border: "1px solid rgba(255,74,74,0.22)" }}
            >
              <AlertCircle size={20} color="var(--danger)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--danger)" }}>整改已逾期</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>当前工单已逾期，系统将自动上报和统计逾期工单</div>
              </div>
            </div>
          )}

          {wo.status === "completed" && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(53,208,127,0.1)", border: "1px solid rgba(53,208,127,0.3)" }}
            >
              <CheckCircle2 size={20} color="var(--success)" />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--success)" }}>整改已完成</div>
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

function WorkOrderListTab({ onSelect }: { onSelect: (wo: ConstructionWorkOrder) => void }) {
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatusFilter>("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const siteOptions = ["all", ...Array.from(new Set(workOrders.map((item) => item.site)))];
  const typeOptions = ["all", ...Array.from(new Set(workOrders.map((item) => item.type)))];

  const filtered = workOrders.filter((w) => {
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    const matchesSite = siteFilter === "all" || w.site === siteFilter;
    const matchesType = typeFilter === "all" || w.type === typeFilter;
    const keyword = query.trim().toLowerCase();
    if (!keyword) return matchesStatus && matchesSite && matchesType;

    const searchable = `${w.id}${w.type}${w.site}${w.location}${w.deadline}${w.assignedTo}${w.unit}${w.requirement}`.toLowerCase();
    return matchesStatus && matchesSite && matchesType && searchable.includes(keyword);
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

      <div className="px-4 py-3 flex-shrink-0">
        <div className="rounded-xl p-3 grid grid-cols-2 gap-2.5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <label className="space-y-1">
            <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>状态</div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as WorkOrderStatusFilter)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {workOrderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>违规工单类型</div>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>{option === "all" ? "全部类型" : option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 col-span-2">
            <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>工地</div>
            <select
              value={siteFilter}
              onChange={(event) => setSiteFilter(event.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {siteOptions.map((option) => (
                <option key={option} value={option}>{option === "all" ? "全部工地" : option}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {filtered.map((wo) => (
          <div
            key={wo.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(wo)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(wo);
              }
            }}
            className="rounded-xl p-4 space-y-3 cursor-pointer active:opacity-80"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start gap-3">
              <img src={wo.img} alt={wo.type} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{wo.type}</div>
                      {wo.rectificationRound === 2 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(255,122,0,0.14)", color: "var(--caution)" }}
                        >
                          二次整改
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{wo.id}</div>
                  </div>
                  <ConstructionWorkOrderStatusBadge status={wo.status} small />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-xs" style={{ color: "var(--accent)" }}>{wo.site}</div>
                  <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                    <MapPin size={12} /><span style={{ fontSize: 12 }}>{wo.location}</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                    <Clock size={12} /><span style={{ fontSize: 12 }}>截止 {wo.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>责任单位: {wo.unit}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>创建时间: {wo.issueTime}</div>
                    <div className="text-xs mt-1" style={{ color: wo.status === "overdue" ? "var(--danger)" : "var(--muted-foreground)" }}>
                      {getConstructionStatusNote(wo)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0" style={{ color: "var(--accent)" }}>
                    <span style={{ fontSize: 12 }}>查看详情</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
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

function ConstructionHomeTab({ onViewOrders }: { onViewOrders: () => void }) {
  const rectifyingCount = workOrders.filter((w) => w.status === "rectifying").length;
  const reviewCount = workOrders.filter((w) => w.status === "re-review").length;
  const overdueCount = workOrders.filter((w) => w.status === "overdue").length;
  const completedCount = workOrders.filter((w) => w.status === "completed").length;
  const prioritized = [...workOrders]
    .sort((a, b) => {
      const priorityMap: Record<ConstructionWorkOrder["status"], number> = {
        overdue: 0,
        "re-review": 1,
        rectifying: 2,
        completed: 3,
      };
      return priorityMap[a.status] - priorityMap[b.status];
    })
    .slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110, border: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eaf4ff 58%, #f4f7fb 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--info)" }}>工地负责人端</div>
          <div className="font-bold" style={{ fontSize: 18, color: "var(--foreground)" }}>你好，张负责人</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>华建总承包 · 阳光城项目</div>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <ClipboardList size={72} color="var(--info)" />
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-4 gap-2">
        {[
          { label: "整改中", value: rectifyingCount, color: "var(--caution)", bg: "rgba(255,159,28,0.12)" },
          { label: "待审核", value: reviewCount, color: "var(--info)", bg: "rgba(95,180,255,0.1)" },
          { label: "逾期", value: overdueCount, color: "var(--danger)", bg: "rgba(255,74,74,0.1)" },
          { label: "已完成", value: completedCount, color: "var(--success)", bg: "rgba(53,208,127,0.1)" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-3 flex flex-col items-center" style={{ background: item.bg }}>
            <span className="font-bold" style={{ fontSize: 22, color: item.color }}>{item.value}</span>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>优先处理工单</h3>
          <button onClick={onViewOrders} style={{ color: "var(--accent)", fontSize: 12 }}>查看全部</button>
        </div>
        <div className="space-y-2">
          {prioritized.map((wo) => (
            <button
              key={wo.id}
              onClick={onViewOrders}
              className="w-full rounded-xl p-3 flex items-center gap-3 text-left active:opacity-70"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={wo.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>{wo.type}</div>
                  {wo.rectificationRound === 2 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                      style={{ background: "rgba(255,122,0,0.14)", color: "var(--caution)" }}
                    >
                      二次整改
                    </span>
                  )}
                </div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{wo.location}</div>
              </div>
              <ConstructionWorkOrderStatusBadge status={wo.status} small />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConstructionApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedWo, setSelectedWo] = useState<ConstructionWorkOrder | null>(null);

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
