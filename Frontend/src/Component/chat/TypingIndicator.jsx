// src/Component/Chat/TypingIndicator.jsx
// Visual upgrade: cleaner animation, better label, matches MessageBubble style.

import React from 'react'

const TypingIndicator = ({ label = 'Sandesh Innovations AI is typing' }) => (
  <div className="flex items-end gap-2 mb-2" style={{ animation: 'msgFadeIn 0.2s ease-out' }}>
    {/* Avatar matches AI bubble avatar */}
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
      text-white shadow-sm mb-0.5" style={{ backgroundColor: '#154895' }}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2zm0 2v1h2V4h-2zM9 9a1 1 0 000 2 1 1 0 000-2zm6 0a1 1 0 000 2 1 1 0 000-2zm-6 4v1h6v-1H9z"/>
      </svg>
    </div>

    <div>
      <p className="text-[10px] font-semibold mb-1 px-1" style={{ color: '#154895' }}>
        {label.replace(' is typing', '')}
      </p>
      <div className="bg-white border border-gray-200 shadow-sm px-4 py-3"
        style={{ borderRadius: '0.25rem 1.1rem 1.1rem 1.1rem' }}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: '#154895',
                animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default TypingIndicator