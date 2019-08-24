import { Component, OnInit } from '@angular/core';
import { StorageService } from '../core/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'complaint-logger-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private readonly storage: StorageService,
    private readonly router: Router
  ) { }

  ngOnInit() {
  }
  logout() {
    this.storage.clearAll();
    this.router.navigate(['/login']);
  }
}
