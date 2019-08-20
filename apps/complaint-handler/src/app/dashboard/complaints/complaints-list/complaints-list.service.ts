import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Observable, of, combineLatest } from 'rxjs';
import { Complaint, ComplaintStatus, Employee } from '@complaint-logger/models';
import { map } from 'rxjs/operators';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';

@Injectable()
export class ComplaintsListService {
    user = this.storage.get(StorageKeys.user) as Employee;
    constructor(private readonly api: ApiService,
        private readonly storage: StorageService) { }

    complaintsCount(status: ComplaintStatus): Observable<number> {
        return this.api.sendRequest({
            method: 'get',
            endpoint: `complaints/count/${status === ComplaintStatus.Pending ? 'pending' : 'resolved'}`,
            queryParams: {
                ...(this.user.admin ? {
                    departmentCode: this.user.department.code
                } : {
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
            endpoint: `complaints/${status === ComplaintStatus.Pending ? 'pending' : 'resolved'}`,
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

    updateComplaint(complaint: Complaint) {
        return this.api.sendRequest({
            method: 'put',
            endpoint: `complaints/${complaint._id}`,
            body: complaint
        })
    }

    employees(searchString: string): Observable<Employee[]> {
        const employees: Employee[] = [
            {
                admin: true,
                loginId: 'rohit.chopra',
                mobile: '9646073913',
                name: 'Rohit Chopra',
                department: {} as any
            },
            {
                admin: true,
                loginId: 'sandeep.sood',
                mobile: '9646073913',
                name: 'Sandeep sood',
                department: {} as any
            },
            {
                admin: true,
                loginId: 'rajnish.gupta',
                mobile: '9646073913',
                name: 'Rajnish Gupta',
                department: {} as any
            },
            {
                admin: true,
                loginId: 'sandeep.sharma',
                mobile: '9646073913',
                name: 'Sandeep Sharma',
                department: {} as any
            }
        ]
        return of(employees.filter(e => e.name.match(new RegExp(searchString, 'ig'))))
    }
}