import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  user:User =JSON.parse( this.userService.getIdentity());
  menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/' },
        { titulo: 'Profile', url: `profile/${this.user.uid}`},
      ],
    },
  ];

  constructor(private userService: UserService,private router:Router) {
    if(this.userService.getIdentity()){
      this.user=JSON.parse( this.userService.getIdentity()) ;
    }else{
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    }
  }
 
}
