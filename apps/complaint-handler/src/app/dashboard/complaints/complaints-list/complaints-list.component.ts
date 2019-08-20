import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { Complaint, ComplaintStatus, Employee } from '@complaint-logger/models';
import { switchMap, map, shareReplay, filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';
import { MatSlideToggle } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {
  ComplaintStatus = ComplaintStatus;
  user: Employee = this.storage.get(StorageKeys.user) as Employee;
  paginationOptions = {
    pageSize: 5,
    pageNumber: 1
  };
  pendingComplaints: Complaint[] = [];
  resolvedComplaints: Complaint[] = [];
  pendingComplaintsCount: number
  resolvedComplaintsCount: number
  constructor(private readonly dataService: ComplaintsListService,
    private readonly storage: StorageService) {
    this.loadComplaints(this.paginationOptions, ComplaintStatus.Pending, this.pendingComplaints);
    this.loadComplaintsCount();
  }

  loadComplaintsCount() {
    this.dataService.complaintsCount(ComplaintStatus.Pending).subscribe((count) => {
      this.pendingComplaintsCount = count;
    })
    this.dataService.complaintsCount(ComplaintStatus.Resolved).subscribe((count) => {
      this.resolvedComplaintsCount = count;
    })
  }
  loadComplaints(pageOptions: { pageSize: number; pageNumber: number }, status: ComplaintStatus, target: Complaint[]) {
    this.dataService.complaints({ ...pageOptions, status }).subscribe((complaints => {
      complaints.forEach(complaint => {
        Object.assign(complaint, {
          createdOffset: moment(complaint.createdAt).fromNow()
        });
        if (status === ComplaintStatus.Pending) {
          complaint.employeeSearchControl = new FormControl();
          complaint.employees = (complaint.employeeSearchControl as FormControl).valueChanges.pipe(
            switchMap((value) => this.dataService.employees(value))
          );
          complaint.employeeSelected = this.employeeSelected.bind(this, complaint);
        }
      });
      target.splice(0);
      Object.assign(target, complaints);
    }));
    this.loadComplaintsCount();
  }

  tabChanged(tabIndex: number) {
    if (tabIndex === 0) {
      this.loadComplaints(this.paginationOptions, ComplaintStatus.Pending, this.pendingComplaints);
    } else {
      this.loadComplaints(this.paginationOptions, ComplaintStatus.Resolved, this.resolvedComplaints);
    }
  }
  ngOnInit() {
  }

  pendingPageChanged(ev: PageEvent) {
    this.paginationOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(this.paginationOptions, ComplaintStatus.Pending, this.pendingComplaints);
  }
  resolvedPageChanged(ev: PageEvent) {
    this.paginationOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(this.paginationOptions, ComplaintStatus.Resolved, this.resolvedComplaints);
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

  markComplaintAsResolved(complaint: Complaint, complaintIndex: number, matToggle: MatSlideToggle) {
    complaint.resolution.status = ComplaintStatus.Resolved;
    this.dataService.updateComplaint(complaint).subscribe(() => {
      this.pendingComplaints.splice(complaintIndex, 1);
      this.pendingComplaintsCount--;
      this.resolvedComplaintsCount++;
    }, () => {
      matToggle.checked = false;
      complaint.addRemarks = false;
    })
  }
}


