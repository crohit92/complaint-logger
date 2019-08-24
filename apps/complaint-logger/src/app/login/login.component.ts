import { Component, OnInit } from '@angular/core';
import { User } from '@complaint-logger/models';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { StorageService } from '../core/services/storage/storage.service';
import { StorageKeys } from '../shared/constants/storage-keys';
import { Router } from '@angular/router';
import { UserTypes } from '@complaint-logger/models';
import { LoginService } from './login.service';

@Component({
  selector: 'complaint-logger-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  UserTypes = UserTypes;
  loginForm: FormGroup;
  departments = this.dataService.departments;
  userTypes: { label: string; code: UserTypes; admin: boolean }[] = [
    {
      label: 'Hostler',
      code: UserTypes.Hostler,
      admin: false
    },
    {
      label: 'Staff',
      code: UserTypes.Staff,
      admin: false
    },
    {
      label: 'Resident',
      code: UserTypes.Resident,
      admin: false
    },
    {
      label: 'Student',
      code: UserTypes.Student,
      admin: false
    },
    {
      label: 'Admin',
      code: UserTypes.Admin,
      admin: true
    },
    {
      label: 'Technician',
      code: UserTypes.Technician,
      admin: false
    }
  ]
  requireDepartmentIfEmployee(control: AbstractControl): ValidationErrors {
    if (!this.loginForm) {
      return null;
    }
    if ((this.loginForm.get('type').value === UserTypes.Admin ||
      this.loginForm.get('type').value === UserTypes.Technician) &&
      control.value === undefined) {
      return {
        department: {
          required: true
        }
      };
    }
    return null;
  };
  constructor(private readonly fb: FormBuilder,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly dataService: LoginService) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      admin: [false, [Validators.required]],
      department: [undefined, [this.requireDepartmentIfEmployee.bind(this)]],
      type: [undefined, [Validators.required]],
      loginId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {


    const user: User = { name: this.loginForm.value.loginId, mobile: '9646073913', ...this.loginForm.value };
    this.storage.set(StorageKeys.user, user);
    if (user.type === UserTypes.Admin || user.type === UserTypes.Technician) {
      this.router.navigate(['/admin'])
    } else {
      this.router.navigate(['/dashboard'])

    }
  }
}
