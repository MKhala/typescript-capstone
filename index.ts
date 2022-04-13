import { requestsMock } from "./src/mocks";
import type {  IObserver, IObserverInput, IRequest, IUnsubscribable } from "./src/types";
import {HTTP_METHOD, HTTP_STATUS, USER_ROLES} from "./src/types";
  
class Observer<T, E> implements IObserver<T, E> {
    private isUnsubscribed = false;
    public _unsubscribe?: () => void;

    constructor(private handlers: IObserverInput<T, E>) {}


    next(value: T) {
        if (this.handlers.next && !this.isUnsubscribed)
            this.handlers.next(value);  
        
    }

    error(error: E) {
        if (!this.isUnsubscribed) {
            if (this.handlers.error)
                this.handlers.error(error);

            this.unsubscribe();
        }
    }

    complete() {
        if (!this.isUnsubscribed) {
            if (this.handlers.complete) 
                this.handlers.complete();
        
            this.unsubscribe();
        }
    }

    unsubscribe() {
        this.isUnsubscribed = true;

        if (this._unsubscribe)
            this._unsubscribe();

    }
}


class Observable<T, E> {
    private constructor(private _subscribe: (observer: IObserver<T, E>) => () => void) {}

    static from<T, E>(values: T[]): Observable<T, E> {
        return new Observable((observer) => {
            values.forEach((value) => observer.next(value));

            observer.complete();

            return () => {
                console.log('unsubscribed');
            };
        })
    }

    subscribe(obs: IObserverInput<T, E>): IUnsubscribable {
        const observer = new Observer(obs);

        observer._unsubscribe = this._subscribe(observer);

        return ({
            unsubscribe() {
                observer.unsubscribe();
            }
        });
    }
}


const handleRequest = () => {
    // handling of request
    return {
        status: HTTP_STATUS.OK
    };
};

const handleError = () => {
    // handling of error
    return {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
    };
};

const handleComplete = () => console.log('complete');

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
    next: handleRequest,
    error: handleError,
    complete: handleComplete
});

subscription.unsubscribe();