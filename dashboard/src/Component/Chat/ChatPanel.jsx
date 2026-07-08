// src/Component/Chat/ChatPanel.jsx
// All existing functionality preserved: send, take over, close (with confirm
// modal), hand back to AI (with confirm modal), back navigation, AI typing
// indicator state.
// Design upgrade: date separators between messages from different calendar
// days, generously sized header action buttons (always show icon + label —
// no more guessing what a tiny icon-only button does on a phone), refined
// bubbles, input bar, and confirmation modals.

import React, { useState, useRef, useEffect, useMemo } from 'react'

const BRAND      = '#154895'
const BRAND_DARK = '#0f3570'

// ── Date helpers for the day separators ──────────────────────────────────────
const isSameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString()

const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr)
  const now  = new Date()
  if (isSameDay(date, now)) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) return 'Yesterday'
  const sameYear = date.getFullYear() === now.getFullYear()
  return date.toLocaleDateString([], {
    weekday: 'long', month: 'short', day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  })
}

// ── Tiny confirmation modal for destructive actions ───────────────────────────
const ConfirmModal = ({ title, message, confirmLabel, confirmStyle, icon, onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden
      animate-[fadeInScale_0.15s_ease-out]">
      <div className="px-6 pt-6 pb-4 flex gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: confirmStyle.includes('red') ? '#fef2f2' : '#eff6ff' }}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3.5 text-sm font-semibold text-gray-500
            hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors
            flex items-center justify-center gap-2 ${confirmStyle}`}
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing…
            </>
          ) : confirmLabel}
        </button>
      </div>
    </div>
  </div>
)

// ── Uniform, generously sized header action button (icon + label, always
//    visible — no icon-only buttons that are hard to tap or decode on mobile) ─
const ActionButton = ({ onClick, label, icon, bg, hoverBg, textColor = '#ffffff', title }) => (
  <button
    onClick={onClick}
    title={title || label}
    className="flex items-center justify-center gap-1.5 rounded-xl font-semibold
      text-xs sm:text-sm px-3.5 py-2.5 transition-colors whitespace-nowrap flex-shrink-0
      active:scale-95"
    style={{ backgroundColor: bg, color: textColor }}
    onMouseEnter={e => { e.currentTarget.style.backgroundColor = hoverBg }}
    onMouseLeave={e => { e.currentTarget.style.backgroundColor = bg }}
  >
    {icon}
    <span>{label}</span>
  </button>
)

const StatusPill = ({ status }) => (
  <span className={`text-xs px-3 py-2 rounded-xl font-semibold flex-shrink-0 whitespace-nowrap ${
    status === 'AI'    ? 'bg-blue-100 text-blue-700' :
    status === 'HUMAN' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
  }`}>
    {status}
  </span>
)

const HeaderActions = ({ isClosed, isHuman, showHandBack, onTakeover, onHandBack, onCloseClick }) => (
  <>
    {!isClosed && !isHuman && (
      <ActionButton
        onClick={onTakeover}
        label="Take Over"
        bg="#d97706" hoverBg="#b45309"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />
    )}

    {!isClosed && isHuman && showHandBack && (
      <ActionButton
        onClick={onHandBack}
        label="Hand to AI"
        bg="#dbeafe" hoverBg="#bfdbfe" textColor="#1d4ed8"
        title="Hand conversation back to AI"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v4M8 11V9a4 4 0 018 0v2M9 15h.01M15 15h.01" />
          </svg>
        }
      />
    )}

    {!isClosed && (
      <ActionButton
        onClick={onCloseClick}
        label="Close"
        bg="#ef4444" hoverBg="#dc2626"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        }
      />
    )}
  </>
)

// ── ChatPanel ─────────────────────────────────────────────────────────────────
const ChatPanel = ({
  conversation, messages, recruiter,
  onSend, onTakeover, onClose, onBack, onHandBackToAI,
}) => {
  const [input,           setInput]           = useState('')
  const [showCloseModal,  setShowCloseModal]  = useState(false)
  const [showHandBack,    setShowHandBack]    = useState(false)
  const [isClosing,       setIsClosing]       = useState(false)
  const [isHandingBack,   setIsHandingBack]   = useState(false)
  const [aiTyping,        setAiTyping]        = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const isHuman  = conversation.status === 'HUMAN'
  const isClosed = conversation.status === 'CLOSED'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus input when conversation becomes HUMAN
  useEffect(() => {
    if (isHuman && !isClosed) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isHuman, isClosed, conversation._id])

  const handleSend = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleConfirmClose = async () => {
    setIsClosing(true)
    try {
      await onClose(conversation._id)
    } finally {
      setIsClosing(false)
      setShowCloseModal(false)
    }
  }

  // const handleConfirmHandBack = async () => {
  //   setIsHandingBack(true)
  //   try {
  //     await onHandBackToAI(conversation._id)
  //   } finally {
  //     setIsHandingBack(false)
  //     setShowHandBack(false)
  //   }
  // }

  const handleConfirmHandBack = async () => {
  if (isHandingBack) return          // ← guard against double-click / double call
  setIsHandingBack(true)
  try {
    await onHandBackToAI(conversation._id)
  } finally {
    setIsHandingBack(false)
    setShowHandBack(false)
  }
}

  // Message time formatter
  const fmtTime = (date) =>
    date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  // Flat render list with a date-divider entry inserted wherever the calendar
  // day changes between consecutive messages — e.g. a conversation spanning
  // today and yesterday shows a "Yesterday" / "Today" pill between them.
  const renderItems = useMemo(() => {
    const items = []
    let lastDay = null
    messages.forEach((msg) => {
      if (msg.createdAt) {
        const dayKey = new Date(msg.createdAt).toDateString()
        if (dayKey !== lastDay) {
          items.push({ kind: 'divider', id: `divider-${dayKey}`, label: formatDateLabel(msg.createdAt) })
          lastDay = dayKey
        }
      }
      items.push({ kind: 'message', msg })
    })
    return items
  }, [messages])

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>

      <div className="flex flex-col h-full bg-white">

        {/* ── Panel header ────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">

            {/* ← Back (mobile) */}
            <button
              onClick={onBack}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl
                text-gray-500 hover:text-gray-800 hover:bg-gray-100 active:scale-90
                transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center
              text-white text-sm font-bold flex-shrink-0 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${BRAND}, #1a5cbf)` }}>
              {(conversation.visitorId?.name?.[0] || '?').toUpperCase()}
            </div>

            {/* Visitor name / email */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {conversation.visitorId?.name || 'Visitor'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {conversation.visitorId?.email}
              </p>
            </div>

            {/* Desktop: status + action buttons inline */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <StatusPill status={conversation.status} />
              <HeaderActions
                isClosed={isClosed} isHuman={isHuman} showHandBack={!!onHandBackToAI}
                onTakeover={() => onTakeover(conversation._id)}
                onHandBack={() => setShowHandBack(true)}
                onCloseClick={() => setShowCloseModal(true)}
              />
            </div>
          </div>

          {/* Mobile: status + action buttons on their own full-width row —
              bigger, scrollable, never cramped next to the avatar/name. */}
          <div className="flex sm:hidden items-center gap-2 mt-3 overflow-x-auto pb-0.5 -mx-1 px-1">
            <StatusPill status={conversation.status} />
            <HeaderActions
              isClosed={isClosed} isHuman={isHuman} showHandBack={!!onHandBackToAI}
              onTakeover={() => onTakeover(conversation._id)}
              onHandBack={() => setShowHandBack(true)}
              onCloseClick={() => setShowCloseModal(true)}
            />
          </div>
        </div>

        {/* ── Info strip ──────────────────────────────────────────────────── */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2
          flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 flex-shrink-0">
          <span>📧 {conversation.visitorId?.email || '—'}</span>
          <span>🕐 Started {conversation.createdAt
            ? new Date(conversation.createdAt).toLocaleDateString()
            : '—'}
          </span>
          {conversation.assignedRecruiter && (
            <span>👤 Assigned to recruiter</span>
          )}
        </div>

        {/* ── Messages ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 bg-gray-50 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No messages yet</p>
          )}

          {renderItems.map((item) => {
            /* Date separator — shown whenever the day changes */
            if (item.kind === 'divider') {
              return (
                <div key={item.id} className="flex items-center justify-center my-4">
                  <span className="bg-white border border-gray-200 shadow-sm text-gray-500
                    text-[11px] font-semibold px-3.5 py-1.5 rounded-full tracking-wide">
                    {item.label}
                  </span>
                </div>
              )
            }

            const msg = item.msg

            /* System message — centred pill */
            if (msg.senderType === 'system') {
              return (
                <div key={msg._id} className="flex justify-center my-2">
                  <span className="bg-white text-gray-500 text-xs px-4 py-1.5
                    rounded-full border border-gray-200 shadow-sm italic">
                    {msg.message}
                  </span>
                </div>
              )
            }

            const isVisitor = msg.senderType === 'visitor'
            const isAI      = msg.senderType === 'ai'

            const bubbleStyle = isVisitor
              ? { background: '#ffffff', color: '#1f2937', border: '1px solid #e5e7eb' }
              : isAI
                ? { background: '#eff6ff', color: '#1e3a5f', border: '1px solid #bfdbfe' }
                : { background: '#f0fdf4', color: '#1f2937', border: '1px solid #bbf7d0' }

            const senderLabel = isVisitor
              ? (conversation.visitorId?.name || 'Visitor')
              : isAI
                ? '🤖 Asliya AI'
                : `👤 ${msg.senderName || 'Recruiter'}`

            return (
              <div key={msg._id}
                className={`flex items-end gap-2 ${isVisitor ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Mini avatar dot */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center
                  text-white text-[10px] font-bold flex-shrink-0 mb-1 shadow-sm"
                  style={{
                    backgroundColor: isVisitor ? '#6b7280' : isAI ? BRAND : '#16a34a'
                  }}>
                  {isVisitor
                    ? (conversation.visitorId?.name?.[0] || 'V').toUpperCase()
                    : isAI ? 'AI' : (recruiter?.name?.[0] || 'R').toUpperCase()}
                </div>

                <div className={`max-w-[85%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${isVisitor ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
                  style={bubbleStyle}>
                  <p className="text-[11px] font-semibold mb-0.5"
                    style={{ color: isVisitor ? '#6b7280' : isAI ? '#1d4ed8' : '#15803d' }}>
                    {senderLabel}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {fmtTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}

          {/* AI typing indicator */}
          {aiTyping && (
            <div className="flex items-end gap-2 flex-row-reverse">
              <div className="w-7 h-7 rounded-full flex items-center justify-center
                text-white text-[10px] font-bold flex-shrink-0 mb-1" style={{ backgroundColor: BRAND }}>
                AI
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-blue-50
                border border-blue-100 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ───────────────────────────────────────────────────── */}
        <div className="border-t border-gray-200 px-3 sm:px-4 py-3 bg-white flex-shrink-0">
          {isClosed ? (
            <p className="text-center text-gray-400 text-sm py-2">
              This conversation is closed
            </p>
          ) : !isHuman ? (
            <div className="flex flex-col items-center gap-2.5 py-1.5">
              <p className="text-gray-500 text-xs">AI is handling this conversation</p>
              <button
                onClick={() => onTakeover(conversation._id)}
                className="text-sm px-6 py-3 rounded-xl font-semibold text-white transition-colors
                  active:scale-95 shadow-sm"
                style={{ backgroundColor: '#d97706' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b45309'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d97706'}
              >
                Take Over as Recruiter
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply… (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm
                  text-gray-900 placeholder-gray-400 bg-white resize-none
                  focus:outline-none focus:ring-2 focus:border-transparent
                  max-h-32 overflow-y-auto"
                style={{ '--tw-ring-color': BRAND }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white
                  disabled:opacity-40 transition-colors self-end flex-shrink-0 active:scale-90"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={e => { if (input.trim()) e.currentTarget.style.backgroundColor = BRAND_DARK }}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = BRAND}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Close conversation modal ─────────────────────────────────────── */}
      {showCloseModal && (
        <ConfirmModal
          title="Close this conversation?"
          message="The visitor will be notified and no further messages can be sent. You can still view the history."
          confirmLabel="Close Conversation"
          confirmStyle="text-red-600 hover:bg-red-50"
          icon={
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onConfirm={handleConfirmClose}
          onCancel={() => setShowCloseModal(false)}
          isLoading={isClosing}
        />
      )}

      {/* ── Hand back to AI modal ────────────────────────────────────────── */}
      {showHandBack && (
        <ConfirmModal
          title="Hand back to AI?"
          message="The AI assistant will take over this conversation. You can reclaim it at any time by clicking 'Take Over'."
          confirmLabel="Hand to AI"
          confirmStyle="text-blue-600 hover:bg-blue-50"
          icon={
            <svg className="w-5 h-5" style={{ color: BRAND }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v4M8 11V9a4 4 0 018 0v2M9 15h.01M15 15h.01" />
            </svg>
          }
          onConfirm={handleConfirmHandBack}
          onCancel={() => setShowHandBack(false)}
          isLoading={isHandingBack}
        />
      )}
    </>
  )
}

export default ChatPanel