import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/http/api.service';
import { Observable } from 'rxjs';
import { Department } from '@complaint-logger/models';

@Injectable()
export class LoginService {

    constructor(private readonly api: ApiService) { }

    get departments(): Observable<Department[]> {
        return this.api.sendRequest({
            method: 'get',
            apiBase: 'assets/resources',
            endpoint: 'departments.json'
        })
    }
}