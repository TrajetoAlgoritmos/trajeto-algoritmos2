export const CODE_ERROR =
  'Erro ao executar o código, verifique se o código está correto e tente novamente.';

export const menus = {
  teacher: [
    {
      href: '/professor/trilhas',
      label: 'Trilhas',
      icon: 'Combine',
    },
    {
      href: '/professor/algoritmos',
      label: 'Algoritmos',
      icon: 'Code2',
    },
    {
      href: '/professor/notificacoes',  // nova rota para notificações
      label: 'Notificações',
      icon: 'Bell',  // ou o nome do ícone de sino que sua biblioteca usar
    },
  ],
  student: [
    {
      href: '/aluno',
      label: 'Trilhas',
      icon: 'Combine',
    },
  ],
};

export const feelings = [
  {
    emoji: '😞',
    alt: 'Culpado',
    value: 1,
  },
  {
    emoji: '😔',
    alt: 'Triste',
    value: 2,
  },
  {
    emoji: '🫤',
    alt: 'Insatisfeito',
    value: 3,
  },
  {
    emoji: '😰',
    alt: 'Medo',
    value: 4,
  },
  {
    emoji: '🤢',
    alt: 'Enojado',
    value: 5,
  },
  {
    emoji: '😠',
    alt: 'Irritado',
    value: 6,
  },
  {
    emoji: '😲',
    alt: 'Surpreso',
    value: 7,
  },
  {
    emoji: '😌',
    alt: 'Sereno',
    value: 8,
  },
  {
    emoji: '🙂',
    alt: 'Interessado',
    value: 9,
  },
  {
    emoji: '😊',
    alt: 'Feliz',
    value: 10,
  },
  {
    emoji: '😃',
    alt: 'Muito Feliz',
    value: 11,
  },
  {
    emoji: '🤩',
    alt: 'Animado',
    value: 12,
  },
];
