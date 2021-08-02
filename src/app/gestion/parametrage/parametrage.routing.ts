import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ParametrageComponent} from "./parametrage.component";
import {CorpsJuridiqueComponent} from "./corps-juridique/corps-juridique.component";
import {FonctionComponent} from "./fonction/fonction.component";
import { ProfessionComponent } from './profession/profession.component';
import {CiviliteComponent} from "./civilite/civilite.component";
import {AnneeComponent} from "./annee/annee.component";

let routes: Routes = [
  {
    path: '', component: ParametrageComponent,
    children: [
      {  path: 'corps', component: CorpsJuridiqueComponent },
      {  path: 'fonction', component: FonctionComponent },
      { path: 'profession', component: ProfessionComponent },
      {  path: 'annee', component: AnneeComponent },
      {  path: 'civilite', component: CiviliteComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrageRoutingModule {}
