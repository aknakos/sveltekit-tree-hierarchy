
// export type LeafDataI = {
//     '@id': number | string;
// }


// type LeafOrBranchI = LeafDataI | DataI;
// export interface DataI extends Record<string, LeafOrBranchI> { };

export type DataChildrenI = Array<DataBranchI>
export type DataBranchI = { id: string | number, children?: DataChildrenI } & { [key: string]: any };
export type DataI = Array<DataBranchI>;
