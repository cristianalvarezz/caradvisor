import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo!: string;
  public tituloSubs$: Subscription;

  
  constructor( private router: Router, private route: ActivatedRoute ) {

    this.tituloSubs$ = this.getArgumentosRuta()
      //aqui extraigo el titulo 
                        .subscribe( ({ titulo }) => {
                            this.titulo = titulo;
                            document.title = `AdminPro - ${ titulo }`;
                        });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }


  getArgumentosRuta() {

    return this.router.events
    
      .pipe(
        // todo esto se dispara en un evento llamado activationEnd 
        //todos estos filtros los utilizo para conseguir solo el titulo
        filter( (event:any) => event instanceof ActivationEnd ),
        //este filtro se va a aplicar al que tenga datos en el firs child
        filter( (event: ActivationEnd) => console.log(event.snapshot.firstChild) === null  ),
      //cuando tengo ya el titulo 
        map( (event: ActivationEnd) => event.snapshot.data ),
      );
  }


}
