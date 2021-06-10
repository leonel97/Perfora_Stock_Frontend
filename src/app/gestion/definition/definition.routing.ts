import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefinitionComponent} from './definition.component';
import {DirectionComponent} from './direction/direction.component';
import { TypeCentreConsommationComponent } from './type-centre-consommation/type-centre-consommation.component';
import { CentreConsommationComponent } from './centre-consommation/centre-consommation.component';
import { MagasinComponent } from './magasin/magasin.component';
import { FamilleArticleComponent } from './famille-article/famille-article.component';
import { TypeArticleComponent } from './type-article/type-article.component';
import { ArticleComponent } from './article/article.component';
import { CauseAnnomalieComponent } from './cause-annomalie/cause-annomalie.component';
import { TypeFournisseurComponent } from './type-fournisseur/type-fournisseur.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';

//const routes: Routes = [];
let routes: Routes = [
  {
    path: '', component: DefinitionComponent,
    children: [
      {  path: 'direction', component: DirectionComponent },
      {  path: 'type-centre-consommation', component: TypeCentreConsommationComponent },
      {  path: 'centre-consommation', component: CentreConsommationComponent },
      {  path: 'magasin', component: MagasinComponent },
      {  path: 'famille-article', component: FamilleArticleComponent },
      {  path: 'type-article', component: TypeArticleComponent },
      {  path: 'type-article', component: TypeArticleComponent },
      {  path: 'article', component: ArticleComponent },
      {  path: 'cause-annomalie', component: CauseAnnomalieComponent },
      {  path: 'type-fournisseur', component: TypeFournisseurComponent },
      {  path: 'fournisseur', component: FournisseurComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefinitionRoutingModule { }
