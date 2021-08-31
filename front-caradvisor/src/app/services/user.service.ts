import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { RegisterForm } from '../interface/register-form.interface';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { LoginForm } from '../interface/login-form.interface';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
 
  public auth2: any;
  public user!: User;
	public identity:any;
  static headers: any;

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
  get uid():string {
    return this.user.uid || '';
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

  guardarLocalStorage(token: string, user:User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user) )
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}auth/login`, formData).pipe(
      tap((resp: any) => {
        console.log(resp.user);
         this.guardarLocalStorage( resp.token,resp.user );
      })
    );
  }
  	/** Método para sacar los datos del usuario del LOCALSTORAGE **/
	getIdentity(){
		let identity = localStorage.getItem('user') || '';

		if (identity != undefined){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

  getUser(id: any) :Observable<any>{
    return this.http.get(`${base_url}user/b/${id}`,this.headers)
  }


 
}
