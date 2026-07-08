import React from 'react'

const Stat = ({ label, value, textColor }) => (
  <div className="flex-1 min-w-0 px-4 py-2.5 border-r last:border-r-0 border-gray-200">
    <p className="text-xs text-gray-500 truncate">{label}</p>
    <p className="text-xl font-bold" style={{ color: textColor }}>{value}</p>
  </div>
)

const StatsBar = ({ stats }) => (
  <div className="bg-white border-b border-gray-200 flex flex-shrink-0">
    <Stat label="Total"        value={stats.total}  textColor="#1f2937" />
    <Stat label="AI Active"    value={stats.ai}     textColor="#154895" />
    <Stat label="Human Active" value={stats.human}  textColor="#16a34a" />
    <Stat label="Closed"       value={stats.closed} textColor="#9ca3af" />
  </div>
)

export default StatsBar