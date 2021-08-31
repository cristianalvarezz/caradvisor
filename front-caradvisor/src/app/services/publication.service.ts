import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { Publication } from '../models/publication.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(public http: HttpClient,private userService:UserService) { }
  	/** Método para AÑADIR una publicación nueva **/
  	newPublication( publication: Publication):Observable<any>{
	  	return this.http.post(base_url+'publication/', publication,this.userService.headers );
    }

    	/** Método para sacar LISTA de PUBLICACIONES **/
	getPublications( page = 1):Observable<any>{
		return this.http.get(base_url+`publication/publications/${page}`, this.userService.headers );
	}

	/** Método para BORRAR una PUBLICACIÓN **/
	deletePublication(idpublish:any,iduser:any):Observable<any>{
		
		return this.http.delete(base_url+`publication/${iduser}/${idpublish}`);
	}

  	/** Método para sacar LISTA de PUBLICACIONES de un usuario en concreto **/
	getPublicationsByUser( page = 1, user_id:any):Observable<any>{

		return this.http.get(base_url+`publication/publications-user/${user_id}/${page}`,  this.userService.headers );
	}
}
