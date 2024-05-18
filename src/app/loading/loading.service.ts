import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, concatMap, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);

    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    showLoaderUntilCompleted <T> (obs$: Observable<T>): Observable<T> {
        return of(null).pipe(
            tap(() => this.loadingOn()), // happens on the inital value 'null'
            concatMap(() => obs$),
            finalize(() => this.loadingOff()) // happens on emiting the real value of obs$
        );
    }

    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);        
    }

}