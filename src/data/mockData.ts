import { Campaign, Winner } from '@/types/campaign';

export const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Audi R8 V10 Plus 2024',
    imageUrl: 'https://images.unsplash.com/photo-1639404544810-0596859d8c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBwcml6ZXxlbnwxfHx8fDE3NjgzNTEwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerTicket: 10,
    drawDate: '2026-02-01',
    drawTime: '20:00',
    description: 'Ganhe um Audi R8 V10 Plus 2024 0km, avaliado em R$ 1.200.000,00. Sorteio realizado pela Loteria Federal.',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Kawasaki Ninja H2R',
    imageUrl: 'https://images.unsplash.com/photo-1740687832355-a7c5e84ecf1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcHJpemV8ZW58MXx8fHwxNzY4MzUxMDE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerTicket: 5,
    drawDate: '2026-02-15',
    drawTime: '20:00',
    description: 'Moto esportiva de alta performance, 0km, documentada e pronta para rodar.',
    isFeatured: false
  },
  {
    id: '3',
    title: 'R$ 100.000 em Dinheiro',
    imageUrl: 'https://images.unsplash.com/photo-1744131897960-2744987b3ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25leSUyMGNhc2glMjBwcml6ZXxlbnwxfHx8fDE3NjgzNTEwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerTicket: 3,
    drawDate: '2026-01-30',
    drawTime: '20:00',
    description: 'Dinheiro na mão! R$ 100 mil para você realizar seus sonhos.',
    isFeatured: false
  }
];

export const winners: Winner[] = [
  {
    id: '1',
    name: 'João Silva',
    campaignTitle: 'BMW M4 Competition',
    prize: 'BMW M4 Competition 2023',
    winningNumber: '3847',
    photoUrl: 'https://images.unsplash.com/photo-1637108746163-99d3a2d15a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdpbm5lciUyMHBlcnNvbnxlbnwxfHx8fDE3NjgzNTEwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2026-01-10'
  },
  {
    id: '2',
    name: 'Maria Santos',
    campaignTitle: 'R$ 50.000 em Dinheiro',
    prize: 'R$ 50.000',
    winningNumber: '0127',
    photoUrl: 'https://images.unsplash.com/photo-1637108746163-99d3a2d15a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdpbm5lciUyMHBlcnNvbnxlbnwxfHx8fDE3NjgzNTEwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2026-01-05'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    campaignTitle: 'Harley-Davidson Fat Boy',
    prize: 'Harley-Davidson Fat Boy',
    winningNumber: '9512',
    photoUrl: 'https://images.unsplash.com/photo-1637108746163-99d3a2d15a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdpbm5lciUyMHBlcnNvbnxlbnwxfHx8fDE3NjgzNTEwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2025-12-28'
  }
];
