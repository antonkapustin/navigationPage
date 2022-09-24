import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from "rxjs";
import { data, HttpService } from "../services/http.service";

export enum Tabs {
  Income = "Income",
  Outcome = "Outcome",
  Loan = "Loan",
  Investment = "Investment",
}
@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit, OnDestroy {
  tabs = Object.keys(Tabs);
  data$: BehaviorSubject<data[]> = this.httpService.getItems$();
  sortedItems$: BehaviorSubject<data[]> = new BehaviorSubject<data[]>([]);
  subscriptions: Subscription[] = [];
  tabNumb: number = 0;

  constructor(
    private httpService: HttpService,
    private location: Location,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.location.replaceState("/navigation?tab=0");
    let subscription1 = this.httpService
      .getAll()
      .pipe(
        switchMap((data) => {
          this.onFiltration(data, this.tabNumb);
          return of(data);
        })
      )
      .subscribe();

    let subscription2 = this.router.queryParams.subscribe((params) => {
      this.tabNumb = params["tab"];
      this.onFiltration(this.data$.getValue(), params["tab"]);
    });

    this.subscriptions.push(subscription1, subscription2);
  }

  onFiltration(data: data[], id: number) {
    let items = data.filter((el) => {
      return el.type.toLocaleLowerCase() === this.tabs[id].toLocaleLowerCase();
    });
    this.sortedItems$.next(items);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }
}
