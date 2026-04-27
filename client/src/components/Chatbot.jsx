import { useState, useRef, useEffect, useCallback } from 'react'

const SYSTEM_PROMPT = `You are a helpful customer support assistant for GoBus — an online bus ticket booking platform in India.

You help users with:
- Booking bus tickets (search by source, destination, date → select seats → pay via Stripe)
- Cancelling bookings (go to My Bookings → Cancel button → full refund if cancelled before journey)
- Downloading tickets (My Bookings → Download button → PDF)
- Available coupons: FIRST10 (10% off, no minimum), SAVE50 (Rs.50 off, min Rs.200), TRAVEL100 (Rs.100 off, min Rs.500)
- Refund policy: 100% refund if cancelled 24hrs before, 75% for 12-24hrs, 50% for 6-12hrs, no refund under 6hrs
- Payment: Stripe card payments only. Test card: 4242 4242 4242 4242
- Seat selection: 2+2 layout, male=red, female=pink, other=purple, selected=blue
- Journey reminders: automatic toast + browser notifications 1hr and 10min before departure
- Reviews: rate your journey from My Bookings after travel

Keep responses short, friendly and helpful. Use bullet points when listing things. 
If asked something unrelated to bus booking or the app, politely say you can only help with GoBus-related queries.
Always respond in the same language the user writes in.`

const QUICK_REPLIES = [
  'How do I book a ticket?',
  'How to cancel booking?',
  'Available coupons?',
  'Download my ticket',
  'Refund policy',
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your GoBus assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = useCallback(async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const updated = [...messages, { role: 'user', content: userMsg }]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updated.map(m => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'API error')
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a4 4 0 014 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a4 4 0 014-4z"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">GoBus Assistant</p>
                <p className="text-red-200 text-xs">Powered by Groq AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-2 shrink-0 mt-1">R</div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-red-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-2 shrink-0 mt-1">R</div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies — only show after first message */}
          {messages.length === 1 && (
            <div className="px-3 py-2 flex gap-2 overflow-x-auto shrink-0 bg-gray-50 border-t border-gray-100">
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="whitespace-nowrap text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition shrink-0">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
            <input
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 transition"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              disabled={loading}
            />
            <button onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-red-600 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-700 transition disabled:opacity-40 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  )
}
