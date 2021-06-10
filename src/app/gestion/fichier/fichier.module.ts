import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ]
})
export class FichierModule { }
