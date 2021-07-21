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
import { AchatComponent } from './achat/achat.component';
import { ConsoInterneComponent } from './conso-interne/conso-interne.component';
import { BonServirComponent } from './bon-servir/bon-servir.component';
import { StockComponent } from './stock/stock.component';
import { EntreeAchatComponent } from './entree-achat/entree-achat.component';


@NgModule({
  declarations: [RapportComponent, ArticleParFamilleComponent, CommandeEngagementArticleComponent, CommandeEngagementFournisseurComponent, AchatComponent, ConsoInterneComponent, BonServirComponent, StockComponent, EntreeAchatComponent],
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
