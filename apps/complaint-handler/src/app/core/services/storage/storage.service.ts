import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { CoreModule } from '../../core.module';

@Injectable({
  providedIn: CoreModule
})
export class StorageService {

  private data: {
    [key: string]: {
      channel: ReplaySubject<any>;
    }
  } = {};
  private readonly storageFactory = localStorage;
  constructor() { }

  public deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
  public set(key: string, value: object | string | number | Date | Array<any>) {
    this.storageFactory.setItem(this.encodeKey(key), this.encodeValue(value));
    this.getDataChannel(key).next(value);
  }

  public get(key: string): object | string | number | Date | Array<any> {
    const localValue = this.storageFactory.getItem(this.encodeKey(key));
    if (!localValue) { return ''; }
    return this.decodeValue(localValue);
  }

  public keys(key: string): Observable<any> {
    return this.getDataChannel(key).asObservable();
  }

  public clearAll() {
    this.storageFactory.clear();
  }

  private getDataChannel(key: string) {
    this.data[key] = this.data[key] || {
      channel: new ReplaySubject<any>(1)
    };
    this.data[key].channel.next(this.get(key) || undefined);
    return this.data[key].channel;
  }

  private encode(value: string) {
    return value;
    // return btoa(value);
  }
  private decode(value: string) {
    return value;
    // return atob(value);
  }
  private encodeKey(key: string) {
    return this.encode(key.toLowerCase());
  }
  private encodeValue(value: object | string | number | Date | Array<any>) {
    return this.encode(JSON.stringify(value));
  }
  private decodeValue(value: string): object | string | number | Date | Array<any> {
    return JSON.parse(this.decode(value));
  }
}
