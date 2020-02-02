import { Component } from '@angular/core';
import { StorageService } from '../core/services/storage/storage.service';
import { Router } from '@angular/router';
import { StorageKeys } from '../shared/constants/storage-keys';
import { UserTypes, User } from '@complaint-logger/models';

@Component({
  selector: 'complaint-logger-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  /**
   *
   */
  user: User = this.storage.get(StorageKeys.user) as User;
  userType: string;
  constructor(
    private readonly storage: StorageService,
    private readonly router: Router
  ) {
    switch (this.user.type) {
      case UserTypes.SuperAdmin:
        this.userType = 'Super Admin';
        break;
      case UserTypes.Admin:
        this.userType = 'Admin';
        break;
      case UserTypes.Technician:
        this.userType = 'Technician';
        break;
    }
  }
  logout() {
    this.storage.clearAll();
    this.router.navigate(['/login']);
  }
}
