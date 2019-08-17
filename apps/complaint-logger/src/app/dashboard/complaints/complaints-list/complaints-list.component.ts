import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { Complaint, ComplaintStatus } from '@complaint-logger/models';
import { switchMap, map, shareReplay, filter } from 'rxjs/operators';

@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {
  ComplaintStatus = ComplaintStatus;
  tabChangeEvent = new BehaviorSubject<number>(1);
  private _pendingPagination = {
    pageSize: 10,
    pageNumber: 1
  };
  private _resolvedPagination = {
    pageSize: 10,
    pageNumber: 1
  };
  pendingPagination = new BehaviorSubject(this._pendingPagination);
  resolvedPagination = new BehaviorSubject(this._resolvedPagination);
  pending$ = combineLatest(this.tabChangeEvent, this.pendingPagination).pipe(
    filter(([selectedTabIndex, _]) => selectedTabIndex === 1),
    switchMap(([_, { pageSize, pageNumber }]) => this.dataService.complaints({ pageSize, pageNumber, status: ComplaintStatus.Pending })),
    shareReplay()
  );
  resolved$ = combineLatest(this.tabChangeEvent, this.resolvedPagination).pipe(
    filter(([selectedTabIndex, _]) => selectedTabIndex === 2),
    switchMap(([_, { pageSize, pageNumber }]) => this.dataService.complaints({ pageSize, pageNumber, status: ComplaintStatus.Resolved })),
    shareReplay()
  );

  constructor(private readonly dataService: ComplaintsListService) {

    this.tabChangeEvent.next(1);
  }

  ngOnInit() {

  }
}


