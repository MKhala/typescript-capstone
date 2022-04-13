import { ISubscriber, IObserver, HTTP_STATUS_CODES } from "./types";
import { requestsMock } from "./mocks";

class Subject {
    subscribers: ISubscriber;
    isUnsubscribed: boolean;
    unsubscribeFn: Function | null


    constructor(subscribers: ISubscriber){
        this.subscribers = subscribers;
        this.isUnsubscribed = false;
        this.unsubscribeFn = null
    }

    next: IObserver['next'] = (value) =>  {
        if (this.subscribers.next && !this.isUnsubscribed)
            this.subscribers.next(value);
    }

    error: IObserver['error'] = (error) => {
        if (!this.isUnsubscribed) {
            if (this.subscribers.error)
                this.subscribers.error(error);

            this.unsubscribe();
        }
    }

    complete: IObserver['complete'] = ()=> {
        if (!this.isUnsubscribed) {
            if (this.subscribers.complete)
                this.subscribers.complete();
            this.unsubscribe();
        }
    }

    unsubscribe: IObserver['unsubscribe'] = ()=> {
      this.isUnsubscribed = true;

      if (this.unsubscribeFn)
        this.unsubscribeFn();
    }
}


class Observable {
  private subscribe: any
  

  constructor(subscribe) {
    this.subscribe = subscribe;
  }

  static from(values): void | any {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value));

      observer.complete();

      return () => {
        console.log('unsubscribed');
      };
    });
  }

  subscribeHandler(obs: ISubscriber) {
    const observer = new Observer(obs);

    observer.unsubscribeFn = this.subscribe(observer);

    return ({
      unsubscribe() {
        if(observer.unsubscribeFn)
          observer.unsubscribeFn();
      }
    });
  }
}

//@ts-ignore
const handleRequest = (request) => {
  // handling of request
  return {status: HTTP_STATUS_CODES.HTTP_STATUS_OK};
};
//@ts-ignore
const handleError = (error) => {
  // handling of error
  return {status: HTTP_STATUS_CODES.HTTP_STATUS_INTERNAL_SERVER_ERROR};
};

const handleComplete = () => console.log('complete');

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete
});

subscription.unsubscribe();