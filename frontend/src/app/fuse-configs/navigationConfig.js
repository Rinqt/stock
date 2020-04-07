const navigationConfig = [
  {
    id: "applications",
    title: "Applications",
    type: "group",
    icon: "apps",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "item",
        url: "/app/dashboard",
        icon: "dashboard",
        showOnLogin: null
      },
      {
        id: "companies",
        title: "Companies",
        type: "item",
        url: "/app/companies",
        icon: "favorite",
        showOnLogin: true
      },
      {
        id: "history",
        title: "History",
        type: "item",
        url: "/app/history",
        icon: "history",
        showOnLogin: true
      },
      {
        id: "analysis",
        title: "Analysis Overview",
        type: "item",
        url: "/app/analysis",
        icon: "show_chart",
        showOnLogin: true
      },
      {
        id: "login",
        title: "locale.login",
        type: "item",
        url: "/auth/login",
        icon: "account_box",
        showOnLogin: false
      },
      {
        id: "register",
        title: "locale.register",
        type: "item",
        url: "/auth/register",
        icon: "verified_user",
        showOnLogin: false
      }
    ]
  }
];

export default navigationConfig;
