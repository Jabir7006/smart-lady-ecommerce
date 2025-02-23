export const doughnutLegends = [
  { title: "Shirts", color: "bg-blue-500" },
  { title: "Shoes", color: "bg-teal-600" },
  { title: "Bags", color: "bg-purple-600" },
];

export const lineLegends = [
  { title: "Organic", color: "bg-teal-600" },
  { title: "Paid", color: "bg-purple-600" },
];

export const barLegends = [
  { title: "Shoes", color: "bg-teal-600" },
  { title: "Bags", color: "bg-purple-600" },
];
export const realTimeUsersBarLegends = [
  { title: "Active Users", color: "bg-teal-600" },
];

export const doughnutOptions = {
  data: {
    datasets: [
      {
        data: [33, 33, 33],
        backgroundColor: ["#1c64f2", "#0694a2", "#7e3af2"],
        borderWidth: 0,
        label: "Dataset 1",
      },
    ],
    labels: ["Shirts", "Shoes", "Bags"],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    cutout: '85%',
    plugins: {
      legend: {
        display: false,
      }
    },
    layout: {
      padding: 20
    }
  }
};

export const lineOptions = {
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Organic",
        backgroundColor: "#0694a2",
        borderColor: "#0694a2",
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
        tension: 0.4,
        borderWidth: 3
      },
      {
        label: "Paid",
        backgroundColor: "#7e3af2",
        borderColor: "#7e3af2",
        data: [24, 50, 64, 74, 52, 51, 65],
        fill: false,
        tension: 0.4,
        borderWidth: 3
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
          padding: 10
        }
      },
      y: {
        grid: {
          color: '#1F2937',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
          maxTicksLimit: 6,
          padding: 10
        },
        min: 20,
        max: 80
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  }
};

export const barOptions = {
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Shoes",
        backgroundColor: "#0694a2",
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [-3, 14, 52, 74, 33, 90, 70],
      },
      {
        label: "Bags",
        backgroundColor: "#7e3af2",
        // borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [66, 33, 43, 12, 54, 62, 84],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
};

export const realTimeUsersBarOptions = {
  data: {
    labels: [
      "6.00",
      "6.10",
      "6.20",
      "6.30",
      "6.40",
      "6.50",
      "7.00",
      "7.10",
      "7.20",
      "7.30",
      "7.40",
      "7.50",
      "Now",
    ],
    datasets: [
      {
        label: "Active Users",
        backgroundColor: "#0694a2",
        borderWidth: 1,
        data: [2, 14, 52, 74, 33, 90, 70, 34, 56, 62, 11, 23, 55],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
};
