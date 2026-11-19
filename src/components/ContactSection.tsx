import {CheckCircle2, Mail, MessageCircle, Phone} from 'lucide-react';
import {useState, type FormEvent} from 'react';
import {BROKER_INFO} from '../data/brokerData';
import {
  buildMailtoLink,
  buildWhatsAppLink,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '../utils/brokerUtils';

type Channel = 'whatsapp' | 'email';

export function ContactSection() {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState<{
    channel: Channel;
    whatsappUrl: string;
    mailtoUrl: string;
    snapshot: ContactFormValues;
  } | null>(null);

  const handleChannelSubmit = (channel: Channel) => {
    const validation = validateContactForm(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitted(null);
      return;
    }

    setErrors({});
    setSubmitted({
      channel,
      whatsappUrl: buildWhatsAppLink(values),
      mailtoUrl: buildMailtoLink(values),
      snapshot: {
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      },
    });
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleChannelSubmit('whatsapp');
  };

  return (
    <section id="contato" className="bg-[#252528] py-20 text-white lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#E5C454]">
              Contato Direto
            </p>
            <h2
              className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{textWrap: 'balance'}}
            >
              Converse diretamente com {BROKER_INFO.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-300">
              Tire dúvidas sobre imóveis, agende uma visita ou alinhe parcerias comerciais. Retorno
              ágil pelo canal de sua preferência.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/15 pt-8">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-neutral-400">Telefone e WhatsApp</p>
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block text-lg font-semibold text-white tabular-nums transition-colors hover:text-[#E5C454]"
                  >
                    {BROKER_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-medium text-neutral-400">Atendimento Imediato</p>
                  <p className="mt-0.5 text-sm text-neutral-300">
                    Envie sua mensagem pelo formulário ao lado para iniciar o atendimento via
                    WhatsApp ou e-mail com os dados já preenchidos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              noValidate
              onSubmit={handleFormSubmit}
              className="rounded-lg border border-white/15 bg-[#1A1A1D] p-6 sm:p-8"
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-200">
                    Nome completo
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome"
                    value={values.name}
                    onChange={(e) => setValues((prev) => ({...prev, name: e.target.value}))}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className="mt-2 block w-full rounded-md border border-white/15 bg-[#252528] px-4 py-3 text-sm text-white placeholder-neutral-400 transition-colors focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.name && (
                    <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-[#F5B7B1]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-200">
                    E-mail
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    value={values.email}
                    onChange={(e) => setValues((prev) => ({...prev, email: e.target.value}))}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className="mt-2 block w-full rounded-md border border-white/15 bg-[#252528] px-4 py-3 text-sm text-white placeholder-neutral-400 transition-colors focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.email && (
                    <p id="contact-email-error" role="alert" className="mt-1.5 text-xs text-[#F5B7B1]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-200">
                    Mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Informe como podemos ajudar (compra, venda, visita ou parceria)."
                    value={values.message}
                    onChange={(e) => setValues((prev) => ({...prev, message: e.target.value}))}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className="mt-2 block w-full rounded-md border border-white/15 bg-[#252528] px-4 py-3 text-sm text-white placeholder-neutral-400 transition-colors focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.message && (
                    <p id="contact-message-error" role="alert" className="mt-1.5 text-xs text-[#F5B7B1]">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#D4AF37] px-5 py-3.5 text-sm font-semibold text-[#1A1A1D] whitespace-nowrap transition-colors hover:bg-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Enviar via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelSubmit('email')}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/20 bg-transparent px-5 py-3.5 text-sm font-semibold text-white whitespace-nowrap transition-colors hover:border-[#D4AF37] hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                  >
                    <Mail className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                    Enviar via E-mail
                  </button>
                </div>
              </div>

              {submitted && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-6 rounded-md border border-[#D4AF37]/40 bg-[#252528] p-5"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">
                        Mensagem pronta para envio via{' '}
                        {submitted.channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                        {submitted.snapshot.name} ({submitted.snapshot.email}): “
                        {submitted.snapshot.message}”
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={submitted.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#1A1A1D] transition-colors hover:bg-[#E5C454]"
                        >
                          Abrir no WhatsApp
                        </a>
                        <a
                          href={submitted.mailtoUrl}
                          className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#D4AF37] hover:text-[#E5C454]"
                        >
                          Abrir no aplicativo de E-mail
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
