import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Department, User, UserTypes, Building } from '@complaint-logger/models';
import { RaiseComplaintService } from './raise-complaint.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageKeys } from '../../../shared/constants/storage-keys';
import { StorageService } from '../../../core/services/storage/storage.service';

@Component({
  selector: 'complaint-logger-raise-complaint',
  templateUrl: './raise-complaint.component.html',
  styleUrls: ['./raise-complaint.component.scss'],
  providers: [RaiseComplaintService]
})
export class RaiseComplaintComponent implements OnInit {

  complaintForm: FormGroup;
  departments: Observable<Department[]> = this.dataService.departments;
  currentUser = this.storage.get(StorageKeys.user) as User;
  buildings: Observable<Building[]> = this.dataService.buildings(this.currentUser.type);
  complaintFormStep = 0;
  labels: {
    buildingName: string;
    roomName: string;
  }
  constructor(private readonly fb: FormBuilder,
    private readonly dataService: RaiseComplaintService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly storage: StorageService) { }

  ngOnInit() {
    this.initComplaintForm();
    this.mapLabelsToUserType();
  }

  initComplaintForm() {
    this.complaintForm = this.fb.group({
      department: [undefined, [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      building: [undefined, [Validators.required]],
      room: ['']
    });
  }

  raiseComplaint() {
    if (this.complaintForm.valid) {
      this.dataService.raiseComplaint(this.complaintForm.value).subscribe(() => {
        this.router.navigate(['../list'], {
          relativeTo: this.route
        })
      });
    }
  }


  mapLabelsToUserType() {
    switch (this.currentUser.type) {
      case UserTypes.Hostler:
        this.labels = { buildingName: 'Hostel Name', roomName: 'Room No.' };
        break;
      case UserTypes.Student:
        this.labels = { buildingName: 'Department Name', roomName: 'Room No.' };
        break;
      case UserTypes.Staff:
        this.labels = { buildingName: 'Department Name', roomName: 'Room No.' };
        break;
      case UserTypes.Resident:
        this.labels = { buildingName: 'House Type', roomName: 'Room/Flat No.' };
        break;
    }
  }
}
