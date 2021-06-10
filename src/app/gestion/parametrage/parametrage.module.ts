import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrageComponent } from './parametrage.component';
import { LangueJuridiqueComponent } from './langue-juridique/langue-juridique.component';
import {ParametrageRoutingModule} from "./parametrage.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {ToastrModule, ToastrService} from "ngx-toastr";
import { NatureJuridiqueComponent } from './nature-juridique/nature-juridique.component';
import { CorpsJuridiqueComponent } from './corps-juridique/corps-juridique.component';
import { StatutComponent } from './statut/statut.component';
import { TypeEvenementComponent } from './type-evenement/type-evenement.component';
import { EvenementComponent } from './evenement/evenement.component';
import { MatiereJuridiqueComponent } from './matiere-juridique/matiere-juridique.component';
import { RelationComponent } from './relation/relation.component';
import { FonctionComponent } from './fonction/fonction.component';
import { SecteurActiviteComponent } from './secteur-activite/secteur-activite.component';
import { RoleAuxiliaireComponent } from './role-auxiliaire/role-auxiliaire.component';
import { ProfessionComponent } from './profession/profession.component';
import { ModeleComponent } from './modele/modele.component';
import { OrigineProcedureComponent } from './origine-procedure/origine-procedure.component';
import { CiviliteComponent } from './civilite/civilite.component';
import { AnneeComponent } from './annee/annee.component';
import { SectionComponent } from './section/section.component';

@NgModule({
  declarations: [ParametrageComponent, LangueJuridiqueComponent, NatureJuridiqueComponent,
    FonctionComponent, SecteurActiviteComponent, RoleAuxiliaireComponent, ProfessionComponent,
    ModeleComponent, RelationComponent,MatiereJuridiqueComponent, CorpsJuridiqueComponent, StatutComponent,
    TypeEvenementComponent, EvenementComponent, OrigineProcedureComponent, AnneeComponent, CiviliteComponent,
    SectionComponent],
    
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    ToastrService
  ]
})
export class ParametrageModule { }
