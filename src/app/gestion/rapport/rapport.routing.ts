import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RapportComponent} from './rapport.component';
import { ArticleParFamilleComponent } from './article-par-famille/article-par-famille.component';
import { CommandeEngagementArticleComponent } from './commande-engagement-article/commande-engagement-article.component';
import { CommandeEngagementFournisseurComponent } from './commande-engagement-fournisseur/commande-engagement-fournisseur.component';

let routes: Routes = [
  {
    path: '', component: RapportComponent,
    children: [
      {  path: 'article-famille', component: ArticleParFamilleComponent },
      {  path: 'eng-com-article', component: CommandeEngagementArticleComponent },
      {  path: 'eng-com-frs', component: CommandeEngagementFournisseurComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportRoutingModule { }
