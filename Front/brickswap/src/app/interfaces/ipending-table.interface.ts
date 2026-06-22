export interface IPendingTable {
    id: string | number;
    title: string;
    customer: string;
    reason:string;
    time: string;
    status: string;
    resolution?: string;
}
