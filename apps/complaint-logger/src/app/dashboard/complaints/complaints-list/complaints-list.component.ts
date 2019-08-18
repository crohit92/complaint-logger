import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ComplaintStatus } from '@complaint-logger/models';
import { switchMap, map, shareReplay, filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material';

import * as moment from 'moment';
@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {
  ComplaintStatus = ComplaintStatus;
  tabChangeEvent = new BehaviorSubject<number>(1);
  pendingPagination = new BehaviorSubject({
    pageSize: 5,
    pageNumber: 1
  });
  resolvedPagination = new BehaviorSubject({
    pageSize: 5,
    pageNumber: 1
  });
  pending$ = combineLatest(this.tabChangeEvent, this.pendingPagination).pipe(
    filter(([selectedTabIndex, _]) => selectedTabIndex === 1),
    switchMap(([_, { pageSize, pageNumber }]) => this.dataService.complaints({ pageSize, pageNumber, status: ComplaintStatus.Pending })),
    map(c => {
      c.complaints.forEach(complaint => Object.assign(complaint, { createdAt: moment(complaint.createdAt).fromNow() }))
      return c;
    }),
    shareReplay()
  );
  resolved$ = combineLatest(this.tabChangeEvent, this.resolvedPagination).pipe(
    filter(([selectedTabIndex, _]) => selectedTabIndex === 2),
    switchMap(([_, { pageSize, pageNumber }]) => this.dataService.complaints({ pageSize, pageNumber, status: ComplaintStatus.Resolved })),
    map(c => {
      c.complaints.forEach(complaint => Object.assign(complaint, { createdAt: moment(complaint.createdAt).fromNow() }))
      return c;
    }),
    shareReplay()
  );

  constructor(private readonly dataService: ComplaintsListService) {
    this.tabChangeEvent.next(1);
  }

  ngOnInit() {
  }

  pendingPageChanged(ev: PageEvent) {
    this.pendingPagination.next({
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    });
  }
  resolvedPageChanged(ev: PageEvent) {
    this.resolvedPagination.next({
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    });
  }

}


