import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/http/api.service';
import { Observable, throwError } from 'rxjs';
import { Department, User, Credentials } from '@complaint-logger/models';
import { map } from 'rxjs/operators';

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

    login(credentials: Credentials) {
        return this.api.sendRequest({
            method: 'POST',
            endpoint: 'users/login',
            body: credentials
        });
        // return this.api.sendRequest({
        //     method: 'get',
        //     apiBase: './assets/resources/users.json',
        //     endpoint: ''
        // }).pipe(map((users: User[]) => {
        //     const matchingUser = users.find(u => ((u.type === user.type) && (u.loginId === user.loginId) && (u.password === user.password) && (user.department ? user.department.code === u.department.code : true)))
        //     if (matchingUser) {
        //         return matchingUser;
        //     } else {
        //         throw new Error('Invalid Credentials');
        //     }
        // }))
    }
}