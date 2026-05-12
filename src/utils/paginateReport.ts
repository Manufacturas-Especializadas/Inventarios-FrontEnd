export const paginateReport = (data: any[], rowsPerPage: number = 10) => {
  const pages = [];

  for (let i = 0; i < data.length; i += rowsPerPage) {
    pages.push(data.slice(i, i + rowsPerPage));
  }

  return pages;
};
