// backend/controllers/revenue.controller.js
import Project from "../models/ProjectModel.js";

export const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const projects = await Project.find({});

    let totalRevenue = 0, revenueThisMonth = 0, revenueThisYear = 0, totalContractValue = 0;

    projects.forEach((p) => {
      totalContractValue += p.cost;
      p.payments.forEach((pay) => {
        totalRevenue += pay.amount;
        if (pay.date >= startOfMonth) revenueThisMonth += pay.amount;
        if (pay.date >= startOfYear) revenueThisYear += pay.amount;
      });
    });

    res.json({
      totalRevenue,
      revenueThisMonth,
      revenueThisYear,
      totalContractValue,
      outstandingBalance: totalContractValue - totalRevenue,
      totalProjects: projects.length,
      ongoingProjects: projects.filter((p) => p.status === "ongoing").length,
      completedProjects: projects.filter((p) => p.status === "completed").length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }), revenue: 0 });
    }
    const map = Object.fromEntries(months.map((m) => [m.key, m]));

    const projects = await Project.find({}, "payments");
    projects.forEach((p) => {
      p.payments.forEach((pay) => {
        const key = `${pay.date.getFullYear()}-${pay.date.getMonth()}`;
        if (map[key]) map[key].revenue += pay.amount;
      });
    });

    res.json(months.map(({ label, revenue }) => ({ month: label, revenue })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRevenueByCategory = async (req, res) => {
  try {
    const projects = await Project.find({});
    const byCategory = {};
    projects.forEach((p) => {
      const total = p.payments.reduce((s, pay) => s + pay.amount, 0);
      byCategory[p.category] = (byCategory[p.category] || 0) + total;
    });
    const total = Object.values(byCategory).reduce((s, v) => s + v, 0) || 1;
    res.json(
      Object.entries(byCategory).map(([category, revenue]) => ({
        category, revenue, percent: Math.round((revenue / total) * 100),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentPayments = async (req, res) => {
  try {
    const projects = await Project.find({}, "title clientCompany currency payments").limit(50);
    const payments = [];
    projects.forEach((p) => {
      p.payments.forEach((pay) => {
        payments.push({
          projectTitle: p.title,
          clientCompany: p.clientCompany,
          currency: p.currency,
          amount: pay.amount,
          date: pay.date,
          method: pay.method,
        });
      });
    });
    payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(payments.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};