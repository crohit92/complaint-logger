import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Observable } from 'rxjs';
import { Complaint, ComplaintStatus, User } from '@complaint-logger/models';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';

@Injectable()
export class ComplaintsListService {
    constructor(private readonly api: ApiService,
        private readonly storage: StorageService) { }

    complaintsCount(status: ComplaintStatus): Observable<number> {
        const user = this.storage.get(StorageKeys.user) as User;
        return this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/count/${status === ComplaintStatus.Pending ? 'pending' : 'resolved'}`
        })
    }
    complaints({ pageSize,
        pageNumber, status }: {
            pageSize: number;
            pageNumber: number;
            status: ComplaintStatus
        }): Observable<Complaint[]> {
        const user = this.storage.get(StorageKeys.user) as User;
        return this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/${status === ComplaintStatus.Pending ? 'pending' : 'resolved'}`,
            queryParams: {
                pageSize,
                pageNumber
            }
        })
    }

    addComment(complaint: Complaint, comment) {
        return this.api.sendRequest({
            method: 'post',
            endpoint: `complaints/${complaint._id}/comments`,
            body: comment
        })
    }

    updateStatus(complaint: Complaint, status: ComplaintStatus) {
        return this.api.sendRequest({
            method: 'put',
            endpoint: `complaints/${complaint._id}/status`,
            queryParams: {
                status
            }
        })
    }
}