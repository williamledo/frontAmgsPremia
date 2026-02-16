export const generateRandomNumbers = (quantity: number): string[] => {
  const numbers = new Set<string>();
  
  while (numbers.size < quantity) {
    const randomNum = Math.floor(Math.random() * 10000);
    const formattedNum = randomNum.toString().padStart(4, '0');
    numbers.add(formattedNum);
  }
  
  return Array.from(numbers).sort();
};

export const formatNumber = (num: number): string => {
  return num.toString().padStart(4, '0');
};

export const isValidNumber = (num: string): boolean => {
  const parsed = parseInt(num, 10);
  return !isNaN(parsed) && parsed >= 0 && parsed <= 9999;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
