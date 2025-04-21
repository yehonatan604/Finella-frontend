export type TDataGridInputCellParams = {
    row: Record<string, unknown>;
    value: string | number;
    hasFocus: boolean;
    id?: string;
}