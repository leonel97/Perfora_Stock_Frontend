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

import { DefinitionRoutingModule } from './definition.routing';
import { DefinitionComponent } from './definition.component';
import { DirectionComponent } from './direction/direction.component';
import { TypeCentreConsommationComponent } from './type-centre-consommation/type-centre-consommation.component';
import { CentreConsommationComponent } from './centre-consommation/centre-consommation.component';
import { MagasinComponent } from './magasin/magasin.component';
import { FamilleArticleComponent } from './famille-article/famille-article.component';
import { TypeArticleComponent } from './type-article/type-article.component';
import { ArticleComponent } from './article/article.component';
import { CauseAnnomalieComponent } from './cause-annomalie/cause-annomalie.component';
import { TypeFournisseurComponent } from './type-fournisseur/type-fournisseur.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { UniterComponent } from './uniter/uniter.component';


@NgModule({
  declarations: [
    DefinitionComponent,
    DirectionComponent,
    TypeCentreConsommationComponent,
    CentreConsommationComponent,
    MagasinComponent,
    FamilleArticleComponent,
    TypeArticleComponent,
    ArticleComponent,
    CauseAnnomalieComponent,
    TypeFournisseurComponent,
    FournisseurComponent,
    UniterComponent
  ],
  imports: [
    CommonModule,
    DefinitionRoutingModule,
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
  ],
  providers: [
    ToastrService
  ]
})
export class DefinitionModule { }
