import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { aiError, requestAi } from "../lib/ai";

export default function ImproveSummary({
  summary,
  onApply,
  rtl,
  isDark = false,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const controller = useRef(null);

  useEffect(() => () => controller.current?.abort(), []);

  const improve = async () => {
    if (controller.current || !summary.trim()) return;
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setError("");
    setSuggestion(null);
    try {
      const text = await requestAi(
        "summary",
        { summary, language: rtl ? "ar" : "en" },
        request.signal,
      );
      if (!request.signal.aborted)
        setSuggestion({ original: summary, text });
    } catch (err) {
      if (!request.signal.aborted) setError(aiError(err, rtl));
    } finally {
      controller.current = null;
      if (!request.signal.aborted) setBusy(false);
    }
  };

  const changed = suggestion && suggestion.original !== summary;

  return (
    <div className="mt-3.5 space-y-3">
      <button
        type="button"
        onClick={improve}
        disabled={busy || !summary.trim() || summary.length > 5000}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
          isDark
            ? "border-blue-500/35 bg-[#172544] text-[#60a5fa] hover:bg-[#1e315c]"
            : "border-blue-200 bg-[#edf3ff] text-[#1d55e5] hover:bg-blue-100/80"
        }`}
      >
        {busy ? (
          <LoaderCircle size={15} className="animate-spin" />
        ) : (
          <Sparkles size={15} aria-hidden="true" />
        )}
        <span>
          {busy
            ? rtl
              ? "جارٍ التحسين..."
              : "Improving..."
            : rtl
              ? "تحسين بالذكاء الاصطناعي"
              : "Improve with AI"}
        </span>
      </button>

      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {rtl
          ? "يُرسل نص الملخص إلى Google Gemini لتحسين الصياغة."
          : "Your summary is sent to Google Gemini to improve the wording."}
      </p>

      {summary.length > 5000 && (
        <p
          role="alert"
          className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}
        >
          {rtl
            ? "اختصر الملخص إلى ٥٠٠٠ حرف لاستخدام التحسين."
            : "Shorten the summary to 5,000 characters to use AI."}
        </p>
      )}

      {busy && (
        <p role="status" className="sr-only">
          {rtl ? "جارٍ تحسين الملخص" : "Improving your summary"}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className={`rounded-xl border p-3 text-xs sm:text-sm ${
            isDark
              ? "border-red-500/30 bg-red-950/50 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {error}
        </p>
      )}

      {suggestion && (
        <div
          className={`rounded-xl border p-4 ${
            isDark
              ? "border-blue-500/30 bg-[#131d33] text-slate-100"
              : "border-blue-200 bg-[#f4f8ff] text-[#0f172a]"
          }`}
        >
          <h3 className="mb-2 text-sm font-bold">
            {rtl ? "الصياغة المقترحة" : "Suggested wording"}
          </h3>
          <p
            dir="auto"
            className={`whitespace-pre-wrap text-sm leading-7 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {suggestion.text}
          </p>
          {changed && (
            <p
              role="status"
              className={`mt-3 text-xs font-medium ${
                isDark ? "text-amber-400" : "text-amber-700"
              }`}
            >
              {rtl
                ? "تم تعديل النص الأصلي. أعد التحسين للحصول على اقتراح جديد."
                : "Your original text changed. Generate a new suggestion before applying."}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={changed}
              onClick={() => {
                onApply(suggestion.text);
                setSuggestion(null);
              }}
              className="cursor-pointer rounded-xl bg-[#1d55e5] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#1746c4] disabled:opacity-50"
            >
              {rtl ? "استخدام الاقتراح" : "Use suggestion"}
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className={`cursor-pointer text-xs font-semibold hover:underline ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {rtl ? "تجاهل" : "Discard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
