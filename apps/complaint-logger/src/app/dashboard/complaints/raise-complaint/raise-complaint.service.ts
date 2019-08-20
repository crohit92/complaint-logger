import { Injectable } from "@angular/core";
import { ApiService } from '../../../core/services/http/api.service';
import { Complaint, Department, UserTypes, User } from '@complaint-logger/models';
import { of, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StorageService } from '../../../core/services/storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';

@Injectable()
export class RaiseComplaintService {
    constructor(private readonly api: ApiService,
        private readonly storage: StorageService) { }

    raiseComplaint(complaint: Complaint) {
        complaint.createdBy = this.storage.get(StorageKeys.user) as User;
        return this.api.sendRequest({
            method: 'post',
            body: complaint,
            endpoint: 'complaints'
        });
    }

    get departments(): Observable<Department[]> {
        return this.api.sendRequest({
            method: 'get',
            apiBase: 'assets/resources',
            endpoint: 'departments.json'
        })
    }
    buildings(userType: UserTypes): Observable<any> {
        return this.api.sendRequest({
            method: 'get',
            apiBase: 'assets/resources',
            endpoint: 'buildings.json'
        }).pipe(
            map(buildings => {
                return buildings.filter(building => building.userType === userType);
            }));
    }
}