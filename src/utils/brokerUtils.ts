import {BROKER_INFO} from '../data/brokerData';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function validateContactForm(values: ContactFormValues): {
  isValid: boolean;
  errors: ContactFormErrors;
} {
  const errors: ContactFormErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Informe seu nome completo (mínimo de 2 caracteres).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Informe um endereço de e-mail válido.';
  }

  if (trimmedMessage.length < 10) {
    errors.message = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppLink(values?: Partial<ContactFormValues>): string {
  if (!values || (!values.name && !values.message)) {
    const defaultText = `Olá! Gostaria de falar com ${BROKER_INFO.name} sobre atendimento imobiliário.`;
    return `${BROKER_INFO.whatsappBaseUrl}?text=${encodeURIComponent(defaultText)}`;
  }

  const lines = [
    `Olá, ${BROKER_INFO.name}!`,
    values.name ? `Nome: ${values.name.trim()}` : '',
    values.email ? `E-mail: ${values.email.trim()}` : '',
    values.message ? `Mensagem: ${values.message.trim()}` : '',
  ].filter(Boolean);

  return `${BROKER_INFO.whatsappBaseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildMailtoLink(values: ContactFormValues): string {
  const subject = `Contato pelo site — ${values.name.trim()}`;
  const body = [
    `Nome: ${values.name.trim()}`,
    `E-mail: ${values.email.trim()}`,
    '',
    'Mensagem:',
    values.message.trim(),
  ].join('\n');

  return `mailto:${BROKER_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getNextLightboxIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex + 1) % total;
}

export function getPrevLightboxIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex - 1 + total) % total;
}

export function isLocalPublicImagePath(src: string): boolean {
  return src.startsWith('/images/') && !src.includes('..');
}
