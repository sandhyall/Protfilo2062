// src/Component/Chat/MessageBubble.jsx
// All senderType logic preserved exactly.
// Design upgrade: gradient visitor bubbles, icon avatars, always-visible
// timestamps, smooth fade-in, better typography.

import React from 'react'

const MessageBubble = ({ message }) => {
  const { senderType, senderName, message: text, createdAt } = message

  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  // ── System pill ────────────────────────────────────────────────────────────
  if (senderType === 'system') {
    return (
      <div className="flex justify-center my-3" style={{ animation: 'msgFadeIn 0.25s ease-out' }}>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 px-4 py-1.5
          rounded-full border border-gray-200 bg-white shadow-sm font-medium italic">
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {text}
        </span>
      </div>
    )
  }

  const isVisitor   = senderType === 'visitor'
  const isAI        = senderType === 'ai'
  const isRecruiter = senderType === 'recruiter'

  return (
    <div
      className={`flex items-end gap-2 mb-2 ${isVisitor ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: 'msgFadeIn 0.2s ease-out' }}
    >
      {/* Avatar — AI / recruiter only */}
      {!isVisitor && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
            text-white text-[10px] font-bold shadow-sm mb-0.5"
          style={{ backgroundColor: isAI ? '#154895' : '#16a34a' }}
        >
          {isAI ? (
            // Tiny robot icon
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2zm0 2v1h2V4h-2zM9 9a1 1 0 000 2 1 1 0 000-2zm6 0a1 1 0 000 2 1 1 0 000-2zm-6 4v1h6v-1H9z"/>
            </svg>
          ) : (
            (senderName?.[0] || 'R').toUpperCase()
          )}
        </div>
      )}

      <div className={`max-w-[78%] flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}>
        {/* Sender label */}
        {!isVisitor && (
          <p className="text-[10px] font-semibold mb-1 px-1"
            style={{ color: isAI ? '#154895' : '#16a34a' }}>
            {isAI ? 'Sandesh Innovations AI' : (senderName || 'Recruiter')}
          </p>
        )}

        {/* Bubble */}
        <div
          className="px-3.5 py-2.5 text-sm leading-relaxed shadow-sm"
          style={
            isVisitor
              ? {
                  background: 'linear-gradient(135deg, #154895 0%, #1a5cbf 100%)',
                  color: '#ffffff',
                  borderRadius: '1.1rem 1.1rem 0.25rem 1.1rem',
                  boxShadow: '0 2px 8px rgba(21,72,149,0.25)',
                }
              : isAI
              ? {
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.25rem 1.1rem 1.1rem 1.1rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }
              : {
                  background: '#f0fdf4',
                  color: '#1f2937',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.25rem 1.1rem 1.1rem 1.1rem',
                  boxShadow: '0 1px 4px rgba(22,163,74,0.08)',
                }
          }
        >
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>

        {/* Timestamp — always visible, subtle */}
        {time && (
          <p className={`text-[10px] text-gray-300 mt-1 px-1 tabular-nums ${isVisitor ? 'text-right' : 'text-left'}`}>
            {time}
          </p>
        )}
      </div>
    </div>
  )
}

export default MessageBubble