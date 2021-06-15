import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaisieRoutingModule } from './saisie.routing';
import { SaisieComponent } from './saisie.component';
import { DemandePrixComponent } from './demande-prix/demande-prix.component';
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


@NgModule({
  declarations: [SaisieComponent, DemandePrixComponent, DepotOffreFactureProformatComponent, LettreCommandeComponent, BonTravailComponent, AppelOffreComponent, StockInitialComponent, EntreeArticleComponent, EtatStockComponent, InventaireComponent, DemandeBesoinComponent, ServirBesoinComponent, CloturePeriodiqueComponent, CommandeAchatComponent],
  imports: [
    CommonModule,
    SaisieRoutingModule
  ]
})
export class SaisieModule { }
