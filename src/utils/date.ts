export default function dateConverter(date: string): Date | undefined {
  if (date != "" && date != "-") {
    const [day, month, year] = date.split(".").map(Number);
    const jsDate = new Date(year, month - 1, day);
    return jsDate;
  }
  return undefined;
}

// Split the string by '.'

// Create a Date object
// Note: month in JS Date is 0-indexed (0 = January, 4 = May)
export const formatDate = (date: Date | undefined) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
