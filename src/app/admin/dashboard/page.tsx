"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays, Users, Quote, Plus, Pencil, Trash2,
  Save, X, LogOut, Home, ChevronDown, ImagePlus, Loader2,
} from "lucide-react";
import type { FamilyEvent, FamilyMember, FamilyMotto } from "@/data/types";

const CATEGORIES = [
  { value: "milestone", label: "里程碑" },
  { value: "daily", label: "日常" },
  { value: "tradition", label: "传统" },
  { value: "achievement", label: "成就" },
];

const ICONS = [
  "Heart", "Baby", "GraduationCap", "Home", "Star",
  "Plane", "Award", "Camera", "Briefcase", "Globe", "Calendar",
];

const EMOJIS = ["👴", "👵", "👨", "👩", "🧑", "👧", "👦", "👶", "🧓", "💁", "🙋", "🧒"];

const COLORS = [
  "#8B7355", "#CD853F", "#4682B4", "#DB7093", "#6A5ACD",
  "#FF69B4", "#2E8B57", "#DAA520", "#708090", "#E8725A",
];

type Tab = "events" | "members" | "mottos";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("events");
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [mottos, setMottos] = useState<FamilyMotto[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // 编辑状态
  const [editingEvent, setEditingEvent] = useState<FamilyEvent | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMotto, setNewMotto] = useState({ content: "", source: "" });
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [evtRes, memRes, motRes] = await Promise.all([
      fetch("/api/events"),
      fetch("/api/members"),
      fetch("/api/mottos"),
    ]);
    setEvents(await evtRes.json());
    setMembers(await memRes.json());
    setMottos(await motRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
      return;
    }
    let active = true;
    (async () => {
      const [evtRes, memRes, motRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/members"),
        fetch("/api/mottos"),
      ]);
      if (!active) return;
      setEvents(await evtRes.json());
      setMembers(await memRes.json());
      setMottos(await motRes.json());
      setLoading(false);
    })();
    return () => { active = false; };
  }, [router]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !editingEvent) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setEditingEvent({
          ...editingEvent,
          photos: [...editingEvent.photos, ...data.urls],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url: string) => {
    if (!editingEvent) return;
    setEditingEvent({
      ...editingEvent,
      photos: editingEvent.photos.filter((p) => p !== url),
    });
  };

  const handleMemberPhotoUpload = async (files: FileList | null) => {
    if (!files || !files[0] || !editingMember) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", files[0]);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.urls[0]) {
        setEditingMember({ ...editingMember, photo: data.urls[0] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  // ====== Event CRUD ======
  const emptyEvent: FamilyEvent = {
    id: "", title: "", date: "", year: new Date().getFullYear(),
    category: "milestone", description: "", photos: [], memberIds: [], icon: "Calendar",
  };

  const openNewEvent = () => {
    const ts = Date.now();
    setEditingEvent({ ...emptyEvent, id: `evt-${ts}` });
    setShowEventForm(true);
  };

  const openEditEvent = (evt: FamilyEvent) => {
    setEditingEvent({ ...evt });
    setShowEventForm(true);
  };

  const saveEvent = async () => {
    if (!editingEvent) return;
    // 自动填充年份
    const eventToSave = { ...editingEvent };
    if (eventToSave.date) {
      eventToSave.year = parseInt(eventToSave.date.substring(0, 4));
    }
    const exists = events.find((e) => e.id === eventToSave.id);
    const method = exists ? "PUT" : "POST";
    await fetch("/api/events", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSave),
    });
    flash(exists ? "事件已更新 ✓" : "事件已添加 ✓");
    setShowEventForm(false);
    setEditingEvent(null);
    fetchData();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("确定删除这个事件吗？")) return;
    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    flash("事件已删除 ✓");
    fetchData();
  };

  // ====== Member CRUD ======
  const emptyMember: FamilyMember = {
    id: "", name: "", avatar: "🧑", relation: "",
    birthday: "", bio: "", color: "#4682B4",
  };

  const openNewMember = () => {
    const ts = Date.now();
    setEditingMember({ ...emptyMember, id: `member-${ts}` });
    setShowMemberForm(true);
  };

  const openEditMember = (m: FamilyMember) => {
    setEditingMember({ ...m });
    setShowMemberForm(true);
  };

  const saveMember = async () => {
    if (!editingMember) return;
    const exists = members.find((m) => m.id === editingMember.id);
    const method = exists ? "PUT" : "POST";
    await fetch("/api/members", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingMember),
    });
    flash(exists ? "成员已更新 ✓" : "成员已添加 ✓");
    setShowMemberForm(false);
    setEditingMember(null);
    fetchData();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("确定删除这个成员吗？")) return;
    await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    flash("成员已删除 ✓");
    fetchData();
  };

  // ====== Motto CRUD ======
  const addMotto = async () => {
    if (!newMotto.content) return;
    await fetch("/api/mottos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMotto),
    });
    flash("格言已添加 ✓");
    setNewMotto({ content: "", source: "" });
    fetchData();
  };

  const deleteMotto = async (index: number) => {
    if (!confirm("确定删除这条格言吗？")) return;
    await fetch("/api/mottos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    flash("格言已删除 ✓");
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <p className="text-warm-400">加载中...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof CalendarDays; count: number }[] = [
    { key: "events", label: "事件管理", icon: CalendarDays, count: events.length },
    { key: "members", label: "家人管理", icon: Users, count: members.length },
    { key: "mottos", label: "格言管理", icon: Quote, count: mottos.length },
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      {/* 顶栏 */}
      <header className="sticky top-0 z-50 bg-warm-800 text-warm-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏠</span>
            <span className="font-bold" style={{ fontFamily: "var(--font-serif-sc)" }}>
              时光记 · 管理后台
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="flex items-center gap-1 text-sm text-warm-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <Home size={14} />
              <span className="hidden sm:inline">查看网站</span>
            </a>
            <button onClick={logout} className="flex items-center gap-1 text-sm text-warm-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <LogOut size={14} />
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </div>
      </header>

      {/* 提示消息 */}
      {msg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-2 rounded-full text-sm shadow-lg animate-bounce">
          {msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-warm-100 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-accent text-white shadow-sm"
                  : "text-warm-500 hover:text-warm-700 hover:bg-warm-50"
              }`}
            >
              <t.icon size={16} />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? "bg-white/20" : "bg-warm-100"
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* ========== 事件管理 ========== */}
        {tab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-warm-800">全部事件</h2>
              <button onClick={openNewEvent} className="flex items-center gap-1 bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent/90 transition-all">
                <Plus size={16} /> 添加事件
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-warm-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-100 bg-warm-50/50">
                    <th className="text-left px-4 py-3 text-warm-500 font-medium">事件</th>
                    <th className="text-left px-4 py-3 text-warm-500 font-medium hidden md:table-cell">日期</th>
                    <th className="text-left px-4 py-3 text-warm-500 font-medium hidden md:table-cell">分类</th>
                    <th className="text-left px-4 py-3 text-warm-500 font-medium hidden lg:table-cell">成员</th>
                    <th className="text-right px-4 py-3 text-warm-500 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {[...events].sort((a, b) => b.year - a.year).map((evt) => (
                    <tr key={evt.id} className="border-b border-warm-50 hover:bg-warm-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-warm-800">{evt.title}</td>
                      <td className="px-4 py-3 text-warm-500 hidden md:table-cell">{evt.date}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600">
                          {CATEGORIES.find((c) => c.value === evt.category)?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {evt.memberIds.slice(0, 3).map((mid) => {
                            const m = members.find((x) => x.id === mid);
                            return m ? <span key={mid} className="text-xs">{m.avatar}</span> : null;
                          })}
                          {evt.memberIds.length > 3 && <span className="text-xs text-warm-400">+{evt.memberIds.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditEvent(evt)} className="p-1.5 rounded-lg hover:bg-warm-100 text-warm-400 hover:text-warm-700 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteEvent(evt.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-warm-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 事件表单弹窗 */}
            {showEventForm && editingEvent && (
              <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowEventForm(false)}>
                <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-warm-800">
                      {events.find((e) => e.id === editingEvent.id) ? "编辑事件" : "添加事件"}
                    </h3>
                    <button onClick={() => setShowEventForm(false)} className="p-1 rounded-lg hover:bg-warm-100 text-warm-400">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">标题 *</label>
                      <input
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                        placeholder="例：全家去三亚旅行"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-warm-600 mb-1 block">日期 *</label>
                        <input
                          type="date"
                          value={editingEvent.date}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-warm-600 mb-1 block">分类</label>
                        <div className="relative">
                          <select
                            value={editingEvent.category}
                            onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as FamilyEvent["category"] })}
                            className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent appearance-none"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">描述</label>
                      <textarea
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent resize-none"
                        placeholder="记录下这个故事的细节..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">图标</label>
                      <div className="flex flex-wrap gap-2">
                        {ICONS.map((icon) => (
                          <button
                            key={icon}
                            onClick={() => setEditingEvent({ ...editingEvent, icon })}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                              editingEvent.icon === icon
                                ? "border-accent bg-accent/10 text-accent font-medium"
                                : "border-warm-200 text-warm-500 hover:border-warm-300"
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">照片</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingEvent.photos.map((url) => (
                          <div key={url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-warm-200">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removePhoto(url)}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                        <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-warm-300 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                          {uploading ? <Loader2 size={20} className="text-warm-400 animate-spin" /> : <ImagePlus size={20} className="text-warm-400" />}
                          <span className="text-[10px] text-warm-400 mt-1">{uploading ? "上传中" : "添加"}</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUpload(e.target.files)}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">关联家人</label>
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => {
                          const selected = editingEvent.memberIds.includes(m.id);
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                const ids = selected
                                  ? editingEvent.memberIds.filter((id) => id !== m.id)
                                  : [...editingEvent.memberIds, m.id];
                                setEditingEvent({ ...editingEvent, memberIds: ids });
                              }}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                                selected
                                  ? "border-accent bg-accent/10 text-accent font-medium"
                                  : "border-warm-200 text-warm-500 hover:border-warm-300"
                              }`}
                            >
                              {m.avatar} {m.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-warm-100">
                    <button
                      onClick={saveEvent}
                      disabled={!editingEvent.title || !editingEvent.date}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Save size={16} /> 保存
                    </button>
                    <button
                      onClick={() => setShowEventForm(false)}
                      className="px-6 py-2.5 rounded-xl border border-warm-200 text-warm-500 hover:bg-warm-50 transition-all"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== 家人管理 ========== */}
        {tab === "members" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-warm-800">全部家人</h2>
              <button onClick={openNewMember} className="flex items-center gap-1 bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent/90 transition-all">
                <Plus size={16} /> 添加家人
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl p-5 border border-warm-100 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {m.photo ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-warm-100 flex-shrink-0">
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-3xl">{m.avatar}</span>
                      )}
                      <div>
                        <p className="font-bold text-warm-800">{m.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: m.color }}>
                          {m.relation}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditMember(m)} className="p-1.5 rounded-lg hover:bg-warm-100 text-warm-400 hover:text-warm-700 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteMember(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-warm-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-warm-400 mb-1">{m.birthday}</p>
                  <p className="text-sm text-warm-600 line-clamp-2">{m.bio}</p>
                </div>
              ))}
            </div>

            {/* 成员表单弹窗 */}
            {showMemberForm && editingMember && (
              <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowMemberForm(false)}>
                <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-warm-800">
                      {members.find((m) => m.id === editingMember.id) ? "编辑家人" : "添加家人"}
                    </h3>
                    <button onClick={() => setShowMemberForm(false)} className="p-1 rounded-lg hover:bg-warm-100 text-warm-400">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-warm-600 mb-1 block">姓名 *</label>
                        <input
                          value={editingMember.name}
                          onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-warm-600 mb-1 block">关系 *</label>
                        <input
                          value={editingMember.relation}
                          onChange={(e) => setEditingMember({ ...editingMember, relation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                          placeholder="如：爸爸、妈妈"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">出生日期</label>
                      <input
                        type="date"
                        value={editingMember.birthday}
                        onChange={(e) => setEditingMember({ ...editingMember, birthday: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">照片</label>
                      <div className="flex items-center gap-4 mb-3">
                        {editingMember.photo ? (
                          <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-warm-200">
                            <img src={editingMember.photo} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setEditingMember({ ...editingMember, photo: undefined })}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        ) : (
                          <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-warm-300 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                            {uploading ? <Loader2 size={20} className="text-warm-400 animate-spin" /> : <ImagePlus size={20} className="text-warm-400" />}
                            <span className="text-[10px] text-warm-400 mt-1">{uploading ? "上传中" : "上传照片"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMemberPhotoUpload(e.target.files)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">备用头像（表情）</label>
                      <div className="flex flex-wrap gap-2">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setEditingMember({ ...editingMember, avatar: emoji })}
                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                              editingMember.avatar === emoji
                                ? "border-accent bg-accent/10 scale-110"
                                : "border-warm-200 hover:border-warm-300"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">主题色</label>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setEditingMember({ ...editingMember, color })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              editingMember.color === color ? "border-warm-800 scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-warm-600 mb-1 block">简介</label>
                      <textarea
                        value={editingMember.bio}
                        onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-warm-100">
                    <button
                      onClick={saveMember}
                      disabled={!editingMember.name || !editingMember.relation}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Save size={16} /> 保存
                    </button>
                    <button
                      onClick={() => setShowMemberForm(false)}
                      className="px-6 py-2.5 rounded-xl border border-warm-200 text-warm-500 hover:bg-warm-50 transition-all"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== 格言管理 ========== */}
        {tab === "mottos" && (
          <div>
            <h2 className="text-lg font-bold text-warm-800 mb-4">家族格言</h2>

            {/* 现有格言 */}
            <div className="space-y-3 mb-6">
              {mottos.map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-warm-100 flex items-center justify-between">
                  <div>
                    <p className="text-warm-800 font-medium" style={{ fontFamily: "var(--font-serif-sc)" }}>
                      「{m.content}」
                    </p>
                    <p className="text-xs text-warm-400 mt-1">—— {m.source}</p>
                  </div>
                  <button onClick={() => deleteMotto(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-warm-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* 添加格言 */}
            <div className="bg-white rounded-2xl p-6 border border-warm-100">
              <h3 className="text-sm font-bold text-warm-700 mb-4">添加新格言</h3>
              <div className="space-y-3">
                <input
                  value={newMotto.content}
                  onChange={(e) => setNewMotto({ ...newMotto, content: e.target.value })}
                  placeholder="格言内容"
                  className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                />
                <input
                  value={newMotto.source}
                  onChange={(e) => setNewMotto({ ...newMotto, source: e.target.value })}
                  placeholder="来源（如：爷爷常说的话）"
                  className="w-full px-3 py-2 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 focus:outline-none focus:border-accent"
                />
                <button
                  onClick={addMotto}
                  disabled={!newMotto.content}
                  className="flex items-center gap-1 bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={16} /> 添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
