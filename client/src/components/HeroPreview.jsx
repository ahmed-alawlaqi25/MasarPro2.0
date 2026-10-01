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
    <div role="tablist" aria-label={rtl ? 'معاينة مزايا مسار برو' : 'MasarPro feature previews'} className="mx-auto  flex w-fit max-w-full gap-1 rounded-2xl border border-sky-100 bg-white/90 p-1.5 shadow-sm shadow-cyan-100">
      {slides.map(({ label, Icon }, index) => <button
        key={label} ref={element => { tabs.current[index] = element }}
        id={`hero-tab-${index}`} type="button" role="tab" aria-selected={selected === index}
        aria-controls={`hero-panel-${index}`} tabIndex={selected === index ? 0 : -1}
        onClick={() => select(index)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          select(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : selected + (event.key === 'ArrowRight' ? (rtl ? -1 : 1) : (rtl ? 1 : -1)), true)
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:px-6 sm:text-sm ${selected === index ? 'bg-linear-to-l from-[#0874c9] to-[#0eb0b2] text-white shadow-sm' : 'text-[#344d80] hover:bg-[#e8f7f5] hover:text-[#0b9f91]'}`}>
        <Icon size={20} aria-hidden="true" />{label}
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
