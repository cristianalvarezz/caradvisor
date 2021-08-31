import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { User } from 'src/app/models/user.model';
import { Publication } from 'src/app/models/publication.model';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {

  user:User =JSON.parse( this.userService.getIdentity());
	public status: any;
  public publication!: Publication;
  public my_stats: any;
  @Output() publicationSended = new EventEmitter();
  constructor(private router:Router,private publicationService:PublicationService,private userService:UserService) {

    this.publication = new Publication( "",this.user.uid||'');
  }

  ngOnInit(): void {
  }

  onSubmit(form:any,event:any){
    
    this.publicationService.newPublication(this.publication).subscribe(
      (res:any)=>{
        if(res){
          form.reset();
          this.publicationSended.emit({send:'true'});
          this.router.navigate([`/dashboard/profile/${this.user.uid}`]);	
        }else{
          this.status = 'error';
        }
      }
    )
  }

}
