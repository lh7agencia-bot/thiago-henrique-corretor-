import {MessageCircle} from 'lucide-react';
import {BROKER_INFO} from '../data/brokerData';
import {buildWhatsAppLink} from '../utils/brokerUtils';

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Conversar no WhatsApp com ${BROKER_INFO.name} (${BROKER_INFO.phoneDisplay})`}
      className="fixed bottom-5 right-5 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full border border-[#D4AF37] bg-[#1A1A1D] text-[#E5C454] shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#D4AF37] hover:text-[#1A1A1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:w-auto sm:gap-2.5 sm:rounded-full sm:px-5"
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden text-xs font-semibold whitespace-nowrap sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
