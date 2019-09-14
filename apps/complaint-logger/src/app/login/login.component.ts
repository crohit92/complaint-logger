import { Component, OnInit } from '@angular/core';
import { User } from '@complaint-logger/models';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { StorageService } from '../core/services/storage/storage.service';
import { StorageKeys } from '../shared/constants/storage-keys';
import { Router } from '@angular/router';
import { UserTypes } from '@complaint-logger/models';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      label: 'Admin',
      code: UserTypes.Admin,
      admin: true
    },
    {
      label: 'Technician',
      code: UserTypes.Technician,
      admin: false
    },
    {
      label: 'Student',
      code: UserTypes.Student,
      admin: false
    },
    {
      label: 'Department',
      code: UserTypes.Department,
      admin: false
    },
    {
      label: 'Employee',
      code: UserTypes.Employee,
      admin: false
    },
  ]
  constructor(private readonly fb: FormBuilder,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly dataService: LoginService,
    private readonly snackBar: MatSnackBar) {
    this.storage.clearAll();
  }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      admin: [false, [Validators.required]],
      // department: [undefined],
      type: [undefined, [Validators.required]],
      loginId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.loginForm.get('type').valueChanges.subscribe((type: UserTypes) => {
      if (type === UserTypes.Admin) {
        this.loginForm.get('admin').setValue(true);
      }
    })
  }

  login() {
    this.dataService.login(this.loginForm.value).subscribe(user => {
      this.storage.set(StorageKeys.user, user);
      if (user.type === UserTypes.Admin || user.type === UserTypes.Technician) {
        this.router.navigate(['/admin'])
      } else {
        this.router.navigate(['/dashboard'])

      }

    }, () => {
      this.snackBar.open('Invalid credentials', 'OK', {
        duration: 2000,
      });
    })
  }
}
