import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import {useEffect} from 'react';
import type {GalleryPhoto} from '../data/brokerData';

interface LightboxModalProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function LightboxModal({
  photos,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxModalProps) {
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        onNext();
      } else if (event.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, onClose, onNext, onPrev]);

  if (activeIndex === null) return null;
  const activePhoto = photos[activeIndex];
  if (!activePhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada: ${activePhoto.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#121214]/92 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/15 bg-[#1C1C1F] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#E5C454] tabular-nums">
              {activeIndex + 1} / {photos.length} · {activePhoto.category}
            </p>
            <h3 className="truncate font-serif text-lg font-bold text-white sm:text-xl">
              {activePhoto.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar visualização ampliada"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/15 text-neutral-200 transition-colors hover:border-[#D4AF37] hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex min-h-[320px] flex-1 items-center justify-center bg-[#121214] p-3 sm:p-6">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-white/20 bg-[#1A1A1D]/85 text-white transition-colors hover:border-[#D4AF37] hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <img
            src={activePhoto.src}
            alt={activePhoto.alt}
            referrerPolicy="no-referrer"
            className="max-h-[66vh] w-auto max-w-full rounded object-contain"
          />

          <button
            type="button"
            onClick={onNext}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-white/20 bg-[#1A1A1D]/85 text-white transition-colors hover:border-[#D4AF37] hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="border-t border-white/10 px-4 py-3 text-sm text-neutral-300 sm:px-6">
          {activePhoto.description}
        </div>
      </div>
    </div>
  );
}
