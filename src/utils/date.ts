export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const getDateFromRange = (range: string, customRange?: { start: Date; end: Date }) => {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
      return null;
    default:
      if (customRange) {
        return customRange;
      }
      return null;
  }

  return { start: startDate, end: now };
}; 