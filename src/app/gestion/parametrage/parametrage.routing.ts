import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ParametrageComponent} from "./parametrage.component";
import {LangueJuridiqueComponent} from "./langue-juridique/langue-juridique.component";
import {NatureJuridiqueComponent} from "./nature-juridique/nature-juridique.component";
import {CorpsJuridiqueComponent} from "./corps-juridique/corps-juridique.component";
import {StatutComponent} from "./statut/statut.component";
import {TypeEvenementComponent} from "./type-evenement/type-evenement.component";
import {EvenementComponent} from "./evenement/evenement.component";
import {MatiereJuridiqueComponent} from "./matiere-juridique/matiere-juridique.component";
import { RelationComponent } from './relation/relation.component';
import {FonctionComponent} from "./fonction/fonction.component";
import {SecteurActiviteComponent} from "./secteur-activite/secteur-activite.component";
import {RoleAuxiliaireComponent} from "./role-auxiliaire/role-auxiliaire.component";
import { ProfessionComponent } from './profession/profession.component';
import { ModeleComponent } from './modele/modele.component';
import { OrigineProcedureComponent } from './origine-procedure/origine-procedure.component';
import {CiviliteComponent} from "./civilite/civilite.component";
import {AnneeComponent} from "./annee/annee.component";
import {SectionComponent} from "./section/section.component";

let routes: Routes = [
  {
    path: '', component: ParametrageComponent,
    children: [
      {  path: 'langue', component: LangueJuridiqueComponent },
      {  path: 'nature-juridique', component: NatureJuridiqueComponent },
      {  path: 'corps', component: CorpsJuridiqueComponent },
      {  path: 'statut', component: StatutComponent },
      {  path: 'type-evenement', component: TypeEvenementComponent },
      {  path: 'evenement', component: EvenementComponent },
      {  path: 'matiere-juridique', component: MatiereJuridiqueComponent },
      {  path: 'relation', component: RelationComponent },
      {  path: 'fonction', component: FonctionComponent },
      {  path: 'secteur-activite', component: SecteurActiviteComponent },
      {  path: 'role-auxiliaire', component: RoleAuxiliaireComponent },
      { path: 'profession', component: ProfessionComponent },
      {  path: 'modele', component: ModeleComponent },
      {  path: 'annee', component: AnneeComponent },
      {  path: 'origine-procedure', component: OrigineProcedureComponent },
      {  path: 'civilite', component: CiviliteComponent },
       {  path: 'section', component: SectionComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrageRoutingModule {}
