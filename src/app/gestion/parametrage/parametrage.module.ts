import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrageComponent } from './parametrage.component';
import {ParametrageRoutingModule} from "./parametrage.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {ToastrModule, ToastrService} from "ngx-toastr";
import { CorpsJuridiqueComponent } from './corps-juridique/corps-juridique.component';
import { FonctionComponent } from './fonction/fonction.component';
import { ProfessionComponent } from './profession/profession.component';
import { CiviliteComponent } from './civilite/civilite.component';
import { AnneeComponent } from './annee/annee.component';

@NgModule({
  declarations: [ParametrageComponent,
    FonctionComponent,  ProfessionComponent, CorpsJuridiqueComponent, AnneeComponent, CiviliteComponent],
    
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    ToastrService
  ]
})
export class ParametrageModule { }
