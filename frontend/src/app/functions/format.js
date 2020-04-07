export const formatNumber = num => {
  return num
    ? num
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    : "";
};
