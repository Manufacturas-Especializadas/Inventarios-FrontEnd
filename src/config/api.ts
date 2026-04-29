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
      stock: "/api/Exits/stock/",
      entries: "/api/Entries/Create",
      historyEntries: "/api/Entries/history/",
      updateEntries: "/api/Entries/UpdateEntry/",
      deleteEntries: "/api/Entries/DeleteEntry/",
      historyExits: "/api/Exits/history/",
      exits: "/api/Exits/CreateExit",
      exitByFolio: "/api/Exits/CreateExitByFolio",
      update: "/api/Exits/UpdateExit/",
      delete: "/api/Exits/DeleteExit/",
    },
    shipments: {
      scan: "/api/Shipping/Scan",
      release: "/api/Shipping/Release",
      releaseId: "/api/Shipping/Release/",
    },
  },
};
