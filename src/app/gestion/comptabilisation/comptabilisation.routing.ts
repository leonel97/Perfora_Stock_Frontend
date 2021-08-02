import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComptabilisationComponent} from './comptabilisation.component';
import {ImputationArticleComponent} from './imputation-article/imputation-article.component';
import {EcritureComptableComponent} from './ecriture-comptable/ecriture-comptable.component';

let routes: Routes = [
  {
    path: '', component: ComptabilisationComponent,
    children: [
      {  path: 'imputation-article', component: ImputationArticleComponent },
      {  path: 'ecriture-comptable', component: EcritureComptableComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabilisationRoutingModule { }
