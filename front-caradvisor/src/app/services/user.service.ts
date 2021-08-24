import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { RegisterForm } from '../interface/register-form.interface';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { LoginForm } from '../interface/login-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public auth2: any;
  public user!: User;

  constructor(private http: HttpClient, private router: Router) {}

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  saveLocalStorage( token: string ) {
    localStorage.setItem('token', token );
  }
  createUser(formData: RegisterForm) {
    return this.http.post(`${base_url}user/register`, formData).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  login(formData: LoginForm) {
    console.log(formData);
    return this.http.post(`${base_url}auth/login`, formData).pipe(
      tap((resp: any) => {
        console.log(resp.token)
        this.guardarLocalStorage( resp.token );
      })
    );
  }
 
}
