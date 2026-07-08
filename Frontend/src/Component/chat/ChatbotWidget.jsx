// src/Component/Chat/ChatbotWidget.jsx
//
// Floating launcher button + mount point for <ChatWindow />.
//
// ── BUG FIX ──────────────────────────────────────────────────────────────────
// ChatContext only exposes `toggleChat` and `closeChat` (no `openChat` /
// `setIsOpen`). Calling anything else to open the panel is undefined and
// throws silently on click — which is why the window/form wasn't opening.
// This version calls ONLY `toggleChat()` and `closeChat()`, matching the
// context exactly. No context logic changed.
//
// ── UNREAD BADGE FIX ─────────────────────────────────────────────────────────
// Previously the badge counted every AI/recruiter message ever sent, even
// ones already seen. Now it tracks `lastSeenCount` — the number of agent
// (senderType 'ai' | 'recruiter') messages already seen — and only messages
// past that count, while the widget is closed, are "unread". The baseline is
// only set once `isRestoring` finishes, so a re-hydrated session's old
// history is never flagged as new on load.
//
// ── LOGO PLACEHOLDER ─────────────────────────────────────────────────────────
// No logo asset yet for Sandesh Innovations — using a styled "SI" initials
// badge as a placeholder. Swap the <LogoPlaceholder /> component's contents
// for an <img src={logo} /> once a real logo file is ready.
//
// ── UI ───────────────────────────────────────────────────────────────────────
// Gradient launcher matching ChatWindow's header, pulsing ring while there's
// something unread, a badge with pop-in animation, and a hover/focus tooltip.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useChat } from '../../context/ChatContext.jsx'
import ChatWindow from './ChatWindow.jsx'

const BRAND      = '#154895'
const BRAND_DARK = '#0f3570'

// A message counts toward "unread" only if it came from the AI or a
// recruiter — never the visitor's own messages, never system messages.
const isAgentMessage = (msg) => msg?.senderType === 'ai' || msg?.senderType === 'recruiter'

// ── Logo placeholder ─────────────────────────────────────────────────────────
// TODO: replace with <img src={logo} alt="Sandesh Innovations" className="w-7 h-7 object-contain" />
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

const ChatbotWidget = () => {
  const {
    isOpen,            // boolean — from ChatContext
    toggleChat,         // () => void — the ONLY way to open/close (no openChat exists)
    messages = [],       // full message history
    isRestoring,        // true while a previous session is being re-hydrated
  } = useChat()

  // ── Unread tracking ───────────────────────────────────────────────────
  const [lastSeenCount, setLastSeenCount] = useState(0)
  const initializedRef = useRef(false)

  const agentMessageCount = useMemo(
    () => messages.filter(isAgentMessage).length,
    [messages]
  )

  // Baseline lastSeenCount once hydration finishes (not before) — so a
  // restored session's existing history isn't flagged as unread on load.
  useEffect(() => {
    if (!isRestoring && !initializedRef.current) {
      initializedRef.current = true
      setLastSeenCount(agentMessageCount)
    }
  }, [isRestoring, agentMessageCount])

  // While the panel is open, keep lastSeenCount synced to the live count —
  // covers both "just opened" and "new message arrived while already open".
  useEffect(() => {
    if (isOpen) setLastSeenCount(agentMessageCount)
  }, [isOpen, agentMessageCount])

  const unreadCount = isOpen ? 0 : Math.max(0, agentMessageCount - lastSeenCount)

  // ── Tooltip ───────────────────────────────────────────────────────────
  const [showTooltip, setShowTooltip] = useState(false)

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      setLastSeenCount(agentMessageCount) // about to open — mark everything read
    }
    toggleChat()
  }, [isOpen, toggleChat, agentMessageCount])

  const tooltipLabel = unreadCount > 0
    ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`
    : 'Chat with us'

  return (
    <>
      <style>{`
        @keyframes widgetPulseRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(1.9); opacity: 0;    }
          100% { transform: scale(1.9); opacity: 0;    }
        }
        @keyframes badgePop {
          0%   { transform: scale(0);    }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1);    }
        }
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateX(6px); }
          to   { opacity: 1; transform: translateX(0);   }
        }
        @keyframes widgetEntrance {
          from { opacity: 0; transform: translateY(16px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @media (prefers-reduced-motion: reduce) {
          .widget-launcher, .widget-launcher * { animation: none !important; }
        }
      `}</style>

      {/* Chat panel — only mounted while open. ChatWindow itself reads
          `step`/`isRestoring` from context to decide form vs. spinner vs. chat. */}
      {isOpen && <ChatWindow />}

      {/* Floating launcher — hidden on mobile while the full-screen panel is open */}
      <div
        className={`widget-launcher fixed z-[9999] bottom-5 right-5 items-center gap-3
          ${isOpen ? 'hidden sm:flex' : 'flex'}`}
        style={{ animation: 'widgetEntrance 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Hover/focus tooltip (desktop only) */}
        {showTooltip && !isOpen && (
          <div
            className="hidden sm:block relative px-3 py-2 rounded-lg text-xs font-medium
              text-white whitespace-nowrap shadow-lg"
            style={{ background: BRAND_DARK, animation: 'tooltipFadeIn 0.18s ease-out' }}
          >
            {tooltipLabel}
            <div
              className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45"
              style={{ background: BRAND_DARK }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label={isOpen ? 'Close chat' : `Open chat${unreadCount > 0 ? `, ${unreadCount} unread messages` : ''}`}
          className="relative w-14 h-14 rounded-full flex items-center justify-center
            shadow-xl transition-transform duration-200 active:scale-90 hover:scale-105
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: `linear-gradient(135deg, ${BRAND} 0%, #1a5cbf 100%)`,
            boxShadow: '0 10px 30px rgba(21,72,149,0.35), 0 4px 12px rgba(0,0,0,0.15)',
            '--tw-ring-color': BRAND,
          }}
        >
          {/* Pulsing ring — only when closed and something is unread */}
          {!isOpen && unreadCount > 0 && (
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `2px solid ${BRAND}`, animation: 'widgetPulseRing 1.8s ease-out infinite' }}
            />
          )}

          {/* Icon: logo when closed, X when open */}
          <span
            className="relative z-10 flex items-center justify-center transition-transform duration-200 rounded-full p-1"
            style={{
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              background: isOpen ? 'transparent' : 'white',  // ← white only for logo, not X
            }}
          >
            {isOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <LogoPlaceholder size={28} />
            )}
          </span>

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full
                flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: '#ef4444', boxShadow: '0 0 0 2px white', animation: 'badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
              aria-hidden="true"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </>
  )
}

export default ChatbotWidget