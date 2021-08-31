import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public formSubmitted = false;

  public registerForm = this.fb.group({
    name: ['admin', Validators.required],
    surname: ['admin', Validators.required],
    nick: ['admin', Validators.required],
    phone: ['1234567', Validators.required],
    email: ['admin@gmail.com', Validators.required],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  createUser() {
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
   
    this.userService.createUser(this.registerForm.value).subscribe(
      (resp: any) => {
        console.log(resp);
        this.router.navigateByUrl('/');
      },
      (err) => {
        if (err.error.errors[0].msg) {
          Swal.fire('Error', err.error.errors[0].msg, 'error');
        } else {
          Swal.fire('Error', err.error.errors[1].msg, 'error');
        }
        // Si sucede un error
      }
    );
  }


  contrasenasNoValidas() {
    const pass1 =      this.registerForm.get('password')?.value
    const pass2 =     this.registerForm.get('password2')?.value

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  campoNoValido( campo: string ): boolean { 
    if ( this.registerForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }
}
