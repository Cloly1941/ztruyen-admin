export interface IUserImportColumn extends Record<string, unknown> {
    name: string;
    email: string;
    gender: string;
    age: number;
    provider: string;
}