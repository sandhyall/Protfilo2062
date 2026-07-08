// src/Component/Common/Dashboard.jsx
// Sidebar (default export) + DashboardStats (named export, "/" route)

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, NotebookPen, FolderKanban, Wallet,
  LogOut, User, Menu, X, ChevronRight, MessageSquare, Circle,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Eye, Mail, Globe, MousePointerClick, TrendingUp,
  RefreshCw, Activity, BarChart2, Loader2,
  ArrowUpRight, ArrowDownRight, Clock, Briefcase,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import api from "../../api/axios.js";
import { formatCurrency } from "../../utils/format.js";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/hero.png";

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [liveStats, setLiveStats] = useState({ ai: 0, human: 0 });
  const { user, logout, loginTime } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLoginDuration = () => {
    if (!loginTime) return "Just now";
    const diffMins = Math.floor((new Date() - new Date(loginTime)) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return diffHours < 24 ? `${diffHours}h ago` : `${Math.floor(diffHours / 24)}d ago`;
  };

//   Uncomment to enable live chat badge polling
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/conversations");
        const convs = data.conversations || [];
        setLiveStats({
          ai: convs.filter((c) => c.status === "AI").length,
          human: convs.filter((c) => c.status === "HUMAN").length,
        });
      } catch { /* silently ignore */ }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalActive = liveStats.ai + liveStats.human;

  const navItems = [
    { name: "Dashboard", path: "/",         icon: LayoutDashboard },
    { name: "Blog",      path: "/blog",     icon: NotebookPen     },
    { name: "Projects",  path: "/projects", icon: FolderKanban    },
    { name: "Revenue",   path: "/revenue",  icon: Wallet          },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#154895] text-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        flex flex-col border-r border-slate-800 shadow-2xl
      `}>

        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Sandesh Innovations" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Sandesh Innovations</h2>
              <p className="text-[10px] uppercase tracking-[2px] text-blue-400 font-bold">Admin Panel</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="mx-4 my-6 p-4 bg-slate-800/40 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#154895]/20 border border-[#154895]/30 flex items-center justify-center text-blue-400">
                <User size={24} />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-medium text-green-400">Active: {getLoginDuration()}</span>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Management</p>

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                ${isActive(item.path) ? "bg-[#154895] text-white shadow-lg" : "hover:bg-slate-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-blue-400"} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive(item.path) && <ChevronRight size={16} />}
            </Link>
          ))}

          <p className="px-4 pt-5 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Live Support</p>

          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
              ${isActive("/chat") ? "bg-[#154895] text-white shadow-lg" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className={isActive("/chat") ? "text-white" : "text-slate-400 group-hover:text-blue-400"} />
              <span className="text-sm font-medium">Live Chat</span>
            </div>
            <div className="flex items-center gap-2">
              {totalActive > 0 && !isActive("/chat") && (
                <span className="flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  <Circle size={5} className="fill-white" />{totalActive}
                </span>
              )}
              {isActive("/chat") && <ChevronRight size={16} />}
            </div>
          </Link>

          {(isActive("/chat") || totalActive > 0) && (
            <div className="mx-2 px-3 py-2.5 bg-slate-800/60 rounded-xl border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />AI Active
                </span>
                <span className="text-blue-300 font-bold">{liveStats.ai}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Human Active
                </span>
                <span className="text-green-300 font-bold">{liveStats.human}</span>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
          <div className="px-4 py-2">
            <p className="text-[10px] text-slate-500">© 2026 Sandesh Innovations</p>
            <p className="text-[10px] text-slate-600 mt-1">Web Development &amp; AI Services</p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS PAGE  (/  route)
// ═══════════════════════════════════════════════════════════════════════════

const STATS_API = "/stats";
const PIE_COLORS = ["#154895", "#1D9E75", "#534AB7", "#EF9F27", "#D85A30"];
const SOURCE_COLORS = { direct: "#154895", google: "#1D9E75", facebook: "#534AB7", whatsapp: "#EF9F27", referral: "#D85A30" };
const DOT_COLORS = { enquiry: "bg-emerald-400", visit: "bg-[#154895]", job: "bg-amber-400", default: "bg-slate-300" };

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0));

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const PctBadge = ({ value }) => (
  <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full
    ${value >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
    {value >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
    {Math.abs(value)}%
  </span>
);

const StatCard = ({ label, value, icon: Icon, color, accent, change, sub }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl px-4 sm:px-5 py-4 sm:py-5 shadow-sm border border-slate-100 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${accent}`} />
    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xl sm:text-2xl font-bold text-slate-800 leading-none tabular-nums">{value}</div>
      <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 leading-tight">{label}</div>
      {(change !== undefined || sub) && (
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
          {change !== undefined && <PctBadge value={change} />}
          {sub && <span className="text-[10px] sm:text-[11px] text-slate-400">{sub}</span>}
        </div>
      )}
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400" />{title}
    </h2>
    {action}
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-600 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: <span className="tabular-nums">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export function DashboardStats() {
  const [overview, setOverview] = useState(null);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [sources, setSources] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [ov, dv, src, proj, act] = await Promise.all([
        api.get(`${STATS_API}/overview`),
        api.get(`${STATS_API}/visits-daily`),
        api.get(`${STATS_API}/enquiry-sources`),
        api.get(`${STATS_API}/top-projects`),
        api.get(`${STATS_API}/recent-activity`),
      ]);
      if (!isMounted.current) return;
      setOverview(ov.data);
      setDailyVisits(dv.data);
      setSources(src.data);
      setTopProjects(proj.data);
      setActivity(act.data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Stats fetch failed", e);
    }
    if (!isMounted.current) return;
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const maxVisit = Math.max(...dailyVisits.map((d) => d.count), 1);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="fixed top-0 left-0 h-screen z-40 shrink-0"><Sidebar /></div>
        <div className="flex-1 w-full lg:ml-72 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#154895] animate-spin" />
            <p className="text-sm text-slate-400">Loading dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="fixed top-0 left-0 h-screen z-40 shrink-0"><Sidebar /></div>

      <div className="flex-1 w-full lg:ml-72 min-h-screen overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-6 mt-12 lg:mt-0">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overview</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && <span className="hidden sm:block text-xs text-slate-400">Updated {timeAgo(lastUpdated)}</span>}
              <button onClick={() => fetchAll(true)} disabled={refreshing}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm disabled:opacity-60">
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard icon={Eye} label="Total Visits" value={fmt(overview?.totalVisits)}
              color="bg-blue-50 text-[#154895]" accent="bg-[#154895]" change={overview?.visitChangePercent} sub="vs last month" />
            <StatCard icon={Mail} label="Total Enquiries" value={fmt(overview?.totalEnquiries)}
              color="bg-emerald-50 text-emerald-600" accent="bg-emerald-500" change={overview?.enquiryChangePercent} sub="vs last month" />
            <StatCard icon={Globe} label="This Month Visits" value={fmt(overview?.visitsThisMonth)}
              color="bg-violet-50 text-violet-600" accent="bg-violet-500" sub="current month" />
            <StatCard icon={MousePointerClick} label="Enquiries This Month" value={fmt(overview?.enquiriesThisMonth)}
              color="bg-amber-50 text-amber-600" accent="bg-amber-400" sub="current month" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={Activity} title="Visits — Last 7 Days"
                action={<span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#154895] inline-block" />Visits</span>} />
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dailyVisits} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gVisit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#154895" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#154895" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="count" name="Visits" stroke="#154895" strokeWidth={2} fill="url(#gVisit)"
                    dot={{ fill: "#154895", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={Globe} title="Traffic Sources" />
              {sources.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-slate-300">No source data yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={sources} dataKey="count" nameKey="source" cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} strokeWidth={0}>
                        {sources.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-xs">
                            <p className="font-semibold capitalize text-slate-600">{payload[0].name}</p>
                            <p className="text-slate-500">{payload[0].value} enquiries</p>
                          </div>
                        ) : null} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {sources.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-slate-500 capitalize">{s.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-14 sm:w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.percent}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                          <span className="font-semibold text-slate-700 w-8 text-right tabular-nums">{s.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={BarChart2} title="Enquiries by Source" />
              {sources.length === 0 ? (
                <div className="flex items-center justify-center h-[180px] text-sm text-slate-300">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={sources} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="source" type="category" width={64} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Enquiries" radius={[0, 6, 6, 0]}>
                      {sources.map((s, i) => <Cell key={i} fill={SOURCE_COLORS[s.source] || PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={Briefcase} title="Top Projects by Value" />
              {topProjects.length === 0 ? (
                <div className="flex items-center justify-center h-[180px] text-sm text-slate-300">No project data yet</div>
              ) : (
                <div className="space-y-3">
                  {topProjects.map((p, i) => {
                    const maxCost = Math.max(...topProjects.map((x) => x.cost), 1);
                    const pct = Math.round((p.cost / maxCost) * 100);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[11px] font-bold text-slate-300 tabular-nums w-4 shrink-0">{i + 1}</span>
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {p.title}{p.clientCompany ? ` — ${p.clientCompany}` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
                            <span className="text-xs font-bold text-slate-600 tabular-nums">{formatCurrency(p.cost)}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                              p.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                              p.status === "cancelled" ? "bg-red-50 text-red-500" :
                              p.status === "on-hold" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-700"
                            }`}>{p.status}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-[#154895] transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={TrendingUp} title="Daily Visit Breakdown" />
              {dailyVisits.length === 0 ? (
                <div className="flex items-center justify-center h-[120px] text-sm text-slate-300">No data</div>
              ) : (
                <>
                  <div className="flex items-end gap-1 sm:gap-1.5 h-20 mb-3">
                    {dailyVisits.map((d, i) => {
                      const h = maxVisit > 0 ? Math.round((d.count / maxVisit) * 100) : 10;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center group relative">
                          <div className="w-full rounded-t-md bg-[#154895]/20 group-hover:bg-[#154895]/50 transition-colors cursor-pointer"
                            style={{ height: `${Math.max(h, 8)}%` }} title={`${d.day}: ${d.count} visits`} />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                            {d.count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mb-3">
                    {dailyVisits.map((d, i) => (
                      <span key={i} className="flex-1 text-center text-[10px] text-slate-400 font-medium">{d.day}</span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
                    <span>Peak: <span className="font-bold text-slate-600">{Math.max(...dailyVisits.map((d) => d.count)).toLocaleString()}</span></span>
                    <span>Avg: <span className="font-bold text-slate-600">{Math.round(dailyVisits.reduce((s, d) => s + d.count, 0) / (dailyVisits.length || 1)).toLocaleString()}</span></span>
                    <span>Total: <span className="font-bold text-slate-600">{dailyVisits.reduce((s, d) => s + d.count, 0).toLocaleString()}</span></span>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={Clock} title="Recent Activity" />
              {activity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[160px] gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">No recent activity</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {activity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${DOT_COLORS[a.type] || DOT_COLORS.default}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-snug">{a.message}</p>
                        {a.source && a.source !== "direct" && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded capitalize">
                            via {a.source}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 mt-0.5">{timeAgo(a.time)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}