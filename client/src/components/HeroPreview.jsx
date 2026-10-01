import { useRef, useState } from 'react'
import { FileText, PanelsTopLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HeroPreview() {
  const { i18n } = useTranslation()
  const rtl = i18n.dir() === 'rtl'
  const [selected, setSelected] = useState(0)
  const tabs = useRef([])
  const slides = [
    { src: '/hero.png', label: rtl ? 'متتبع الوظائف' : 'Job Tracker', Icon: PanelsTopLeft },
    { src: '/resume-builder.png', label: rtl ? 'منشئ السيرة الذاتية' : 'Resume Builder', Icon: FileText },
  ]
  function select(index, focus = false) {
    const next = (index + slides.length) % slides.length
    setSelected(next)
    if (focus) tabs.current[next]?.focus()
  }
  return <div className="relative z-5">
    <div role="tablist" dir={rtl ? 'rtl' : 'ltr'} aria-label={rtl ? 'معاينة مزايا مسار برو' : 'MasarPro feature previews'} className="mx-auto  grid w-full max-w-[380px] grid-cols-2 gap-1 rounded-xl border border-slate-200/70 bg-white/70 p-1">
      {slides.map(({ label, Icon }, index) => <button
        key={label} ref={element => { tabs.current[index] = element }}
        id={`hero-tab-${index}`} type="button" role="tab" aria-selected={selected === index}
        aria-controls={`hero-panel-${index}`} tabIndex={selected === index ? 0 : -1}
        onClick={() => select(index)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          select(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : selected + (event.key === 'ArrowRight' ? (rtl ? -1 : 1) : (rtl ? 1 : -1)), true)
        }}
        className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:gap-2 sm:px-4 sm:text-sm ${selected === index ? 'bg-[#e8f7f5] text-[#087f75]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#344d80]'}`}>
        <Icon size={16} className="shrink-0" aria-hidden="true" />{label}
      </button>)}
    </div>
    <div className="relative">
      <div className="h-[200px] sm:h-[420px] lg:h-[543px]  rounded-[22px] border-[6px] border-white/80 bg-white shadow-[0_20px_80px_rgba(27,121,171,0.18)] sm:border-[12px]">
        {slides.map(({ src, label }, index) => <div key={src} id={`hero-panel-${index}`} role="tabpanel" aria-labelledby={`hero-tab-${index}`} hidden={selected !== index} tabIndex={0}>
          <img src={src} alt={`MasarPro - ${label}`} className="h-full w-full object-contain object-top" />
        </div>)}
      </div>
    </div>
  </div>
}
