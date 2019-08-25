import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Observable, of } from 'rxjs';
import { Complaint, ComplaintStatus, Comment, User, UserTypes } from '@complaint-logger/models';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';
import { map } from 'rxjs/operators';

@Injectable()
export class ComplaintsListService {
    user = this.storage.get(StorageKeys.user) as User;
    constructor(private readonly api: ApiService,
        private readonly storage: StorageService) { }

    complaintsCount(status: ComplaintStatus): Observable<number> {
        return this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/count/${status === ComplaintStatus.Pending ? 'pending' : (status === ComplaintStatus.Resolved ? 'resolved' : 'done')}`,
            queryParams: {
                ...(this.user.admin ? {
                    departmentCode: this.user.department.code
                } : {
                        departmentCode: this.user.department.code,
                        assignedTo: this.user.loginId
                    })
            }
        })
    }
    complaints({ pageSize,
        pageNumber, status }: {
            pageSize: number;
            pageNumber: number;
            status: ComplaintStatus
        }): Observable<Complaint[]> {
        return this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/${status === ComplaintStatus.Pending ? 'pending' : (status === ComplaintStatus.Resolved ? 'resolved' : 'done')}`,
            queryParams: {
                pageSize,
                pageNumber,
                ...(this.user.admin ? {
                    departmentCode: this.user.department.code
                } : {
                        assignedTo: this.user.loginId
                    })
            }
        });
    }

    assignComplaint(id: string, technician: User) {
        return this.api.sendRequest({
            method: 'put',
            endpoint: `comaplints/${id}/assign`,
            body: technician
        });
    }

    updateComplaint(complaint: Complaint) {
        return this.api.sendRequest({
            method: 'put',
            endpoint: `complaints/${complaint._id}`,
            body: complaint
        })
    }
    updateComplaintStatus(complaint: Complaint, status: ComplaintStatus) {
        return this.api.sendRequest({
            method: 'put',
            endpoint: `complaints/${complaint._id}/status`,
            queryParams: {
                status
            }
        })
    }
    addComment(complaint: Complaint, comment: Comment) {
        return this.api.sendRequest({
            method: 'post',
            endpoint: `complaints/${complaint._id}/comments`,
            body: comment
        })
    }

    employees(searchString: string): Observable<User[]> {
        return this.api.sendRequest({
            method: 'get',
            apiBase: './assets/resources/users.json',
            endpoint: ''
        }).pipe(
            map((users: User[]) => {
                return users.filter(u => u.type === UserTypes.Technician && u.name.match(new RegExp(searchString, 'ig')));
            }));
    }
}