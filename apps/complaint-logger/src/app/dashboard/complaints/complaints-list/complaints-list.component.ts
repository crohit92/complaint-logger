import { Component, OnInit } from '@angular/core';
import { ComplaintsListService } from './complaints-list.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ComplaintStatus, Complaint, User } from '@complaint-logger/models';
import { switchMap, map, shareReplay, filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import * as moment from 'moment';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'complaint-logger-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  providers: [ComplaintsListService]
})
export class ComplaintsListComponent implements OnInit {
  ComplaintStatus = ComplaintStatus;
  user = this.storage.get(StorageKeys.user) as User;
  pageOptions = {
    pageSize: 5,
    pageNumber: 1
  };

  pendingComplaints: Complaint[] = [];
  resolvedComplaints: Complaint[] = [];
  pendingComplaintsCount = 0;
  resolvedComplaintsCount = 0;
  loadComplaints(status: ComplaintStatus, target: Complaint[]) {
    this.dataService.complaints({ ...this.pageOptions, status }).subscribe(complaints => {
      complaints.forEach(complaint => {
        if (complaint.status === ComplaintStatus.Resolved) {
          complaint.canReopen = moment().diff(moment(complaint.createdAt)) < environment.reopenWindow;
        }
        Object.assign(complaint, { createdAtFromNow: moment(complaint.createdAt).fromNow() });
      })
      target.splice(0);
      Object.assign(target, complaints);
    });
    this.loadcomplaintCount();
  }

  loadcomplaintCount() {
    this.dataService.complaintsCount(ComplaintStatus.Pending).subscribe(count => this.pendingComplaintsCount = count);
    this.dataService.complaintsCount(ComplaintStatus.Resolved).subscribe(count => this.resolvedComplaintsCount = count);
  }
  constructor(private readonly dataService: ComplaintsListService,
    private readonly storage: StorageService) {
    this.loadComplaints(ComplaintStatus.Pending, this.pendingComplaints);
  }

  ngOnInit() {
  }

  pendingPageChanged(ev: PageEvent) {
    this.pageOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(ComplaintStatus.Pending, this.pendingComplaints);
  }
  resolvedPageChanged(ev: PageEvent) {
    this.pageOptions = {
      pageNumber: ev.pageIndex + 1,
      pageSize: ev.pageSize
    };
    this.loadComplaints(ComplaintStatus.Resolved, this.resolvedComplaints);
  }

  tabChanged(tabIndex: number) {
    if (tabIndex === 0) {
      this.loadComplaints(ComplaintStatus.Pending, this.pendingComplaints);
    } else {
      this.loadComplaints(ComplaintStatus.Resolved, this.resolvedComplaints);
    }
  }

  addComment(complaint: Complaint, commentDescription: HTMLInputElement, updateComplaintStatus?: ComplaintStatus, complaintIndex?: number) {
    if (commentDescription.value.length) {
      complaint.comments = complaint.comments || [];
      const comment = {
        by: this.user.name,
        description: commentDescription.value,
        userType: this.user.type,
        timestamp: new Date()
      };
      this.dataService.addComment(complaint, comment).subscribe(() => {
        commentDescription.value = '';
        complaint.comments.push(comment);
        if (updateComplaintStatus !== undefined) {
          this.dataService.updateStatus(complaint, updateComplaintStatus).subscribe(() => {
            if (updateComplaintStatus === ComplaintStatus.Pending) {
              this.pendingComplaintsCount++;
              this.resolvedComplaintsCount--;
              this.resolvedComplaints.splice(complaintIndex, 1);
            }
          })
        }
      })
    }
  }
  closeComplaint(complaint: Complaint, complaintIndex: number) {
    this.dataService.updateStatus(complaint, ComplaintStatus.Done).subscribe(() => {
      this.resolvedComplaints.splice(complaintIndex, 1);
      this.resolvedComplaintsCount--;
    })
  }
}


