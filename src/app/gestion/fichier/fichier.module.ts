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

import { FichierComponent } from './fichier.component';
import {FichierRoutingModule} from "./fichier.routing";
import { ImportationComponent } from './importation/importation.component';
import { ExerciceComponent } from './exercice/exercice.component';


@NgModule({
  declarations: [
    FichierComponent,
    ImportationComponent,
    ExerciceComponent
  ],
  imports: [
    CommonModule,
    FichierRoutingModule,
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
export class FichierModule { }
