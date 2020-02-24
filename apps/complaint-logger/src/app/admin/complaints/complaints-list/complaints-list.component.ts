import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import {
  Complaint,
  ComplaintStatus,
  Comment,
  User,
  UserTypes,
  Department
} from '@complaint-logger/models';
import { switchMap, combineAll, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { environment } from '../../../../environments/environment';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin } from 'rxjs';
declare var c3;
@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit, AfterViewInit {
  ComplaintStatus = ComplaintStatus;
  UserTypes = UserTypes;
  departments: Department[];
  graph: { filters: { from: string; to: string; department?: string } } = {
    filters: {
      from: moment()
        .startOf('month')
        .startOf('day')
        .toISOString(),
      to: moment()
        .endOf('month')
        .endOf('day')
        .toISOString()
    }
  };
  user: User = this.storage.get(StorageKeys.user) as User;
  paginationOptions = {
    pageSize: 5,
    pageNumber: 1
  };
  pendingComplaints: Complaint[] = [];
  resolvedComplaints: Complaint[] = [];
  closedComplaints: Complaint[] = [];
  pendingComplaintsCount: number;
  resolvedComplaintsCount: number;
  closedComplaintsCount: number;
  selectedTabIndex: number = 0;
  constructor(
    private readonly dataService: ComplaintsListService,
    private readonly storage: StorageService
  ) {}

  getStartOfDay(date: any) {
    return moment(date).startOf('day');
  }
  getEndOfDay(date: any) {
    return moment(date).endOf('day');
  }

  onFromDateChange(date) {
    this.graph.filters.from = this.getStartOfDay(date).toISOString();
    this.loadComplaintsOnSelectionChange();
  }
  public loadComplaintsOnSelectionChange() {
    const complaintTypeToLoad = this.getSelectedTabType();
    this.loadComplaints(
      this.paginationOptions,
      complaintTypeToLoad,
      complaintTypeToLoad === ComplaintStatus.Pending
        ? this.pendingComplaints
        : complaintTypeToLoad === ComplaintStatus.Resolved
        ? this.resolvedComplaints
        : this.closedComplaints
    );
  }

  onToDateChange(date) {
    this.graph.filters.to = this.getEndOfDay(date).toISOString();
    this.loadComplaintsOnSelectionChange();
  }
  ngAfterViewInit(): void {
    this.dataService.departments.subscribe(departments => {
      if (this.user.type === UserTypes.SuperAdmin) {
        this.departments = departments;
        this.graph.filters.department = this.departments[0].code;
      }
      this.loadComplaints(
        this.paginationOptions,
        ComplaintStatus.Pending,
        this.pendingComplaints
      );
    });
  }
  private getSelectedTabType(): ComplaintStatus {
    if (this.selectedTabIndex === 0) {
      return ComplaintStatus.Pending;
    } else if (this.selectedTabIndex === 1) {
      return ComplaintStatus.Resolved;
    }
    if (this.selectedTabIndex === 2) {
      return ComplaintStatus.Done;
    }
  }
  private getClosedComplaints() {
    return this.dataService.complaintsCount(
      ComplaintStatus.Done,
      this.graph.filters
    );
  }

  private getResolvedComplaints() {
    return this.dataService.complaintsCount(
      ComplaintStatus.Resolved,
      this.graph.filters
    );
  }

  private getPendingComplaints() {
    return this.dataService.complaintsCount(
      ComplaintStatus.Pending,
      this.graph.filters
    );
  }

  loadComplaintCountGraph() {
    forkJoin([
      this.getClosedComplaints(),
      this.getPendingComplaints(),
      this.getResolvedComplaints()
    ]).subscribe(([doneCount, pendingCount, resolvedCount]) => {
      this.pendingComplaintsCount = pendingCount;
      this.closedComplaintsCount = doneCount;
      this.resolvedComplaintsCount = resolvedCount;
      c3.generate({
        bindto: '.graph__complaints-count',
        data: {
          columns: [
            ['Pending', pendingCount],
            ['Resolved', resolvedCount],
            ['Closed', doneCount]
            // ['data2', 130, 100, 140, 200, 150, 50]
          ],
          type: 'pie'
        },
        bar: {
          width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
          }
          // or
          //width: 100 // this makes bar width 100px
        }
      });
    });
  }
  loadComplaints(
    pageOptions: { pageSize: number; pageNumber: number },
    status: ComplaintStatus,
    target: Complaint[]
  ) {
    this.dataService
      .complaints({ ...pageOptions, status }, this.graph.filters)
      .subscribe(complaints => {
        complaints.forEach(complaint => {
          if (complaint.status === ComplaintStatus.Resolved) {
            complaint.canClose =
              moment().diff(moment(complaint.resolvedAt)) >
              environment.adminCanCloseAfter;
          }
          Object.assign(complaint, {
            createdOffset: moment(complaint.createdAt).fromNow()
          });
          if (status === ComplaintStatus.Pending) {
            complaint.employeeSearchControl = new FormControl();
            complaint.employees = (complaint.employeeSearchControl as FormControl).valueChanges.pipe(
              switchMap(value => this.dataService.employees(value))
            );
            complaint.getEmployeeName = this.getEmployeeName.bind(
              this,
              complaint
            );
            complaint.assign = this.assignComplaint.bind(this, complaint);
          }
        });
        target.splice(0);
        Object.assign(target, complaints);
      });
    this.loadComplaintCountGraph();
  }
  closeComplaint(complaint: Complaint, complaintIndex: number) {
    this.dataService
      .updateComplaintStatus(complaint, ComplaintStatus.Done)
      .subscribe(() => {
        this.resolvedComplaints.splice(complaintIndex, 1);
        this.resolvedComplaintsCount--;
      });
  }
  tabChanged(tabIndex: number) {
    this.selectedTabIndex = tabIndex;
    if (tabIndex === 0) {
      this.loadComplaints(
        this.paginationOptions,
        ComplaintStatus.Pending,
        this.pendingComplaints
      );
    } else if (tabIndex === 1) {
      this.loadComplaints(
        this.paginationOptions,
        ComplaintStatus.Resolved,
        this.resolvedComplaints
      );
    } else if (tabIndex === 2) {
      this.loadComplaints(
        this.paginationOptions,
        ComplaintStatus.Done,
        this.closedComplaints
      );
    }
  }
  ngOnInit() {}

  pendingPageChanged(ev: PageEvent) {
    this.paginationOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(
      this.paginationOptions,
      ComplaintStatus.Pending,
      this.pendingComplaints
    );
  }
  resolvedPageChanged(ev: PageEvent) {
    this.paginationOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(
      this.paginationOptions,
      ComplaintStatus.Resolved,
      this.resolvedComplaints
    );
  }
  closedPageChanged(ev: PageEvent) {
    this.paginationOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(
      this.paginationOptions,
      ComplaintStatus.Done,
      this.closedComplaints
    );
  }

  getEmployeeName(complaint: Complaint, employee?: User): string | undefined {
    if (employee) {
      return employee.name;
    }
    return undefined;
  }

  assignComplaint(complaint: Complaint, $event: MatAutocompleteSelectedEvent) {
    this.dataService
      .assignComplaint(complaint._id, $event.option.value)
      .subscribe(() => {
        complaint.assignedTo = $event.option.value;
        complaint.selectAssignee = false;
      });
  }

  markComplaintAsResolved(
    complaint: Complaint,
    commentEl: HTMLInputElement,
    complaintIndex: number,
    matToggle: MatSlideToggle
  ) {
    const comment: Comment = {
      by: this.user.name,
      description: commentEl.value,
      userType: this.user.type,
      timestamp: new Date()
    };
    this.dataService
      .addComment(complaint, comment)
      .subscribe((_complaint: Complaint) => {
        commentEl.value = '';

        this.dataService
          .updateComplaintStatus(_complaint, ComplaintStatus.Resolved)
          .subscribe(
            () => {
              this.pendingComplaints.splice(complaintIndex, 1);
              this.pendingComplaintsCount--;
              this.resolvedComplaintsCount++;
            },
            () => {
              matToggle.checked = false;
              _complaint.addRemarks = false;
            }
          );
      });
  }
}
