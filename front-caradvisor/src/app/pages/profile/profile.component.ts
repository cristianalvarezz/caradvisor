import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

 	public user: User={};
 	public title  !: string;
	public status !: string;
	public url    !: string;
	public section!: string;		// indica la sección a mostrar
	public identity:any;
	public token:any;
	public stats:any;
	public followed:any;
	public following:any;

	
  constructor(private userService: UserService,private router:Router, private route:ActivatedRoute) {
      this.token =this.userService.token;
      this.following=false;
      this.followed=false;
      this.section = 'publications'; 
      this.identity=JSON.parse( this.userService.getIdentity()) ;
   }
  ngOnInit(): void {

    this.loadPage();
  }
  loadPage(){
    let id;

		this.route.params.subscribe(params=>{
		   id = params['id'];
		})
		this.getUser(id);
		
	
  }

getUser(id:any){
		this.userService.getUser(id).subscribe(
			(response:any) => {
				if(response.user){
					this.user = response.user;
					this.status = 'success';
         
					if(response.following){
						this.following = true;
					}else{
						this.following = false;
					}
					if(response.followed){
						this.followed = true;
					}else{
						this.followed = false;
					}
				}else{
					this.status = 'error';
				}
			},
			(error:any) => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				// this.router.navigate(['/profile', this.identity.uid]);
			}
			);
	}
}


