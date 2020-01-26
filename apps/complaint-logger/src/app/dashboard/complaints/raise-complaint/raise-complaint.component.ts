import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Department, User, UserTypes } from '@complaint-logger/models';
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
  UserType = UserTypes;
  user = this.storage.get(StorageKeys.user) as User;
  complaintForm: FormGroup;
  departments: Observable<Department[]> = this.dataService.departments;
  currentUser = this.storage.get(StorageKeys.user) as User;
  complaintFormStep = 0;
  selectedComplaintType: { name: string; descriptionSuggestions: string[] };
  addOtherDescription: boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: RaiseComplaintService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly storage: StorageService
  ) {}

  ngOnInit() {
    this.initComplaintForm();
  }

  initComplaintForm() {
    this.complaintForm = this.fb.group({
      department: [undefined, [Validators.required]],
      complaintType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      building: [this.currentUser.department!.name, [Validators.required]],
      room: ['', [Validators.required]]
    });
  }

  raiseComplaint() {
    if (this.complaintForm.valid) {
      this.dataService
        .raiseComplaint(this.complaintForm.value)
        .subscribe(() => {
          this.router.navigate(['../list'], {
            relativeTo: this.route
          });
        });
    }
  }
  onComplaintTypeChange(complaintType: {
    name: string;
    descriptionSuggestions: string[];
  }) {
    const descriptionSuggestions = [
      ...complaintType.descriptionSuggestions,
      'Others'
    ];
    this.selectedComplaintType = { ...complaintType, descriptionSuggestions };
  }
  onComplaintDescriptionSelected(description: string) {
    if (description !== 'Others') {
      this.complaintForm.get('description').setValue(description);
      this.addOtherDescription = false;
    } else {
      this.complaintForm.get('description').setValue(undefined);
      this.addOtherDescription = true;
    }
  }
}
