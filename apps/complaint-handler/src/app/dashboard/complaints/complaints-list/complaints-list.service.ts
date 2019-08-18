import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Observable, of, combineLatest } from 'rxjs';
import { Complaint, ComplaintStatus } from '@complaint-logger/models';
import { map } from 'rxjs/operators';

@Injectable()
export class ComplaintsListService {
    constructor(private readonly api: ApiService) { }

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
        return combineLatest(this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/${status === ComplaintStatus.Pending ? 'pending' : 'resolved'}`,
            queryParams: {
                pageSize,
                pageNumber
            }
        }), this.complaintsCount(status)).pipe(
            map(([complaints, count]) => ({
                count,
                complaints
            }))
        )
    }

    updateComplaint(complaint: Complaint) {
        return this.api.sendRequest({
            method: 'put',
            endpoint: `complaints/${complaint._id}`,
            body: complaint
        })
    }

    employees(searchString: string) {
        return of([
            {
                name: 'Rohit Chopra',
                mobile: '9646073913'
            },
            {
                name: 'Mohit Arora',
                mobile: '9646073913'
            },
            {
                name: 'Danish Aggarwal',
                mobile: '9646073913'
            },
            {
                name: 'Sweety Gupta',
                mobile: '9646073913'
            },
            {
                name: 'Munish Joshi',
                mobile: '9646073913'
            }
        ].filter(e => e.name.match(new RegExp(searchString, 'ig'))))
    }
}