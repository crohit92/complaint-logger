import { Component, OnInit } from '@angular/core';
import { StorageService } from '../core/services/storage/storage.service';
import { Router } from '@angular/router';
import { StorageKeys } from '../shared/constants/storage-keys';
import { UserTypes, User } from '@complaint-logger/models';

@Component({
  selector: 'complaint-logger-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userType: string;
  user: User;
  constructor(
    private readonly storage: StorageService,
    private readonly router: Router
  ) {
    this.user = this.storage.get(StorageKeys.user) as User;
    switch (this.user.type) {
      case UserTypes.Student:
        this.userType = 'Student';
        break;
      case UserTypes.Department:
        this.userType = 'Department';
        break;
      case UserTypes.Employee:
        this.userType = 'Employee';
    }
  }

  ngOnInit() {
  }
  logout() {
    this.storage.clearAll();
    this.router.navigate(['/login']);
  }
}
