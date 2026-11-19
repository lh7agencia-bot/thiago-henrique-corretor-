import {Star} from 'lucide-react';
import {TESTIMONIALS} from '../data/brokerData';

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="border-b border-[#E3E3DF] bg-[#F6F6F4] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#DCDCD7] pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-[#8E6E13]">
              Depoimentos
            </p>
            <h2
              className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#252528] sm:text-4xl"
              style={{textWrap: 'balance'}}
            >
              Experiências de quem já negociou conosco
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#4A4A4A]">
            Confiança construída com atendimento próximo, orientação clara e resultados reais em cada
            fechamento.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-[#DCDCD7] bg-white p-6"
            >
              <div>
                <div
                  className="flex items-center gap-1"
                  aria-label={`Avaliação ${item.rating} de 5 estrelas`}
                >
                  {Array.from({length: item.rating}).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-[#4A4A4A] tabular-nums">
                    {item.rating}.0
                  </span>
                </div>

                <blockquote className="mt-4 text-sm leading-relaxed text-[#38383C] sm:text-base">
                  “{item.text}”
                </blockquote>
              </div>

              <footer className="mt-6 border-t border-[#ECECE8] pt-4">
                <p className="font-serif text-lg font-bold text-[#252528]">{item.name}</p>
                <p className="text-xs font-medium text-[#6B6B70]">{item.context}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
