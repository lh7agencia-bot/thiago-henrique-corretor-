import {BROKER_INFO} from '../data/brokerData';
import {buildWhatsAppLink} from '../utils/brokerUtils';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#141416] py-12 text-neutral-300">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <p className="font-serif text-xl font-bold text-white">{BROKER_INFO.name}</p>
          <p className="mt-1 text-sm text-[#D4AF37]">{BROKER_INFO.slogan}</p>
          <p className="mt-2 text-xs text-neutral-400 tabular-nums">
            Telefone / WhatsApp:{' '}
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-200 transition-colors hover:text-[#E5C454]"
            >
              {BROKER_INFO.phoneDisplay}
            </a>
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <a href="#inicio" className="transition-colors hover:text-[#E5C454]">
            Início
          </a>
          <a href="#diferenciais" className="transition-colors hover:text-[#E5C454]">
            Diferenciais
          </a>
          <a href="#galeria" className="transition-colors hover:text-[#E5C454]">
            Galeria
          </a>
          <a href="#maquete-3d" className="transition-colors hover:text-[#E5C454]">
            Maquete 3D
          </a>
          <a href="#depoimentos" className="transition-colors hover:text-[#E5C454]">
            Depoimentos
          </a>
          <a href="#faq" className="transition-colors hover:text-[#E5C454]">
            FAQ
          </a>
          <a href="#contato" className="transition-colors hover:text-[#E5C454]">
            Contato
          </a>
        </nav>

        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} {BROKER_INFO.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
