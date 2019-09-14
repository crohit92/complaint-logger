import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
// import { StorageKeys } from '../../../shared/constants/storage-keys';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req.headers.append('Authorization', `Bearer ${this.storage.get(StorageKeys.token)}`)
    return next.handle(req);
  }
}
