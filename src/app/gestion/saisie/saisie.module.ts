import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {ToastrModule, ToastrService} from "ngx-toastr";
import { NgSelectModule } from '@ng-select/ng-select';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";

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
import { TravauxComponent } from './travaux/travaux.component';


@NgModule({
  declarations: [SaisieComponent, DemandePrixComponent, DepotOffreFactureProformatComponent, LettreCommandeComponent, BonTravailComponent, AppelOffreComponent, StockInitialComponent, EntreeArticleComponent, EtatStockComponent, InventaireComponent, DemandeBesoinComponent, ServirBesoinComponent, CloturePeriodiqueComponent, CommandeAchatComponent, TravauxComponent],
  imports: [
    CommonModule,
    SaisieRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
  ],
  providers: [
    ToastrService
  ]
})
export class SaisieModule { }
