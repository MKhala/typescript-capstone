export interface IObserverInput<T, E> {
    next(value: T): void;
    error(value: E): void;
    complete(): void;
}

export interface IUnsubscribable {
    unsubscribe(): void;
}

export interface IObserver<T, E> extends IObserverInput<T, E>, IUnsubscribable {
    _unsubscribe?: () => void
}

export enum HTTP_METHOD {
    POST = 'POST',
    GET = 'GET'
}

export enum HTTP_STATUS {
    OK = 200,
    INTERNAL_SERVER_ERROR = 500
}

export enum USER_ROLES {
    USER = 'user',
    ADMIN = 'admin'
}

export interface IUser {
    name: string;
    age: number;
    roles: USER_ROLES[]
    createdAt: Date,
    isDeleted: boolean
}

export interface IRequest {
    method: HTTP_METHOD;
    host: string,
    path: string,
    body?: IUser,
    params: { [key: string]: string}
}

export type status = {
    status: HTTP_STATUS
}