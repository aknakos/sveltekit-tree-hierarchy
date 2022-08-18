
export type LeafDataI = {
    '@id': number | string;
}

type LeafOrBranchI = LeafDataI | DataI;
export interface DataI extends Record<string, LeafOrBranchI> { }