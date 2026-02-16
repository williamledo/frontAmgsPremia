import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket } from '@/types/campaign';

interface PurchaseContextType {
  currentCampaignId: string | null;
  quantity: number;
  userNumbers: string[];
  tickets: Ticket[];
  setCurrentCampaignId: (id: string) => void;
  setQuantity: (qty: number) => void;
  setUserNumbers: (numbers: string[]) => void;
  addTicket: (ticket: Ticket) => void;
  resetPurchase: () => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within PurchaseProvider');
  }
  return context;
};

export const PurchaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [userNumbers, setUserNumbers] = useState<string[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const addTicket = (ticket: Ticket) => {
    setTickets(prev => [...prev, ticket]);
  };

  const resetPurchase = () => {
    setCurrentCampaignId(null);
    setQuantity(0);
    setUserNumbers([]);
  };

  return (
    <PurchaseContext.Provider
      value={{
        currentCampaignId,
        quantity,
        userNumbers,
        tickets,
        setCurrentCampaignId,
        setQuantity,
        setUserNumbers,
        addTicket,
        resetPurchase
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
