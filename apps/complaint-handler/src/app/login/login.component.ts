import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserTypes, User, Employee } from '@complaint-logger/models';
import { StorageService } from '../core/services/storage/storage.service';
import { Router } from '@angular/router';
import { StorageKeys } from '../shared/constants/storage-keys';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  departments = this.dataService.departments;
  userTypes: { label: string; admin: boolean }[] = [
    {
      label: 'Admin',
      admin: true
    },
    {
      label: 'Technician',
      admin: false
    }
  ]
  constructor(private readonly fb: FormBuilder,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly dataService: LoginService) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      admin: [undefined, [Validators.required]],
      department: [undefined, [Validators.required]],
      loginId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    const employee: Employee = { name: this.loginForm.value.loginId, mobile: '9646073913', ...this.loginForm.value };
    employee.name = employee.loginId;
    this.storage.set(StorageKeys.user, employee);
    this.router.navigate(['/dashboard']);
  }

}
