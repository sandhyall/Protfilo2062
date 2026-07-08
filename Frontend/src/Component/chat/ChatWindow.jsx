// src/Component/Chat/ChatWindow.jsx
// All existing logic preserved exactly:
//   step, isClosed, sendMessage, handleKeyDown, isAiTyping, recruiterTyping,
//   conversation status display, textarea auto-resize, sending spinner.
// Design upgrade: premium header with gradient, smooth slide-up animation,
//   better empty state, refined input bar, CSS keyframes via <style> tag.
//
// ── LOGO PLACEHOLDER ─────────────────────────────────────────────────────────
// No logo asset yet for Sandesh Innovations — using a styled "SI" initials
// badge as a placeholder. Swap the <LogoPlaceholder /> component's contents
// for an <img src={logo} /> once a real logo file is ready.

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from '../../context/ChatContext.jsx'
import VisitorForm from './VisitorForm.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'

const BRAND      = '#154895'
const BRAND_DARK = '#0f3570'
const COMPANY    = 'Sandesh Innovations'

// ── Logo placeholder ─────────────────────────────────────────────────────────
// TODO: replace with <img src={logo} alt={COMPANY} className="w-7 h-7 object-contain" />
// once a real logo asset is available.
const LogoPlaceholder = ({ size = 28 }) => (
  <div
    className="flex items-center justify-center rounded-full font-bold"
    style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${BRAND} 0%, #1a5cbf 100%)`,
      color: '#fff',
      fontSize: size * 0.42,
    }}
  >
    SI
  </div>
)

// ── Status helpers ────────────────────────────────────────────────────────────
const getStatusLabel = (conversation, recruiterName) => {
  if (!conversation) return 'AI Assistant online'
  if (conversation.status === 'CLOSED')  return 'Conversation closed'
  if (conversation.status === 'HUMAN')   return recruiterName || 'Recruiter online'
  return 'AI Assistant online'
}

const getStatusColor = (conversation) => {
  if (!conversation || conversation.status === 'CLOSED') return '#94a3b8'
  if (conversation.status === 'HUMAN') return '#4ade80'
  return '#4ade80'
}

// ── ChatWindow ────────────────────────────────────────────────────────────────
const ChatWindow = () => {
  const {
    step, closeChat,
    visitor, conversation,
    messages, isAiTyping, recruiterTyping, recruiterName,
    sendMessage, isRestoring,
  } = useChat()

  const [input,   setInput]   = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiTyping, recruiterTyping])

  useEffect(() => {
    if (step === 'chat') setTimeout(() => inputRef.current?.focus(), 120)
  }, [step])

  const handleSend = useCallback(async (e) => {
    e?.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)
    try {
      await sendMessage(input)
      setInput('')
    } finally {
      setSending(false)
    }
  }, [input, sending, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isClosed    = conversation?.status === 'CLOSED'
  const typingLabel = recruiterTyping
    ? `${recruiterName || 'Recruiter'} is typing`
    : 'Sandesh AI is typing'

  const statusDotColor = getStatusColor(conversation)
  const statusLabel    = getStatusLabel(conversation, recruiterName)

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.5; }
          30%            { transform: translateY(-5px); opacity: 1;   }
        }

        @keyframes pulseRing {
  0%   { transform: scale(1);   opacity: 0.75; }
  70%  { transform: scale(2.2); opacity: 0;    }
  100% { transform: scale(2.2); opacity: 0;    }
}
        .chat-scrollbar::-webkit-scrollbar       { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track  { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb  { background: #e2e8f0; border-radius: 2px; }
      `}</style>

      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9997] sm:hidden backdrop-blur-sm"
        onClick={closeChat}
      />

      {/* Chat panel */}
      <div
        className="fixed z-[9998] flex flex-col bg-white overflow-hidden
          inset-x-3 bottom-3 top-3 rounded-2xl
          sm:inset-auto sm:bottom-24 sm:right-5
          sm:w-[390px] sm:h-[600px] sm:rounded-2xl
          md:w-[400px] md:h-[620px]"
        style={{
          animation: 'slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
        }}
      >

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          className="px-4 py-3.5 flex items-center gap-3 flex-shrink-0 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #1a5cbf 100%)` }}
        >
          {/* Subtle decorative circle */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute -bottom-8 right-12 w-20 h-20 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)' }} />

          {/* Logo */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center
            flex-shrink-0 relative z-10 overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <LogoPlaceholder size={28} />
          </div>

          {/* Title + status */}
          <div className="flex-1 min-w-0 relative z-10">
            <h3 className="text-white font-semibold text-sm truncate leading-tight">
              {COMPANY}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Animated status dot */}
              <span className="relative flex h-2 w-2">
  {/* Ping ring — only shown when active */}
  {!isClosed && (
    <span
      className="absolute inline-flex h-full w-full rounded-full"
      style={{
        backgroundColor: statusDotColor,
        animation: 'pulseRing 1.5s ease-out infinite',
      }}
    />
  )}
  {/* Solid inner dot — always visible */}
  <span
    className="relative inline-flex rounded-full h-2 w-2"
    style={{ backgroundColor: statusDotColor }}
  />
</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={closeChat}
            aria-label="Close chat"
            className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center
              transition-colors flex-shrink-0"
            style={{ color: 'rgba(255,255,255,0.75)' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
            }}
          >
            <svg className="w-4.5 h-4.5" style={{ width: 18, height: 18 }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        {isRestoring ? (
          // Restoring session — show spinner instead of flashing the form
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24"
                style={{ color: BRAND }}>
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-xs text-gray-400">Resuming your conversation…</p>
            </div>
          </div>

        ) : step === 'form' ? (
          <VisitorForm />

        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 chat-scrollbar"
              style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}>
                    <svg className="w-7 h-7" style={{ color: BRAND }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm mb-1">
                    Hi {visitor?.name?.split(' ')[0] || 'there'}! 👋
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
                    Ask us anything about our AI and web services.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg._id} message={msg} />
              ))}

              {(isAiTyping || recruiterTyping) && (
                <TypingIndicator label={typingLabel} />
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Input bar ───────────────────────────────────────────── */}
            <div className="border-t border-gray-100 px-3 py-3 bg-white flex-shrink-0">
              {isClosed ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs text-gray-400">This conversation is closed.</p>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Type your message…"
                    className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm
                      text-gray-900 placeholder-gray-400 bg-gray-50
                      border border-gray-200 transition-all duration-150
                      focus:outline-none focus:ring-2 focus:bg-white max-h-24"
                    style={{ '--tw-ring-color': BRAND }}
                    onInput={e => {
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    aria-label="Send message"
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      text-white transition-all duration-150 active:scale-90 disabled:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #1a5cbf 100%)` }}
                    onMouseEnter={e => { if (input.trim()) e.currentTarget.style.background = `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})` }}
                    onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg, ${BRAND} 0%, #1a5cbf 100%)`}
                  >
                    {sending ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              )}

              {/* Powered by */}
              <p className="text-center text-gray-300 text-[10px] mt-2 font-medium tracking-wide">
                Powered by <span style={{ color: BRAND }} className="font-semibold">{COMPANY} AI</span>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ChatWindow