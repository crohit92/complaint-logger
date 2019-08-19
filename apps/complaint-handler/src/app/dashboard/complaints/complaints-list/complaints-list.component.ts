import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { Complaint, ComplaintStatus, Employee } from '@complaint-logger/models';
import { switchMap, map, shareReplay, filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import * as moment from 'moment';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-complaints-list',
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
  pending$ = this.generateComplaintsStream(this.pendingPagination, ComplaintStatus.Pending);
  resolved$ = this.generateComplaintsStream(this.pendingPagination, ComplaintStatus.Resolved);

  constructor(private readonly dataService: ComplaintsListService) {
    this.tabChangeEvent.next(1);
  }

  private generateComplaintsStream(pagination: Subject<{ pageSize: number; pageNumber: number; }>, status: ComplaintStatus) {
    return combineLatest(this.tabChangeEvent, pagination).pipe(
      filter(([selectedTabIndex, _]) => selectedTabIndex === (status === ComplaintStatus.Pending ? 1 : 2)),
      switchMap(([_, { pageSize, pageNumber }]) => this.dataService.complaints({ pageSize, pageNumber, status })), map(c => {
        c.complaints.forEach(complaint => {
          Object.assign(complaint, {
            createdOffset: moment(complaint.createdAt).fromNow()
          });
          complaint.employeeSearchControl = new FormControl();
          complaint.employees = (complaint.employeeSearchControl as FormControl).valueChanges.pipe(
            switchMap((value) => this.dataService.employees(value))
          );
          complaint.employeeSelected = this.employeeSelected.bind(this, complaint);
        });
        return c;
      }), shareReplay());
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

  employeeSelected(complaint: Complaint, employee?: Employee): string | undefined {
    if (employee) {
      const _complaint = { ...complaint };
      delete _complaint['employeeSelected'];
      delete _complaint['employees'];
      delete _complaint['employeeSearchControl'];
      _complaint.assignedTo = employee;
      this.dataService.updateComplaint(_complaint).subscribe(() => {
        complaint.assignedTo = employee;
        complaint.selectAssignee = false;
      });
      return employee.name;
    }
    return undefined;
  }
}


