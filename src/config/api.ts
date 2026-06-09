const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    Lines: {
      getAll: "/api/Balances/line/",
      export: "/api/Balances/export/line/",
      ftnBalance: "/api/Ftn/balance/",
      stock: "/api/Exits/stock/",
      entries: "/api/Entries/Create",
      historyEntries: "/api/Entries/history/",
      updateEntries: "/api/Entries/UpdateEntry/",
      deleteEntries: "/api/Entries/DeleteEntry/",
      historyExits: "/api/Exits/history/",
      reconcile: "/api/Ftn/reconcile/",
      exits: "/api/Exits/CreateExit",
      exitByFolio: "/api/Exits/CreateExitByFolio",
      generateReport: "/api/Exits/Generate-Report",
      reportLogs: "/api/Exits/report-logs/",
      previewExits: "/api/Exits/preview/",
      update: "/api/Exits/UpdateExit/",
      delete: "/api/Exits/DeleteExit/",
    },
    shipments: {
      scan: "/api/Shipping/Scan",
      release: "/api/Shipping/Release",
      releaseId: "/api/Shipping/Release/",
    },
    microchanlle: {
      register: "/api/Microchannel/register",
    },
  },
};
