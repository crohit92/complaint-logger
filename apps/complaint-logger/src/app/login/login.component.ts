import { Component, OnInit } from '@angular/core';
import { User } from '@complaint-logger/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../core/services/storage/storage.service';
import { StorageKeys } from '../shared/constants/storage-keys';
import { Router } from '@angular/router';
import { UserTypes } from '@complaint-logger/models';

@Component({
  selector: 'complaint-logger-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userTypes: { label: string; code: UserTypes }[] = [
    {
      label: 'Hostler',
      code: UserTypes.Hostler
    },
    {
      label: 'Staff',
      code: UserTypes.Staff
    },
    {
      label: 'Resident',
      code: UserTypes.Resident
    },
    {
      label: 'Student',
      code: UserTypes.Student
    }
  ]
  constructor(private readonly fb: FormBuilder,
    private readonly storage: StorageService,
    private readonly router: Router) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      type: [undefined, [Validators.required]],
      loginId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    const user: User = { name: this.loginForm.value.loginId, mobile: '9646073913', ...this.loginForm.value };
    this.storage.set(StorageKeys.user, user);
    this.router.navigate(['/dashboard'])
  }
}
