import { Injectable } from '@angular/core';
import { CoreModule } from '../../core.module';
import { HttpClient } from '@angular/common/http';

import { timeout } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { StorageKeys } from '../../../shared/constants/storage-keys';


export interface Request {
    apiBase?: string;
    endpoint: string;
    routeParams?: { [key: string]: number | string | Date };
    queryParams?: { [key: string]: number | string | Date };
    body?: any;
    formData?: FormData;
    method: string;
}

export const appVersion = '1.0.1';

@Injectable({
    providedIn: CoreModule
})
export class ApiService {
    private apiBase: string;
    constructor(private http: HttpClient,
        private readonly storage: StorageService) {
        this.apiBase = environment.apiBase;
    }

    sendRequest(request: Request): Observable<any> {

        const finalUrl = this.buildURL(request);

        // this.progressService.start();
        return this.http.request(
            request.method,
            finalUrl,
            {
                body: request.body || request.formData,
                headers: {
                    'Authorization': `Bearer ${this.storage.get(StorageKeys.token)}`
                }
            }).pipe(
                timeout(10000)
            );
    }


    private removeTrailingSlash(endpoint: string) {
        if (endpoint.endsWith('/')) {
            endpoint = endpoint.substr(0, endpoint.length - 1);
        }
        return endpoint;
    }

    private buildURL(request: Request): string {
        request.endpoint = this.removeTrailingSlash(request.endpoint);
        let route = this.removeTrailingSlash(`${request.apiBase ? request.apiBase : this.apiBase}/${request.endpoint}`);
        if (request.routeParams) {
            for (const key in request.routeParams) {
                if (key in request.routeParams) {
                    route = `${route}/${key}/${request.routeParams[key]}`;
                }
            }
        }
        let paramChar = route.indexOf('?') >= 0 ? '&' : '?';
        if (request.queryParams) {
            for (const key in request.queryParams) {
                if (request.queryParams.hasOwnProperty(key)) {
                    route = `${route}${paramChar}${key}=${request.queryParams[key]}`;
                    paramChar = '&';
                }
            }
        }
        route += `${paramChar}appVersion=${appVersion}`;
        return route;
    }



}

