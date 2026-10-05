import { supabase } from './supabase'

export async function requestAi(task, input, signal) {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) throw Object.assign(new Error('AUTH_REQUIRED'), { code: 'AUTH_REQUIRED' })
  const response = await fetch(`/api/ai/${task}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(input),
    signal: AbortSignal.any([signal, AbortSignal.timeout(60000)].filter(Boolean)),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || typeof body.text !== 'string' || !body.text.trim()) {
    throw Object.assign(new Error(body.code || 'AI_FAILED'), { code: body.code || 'AI_FAILED' })
  }
  return body.text
}

export function aiError(error, rtl) {
  const messages = {
    AUTH_REQUIRED: ['Please sign in again to use AI.', 'يرجى تسجيل الدخول مجدداً لاستخدام الذكاء الاصطناعي.'],
    RATE_LIMITED: ['Too many requests. Please wait before trying again.', 'طلبات كثيرة. انتظر قليلاً قبل المحاولة مجدداً.'],
    AI_QUOTA: ['The AI usage limit has been reached. Please try again later.', 'تم بلوغ حد استخدام الذكاء الاصطناعي. حاول لاحقاً.'],
    AI_UNAVAILABLE: ['AI is currently unavailable. Please try again later.', 'الذكاء الاصطناعي غير متاح حالياً. حاول لاحقاً.'],
    AI_TIMEOUT: ['The request took too long. Please try again.', 'استغرق الطلب وقتاً طويلاً. حاول مجدداً.'],
    INVALID_INPUT: ['Check the required fields and their length.', 'تحقق من الحقول المطلوبة وطول النص.'],
    AI_FAILED: ['Unable to generate text. Your draft is unchanged. Please retry.', 'تعذر إنشاء النص. لم تتغير مسودتك. حاول مجدداً.'],
  }
  return (messages[error.name === 'TimeoutError' ? 'AI_TIMEOUT' : error.code] || messages.AI_FAILED)[rtl ? 1 : 0]
}
