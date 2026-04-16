const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    L10: {
      getAll: "/api/Balances/line/",
      export: "/api/Balances/export/line/",
      stock: "/api/Exits/stock/",
      entries: "/api/Entries/Create",
      historyEntries: "/api/Entries/history/",
      exits: "/api/Exits/CreateExit",
      update: "/api/Exits/UpdateExit/",
      delete: "/api/Exits/DeleteExit/",
    },
  },
};
