import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { data, HttpService } from '../services/http.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  data$: BehaviorSubject<data[]> = this.httpService.getItems$();
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    console.log(this.data$.getValue());
  }
}
