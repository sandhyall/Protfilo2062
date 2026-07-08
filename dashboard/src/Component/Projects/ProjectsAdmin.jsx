// src/Component/Projects/ProjectsAdmin.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../api/axios.js";
import Sidebar from "../Common/Dashboard.jsx";
import { formatCurrency } from "../../utils/format.js";
import {
  Plus, Search, Filter, Edit2, Trash2, X, ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Loader2, FolderKanban, Building2, Wallet, Tag,
  Type, AlignLeft, Calendar, User, Layers, CreditCard, Check, MoreVertical,
  Clock, PauseCircle, XCircle, TrendingUp,
} from "lucide-react";

const API = "/projects";

const CATEGORIES = ["Web Development", "AI Services", "Mobile App", "UI/UX Design", "Maintenance", "Other"];
const STATUSES = ["ongoing", "completed", "on-hold", "cancelled"];
const CURRENCIES = ["USD", "NPR", "EUR", "GBP"];
const METHODS = ["Bank Transfer", "Cash", "eSewa", "Khalti", "PayPal", "Stripe", "Other"];

const EMPTY_FORM = {
  title: "", category: "Web Development", description: "", technologies: "",
  clientCompany: "", clientContact: "", cost: "", currency: "USD",
  status: "ongoing", startDate: "", endDate: "", payments: [],
};

const TABS = [
  { id: "details", label: "Details",       icon: FolderKanban },
  { id: "client",  label: "Client & Cost", icon: Building2    },
  { id: "payments",label: "Payments",      icon: CreditCard   },
];

const STATUS_STYLES = {
  ongoing:   { wrap: "bg-blue-50 text-[#154895] ring-blue-600/20",     dot: "bg-[#154895]",  icon: Clock },
  completed: { wrap: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500", icon: CheckCircle },
  "on-hold": { wrap: "bg-amber-50 text-amber-700 ring-amber-600/20",   dot: "bg-amber-400",   icon: PauseCircle },
  cancelled: { wrap: "bg-red-50 text-red-700 ring-red-600/20",         dot: "bg-red-400",     icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.ongoing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ring-inset capitalize ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {status.replace("-", " ")}
    </span>
  );
};

const OverdueBadge = () => (
  <span className="inline-flex items-center text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded whitespace-nowrap">
    OVERDUE
  </span>
);

const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-auto z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-semibold ${type === "error" ? "bg-red-600" : "bg-[#154895]"}`}
    style={{ animation: "slideUp .25s ease" }}>
    <style>{`@keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    {type === "error" ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
    <span className="flex-1">{msg}</span>
    <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity ml-1"><X className="w-3.5 h-3.5" /></button>
  </div>
);

const Field = ({ label, hint, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
      <span className="flex items-center gap-1.5">{Icon && <Icon className="w-3 h-3" />}{label}</span>
      {hint && <span className="font-normal normal-case tracking-normal text-slate-300">{hint}</span>}
    </label>
    {children}
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, accent }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl px-4 sm:px-5 py-4 sm:py-5 shadow-sm border border-slate-100 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${accent}`} />
    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <div className="min-w-0">
      <div className="text-lg sm:text-2xl font-bold text-slate-800 leading-none tabular-nums truncate">{value}</div>
      <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">{label}</div>
    </div>
  </div>
);

const inputCls    = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white placeholder:text-slate-300 outline-none focus:border-[#154895] focus:ring-2 focus:ring-[#154895]/10 transition-all";
const textareaCls = `${inputCls} resize-y leading-relaxed`;
const selectCls   = `${inputCls} appearance-none cursor-pointer`;

/* ---------------------------------------------------------------------- *
 * ProjectCard
 * The kebab (...) menu now positions itself using fixed coordinates
 * computed from the button's bounding rect, so it always renders above
 * the rest of the card content instead of being clipped by it.
 * ---------------------------------------------------------------------- */
const ProjectCard = ({ p, onEdit, onDelete, selected, onToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef();
  const btnRef = useRef();
  const totalPaid = (p.payments || []).reduce((s, x) => s + x.amount, 0);
  const balance = (p.cost || 0) - totalPaid;
  const isOverdue = ["ongoing", "on-hold"].includes(p.status) && p.endDate && new Date(p.endDate) < new Date() && balance > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const closeMenu = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  const toggleMenu = () => {
    if (!menuOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuWidth = 150;
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
      setMenuPos({ top: rect.bottom + 6, left });
    }
    setMenuOpen(v => !v);
  };

  return (
    <div className={`relative bg-white rounded-xl border transition-all ${selected ? "border-[#154895] ring-2 ring-[#154895]/15" : "border-slate-100 hover:border-slate-200 hover:shadow-sm"}`}>
      <div className="flex items-start gap-3 p-3">
        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#154895] cursor-pointer mt-0.5 shrink-0" checked={selected} onChange={onToggle} />
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <FolderKanban className="w-4 h-4 text-[#154895]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{p.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 truncate"><Building2 className="w-3 h-3 shrink-0" />{p.clientCompany}</p>
        </div>
        <div className="relative shrink-0">
          <button ref={btnRef} onClick={toggleMenu} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              style={{ top: menuPos.top, left: menuPos.left }}
              className="fixed z-[500] bg-white rounded-xl shadow-xl border border-slate-100 py-1 min-w-[140px]"
            >
              <button onClick={() => { onEdit(p); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Edit2 className="w-3.5 h-3.5 text-[#154895]" /> Edit
              </button>
              <button onClick={() => { onDelete(p._id); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 pb-3 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#154895] text-xs font-medium rounded-md">
          <Tag className="w-3 h-3" />{p.category}
        </span>
        <StatusBadge status={p.status} />
        {isOverdue && <OverdueBadge />}
        <span className="text-xs font-semibold text-slate-600 ml-auto tabular-nums">
          {formatCurrency(totalPaid, p.currency)} / {formatCurrency(p.cost, p.currency)}
        </span>
      </div>
    </div>
  );
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [selected, setSelected] = useState([]);
  const [stats, setStats] = useState({ total: 0, ongoing: 0, completed: 0 });
  const [payForm, setPayForm] = useState({ amount: "", date: "", method: "Bank Transfer", note: "" });

  const searchTimeout = useRef();
  const isMounted = useRef(true);

  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  const fetchProjects = useCallback(async ({ pg, status, q } = {}) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 8 };
      if (q) params.search = q;
      if (status) params.status = status;
      const { data } = await axios.get(`${API}/admin/all`, { params });
      if (!isMounted.current) return;
      setProjects(data.projects);
      setTotalPages(data.totalPages);
      setStats({ total: data.count, ongoing: data.ongoingCount ?? 0, completed: data.completedCount ?? 0 });
    } catch {
      if (isMounted.current) showToast("Failed to load projects", "error");
    }
    if (isMounted.current) setLoading(false);
  }, []);

  useEffect(() => { fetchProjects({ pg: page, status: statusFilter, q: search }); }, [page, statusFilter]); // eslint-disable-line

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setPage(1); fetchProjects({ pg: 1, status: statusFilter, q: val }); }, 350);
  };

  const handleStatusFilterChange = (val) => { setStatusFilter(val); setPage(1); setSelected([]); };
  const handlePageChange = (p) => { setPage(p); setSelected([]); };
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => { if (isMounted.current) setToast(null); }, 3200); };

  const openCreate = () => {
    setForm(EMPTY_FORM); setEditing(null); setActiveTab("details"); setModal("create");
  };

  const openEdit = (project) => {
    setForm({
      title: project.title || "", category: project.category || "Web Development",
      description: project.description || "", technologies: (project.technologies || []).join(", "),
      clientCompany: project.clientCompany || "", clientContact: project.clientContact || "",
      cost: project.cost ?? "", currency: project.currency || "USD", status: project.status || "ongoing",
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
      payments: project.payments || [],
    });
    setEditing(project); setActiveTab("details"); setModal("edit");
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.title || !form.clientCompany || !form.cost) {
      showToast("Title, client company and cost are required", "error"); return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (modal === "create") {
        await axios.post(API, payload);
        showToast("Project added");
      } else {
        await axios.put(`${API}/${editing._id}`, payload);
        showToast("Changes saved");
      }
      if (!isMounted.current) return;
      closeModal(); fetchProjects({ pg: page, status: statusFilter, q: search });
    } catch (e) {
      if (isMounted.current) showToast(e.response?.data?.message || "Save failed", "error");
    }
    if (isMounted.current) setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this project? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Project deleted");
      const remaining = projects.filter(p => p._id !== id).length;
      const newPage = remaining === 0 && page > 1 ? page - 1 : page;
      setPage(newPage); setSelected(s => s.filter(x => x !== id));
      fetchProjects({ pg: newPage, status: statusFilter, q: search });
    } catch { showToast("Failed to delete", "error"); }
  };

  // Bulk-delete the currently selected (checkbox) projects.
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Permanently delete ${selected.length} selected project(s)? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/bulk`, { data: { ids: selected } });
      showToast(`${selected.length} project(s) deleted`);
      const newPage = projects.length === selected.length && page > 1 ? page - 1 : page;
      setSelected([]); setPage(newPage);
      fetchProjects({ pg: newPage, status: statusFilter, q: search });
    } catch { showToast("Failed to delete selected projects", "error"); }
  };

  const handleAddPayment = async () => {
    if (!payForm.amount || Number(payForm.amount) <= 0 || !editing) { showToast("Enter a valid payment amount", "error"); return; }
    const amt = Number(payForm.amount);
    if (formBalance > 0 && amt > formBalance) {
      const proceed = window.confirm(
        `This payment (${formatCurrency(amt, form.currency)}) exceeds the remaining balance of ${formatCurrency(formBalance, form.currency)}. Record it anyway?`
      );
      if (!proceed) return;
    }
    try {
      const { data } = await axios.patch(`${API}/${editing._id}/payments`, {
        ...payForm, amount: amt, date: payForm.date || new Date().toISOString(),
      });
      setForm(f => ({ ...f, payments: data.payments }));
      setEditing(data);
      setPayForm({ amount: "", date: "", method: "Bank Transfer", note: "" });
      showToast("Payment recorded");
    } catch { showToast("Failed to record payment", "error"); }
  };

  // Delete a single payment record from the currently-edited project.
  const handleDeletePayment = async (paymentId) => {
    if (!editing || !paymentId) return;
    if (!window.confirm("Delete this payment record? This cannot be undone.")) return;
    try {
      const { data } = await axios.delete(`${API}/${editing._id}/payments/${paymentId}`);
      setForm(f => ({ ...f, payments: data.payments }));
      setEditing(data);
      showToast("Payment deleted");
    } catch { showToast("Failed to delete payment", "error"); }
  };

  const allSelected = projects.length > 0 && selected.length === projects.length;
  const toggleAll   = () => setSelected(allSelected ? [] : projects.map(p => p._id));
  const toggleOne   = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const totalContractValue = projects.reduce((s, p) => s + p.cost, 0);
  const totalPaid = (p) => (p.payments || []).reduce((s, x) => s + x.amount, 0);
  const isRowOverdue = (p) => ["ongoing", "on-hold"].includes(p.status) && p.endDate && new Date(p.endDate) < new Date() && (p.cost - totalPaid(p)) > 0;
  const formPaidTotal = form.payments.reduce((s, x) => s + x.amount, 0);
  const formBalance = (Number(form.cost) || 0) - formPaidTotal;

  return (
    <>
      <div className="flex min-h-screen bg-slate-50">
        <div className="fixed top-0 left-0 h-screen z-40 shrink-0"><Sidebar /></div>

        <div className="flex-1 w-full lg:ml-72 min-h-screen overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex items-center justify-between mb-6 mt-12 lg:mt-0">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Work</p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Projects</h1>
              </div>
              <button onClick={openCreate}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-[#154895] text-white text-sm font-semibold rounded-xl hover:bg-[#1240a0] active:scale-95 transition-all shadow-sm shadow-[#154895]/25">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatCard label="Total Projects" value={stats.total} icon={FolderKanban} color="bg-blue-50 text-[#154895]" accent="bg-[#154895]" />
              <StatCard label="Ongoing" value={stats.ongoing} icon={Clock} color="bg-amber-50 text-amber-600" accent="bg-amber-400" />
              <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" accent="bg-emerald-500" />
              <StatCard label="Contract Value (page)" value={formatCurrency(totalContractValue)} icon={Wallet} color="bg-violet-50 text-violet-600" accent="bg-violet-500" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
                <div className="relative flex-1 min-w-[140px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                  <input className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 placeholder:text-slate-300 outline-none focus:border-[#154895] focus:bg-white focus:ring-2 focus:ring-[#154895]/10 transition-all"
                    placeholder="Search projects or clients…" value={search} onChange={e => handleSearchChange(e.target.value)} />
                </div>
                <div className="relative shrink-0">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                  <select className="pl-8 pr-8 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none focus:border-[#154895] focus:ring-2 focus:ring-[#154895]/10 appearance-none transition-all cursor-pointer"
                    value={statusFilter} onChange={e => handleStatusFilterChange(e.target.value)}>
                    <option value="">All</option>
                    {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace("-", " ")}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                </div>
                {selected.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#154895] bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap">{selected.length} selected</span>
                    <button onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-7 h-7 text-[#154895] animate-spin" />
                  <p className="text-sm text-slate-400">Loading projects…</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-1">
                    <FolderKanban className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="font-semibold text-slate-600">No projects found</p>
                  <p className="text-sm text-slate-400 max-w-xs">
                    {search || statusFilter ? "Try adjusting your search or filters." : "Add the first client project to start tracking revenue."}
                  </p>
                  {!search && !statusFilter && (
                    <button onClick={openCreate} className="mt-2 flex items-center gap-2 px-4 py-2 bg-[#154895] text-white text-sm font-semibold rounded-lg hover:bg-[#1240a0] transition-colors">
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="lg:hidden p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 flex items-center gap-2 pb-1 border-b border-slate-100 mb-1">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#154895] cursor-pointer" checked={allSelected} onChange={toggleAll} />
                      <span className="text-xs text-slate-400 font-medium">Select all ({projects.length})</span>
                    </div>
                    {projects.map(p => (
                      <ProjectCard key={p._id} p={p} selected={selected.includes(p._id)} onToggle={() => toggleOne(p._id)} onEdit={openEdit} onDelete={handleDelete} />
                    ))}
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                          <th className="w-10 px-4 py-3">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#154895] cursor-pointer" checked={allSelected} onChange={toggleAll} />
                          </th>
                          {["Project", "Category", "Cost", "Paid", "Status", "Actions"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {projects.map(p => (
                          <tr key={p._id} className="group hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3.5">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-[#154895] cursor-pointer" checked={selected.includes(p._id)} onChange={() => toggleOne(p._id)} />
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                  <FolderKanban className="w-4 h-4 text-[#154895]" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate max-w-[220px]">{p.title}</p>
                                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" />{p.clientCompany}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#154895] text-xs font-medium rounded-md">
                                <Tag className="w-3 h-3" />{p.category}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 tabular-nums">{formatCurrency(p.cost, p.currency)}</td>
                            <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600 tabular-nums">
                              <div className="flex items-center gap-1.5">
                                {formatCurrency(totalPaid(p), p.currency)}
                                {isRowOverdue(p) && <OverdueBadge />}
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#154895] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                  <Edit2 className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-4 border-t border-slate-100 flex-wrap">
                  <button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-2 text-sm font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" /><span className="hidden sm:inline">Prev</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 text-sm font-semibold rounded-lg transition-colors ${p === page ? "bg-[#154895] text-white shadow-sm" : "text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-2 text-sm font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <span className="hidden sm:inline">Next</span><ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 lg:p-8 bg-slate-900/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white w-full sm:rounded-2xl sm:max-w-2xl lg:max-w-3xl shadow-2xl shadow-slate-900/20 overflow-hidden rounded-t-2xl sm:my-auto max-h-[95dvh] sm:max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#154895]/10 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-4 h-4 text-[#154895]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                    {modal === "create" ? "New Project" : "Editing"}
                  </p>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-none truncate max-w-[180px] sm:max-w-[300px]">
                    {modal === "create" ? "Add Project" : (form.title || "Project")}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <select className="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-600 outline-none focus:border-[#154895] cursor-pointer capitalize"
                    value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
                <button onClick={closeModal} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex gap-0.5 sm:gap-1 px-4 sm:px-6 pt-3 pb-0 border-b border-slate-100 shrink-0 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)} disabled={id === "payments" && modal === "create"}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 -mb-px whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed
                    ${activeTab === id ? "text-[#154895] border-[#154895] bg-blue-50/50" : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" /><span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

              {activeTab === "details" && (<>
                <Field label="Project Title" hint="required" icon={Type}>
                  <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. AI-Powered Customer Support Chatbot" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Category" icon={Tag}>
                    <div className="relative">
                      <select className={selectCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Technologies" hint="comma-separated" icon={Layers}>
                    <input className={inputCls} value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))}
                      placeholder="React, Node.js, OpenAI API" />
                  </Field>
                </div>
                <Field label="Description" icon={AlignLeft}>
                  <textarea className={textareaCls} style={{ minHeight: 100 }} value={form.description}
                    placeholder="Brief scope of work"
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Start Date" icon={Calendar}>
                    <input type="date" className={inputCls} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                  </Field>
                  <Field label="End Date" icon={Calendar}>
                    <input type="date" className={inputCls} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  </Field>
                </div>
              </>)}

              {activeTab === "client" && (<>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Client Company" hint="required" icon={Building2}>
                    <input className={inputCls} value={form.clientCompany} onChange={e => setForm(f => ({ ...f, clientCompany: e.target.value }))} placeholder="Client's company name" />
                  </Field>
                  <Field label="Client Contact" icon={User}>
                    <input className={inputCls} value={form.clientContact} onChange={e => setForm(f => ({ ...f, clientContact: e.target.value }))} placeholder="Email or phone" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Total Cost" hint="required" icon={Wallet}>
                    <input type="number" min="0" className={inputCls} value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} placeholder="5000" />
                  </Field>
                  <Field label="Currency" icon={Wallet}>
                    <div className="relative">
                      <select className={selectCls} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                    </div>
                  </Field>
                </div>
                {modal === "edit" && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paid so far</p>
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(formPaidTotal, form.currency)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balance</p>
                      <p className={`text-lg font-bold ${formBalance > 0 ? "text-slate-700" : "text-emerald-600"}`}>{formatCurrency(formBalance, form.currency)}</p>
                    </div>
                  </div>
                )}
              </>)}

              {activeTab === "payments" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Record a payment</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input type="number" min="0" className={inputCls} placeholder="Amount" value={payForm.amount}
                        onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} />
                      <input type="date" className={inputCls} value={payForm.date}
                        onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="relative">
                        <select className={selectCls} value={payForm.method} onChange={e => setPayForm(f => ({ ...f, method: e.target.value }))}>
                          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                      </div>
                      <input className={inputCls} placeholder="Note (optional)" value={payForm.note}
                        onChange={e => setPayForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                    <button onClick={handleAddPayment}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#154895] rounded-lg hover:bg-[#1240a0] transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Payment
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment history</p>
                    {form.payments.length === 0 ? (
                      <p className="text-center text-sm text-slate-300 py-6">No payments recorded yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                        {[...form.payments].sort((a, b) => new Date(b.date) - new Date(a.date)).map((pay, i) => (
                          <div key={pay._id || i} className="flex items-center justify-between px-4 py-3 bg-white gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-700">{formatCurrency(pay.amount, form.currency)}</p>
                              <p className="text-xs text-slate-400">{new Date(pay.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {pay.method}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {pay.note && <p className="text-xs text-slate-400 italic max-w-[100px] sm:max-w-[160px] text-right truncate">{pay.note}</p>}
                              {pay._id && (
                                <button
                                  onClick={() => handleDeletePayment(pay._id)}
                                  title="Delete payment"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 gap-2">
              <button onClick={closeModal} className="px-3 sm:px-4 py-2.5 text-sm font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white bg-[#154895] rounded-xl hover:bg-[#1240a0] disabled:opacity-60 active:scale-95 transition-all shadow-sm shadow-[#154895]/25">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline">Saving…</span></> : <><Check className="w-4 h-4" /><span>{modal === "create" ? "Add Project" : "Save Changes"}</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}