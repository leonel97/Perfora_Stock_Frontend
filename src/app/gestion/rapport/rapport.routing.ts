import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RapportComponent} from './rapport.component';
import { ArticleParFamilleComponent } from './article-par-famille/article-par-famille.component';
import { CommandeEngagementArticleComponent } from './commande-engagement-article/commande-engagement-article.component';
import { CommandeEngagementFournisseurComponent } from './commande-engagement-fournisseur/commande-engagement-fournisseur.component';
import { AchatComponent } from './achat/achat.component';
import { ConsoInterneComponent } from './conso-interne/conso-interne.component';
import { BonServirComponent } from './bon-servir/bon-servir.component';
import { StockComponent } from './stock/stock.component';
import { EntreeAchatComponent } from './entree-achat/entree-achat.component';

let routes: Routes = [
  {
    path: '', component: RapportComponent,
    children: [
      {  path: 'article-famille', component: ArticleParFamilleComponent },
      {  path: 'eng-com-article', component: CommandeEngagementArticleComponent },
      {  path: 'achat', component: AchatComponent },
      {  path: 'conso-interne', component: ConsoInterneComponent },
      {  path: 'bon-servir', component: BonServirComponent },
      {  path: 'stock', component: StockComponent },
      {  path: 'entree-achat', component: EntreeAchatComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportRoutingModule { }
