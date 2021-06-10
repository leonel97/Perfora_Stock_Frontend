import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BtnLoadingComponent} from "./btn-loading/btn-loading.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";
import {WizardComponent} from "./wizard/wizard.component";
import {WizardStepComponent} from "./wizard-step/wizard-step.component";
import {SharedDirectivesModule} from "../directives/shared-directives.module";
import {SharedPipesModule} from "../pipes/shared-pipes.module";


const components = [
  BtnLoadingComponent,
  WizardComponent, WizardStepComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,

    SharedDirectivesModule,
    SharedPipesModule,
  ],
  declarations: components,
  exports: components
})
export class SharedModule { }
