import { Injectable } from "@angular/core";
import { CanLoad, CanActivate } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';
import { StorageKeys } from '../../shared/constants/storage-keys';
import { User, UserTypes } from '@complaint-logger/models';
import { CoreModule } from '../core.module';

@Injectable({
    providedIn: CoreModule
})
export class AdminGuard implements CanActivate {
    canActivate(): boolean {
        const user = this.storage.get(StorageKeys.user) as User;
        if (user) {
            return user.type === UserTypes.Admin || user.type === UserTypes.Technician;
        }
        return false;
    }
    constructor(private readonly storage: StorageService) { }

}