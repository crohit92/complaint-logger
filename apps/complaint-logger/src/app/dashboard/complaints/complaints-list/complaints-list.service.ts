import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Observable, of, combineLatest } from 'rxjs';
import { Complaint, ComplaintStatus, User } from '@complaint-logger/models';
import { map } from 'rxjs/operators';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';

@Injectable()
export class ComplaintsListService {
    constructor(private readonly api: ApiService,
        private readonly storage: StorageService) { }

    private complaintsCount(status: ComplaintStatus): Observable<number> {
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
        }): Observable<{ count: number; complaints: Complaint[] }> {
        const user = this.storage.get(StorageKeys.user) as User;
        return combineLatest(this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/${status === ComplaintStatus.Pending ? 'pending' : 'resolved'}`,
            queryParams: {
                pageSize,
                pageNumber,
                raisedById: user.loginId
            }
        }), this.complaintsCount(status)).pipe(
            map(([complaints, count]) => ({
                count,
                complaints
            }))
        )
    }
}