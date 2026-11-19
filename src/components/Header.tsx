import {Menu, X} from 'lucide-react';
import {useState} from 'react';
import {BROKER_INFO} from '../data/brokerData';
import {buildWhatsAppLink} from '../utils/brokerUtils';

const NAV_ITEMS = [
  {label: 'Diferenciais', href: '#diferenciais'},
  {label: 'Galeria', href: '#galeria'},
  {label: 'Maquete 3D', href: '#maquete-3d'},
  {label: 'Depoimentos', href: '#depoimentos'},
  {label: 'FAQ', href: '#faq'},
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1A1A1D]/95 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="font-serif text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-colors hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          {BROKER_INFO.name}
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-200"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#1A1A1D] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            Falar no WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-neutral-200 transition-colors hover:border-[#D4AF37] hover:text-white md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navegação mobile"
          className="border-t border-white/10 bg-[#1A1A1D] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/5 hover:text-[#E5C454]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#1A1A1D] transition-colors hover:bg-[#E5C454]"
            >
              Solicitar Atendimento
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
