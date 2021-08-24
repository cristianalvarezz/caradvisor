import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    })

  //   const promesa = new Promise((resolve,reject)=>{
  //     if(true){
  //       resolve('Hola mundo ');
  //     }else{
  //       reject('Algo salio mal ');
  //     }
  //   });

  //   promesa.then((mensaje)=>{
  //     console.log(mensaje)
  //   })
  //   .catch(error=>console.log("Algo salio mal en mi promesa"+ error))
  // console.log("fin del init");
  }
  
  //regreso solo la data del json 
  /*
  getUsuarios(){ 
    fetch('https://reqres.in/api/users')
    .then( resp => resp.json())
    .then(  body=> body.data());
  }
  */
  getUsuarios() {

    return new Promise( resolve => {

      fetch('https://reqres.in/api/users')
        .then( resp => resp.json() )
        .then( body => resolve( body.data ) );

    });

  }
}
  