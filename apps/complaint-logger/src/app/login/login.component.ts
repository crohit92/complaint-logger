import { Component, OnInit } from '@angular/core';
import { UserType, User } from '@complaint-logger/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../core/services/storage/storage.service';
import { StorageKeys } from '../shared/constants/storage-keys';
import { Router } from '@angular/router';

@Component({
  selector: 'complaint-logger-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userTypes: UserType[] = [
    {
      label: 'Hostler',
      code: 'host'
    },
    {
      label: 'Staff',
      code: 'staff'
    },
    {
      label: 'Resident',
      code: 'resi'
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
      userType: [undefined, [Validators.required]],
      loginId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    const userForm = this.loginForm.value as User;
    this.storage.set(StorageKeys.user, userForm);
    this.router.navigate(['/dashboard'])
  }
}
