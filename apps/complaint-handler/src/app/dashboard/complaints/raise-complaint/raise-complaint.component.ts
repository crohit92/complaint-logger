import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Department } from '@complaint-logger/models';
import { RaiseComplaintService } from './raise-complaint.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'complaint-logger-raise-complaint',
  templateUrl: './raise-complaint.component.html',
  styleUrls: ['./raise-complaint.component.scss'],
  providers: [RaiseComplaintService]
})
export class RaiseComplaintComponent implements OnInit {

  complaintForm: FormGroup;
  departments: Observable<Department[]> = this.dataService.departments;
  buildings: Observable<Department[]> = this.dataService.buildings;
  complaintFormStep = 0;
  constructor(private readonly fb: FormBuilder,
    private readonly dataService: RaiseComplaintService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.initComplaintForm();
  }

  initComplaintForm() {
    this.complaintForm = this.fb.group({
      departmentId: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      buildingId: ['', [Validators.required]],
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

}
