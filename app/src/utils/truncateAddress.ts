export const truncateAddress = (address: string) => {
  const len = address.length;
  return `${address.substring(0, 3)}...${address.substring(len - 3, len)}`;
};
