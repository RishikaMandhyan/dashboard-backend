
const salesGraph = {
  dataPoints: [
    { label: "January", value: 10000 },
    { label: "February", value: 12000 },
    { label: "March", value: 13000 },
    { label: "April", value: 9000 },
    { label: "May", value: 15000 },
    { label: "June", value: 11000 },
    { label: "July", value: 12000 },
    { label: "August", value: 10000 },
    { label: "September", value: 7000 },
    { label: "October", value: 8000 },
  ],
  totalSales: 123240,
  totalExpenses: 111020,
  totalProfit: 12220,
};

const platformGraph = {
  dataPoints: [
    { label: "Zepto", value: 20 },
    { label: "Vendors", value: 90 },
    { label: "Zomato", value: 100 },
    { label: "Swiggy", value: 120 },
    { label: "Offline", value: 230 },
  ],
};

const categoryGraph = {
  sweets: {
    dataPoints: [
      { label: "1", value: 10000 },
      { label: "2", value: 12000 },
      { label: "3", value: 13000 },
      { label: "4", value: 9000 },
      { label: "5", value: 15000 },
      { label: "6", value: 11000 },
      { label: "7", value: 12000 },
      { label: "8", value: 10000 },
      { label: "9", value: 7000 },
      { label: "10", value: 8000 },
      { label: "11", value: 12000 },
      { label: "12", value: 10000 },
      { label: "13", value: 7000 },
      { label: "14", value: 8000 },
    ],
  },
  confectionery: {
    dataPoints: [
      { label: "1", value: 1000 },
      { label: "2", value: 9000 },
      { label: "3", value: 3000 },
      { label: "4", value: 9000 },
      { label: "5", value: 5000 },
      { label: "6", value: 1000 },
      { label: "7", value: 2000 },
      { label: "8", value: 1000 },
      { label: "9", value: 3000 },
      { label: "10", value: 4000 },
      { label: "11", value: 2000 },
      { label: "12", value: 1000 },
      { label: "13", value: 4000 },
      { label: "14", value: 8000 },
    ],
  },
  breads: {
    dataPoints: [
      { label: "1", value: 500 },
      { label: "2", value: 200 },
      { label: "3", value: 1300 },
      { label: "4", value: 900 },
      { label: "5", value: 5000 },
      { label: "6", value: 1000 },
      { label: "7", value: 1000 },
      { label: "8", value: 1000 },
      { label: "9", value: 700 },
      { label: "10", value: 800 },
      { label: "11", value: 1000 },
      { label: "12", value: 1000 },
      { label: "13", value: 700 },
      { label: "14", value: 700 },
    ],
  },
};

const ordersGraph = {
  dataPoints: [
    { label: "January", value: 100 },
    { label: "February", value: 110 },
    { label: "March", value: 120 },
    { label: "April", value: 130 },
    { label: "May", value: 190 },
    { label: "June", value: 110 },
    { label: "July", value: 120 },
    { label: "August", value: 100 },
    { label: "September", value: 50 },
    { label: "October", value: 40 },
  ],
  totalOrders: 1200,
};

module.exports = {
  salesGraph,
  ordersGraph,
  platformGraph,
  categoryGraph,
};
