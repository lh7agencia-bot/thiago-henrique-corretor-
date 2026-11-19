import {ChevronDown} from 'lucide-react';
import {useState} from 'react';
import {FAQ_ITEMS} from '../data/brokerData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="border-b border-[#E3E3DF] bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.15em] text-[#8E6E13]">
            Perguntas Frequentes
          </p>
          <h2
            className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#252528] sm:text-4xl"
            style={{textWrap: 'balance'}}
          >
            Dúvidas comuns sobre nosso atendimento
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4A4A4A]">
            Esclarecimentos diretos sobre intermediação, visitas, documentação e parcerias.
          </p>
        </div>

        <div className="mt-10 divide-y divide-[#DCDCD7] border-y border-[#DCDCD7]">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;
            return (
              <div key={item.id} className="py-1">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-[#8E6E13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  <span className="text-base font-semibold text-[#252528] sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#9B7815] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    className="pb-5 pr-8 text-sm leading-relaxed text-[#4A4A4A] sm:text-base"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
