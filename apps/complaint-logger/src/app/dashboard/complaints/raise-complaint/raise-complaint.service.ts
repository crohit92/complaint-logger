import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Complaint } from '../../../shared/models/complaint';
import { of, Observable } from 'rxjs';
import { Department } from '../../../shared/models/department';

@Injectable()
export class RaiseComplaintService {
    constructor(private readonly api: ApiService) { }

    raiseComplaint(complaint: Complaint) {

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