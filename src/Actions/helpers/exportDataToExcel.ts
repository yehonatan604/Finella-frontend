import * as XLSX from "xlsx";

export const exportDataToExcel = (data: Record<string, unknown>[], fileName: string = "salaries") => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName + ".xlsx");
};