import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {UserGroupComponent} from "./user-group/user-group.component";
import {UserComponent} from "./user/user.component";
import {UtilisateurRoutingModule} from "./utilisateur.routing";
import {UtilisateurComponent} from "./utilisateur.component";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [UtilisateurComponent, UserComponent, UserGroupComponent],

  imports: [
    CommonModule,
    UtilisateurRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    ToastrService
  ]
})
export class UtilisateurModule { }
