export const formatDate = (date: string) => {
  const diff = new Date().getTime() - new Date(date).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  
  if (months > 0) {
    return `${months} months ago`;
  }
  return 'recently';
};