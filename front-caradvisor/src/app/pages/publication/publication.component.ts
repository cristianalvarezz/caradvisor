import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from 'src/app/models/publication.model';
import { User } from 'src/app/models/user.model';
import { PublicationService } from '../../services/publication.service';

/* jQUERY */
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
})
export class PublicationComponent implements OnInit {
  @Input()
  user_id: string | undefined;
  public page = 1;
  public loading: boolean = true;
  public publications: Publication[] = [];
  public users: User[] = [];
  public total: any;
  public pages: any;
  public noMore: boolean = false;
  public items_per_page: any;
  public status: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicationService: PublicationService
  ) {}

  ngOnInit(): void {
    this.actualPage();
  }
  actualPage() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.user_id = params['id'];
      }
      this.getPublications(this.user_id, this.page);
    });
  }

  getPublications(user_id: any, page: any, adding = false) {
    this.publicationService.getPublicationsByUser(page, user_id).subscribe(
      (response) => {
        if (response.publications) {
          this.loading = false;
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.items_per_page;

          if (this.pages == 1) {
            this.noMore = true;
          }
          if (!adding) {
            this.publications = response.publications;
          } else {
            var arrayA = this.publications; // lo que tengo hasta ahora
            var arrayB = response.publications; // la siguiente página que me devuelve
            this.publications = arrayA.concat(arrayB);
            $('html, body').animate(
              { scrollTop: $('#timeline').prop('scrollHeight') },
              500
            );
          }
          if (page > this.pages) {
            this.router.navigate(['/home']);
          } else {
            this.status = 'error';
            this.loading = false;
          }
        }
      },
      (error) => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.loading = false;
          this.status = 'error';
        }
      }
    );
  }
  deletePublication(publication_id: any) {
    console.log(publication_id);
    console.log(this.user_id);
    this.publicationService
      .deletePublication(publication_id, this.user_id)
      .subscribe(
        (response: any) => {
          this.refreshPublications();
          // this._userService.updateMyStats('publications',-1);
          console.log(response);
        },
        (error: any) => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage != null) {
            this.status = 'error';
          }
        }
      );
  }
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.user_id, this.page, true);
  }
  refreshPublications() {
    this.noMore = false;
    this.getPublications(this.user_id, 1);
  }
}
