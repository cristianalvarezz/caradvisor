import { User } from "./user.model";

export class Publication{
	
	constructor(
		public text      ?:string,
		public user      ?:any,
		public uid       ?:string,
		public file      ?:string,
		public created_at?:string,
		) {
		// code...
	}
}