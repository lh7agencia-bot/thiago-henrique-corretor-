import {BROKER_INFO, SERVICE_PILLARS} from '../data/brokerData';

export function DifferentialsSection() {
  return (
    <section
      id="diferenciais"
      className="border-b border-[#E3E3DF] bg-[#F6F6F4] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#8E6E13]">
              Atuação Profissional
            </p>
            <h2
              className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#252528] sm:text-4xl"
              style={{textWrap: 'balance'}}
            >
              Compromisso real com cada negociação imobiliária
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#4A4A4A]">
              Na atuação de <strong className="font-semibold text-[#252528]">{BROKER_INFO.name}</strong>, cada
              imóvel e cada cliente recebem atenção direta. Do alinhamento de expectativas à
              formalização contratual, o foco é gerar negócios sólidos e duradouros.
            </p>

            <div className="mt-8 rounded-lg border border-[#DCDCD7] bg-white p-6">
              <p className="font-serif text-xl font-semibold text-[#252528]">
                “{BROKER_INFO.slogan}”
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
                Transparência em honorários, agilidade no retorno e respeito ao tempo de quem compra,
                vende ou indica oportunidades.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-[#DCDCD7] border-y border-[#DCDCD7]">
              {SERVICE_PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:items-start sm:gap-6"
                >
                  <span className="font-serif text-2xl font-bold text-[#9B7815] tabular-nums sm:col-span-2">
                    {pillar.number}.
                  </span>
                  <div className="sm:col-span-10">
                    <h3 className="text-lg font-semibold text-[#252528]">{pillar.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#4A4A4A] sm:text-base">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
