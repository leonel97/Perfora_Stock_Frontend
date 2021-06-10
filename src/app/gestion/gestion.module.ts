
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionComponent } from './gestion.component';
import {GestionRoutingModule} from "./gestion.routing";
import {HeaderSidebarLargeComponent} from "./header-sidebar-large/header-sidebar-large.component";
import {SidebarLargeComponent} from "./sidebar-large/sidebar-large.component";
import {FooterComponent} from "./footer/footer.component";

import {FormsModule} from "@angular/forms";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedPipesModule} from "../pipes/shared-pipes.module";

@NgModule({
  declarations: [GestionComponent, HeaderSidebarLargeComponent, SidebarLargeComponent, FooterComponent],
  imports: [
    CommonModule,
    GestionRoutingModule,
    NgbModule,
    FormsModule,
    PerfectScrollbarModule,
    SharedPipesModule,
  ]
})
export class GestionModule { }
