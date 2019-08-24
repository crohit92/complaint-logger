import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';
import { StorageService } from '../../core/services/storage/storage.service';
import { StorageKeys } from '../../shared/constants/storage-keys';
import { User } from '@complaint-logger/models';
import { CoreModule } from '../core.module';

@Injectable({
    providedIn: CoreModule
})
export class UserGuard implements CanActivate {
    constructor(private readonly storage: StorageService) { }
    canActivate(): boolean {
        const user = this.storage.get(StorageKeys.user) as User;
        if (user) {
            return true;
        }
        return false;
    }

}