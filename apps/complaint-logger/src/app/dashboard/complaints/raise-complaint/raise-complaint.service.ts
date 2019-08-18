import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Complaint, Department } from '@complaint-logger/models';
import { of, Observable } from 'rxjs';

@Injectable()
export class RaiseComplaintService {
    constructor(private readonly api: ApiService) { }

    raiseComplaint(complaint: Complaint) {
        complaint.createdBy = {
            name: 'Rohit Chopra',
            mobile: '9646073913'
        };
        complaint.mobile = '9646073913';
        complaint.departmentId = complaint.department._id;
        complaint.buildingId = complaint.building._id;
        return this.api.sendRequest({
            method: 'post',
            body: complaint,
            endpoint: 'complaints'
        });
    }

    get departments(): Observable<Department[]> {
        return of([
            {
                _id: '4cdfb11e1f3c000000007822',
                name: 'Electricity'
            },
            {
                _id: '4cdfb11e1f3c000000007822',
                name: 'Sewage'
            },
            {
                _id: '4cdfb11e1f3c000000007822',
                name: 'Library'
            }
        ])
    }
    get buildings(): Observable<Department[]> {
        return of([
            {
                _id: '4cdfb11e1f3c000000007822',
                name: 'Admin Block'
            },
            {
                _id: '4cdfb11e1f3c000000007822',
                name: 'Hostel 1'
            },
            {
                _id: '4cdfb11e1f3c000000007822',
                name: 'Hostel 2'
            }
        ])
    }
}