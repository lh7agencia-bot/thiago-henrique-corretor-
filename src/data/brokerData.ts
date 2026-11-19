export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  width: number;
  height: number;
}

export interface Testimonial {
  id: string;
  name: string;
  context: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServicePillar {
  number: string;
  title: string;
  description: string;
}

export const BROKER_INFO = {
  name: 'thiago henrique corretor',
  slogan: 'Sua comissão é nosso sucesso',
  niche: 'Corretor de Imóveis',
  phoneDisplay: '(62) 8477-3452',
  phoneRaw: '556284773452',
  whatsappBaseUrl: 'https://wa.me/556284773452',
  email: 'contato@thiagohenriquecorretor.com.br',
} as const;

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    number: '01',
    title: 'Atendimento Direto e Consultivo',
    description:
      'Conversa transparente do primeiro contato à entrega das chaves, entendendo o perfil exato do imóvel ou investimento que você procura.',
  },
  {
    number: '02',
    title: 'Avaliação Real de Mercado',
    description:
      'Precificação estratégica baseada em comparativos reais e características construtivas para acelerar vendas sem comprometer seu patrimônio.',
  },
  {
    number: '03',
    title: 'Segurança em Toda a Documentação',
    description:
      'Conferência completa de matrícula, certidões e etapas de contrato para que comprador e vendedor fechem negócio com tranquilidade.',
  },
  {
    number: '04',
    title: 'Parcerias e Comissões Claras',
    description:
      'Modelo de trabalho honesto e objetivo: sua comissão é nosso sucesso, valorizando cada indicação, parceria e fechamento bem conduzido.',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'area-lazer-piscina',
    src: '/images/area-lazer-piscina.jpeg',
    alt: 'Área de lazer com piscina em alvenaria, hidromassagem curva e espaço gourmet coberto',
    title: 'Área de Lazer com Piscina e Espaço Gourmet',
    category: 'Área Externa',
    description:
      'Piscina revestida com degraus amplos, hidromassagem curva e acesso direto à bancada gourmet coberta e sistema de energia solar.',
    width: 1080,
    height: 1391,
  },
  {
    id: 'cozinha-planejada',
    src: '/images/cozinha-planejada.jpeg',
    alt: 'Cozinha planejada com armários amadeirados, bancada em granito escuro e piso em mármore',
    title: 'Cozinha Planejada e Acabamento em Mármore',
    category: 'Ambiente Interno',
    description:
      'Armários planejados em padrão amadeirado, bancada extensa em granito escuro e revestimento contínuo com iluminação em LED.',
    width: 1080,
    height: 1413,
  },
  {
    id: 'garagem-coberta',
    src: '/images/garagem-coberta.jpeg',
    alt: 'Garagem ampla coberta com forro amadeirado, vigas metálicas e acesso direto à área social',
    title: 'Garagem Coberta e Acesso Social',
    category: 'Fachada & Acesso',
    description:
      'Cobertura ampla para veículos com forro amadeirado, estrutura metálica reforçada, piso antiderrapante e integração direta à residência.',
    width: 1080,
    height: 1407,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'dep-1',
    name: 'Marcelo Rezende',
    context: 'Compra residencial',
    rating: 5,
    text: 'O Thiago acompanhou cada etapa da nossa compra com muita clareza. Apresentou opções alinhadas ao que buscávamos e conduziu a negociação até a assinatura sem surpresas.',
  },
  {
    id: 'dep-2',
    name: 'Camila Andrade',
    context: 'Venda de imóvel',
    rating: 5,
    text: 'Excelente atendimento desde a avaliação inicial. As visitas foram bem filtradas e conseguimos fechar a venda com agilidade e total segurança na documentação.',
  },
  {
    id: 'dep-3',
    name: 'Rafael Nogueira',
    context: 'Parceria e indicação',
    rating: 5,
    text: 'Profissional comprometido com a palavra. A transparência na comissão e o cuidado no atendimento aos clientes fazem toda a diferença no resultado final.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona o atendimento para comprar ou vender um imóvel?',
    answer:
      'O atendimento começa com uma conversa direta pelo WhatsApp ou formulário para entender seu objetivo, faixa de investimento ou características do imóvel. A partir disso, fazemos a seleção de oportunidades ou o plano de divulgação e agendamento de visitas.',
  },
  {
    id: 'faq-2',
    question: 'Como são tratadas as comissões e parcerias imobiliárias?',
    answer:
      'Trabalhamos com total transparência desde o início, formalizando percentuais e condições de forma clara. Seguindo nosso princípio de que sua comissão é nosso sucesso, cada parceria e intermediação recebe acompanhamento dedicado até a conclusão do negócio.',
  },
  {
    id: 'faq-3',
    question: 'Como agendar uma visita presencial aos imóveis disponíveis?',
    answer:
      'Basta enviar uma mensagem pelo WhatsApp (62) 8477-3452 ou preencher o formulário de contato informando seu nome, e-mail e melhor horário. Retornamos rapidamente para confirmar a visita.',
  },
  {
    id: 'faq-4',
    question: 'Vocês auxiliam na conferência da documentação e financiamento?',
    answer:
      'Sim. Orientamos sobre toda a documentação necessária para compra e venda, análise de matrícula atualizada, certidões e encaminhamento junto às etapas de contrato e crédito imobiliário.',
  },
  {
    id: 'faq-5',
    question: 'Posso anunciar meu imóvel com o Thiago Henrique Corretor?',
    answer:
      'Sim. Entre em contato informando os detalhes principais do imóvel. Realizamos uma análise de mercado e alinhamos a estratégia de apresentação e atendimento aos interessados.',
  },
];
