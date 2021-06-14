import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SaisieComponent} from './saisie.component';
import {DemandePrixComponent} from './demande-prix/demande-prix.component';
import { DepotOffreFactureProformatComponent } from './depot-offre-facture-proformat/depot-offre-facture-proformat.component';
import { LettreCommandeComponent } from './lettre-commande/lettre-commande.component';
import { BonTravailComponent } from './bon-travail/bon-travail.component';
import { AppelOffreComponent } from './appel-offre/appel-offre.component';
import { StockInitialComponent } from './stock-initial/stock-initial.component';
import { EntreeArticleComponent } from './entree-article/entree-article.component';
import { EtatStockComponent } from './etat-stock/etat-stock.component';
import { InventaireComponent } from './inventaire/inventaire.component';
import { DemandeBesoinComponent } from './demande-besoin/demande-besoin.component';
import { ServirBesoinComponent } from './servir-besoin/servir-besoin.component';
import { CloturePeriodiqueComponent } from './cloture-periodique/cloture-periodique.component';
import { CommandeAchatComponent } from './commande-achat/commande-achat.component';

let routes: Routes = [
  {
    path: '', component: SaisieComponent,
    children: [
      {  path: 'appro-demande-prix', component: DemandePrixComponent },
      {  path: 'appro-depot-offre-facture-proformat', component: DepotOffreFactureProformatComponent },
      {  path: 'lettre-commande', component: LettreCommandeComponent },
      {  path: 'bon-travail', component: BonTravailComponent },
      {  path: 'appel-offre', component: AppelOffreComponent },
      {  path: 'stock-stock-initial', component: StockInitialComponent },
      {  path: 'stock-entree-article', component: EntreeArticleComponent },
      {  path: 'stock-etat-stock', component: EtatStockComponent },
      {  path: 'stock-inventaire', component: InventaireComponent },
      {  path: 'conso-interne-demande-besoin', component: DemandeBesoinComponent },
      {  path: 'conso-interne-servir-besoin', component: ServirBesoinComponent },
      {  path: 'cloture-periodique', component: CloturePeriodiqueComponent },
      {  path: 'commande-achat', component: CommandeAchatComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaisieRoutingModule { }
