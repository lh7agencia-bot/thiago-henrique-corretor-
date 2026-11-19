import {ArrowDown, MessageCircle} from 'lucide-react';
import {BROKER_INFO} from '../data/brokerData';
import {buildWhatsAppLink} from '../utils/brokerUtils';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#1A1A1D] text-white"
    >
      {/* Full-Screen Looping Background Video (no visible controls) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/area-lazer-piscina.jpeg"
          className="h-full w-full object-cover scale-105"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        {/* Dark graphite contrast scrim so headlines and buttons stay crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#161618]/80 via-[#252528]/70 to-[#141416]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141416]/85 via-[#141416]/45 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.18em] text-[#E5C454] sm:text-sm">
            {BROKER_INFO.niche} · Consultoria e Intermediação
          </p>

          <h1
            className="mt-4 font-serif font-bold tracking-tight text-white"
            style={{fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)', lineHeight: 1.05, textWrap: 'balance'}}
          >
            {BROKER_INFO.name}
          </h1>

          <p className="mt-4 font-serif text-2xl font-semibold text-[#D4AF37] sm:text-3xl">
            {BROKER_INFO.slogan}
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-200 sm:text-lg">
            Atendimento direto, negociação transparente e acompanhamento completo na compra, venda e
            parcerias imobiliárias.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contato"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-[#1A1A1D] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              Solicitar Atendimento
            </a>

            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-[#1A1A1D]/75 px-6 py-3.5 text-sm font-medium text-white whitespace-nowrap shrink-0 transition-colors hover:border-[#D4AF37] hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <MessageCircle className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              WhatsApp {BROKER_INFO.phoneDisplay}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-neutral-300">
            <span>Atendimento personalizado</span>
            <span aria-hidden="true" className="text-[#D4AF37]">·</span>
            <span>Avaliação e intermediação direta</span>
            <span aria-hidden="true" className="text-[#D4AF37]">·</span>
            <a
              href="#galeria"
              className="inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-[#E5C454]"
            >
              Conhecer ambientes
              <ArrowDown className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
