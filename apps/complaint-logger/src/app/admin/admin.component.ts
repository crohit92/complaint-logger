import { Component } from "@angular/core";
import { StorageService } from '../core/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'complaint-logger-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    /**
     *
     */
    constructor(private readonly storage: StorageService,
        private readonly router: Router) {

    }
    logout() {
        this.storage.clearAll();
        this.router.navigate(['/login']);
    }
}