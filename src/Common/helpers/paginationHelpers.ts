import { TPaginationModel } from "../types/TPaginationModel";

export const pageSizeOptions = [5, 7, 10, 20];

export const defaultPageSize = pageSizeOptions[1];

export const paginatedRows = (paginationModel: TPaginationModel, filteredRows: unknown[]) => {
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return filteredRows.slice(start, end);
}