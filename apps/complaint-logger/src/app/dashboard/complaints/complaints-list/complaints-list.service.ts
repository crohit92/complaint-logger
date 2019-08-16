import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Observable, of } from 'rxjs';
import { Complaint } from '@complaint-logger/models';

@Injectable()
export class ComplaintsListService {
    constructor(private readonly api: ApiService) { }

    pastComplaints({ pageSize,
        pageNumber }: {
            pageSize: number;
            pageNumber: number
        }): Observable<Complaint[]> {
        return this.api.sendRequest({
            method: 'get',
            endpoint: 'complaints',
            queryParams: {
                pageSize,
                pageNumber
            }
        })
    }
}