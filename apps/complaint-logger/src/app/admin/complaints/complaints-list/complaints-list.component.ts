import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { Complaint, ComplaintStatus, Comment, User } from '@complaint-logger/models';
import { switchMap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { environment } from '../../../../environments/environment';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {
  ComplaintStatus = ComplaintStatus;
  user: User = this.storage.get(StorageKeys.user) as User;
  paginationOptions = {
    pageSize: 5,
    pageNumber: 1
  };
  pendingComplaints: Complaint[] = [];
  resolvedComplaints: Complaint[] = [];
  closedComplaints: Complaint[] = [];
  pendingComplaintsCount: number
  resolvedComplaintsCount: number
  closedComplaintsCount: number
  constructor(private readonly dataService: ComplaintsListService,
    private readonly storage: StorageService) {
    this.loadComplaints(this.paginationOptions, ComplaintStatus.Pending, this.pendingComplaints);
  }

  loadComplaintsCount() {
    this.dataService.complaintsCount(ComplaintStatus.Pending).subscribe((count) => {
      this.pendingComplaintsCount = count;
    })
    this.dataService.complaintsCount(ComplaintStatus.Resolved).subscribe((count) => {
      this.resolvedComplaintsCount = count;
    })
    this.dataService.complaintsCount(ComplaintStatus.Done).subscribe((count) => {
      this.closedComplaintsCount = count;
    })
  }
  loadComplaints(pageOptions: { pageSize: number; pageNumber: number }, status: ComplaintStatus, target: Complaint[]) {
    this.dataService.complaints({ ...pageOptions, status }).subscribe((complaints => {
      complaints.forEach(complaint => {
        if (complaint.status === ComplaintStatus.Resolved) {
          complaint.canClose = moment().diff(moment(complaint.resolvedAt)) > environment.adminCanCloseAfter;
        }
        Object.assign(complaint, {
          createdOffset: moment(complaint.createdAt).fromNow()
        });
        if (status === ComplaintStatus.Pending) {
          complaint.employeeSearchControl = new FormControl();
          complaint.employees = (complaint.employeeSearchControl as FormControl).valueChanges.pipe(
            switchMap((value) => this.dataService.employees(value))
          );
          complaint.getEmployeeName = this.getEmployeeName.bind(this, complaint);
          complaint.assign = this.assignComplaint.bind(this, complaint);
        }
      });
      target.splice(0);
      Object.assign(target, complaints);
    }));
    this.loadComplaintsCount();
  }
  closeComplaint(complaint: Complaint, complaintIndex: number) {
    this.dataService.updateComplaintStatus(complaint, ComplaintStatus.Done).subscribe(() => {
      this.resolvedComplaints.splice(complaintIndex, 1);
      this.resolvedComplaintsCount--;
    })
  }
  tabChanged(tabIndex: number) {
    if (tabIndex === 0) {
      this.loadComplaints(this.paginationOptions, ComplaintStatus.Pending, this.pendingComplaints);
    } else if (tabIndex === 1) {
      this.loadComplaints(this.paginationOptions, ComplaintStatus.Resolved, this.resolvedComplaints);
    } else if (tabIndex === 2) {
      this.loadComplaints(this.paginationOptions, ComplaintStatus.Done, this.closedComplaints);
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
  closedPageChanged(ev: PageEvent) {
    this.paginationOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(this.paginationOptions, ComplaintStatus.Done, this.closedComplaints);
  }

  getEmployeeName(complaint: Complaint, employee?: User): string | undefined {
    if (employee) {

      return employee.name;
    }
    return undefined;
  }

  assignComplaint(complaint: Complaint, $event: MatAutocompleteSelectedEvent) {
    this.dataService.assignComplaint(complaint._id, $event.option.value).subscribe(() => {
      complaint.assignedTo = $event.option.value;
      complaint.selectAssignee = false;
    });
  }

  markComplaintAsResolved(complaint: Complaint, commentEl: HTMLInputElement, complaintIndex: number, matToggle: MatSlideToggle) {
    const comment: Comment = {
      by: this.user.name,
      description: commentEl.value,
      userType: this.user.type,
      timestamp: new Date()
    }
    this.dataService.addComment(complaint, comment).subscribe((_complaint: Complaint) => {

      commentEl.value = '';

      this.dataService.updateComplaintStatus(_complaint, ComplaintStatus.Resolved).subscribe(() => {
        this.pendingComplaints.splice(complaintIndex, 1);
        this.pendingComplaintsCount--;
        this.resolvedComplaintsCount++;
      }, () => {
        matToggle.checked = false;
        _complaint.addRemarks = false;
      })
    })
  }
}


