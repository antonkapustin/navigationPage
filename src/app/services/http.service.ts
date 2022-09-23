import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
} from "rxjs";

export interface data {
  type: string;
  _id: string;
  amount: number;
  name: {
    // Nested object with it’s own properties
    first: string;
    last: string;
  };
  company: string;
  email: string;
  phone: string;
  address: string;
}

export interface api {
  total: number;
  data: data[];
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  data$: BehaviorSubject<data[]> = new BehaviorSubject<data[]>([]);
  api: string =
    "https://raw.githubusercontent.com/antonkapustin/navigationPage/main/src/jsonviewer.json";
  constructor(private http: HttpClient) {}

  getAll(): Observable<data[]> {
    const data = this.http.get<api>(this.api).pipe(
      map((response) => {
        this.updateItems(response.data);
        return response.data;
      }),
      catchError(this.handleError<any>("GetData"))
    );
    return data;
  }
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  private updateItems(data: data[]): void {
    this.data$.next(data);
  }
  getItems$(): BehaviorSubject<data[]> {
    return this.data$;
  }
  getItems(): data[] {
    return this.data$.getValue();
  }
}
