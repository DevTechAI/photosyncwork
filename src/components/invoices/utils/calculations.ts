
export const calculateSubtotal = (items: { amount: string }[]) => {
  return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
};

export const calculateGST = (subtotal: number, gstRate: string) => {
  return (subtotal * Number(gstRate)) / 100;
};

export const calculateTotal = (subtotal: number, gst: number) => {
  return subtotal + gst;
};
