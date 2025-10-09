export default function dateConverter(date: string): Date {
  const [day, month, year] = csvDate.split(".").map(Number);
  const jsDate = new Date(year, month - 1, day);
  return jsDate;
}

const csvDate = "20.5.2025";

// Split the string by '.'

// Create a Date object
// Note: month in JS Date is 0-indexed (0 = January, 4 = May)
