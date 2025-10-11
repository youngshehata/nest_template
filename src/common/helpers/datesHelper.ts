export const setAsStartDate = (date: Date): Date => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export const setAsEndDate = (date: Date): Date => {
  date.setHours(23, 59, 59, 999);
  return date;
};

export const formatDateOnly = (date: Date): string =>
  date.toISOString().split('T')[0];

export const extractDaysAsArray = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};
