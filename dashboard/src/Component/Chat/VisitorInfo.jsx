import React from 'react'

/**
 * VisitorInfo — optional side panel showing visitor details.
 * Import in Dashboard if you want a 3-column layout.
 */
const VisitorInfo = ({ visitor, conversation }) => {
  if (!visitor) return null

  return (
    <aside className="w-64 bg-white border-l border-gray-200 p-4 hidden xl:flex flex-col gap-4">
      <h3 className="font-semibold text-gray-700 text-sm">Visitor Info</h3>

      <div className="flex flex-col items-center text-center py-4 border-b border-gray-100">
        <div className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
          {(visitor.name?.[0] || '?').toUpperCase()}
        </div>
        <p className="font-semibold text-gray-800">{visitor.name}</p>
        <p className="text-xs text-gray-400">{visitor.email}</p>
      </div>

      <div className="space-y-3 text-sm">
        <InfoRow label="Status" value={conversation?.status} />
        <InfoRow label="First seen" value={visitor.createdAt ? new Date(visitor.createdAt).toLocaleDateString() : '—'} />
        <InfoRow label="Last seen" value={visitor.lastSeen ? new Date(visitor.lastSeen).toLocaleDateString() : '—'} />
      </div>
    </aside>
  )
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-2">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-700 font-medium text-right">{value || '—'}</span>
  </div>
)

export default VisitorInfo