import {Expand, ImageOff} from 'lucide-react';
import {useState} from 'react';
import {GALLERY_PHOTOS, type GalleryPhoto} from '../data/brokerData';

interface GallerySectionProps {
  onSelectPhoto: (index: number) => void;
}

function GalleryCard({
  photo,
  index,
  onSelect,
}: {
  photo: GalleryPhoto;
  index: number;
  onSelect: (index: number) => void;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Ampliar foto: ${photo.title}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[#DCDCD7] bg-white text-left transition-colors hover:border-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#2D2D30]">
        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#3A3A3D] to-[#252528] p-6 text-center text-neutral-300">
            <ImageOff className="h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
            <span className="text-sm font-medium">{photo.title}</span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141416]/85 via-[#141416]/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

        <div className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#1A1A1D]/80 text-[#E5C454] transition-transform duration-200 group-hover:scale-105">
          <Expand className="h-4 w-4" aria-hidden="true" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs font-medium text-[#E5C454]">{photo.category}</p>
          <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-white">
            {photo.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <p className="text-sm leading-relaxed text-[#4A4A4A]">{photo.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E6E13] group-hover:text-[#252528]">
          Clique para ampliar em tela cheia
        </span>
      </div>
    </button>
  );
}

export function GallerySection({onSelectPhoto}: GallerySectionProps) {
  return (
    <section id="galeria" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E3E3DF] pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-[#8E6E13]">
              Galeria de Fotos
            </p>
            <h2
              className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#252528] sm:text-4xl"
              style={{textWrap: 'balance'}}
            >
              Ambientes em destaque
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#4A4A4A]">
            Clique em qualquer imagem abaixo para abrir a visualização ampliada com todos os detalhes
            e acabamentos em proporção original.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_PHOTOS.map((photo, index) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              index={index}
              onSelect={onSelectPhoto}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
