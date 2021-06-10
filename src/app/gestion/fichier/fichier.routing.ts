import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FichierComponent} from './fichier.component';
import { ImportationComponent } from './importation/importation.component';
import { ExerciceComponent } from './exercice/exercice.component';


let routes: Routes = [
  {
    path: '', component: FichierComponent,
    children: [
      {  path: 'importation', component: ImportationComponent },
      {  path: 'exo', component: ExerciceComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichierRoutingModule { }
