import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardRoutingModule} from "./dashboard.routing";
import { DashboardComponent } from './dashboard.component';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxDatatableModule,
  ]
})
export class DashboardModule { }
