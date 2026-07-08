// src/Component/Revenue/RevenueDashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../api/axios.js";
import Sidebar from "../Common/Dashboard.jsx";
import { formatCurrency } from "../../utils/format.js";
import {
  Wallet, TrendingUp, Calendar, PieChart as PieChartIcon,
  RefreshCw, Loader2, Clock, AlertTriangle, CreditCard,
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const API = "/revenue";
const PIE_COLORS = ["#154895", "#1D9E75", "#534AB7", "#EF9F27", "#D85A30", "#0EA5E9"];

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Icon className="w-4 h-4 text-slate-400" />{title}</h2>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, accent, sub }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl px-4 sm:px-5 py-4 sm:py-5 shadow-sm border border-slate-100 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow">
    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${accent}`} />
    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <div className="min-w-0">
      <div className="text-lg sm:text-2xl font-bold text-slate-800 leading-none tabular-nums truncate">{value}</div>
      <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">{label}</div>
      {sub && <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-600 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: <span className="tabular-nums">{formatCurrency(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export default function RevenueDashboard() {
  const [overview, setOverview] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [ov, mo, cat, pay] = await Promise.all([
        axios.get(`${API}/overview`),
        axios.get(`${API}/monthly`),
        axios.get(`${API}/by-category`),
        axios.get(`${API}/recent-payments`),
      ]);
      if (!isMounted.current) return;
      setOverview(ov.data);
      setMonthly(mo.data);
      setByCategory(cat.data);
      setRecentPayments(pay.data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Revenue fetch failed", e);
    }
    if (!isMounted.current) return;
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <div className="fixed top-0 left-0 h-screen z-40 shrink-0"><Sidebar /></div>
        <div className="flex-1 w-full lg:ml-72 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#154895] animate-spin" />
            <p className="text-sm text-slate-400">Loading revenue…</p>
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
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Finance</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Revenue</h1>
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
            <StatCard icon={Wallet} label="Total Revenue" value={formatCurrency(overview?.totalRevenue)}
              color="bg-blue-50 text-[#154895]" accent="bg-[#154895]" sub="all-time received" />
            <StatCard icon={Calendar} label="This Month" value={formatCurrency(overview?.revenueThisMonth)}
              color="bg-emerald-50 text-emerald-600" accent="bg-emerald-500" sub="revenue received" />
            <StatCard icon={TrendingUp} label="This Year" value={formatCurrency(overview?.revenueThisYear)}
              color="bg-violet-50 text-violet-600" accent="bg-violet-500" sub="year to date" />
            <StatCard icon={AlertTriangle} label="Outstanding" value={formatCurrency(overview?.outstandingBalance)}
              color="bg-amber-50 text-amber-600" accent="bg-amber-400" sub="yet to be collected" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={TrendingUp} title="Revenue — Last 12 Months" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#154895" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#154895" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v).replace(/\.00$/, "")} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#154895" strokeWidth={2} fill="url(#gRevenue)"
                    dot={{ fill: "#154895", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <SectionHeader icon={PieChartIcon} title="Revenue by Category" />
              {byCategory.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-slate-300">No revenue yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={byCategory} dataKey="revenue" nameKey="category" cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} strokeWidth={0}>
                        {byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-xs">
                            <p className="font-semibold text-slate-600">{payload[0].name}</p>
                            <p className="text-slate-500">{formatCurrency(payload[0].value)}</p>
                          </div>
                        ) : null} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {byCategory.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-slate-500">{c.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-14 sm:w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${c.percent}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                          <span className="font-semibold text-slate-700 w-10 text-right tabular-nums">{c.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
            <SectionHeader icon={CreditCard} title="Recent Payments" />
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[160px] gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Clock className="w-5 h-5 text-slate-300" /></div>
                <p className="text-sm text-slate-400">No payments recorded yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentPayments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 flex-wrap gap-1">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{p.projectTitle}</p>
                      <p className="text-xs text-slate-400">{p.clientCompany} · {p.method}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-600 tabular-nums">{formatCurrency(p.amount, p.currency)}</p>
                      <p className="text-[11px] text-slate-400">{timeAgo(p.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}