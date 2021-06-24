import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {ToastrModule, ToastrService} from "ngx-toastr";
import { NgSelectModule } from '@ng-select/ng-select';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";

import { RapportRoutingModule } from './rapport.routing';
import { RapportComponent } from './rapport.component';
import { ArticleParFamilleComponent } from './article-par-famille/article-par-famille.component';
import { CommandeEngagementArticleComponent } from './commande-engagement-article/commande-engagement-article.component';
import { CommandeEngagementFournisseurComponent } from './commande-engagement-fournisseur/commande-engagement-fournisseur.component';


@NgModule({
  declarations: [RapportComponent, ArticleParFamilleComponent, CommandeEngagementArticleComponent, CommandeEngagementFournisseurComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    RapportRoutingModule
  ],
  providers: [
    ToastrService
  ]
})
export class RapportModule { }
