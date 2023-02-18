export interface QueryResult<T>{
    errorMessage: any;
    data: T | null;
}