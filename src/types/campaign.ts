export interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  pricePerTicket: number;
  drawDate: string;
  drawTime: string;
  description: string;
  isFeatured?: boolean;
}

export interface Ticket {
  id: string;
  campaignId: string;
  numbers: string[];
  purchaseDate: string;
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'pending';
}

export interface Winner {
  id: string;
  name: string;
  campaignTitle: string;
  prize: string;
  winningNumber: string;
  photoUrl: string;
  date: string;
}
