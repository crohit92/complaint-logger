import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Complaint, Department } from '@complaint-logger/models';
import { of, Observable } from 'rxjs';

@Injectable()
export class RaiseComplaintService {
    constructor(private readonly api: ApiService) { }

    raiseComplaint(complaint: Complaint) {
        complaint.createAt = Date.now();
        complaint.createdBy = 'rohit';
        complaint.mobile = '9646073913';
        return this.api.sendRequest({
            method: 'post',
            body: complaint,
            endpoint: 'complaints'
        });
    }

    get departments(): Observable<Department[]> {
        return of([
            {
                _id: '1',
                name: 'Electricity'
            },
            {
                _id: '2',
                name: 'Sewage'
            },
            {
                _id: '3',
                name: 'Library'
            }
        ])
    }
    get buildings(): Observable<Department[]> {
        return of([
            {
                _id: '1',
                name: 'Admin Block'
            },
            {
                _id: '2',
                name: 'Hostel 1'
            },
            {
                _id: '3',
                name: 'Hostel 2'
            }
        ])
    }
}