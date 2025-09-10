let keys = [
  { name: "Spanish" },
  { name: "HOME" },
  { name: "TIRES" },
  { name: "WHEELS" },
  { name: "ACCESSORIES" },
  { name: "PRODUCTS" },
  { name: "PROGRAMS & SERVICES" },
  { name: "CONTACT US" },
  { name: "ABOUT US" },
  { name: "ORDERS & DELIVERIES" },
  { name: "ACCOUNT" },
  { name: "MANAGE_ACCOUNT" },
  { name: "LOG_OUT" },
  { name: "LOGIN" },
  { name: "Items on sellout" },
  { name: "Discount" },
  { name: "Show Items" },
  { name: "SEARCH TIRE MANUALLY" },
  { name: "See More" },
  { name: "Updated successfully" },
  { name: "Saving..." },
  { name: "Sale ends on" },
  { name: "Submit" },
  { name: "VEHICLE" },
  { name: "Year" },
  { name: "Make" },
  { name: "Model" },
  { name: "Select" },
  { name: "Search" },
  { name: "SEARCH TIRE MANUALLY" },
  { name: "Logged Out Successfully" },
  { name: "Search Placeholder" },
  { name: "Learn More" },
  { name: "Show Less" },
  { name: "hello" },
];

const seen = new Set();
export const uniqueKeys = keys.filter((item) => {
  if (seen.has(item.name)) return false;
  seen.add(item.name);
  return true;
});
