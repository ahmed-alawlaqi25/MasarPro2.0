import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { aiError, requestAi } from '../lib/ai'

export default function ImproveSummary({ summary, onApply, rtl }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const controller = useRef(null)
  useEffect(() => () => controller.current?.abort(), [])
  const improve = async () => {
    if (controller.current || !summary.trim()) return
    const request = new AbortController()
    controller.current = request
    setBusy(true)
    setError('')
    setSuggestion(null)
    try {
      const text = await requestAi('summary', { summary, language: rtl ? 'ar' : 'en' }, request.signal)
      if (!request.signal.aborted) setSuggestion({ original: summary, text })
    } catch (error) {
      if (!request.signal.aborted) setError(aiError(error, rtl))
    } finally {
      controller.current = null
      if (!request.signal.aborted) setBusy(false)
    }
  }
  const changed = suggestion && suggestion.original !== summary
  return <div className="mt-3 space-y-3">
    <button type="button" onClick={improve} disabled={busy || !summary.trim() || summary.length > 5000} className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 disabled:opacity-50">
      <Sparkles size={16} aria-hidden="true" />
      {busy ? (rtl ? 'جارٍ التحسين...' : 'Improving...') : (rtl ? 'تحسين بالذكاء الاصطناعي' : 'Improve with AI')}
    </button>
    <p className="text-xs text-slate-500">{rtl ? 'يُرسل نص الملخص إلى Google Gemini لتحسين الصياغة.' : 'Your summary is sent to Google Gemini to improve the wording.'}</p>
    {summary.length > 5000 && <p role="alert" className="text-sm text-red-700">{rtl ? 'اختصر الملخص إلى ٥٠٠٠ حرف لاستخدام التحسين.' : 'Shorten the summary to 5,000 characters to use AI.'}</p>}
    {busy && <p role="status" className="sr-only">{rtl ? 'جارٍ تحسين الملخص' : 'Improving your summary'}</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {suggestion && <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
      <h3 className="mb-2 text-sm font-semibold">{rtl ? 'الصياغة المقترحة' : 'Suggested wording'}</h3>
      <p dir="auto" className="whitespace-pre-wrap text-sm leading-7">{suggestion.text}</p>
      {changed && <p role="status" className="mt-3 text-sm text-amber-800">{rtl ? 'تم تعديل النص الأصلي. أعد التحسين للحصول على اقتراح جديد.' : 'Your original text changed. Generate a new suggestion before applying.'}</p>}
      <div className="mt-4 flex gap-3">
        <button type="button" disabled={changed} onClick={() => { onApply(suggestion.text); setSuggestion(null) }} className="rounded-lg bg-teal-700 px-3 py-2 text-sm text-white disabled:opacity-50">{rtl ? 'استخدام الاقتراح' : 'Use suggestion'}</button>
        <button type="button" onClick={() => setSuggestion(null)} className="text-sm text-slate-600">{rtl ? 'تجاهل' : 'Discard'}</button>
      </div>
    </div>}
  </div>
}
