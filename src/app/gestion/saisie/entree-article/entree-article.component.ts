import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { AppelOffre } from 'src/app/models/gestion/saisie/appelOffre.model';
import { BondTravail } from 'src/app/models/gestion/saisie/bondTravail.model';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { CommandeAchat } from 'src/app/models/gestion/saisie/commandeAchat.model';
import { ConsulterFrsForDp } from 'src/app/models/gestion/saisie/consulterFrsForDp.model';
import { DemandePrix } from 'src/app/models/gestion/saisie/demandPrix.model';
import { EncapReception } from 'src/app/models/gestion/saisie/encapsuleur-model/encapReception.model';
import { FactureProFormAcha } from 'src/app/models/gestion/saisie/factureProFormAcha.model';
import { LettreCommande } from 'src/app/models/gestion/saisie/lettreCommande.model';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { LigneReception } from 'src/app/models/gestion/saisie/ligneReception.model';
import { Reception } from 'src/app/models/gestion/saisie/reception.model';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { AppelOffreService } from 'src/app/services/gestion/saisie/appel-offre.service';
import { BondTravailService } from 'src/app/services/gestion/saisie/bond-travail.service';
import { CommandeAchatService } from 'src/app/services/gestion/saisie/commande-achat.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { ConsulterFrsForDpService } from 'src/app/services/gestion/saisie/consulter-frs-for-dp.service';
import { DemandePrixService } from 'src/app/services/gestion/saisie/demandePrix.service';
import { FactureProFormAchaService } from 'src/app/services/gestion/saisie/facture-pro-form-acha.service';
import { LettreCommandeService } from 'src/app/services/gestion/saisie/lettre-commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { LigneReceptionService } from 'src/app/services/gestion/saisie/ligne-reception.service';
import { ReceptionService } from 'src/app/services/gestion/saisie/reception.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { NumberToLetter } from 'convertir-nombre-lettre';
import { InventaireService } from 'src/app/services/gestion/saisie/inventaire.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { SalTools } from 'src/app/utilitaires/salTools';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';


export interface modelLigneRecept{
  ligneReception: LigneReception;
  listArticle: Article[];
  uniter: Uniter;
  selectedArticl: number;
  selectedUniter: number;
  prixUnitaire: number;
  concernedLigneCom: LigneCommande;
  concernedStocker: Stocker;
  qteRest: number;


}

@Component({
  selector: 'app-entree-article',
  templateUrl: './entree-article.component.html',
  styleUrls: ['./entree-article.component.css']
})
export class EntreeArticleComponent  implements OnInit {

  searchControl: FormControl = new FormControl();
  receptionFiltered;

  validateForm: FormGroup;
  receptionList: Reception[] = [];
  receptionListByExo: Reception[] = [];
  ligneReceptList: LigneReception[] = [];
  ligneCommandeList: LigneCommande[] = [];
  commandeList: Commande[] = [];
  commandeAchaList: CommandeAchat[] = [];
  appelOffreList: AppelOffre[] = [];
  bondTravailList: BondTravail[] = [];
  lettreCommandeList: LettreCommande[] = [];
  demandePrixList: DemandePrix[] = [];
  consulterFrsForDpList: ConsulterFrsForDp[] = [];
  fpfaList: FactureProFormAcha[] = [];
  selectedLigneReceptList: LigneReception[] = [];
  magasinList: Magasin[] = [];
  magasinList2: Magasin[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  stockerList: Stocker[] = [];
  loading: boolean;
  reception: Reception = null;
  ligneShow: modelLigneRecept[] = [];
  detailView: boolean = false;

  etatVali: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  inventaireEnCours: boolean = true;

  constructor(
    private receptionService: ReceptionService,
    private ligneReceptService: LigneReceptionService,
    private ligneCommandeService: LigneCommandeService,
    private magasinService: MagasinService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private commandeService: CommandeService,
    private bondTravailService: BondTravailService,
    private appelOffreService: AppelOffreService,
    private commandeAchatService: CommandeAchatService,
    private lettreCommandeService: LettreCommandeService,
    private demandePrixService: DemandePrixService,
    private consulterFrsForDpService: ConsulterFrsForDpService,
    private fpfaService: FactureProFormAchaService,
    private exerciceService: ExerciceService,
    private stockerService: StockerService,
    private inventaireService: InventaireService,
    private clotureService: CloturePeriodiqService,
    public salToolsService: SalTools,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.getAllReceptionByCodeExoSelected();

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

      this.getAllArticle();
      this.getAllUniter();
      this.getAllMagasin();
      this.getAllStocker();
      this.getAllAppelOffre();
      this.getAllBondTravail();
      this.getAllCommandeAchat();
      this.getAllLettreCommande();
      this.getAllLigneCommande();
      this.getAllLigneReception();
      this.getAllDemandePrix();
      this.getAllFactureProFormAcha();
      this.getAllConsulterFrsForDp();
      this.getAllInventaire();

      this.magasinList2 = SalTools.getConnectedUser().magasins;

  }

  isAllowedMagasin(ligne:Reception):boolean{
    let b:boolean = false;
    for (const mag of this.magasinList2) {
      if(ligne.magasin.numMagasin == mag.numMagasin){
        b = true;
        break;
      }
    }
    return b;
  }

  getAllInventaire(){
    this.inventaireService.getAllInventaire().subscribe(
      (data) => {
        let finded = false;
        for (const element of data) {
          if(element.valideInve == false){
            finded = true;
          }
        }

        this.inventaireEnCours = finded;

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getAllLettreCommande(){
    this.lettreCommandeService.getAllLettreCommande().subscribe(
      (data) => {
        this.lettreCommandeList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllDemandePrix(){
    this.demandePrixService.getAllDemandePrix().subscribe(
      (data) => {
        this.demandePrixList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllConsulterFrsForDp(){
    this.consulterFrsForDpService.getAllConsulterFrsForDp().subscribe(
      (data) => {
        this.consulterFrsForDpList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllFactureProFormAcha(){
    this.fpfaService.getAllFactureProFormAcha().subscribe(
      (data) => {
        this.fpfaList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllBondTravail(){
    this.bondTravailService.getAllBondTravail().subscribe(
      (data) => {
        this.bondTravailList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllAppelOffre(){
    this.appelOffreService.getAllAppelOffre().subscribe(
      (data) => {
        this.appelOffreList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllCommandeAchat(){
    this.commandeAchatService.getAllCommandeAchat().subscribe(
      (data) => {
        this.commandeAchaList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllStocker(){
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getAllArticle(){
    this.articleService.getAllArticle().subscribe(
      (data) => {
        this.articleList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllReception(){
    this.receptionService.getAllReception().subscribe(
      (data) => {
        this.receptionList = [...data.filter( l => this.isAllowedMagasin(l))];
        //this.receptionFiltered = this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()));
        //console.log(this.receptionList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllReceptionByCodeExoSelected(){
    this.receptionService.getReceptionByCodeExo(this.exerciceService.selectedExo.codeExercice).subscribe(
      (data) => {
        this.receptionListByExo = [...data.filter( l => this.isAllowedMagasin(l))];
        this.receptionFiltered = this.receptionListByExo.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()));
        //console.log(this.receptionList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllLigneCommande(){
    this.ligneCommandeService.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandeList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllUniter(){
    this.uniterService.getAllUniter().subscribe(
      (data) => {
        this.uniterList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllMagasin(){
    this.magasinService.getAllMagasin().subscribe(
      (data) => {
        this.magasinList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllLigneReception(){
    this.ligneReceptService.getAllLigneReception().subscribe(
      (data) => {
        this.ligneReceptList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getAllCommande(){
    this.commandeService.getAllCommande().subscribe(
      (data) => {
        this.commandeList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }


  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.receptionFiltered = [...this.receptionListByExo.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
    }

    const columns = Object.keys(this.receptionListByExo[0]);
    if (!columns.length) {
      return;
    }

    let rows = this.receptionListByExo.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    if(rows.length == 0){
      rows = this.receptionListByExo.filter((l) => this.subSearch(l));
    }

    this.receptionFiltered = rows;
  }

  subSearch(recep: Reception){
    let textee: String = this.searchControl.value;
    const columns2 = Object.keys(this.ligneReceptList[0].ligneCommande.numCommande);
    

    let cmd = this.getCommandeOfAReception(recep);
    /*console.log('cmd ==> ',cmd);
    console.log('col ==> ',columns2);*/

    for (let i = 0; i <= columns2.length; i++) {
      const column = columns2[i];
      if (cmd[column] && cmd[column].toString().toLowerCase().indexOf(textee.toLowerCase()) > -1) {
        return true;
      }
    }

    const columns3 = Object.keys(this.getFilleCommandeOfARecept(recep));

    let cmd2 = this.getFilleCommandeOfARecept(recep);
    /*console.log('cmd2 ==> ',cmd2);
    console.log('col2 ==> ',columns3);*/

    for (let i = 0; i <= columns3.length; i++) {
      const column = columns3[i];
      if (cmd2[column] && cmd2[column].toString().toLowerCase().indexOf(textee.toLowerCase()) > -1) {
        return true;
      }
    }

    return false;

  }

  makeForm(reception: Reception): void {
    this.validateForm = this.fb.group({
      numReception: [reception != null ? reception.numReception: null],
      dateReception: [reception != null ? reception.dateReception.toString().substr(0, 10) : null,
      [Validators.required]],
      observation: [reception != null ? reception.observation : null],
      refBordLivraiRecept: [reception != null ? reception.refBordLivraiRecept : null],
      description: [reception != null ? reception.referenceReception : null],
      magasin: [reception != null ? reception.magasin.numMagasin : null,
        [Validators.required]],
      valideRecep: [reception != null ? reception.valideRecep : false],
      numComm: [reception != null ? this.getCommandeOfAReception(reception).numCommande : null,
        [Validators.required]],
      numType: [reception != null ? this.getTypeCommandeOfARecept(reception) : null,
        [Validators.required]],
      numFilleComm: [reception != null ? this.getNumFilleCommandeOfARecept(reception) : null,
        [Validators.required]],


    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (reception?.numReception !=null){

      this.ligneReceptService.getLignesReceptionByCodeReception(reception.numReception).subscribe(
        (ligneReceptList) => {
          this.ligneShow = [];
          //console.log(this.validateForm.value, reception.dateReception);
          if(this.detailView == true) this.detailView = false;
          for(const ligCo of ligneReceptList){
            
              let ne = new LigneReception(ligCo.quantiteLigneReception, ligCo.puLigneReception, ligCo.observationLigneReception, 
                ligCo.lastCump, ligCo.ligneCommande, ligCo.reception, ligCo.lastStockQte);
                ne.idLigneReception = ligCo.idLigneReception;
              this.ligneShow.push({
                ligneReception: ne,
                listArticle: this.getNotUsedArticle(),
                uniter: ne.ligneCommande.uniter,
                selectedArticl: ne.ligneCommande.article.numArticle,
                selectedUniter: ne.ligneCommande.uniter ? ne.ligneCommande.uniter.numUniter : null,
                prixUnitaire: ne.puLigneReception,
                concernedLigneCom: ne.ligneCommande,
                concernedStocker: this.getStockerByArtiAndMagasin(ne.ligneCommande.article, reception.magasin),
                qteRest: this.getQteRestanOfALigCom(ne.ligneCommande) + ne.quantiteLigneReception
              });
            
          }
    
          this.calculTotaux();
    
          this.activeTabsNav = 2;
    
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
        }
      );


    }
  }

  getCommandeByNumFille(numFille: String): Commande{
    for(const comAch of this.commandeAchaList){
      if(comAch.numComAchat == numFille){
        return comAch.commande;
      }
    }

    for(const appOffr of this.appelOffreList){
      if(appOffr.numAppelOffre == numFille){
        return appOffr.commande;
      }
    }

    for(const bt of this.bondTravailList){
      if(bt.numBondTravail == numFille){
        return bt.commande;
      }
    }

    for(const lc of this.lettreCommandeList){
      if(lc.numLettreComm == numFille){
        return lc.commande;
      }
    }
    
    for(const dp of this.demandePrixList){
      if(dp.idDemandePrix == numFille){
        let concernedConsu: ConsulterFrsForDp = null;
        for(const consu of this.consulterFrsForDpList){
          if(consu.demandePrix.idDemandePrix == dp.idDemandePrix && consu.choisit){
            concernedConsu = consu;
            break;
          }
        }

        if(concernedConsu){
          let concerFpfa: FactureProFormAcha = null;
          for(const fpfa of this.fpfaList){
            if(fpfa.demandePrix.idDemandePrix == dp.idDemandePrix
              && fpfa.fournisseur.numFournisseur == concernedConsu.fournisseur.numFournisseur){
                concerFpfa = fpfa;
                break;
              }
          }
          
          if(concerFpfa){

            if(concerFpfa.commande){
              return concerFpfa.commande;
            }
            else{
              //this.toastr.error('Veuillez d\'abord générer le bond de Commande pour le DP Afin de Procéder à la réception', 'Erreur !', { timeOut: 5000 });
              return null;
            }

          }
          else{
            //this.toastr.error('Aucune Facture Proformat enrégistrer pour le Fournisseur choisit pour ce DP', 'Erreur !', { timeOut: 5000 });
            return null;
          }

        }
        else{
          //this.toastr.error('Aucun fournisseur choisit pour cette DP', 'Erreur !', { timeOut: 5000 });
          return null;
        }


      }
    }
    

    return null;
  }

  getNumFilleCommandeOfARecept(reception: Reception): String{
    let concernedComm: Commande = this.getCommandeOfAReception(reception);

    for(const comAch of this.commandeAchaList){
      if(comAch.commande.numCommande == concernedComm?.numCommande){
        return comAch.numComAchat;
      }
    }

    for(const appOffr of this.appelOffreList){
      if(appOffr.commande.numCommande == concernedComm?.numCommande){
        return appOffr.numAppelOffre;
      }
    }

    for(const bt of this.bondTravailList){
      if(bt.commande.numCommande == concernedComm?.numCommande){
        return bt.numBondTravail;
      }
    }

    for(const lc of this.lettreCommandeList){
      if(lc.commande.numCommande == concernedComm?.numCommande){
        return lc.numLettreComm;
      }
    }

    for(const fpfa of this.fpfaList){
      if(fpfa.commande?.numCommande == concernedComm?.numCommande){
        return fpfa.demandePrix.idDemandePrix;
      }
    }

    return null;

  }

  getFilleCommandeOfARecept(reception: Reception): any{
    let concernedComm: Commande = this.getCommandeOfAReception(reception);

    for(const comAch of this.commandeAchaList){
      if(comAch.commande.numCommande == concernedComm?.numCommande){
        return comAch;
      }
    }

    for(const appOffr of this.appelOffreList){
      if(appOffr.commande.numCommande == concernedComm?.numCommande){
        return appOffr;
      }
    }

    for(const bt of this.bondTravailList){
      if(bt.commande.numCommande == concernedComm?.numCommande){
        return bt;
      }
    }

    for(const lc of this.lettreCommandeList){
      if(lc.commande.numCommande == concernedComm?.numCommande){
        return lc;
      }
    }

    for(const fpfa of this.fpfaList){
      if(fpfa.commande?.numCommande == concernedComm?.numCommande){
        return fpfa.demandePrix;
      }
    }

    return null;

  }

  getTypeCommandeOfARecept(reception: Reception): number{
    let concernedComm: Commande = this.getCommandeOfAReception(reception);

    for(const comAch of this.commandeAchaList){
      if(comAch.commande.numCommande == concernedComm.numCommande){
        return 0;
      }
    }

    for(const appOffr of this.appelOffreList){
      if(appOffr.commande.numCommande == concernedComm.numCommande){
        return 1;
      }
    }

    for(const bt of this.bondTravailList){
      if(bt.commande.numCommande == concernedComm.numCommande){
        return 2;
      }
    }

    for(const lc of this.lettreCommandeList){
      if(lc.commande.numCommande == concernedComm.numCommande){
        return 3;
      }
    }

    for(const fpfa of this.fpfaList){
      if(fpfa.commande?.numCommande == concernedComm.numCommande){
        return 4;
      }
    }

    return null;

  }

  getStockerByArtiAndMagasin(article: Article, magasin: Magasin): Stocker{

    for(const sto of this.stockerList){
      if(article.numArticle == sto.article.numArticle && magasin.numMagasin == sto.magasin.numMagasin){
        return sto;
      }
    }

    return new Stocker(0, 0, 0, 0, article, magasin);

  }

  getInfosOnAFilleCommandeSelected(){
    let articlesOfFilleCom = [];

    this.validateForm.patchValue({
      numComm: this.getCommandeByNumFille(this.validateForm.value.numFilleComm)?.numCommande.toString(),
    });

    for(const lig1 of this.ligneCommandeList){
      if(lig1.numCommande.numCommande == this.validateForm.value.numComm){
        articlesOfFilleCom.push(lig1.article);
      }
    }

    console.log(this.validateForm.value.numComm, this.validateForm.value.magasin);

    this.ligneShow = [];

    this.articleList = articlesOfFilleCom;

  }

  getInfosOnMagasinSelected(){

    for(const arti of this.articleList){
      if(arti.famille.magasin && arti.famille.magasin.numMagasin != this.validateForm.value.magasin){
        const i = this.articleList.findIndex(l => l.numArticle == arti.numArticle);
        if (i > -1) {
          this.articleList.splice(i, 1);
        }
      }
    }

    //console.log(this.validateForm.value.numComm, this.validateForm.value.magasin);

    this.getAllStocker();

  }

  getLigneComBySelectedNumArti(numArt:number): LigneCommande{
    for(const lig1 of this.ligneCommandeList){
      if(lig1.article.numArticle == numArt && lig1.numCommande.numCommande == this.validateForm.value.numComm){
        return lig1;
      }
    }

    return null;
  }

  getInfosOfSelectArt(ind:number){

    this.ligneShow[ind].concernedLigneCom = this.getLigneComBySelectedNumArti(this.ligneShow[ind].selectedArticl);
    this.ligneShow[ind].qteRest = this.getQteRestanOfALigCom(this.ligneShow[ind].concernedLigneCom);

    let mag: Magasin = new Magasin('', '');
    const i = this.magasinList.findIndex(l => l.numMagasin == this.validateForm.value.magasin);
    if(i > -1){
      mag = this.magasinList[i];
    }
    this.ligneShow[ind].concernedStocker = this.getStockerByArtiAndMagasin(this.ligneShow[ind].concernedLigneCom.article, mag);

    this.ligneShow[ind].listArticle = this.getNotUsedArticle();

    this.ligneShow[ind].ligneReception.quantiteLigneReception = this.ligneShow[ind]?.concernedLigneCom?.qteLigneCommande;
    this.ligneShow[ind].ligneReception.puLigneReception = this.ligneShow[ind]?.concernedLigneCom?.puLigneCommande;
    this.ligneShow[ind].ligneReception.ligneCommande = this.ligneShow[ind].concernedLigneCom;

    console.log('vava', this.ligneShow[ind]);

  }

  getCommandeOfAReception(reception: Reception) : Commande{
    for(const lig1 of this.ligneReceptList){
      if(lig1.reception.numReception == reception.numReception){
        return lig1.ligneCommande.numCommande;
      }
    }
    return null;
  }

  getQteRestanOfALigCom(ligneCommande: LigneCommande): number{
    let nbr : number = 0;

    for(const lig of this.ligneReceptList){
      if(lig.ligneCommande.idLigneCommande == ligneCommande?.idLigneCommande){
        nbr += lig.quantiteLigneReception;
      }
    }

    return (ligneCommande?.qteLigneCommande - nbr);

  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);

    this.ligneShow = [];
    this.calculTotaux();
    if(this.detailView == true) this.detailView = false;

  }

  submit(): void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const formData = this.validateForm.value;

    let lignShowValid: boolean = true;
    /*let dateValid: boolean = true;
    const i = this.commandeList.findIndex(l => l.numCommande == formData.numComm);
    let comman:Commande = null;
    if (i > -1) {
       comman = this.commandeList[i];
    }*/
    for(const lig of this.ligneShow){
      if(lig.ligneReception.quantiteLigneReception > lig.qteRest || lig.ligneReception.quantiteLigneReception <= 0){
        lignShowValid = false;
        break;
      }
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir le Formulaire convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else if (this.ligneShow.length == 0 || lignShowValid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        if(this.ligneShow.length == 0)
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', {progressBar: true});
        if(lignShowValid == false)
        this.toastr.error('Veuillez Renseigner les Quantités Convenablement.', ' Erreur !', {progressBar: true});

      }, 3000);
    } else if (this.ligneShow[0].concernedLigneCom.numCommande.dateCommande.valueOf() > formData.dateReception.valueOf()) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('La date de la réception est antérieur à la date de la commande.', ' Erreur !', {progressBar: true});

      }, 3000);
    } else {
      

    const i = this.commandeList.findIndex(l => l.numCommande == formData.numComm);
    if (i > -1) {
      formData.numComm = this.commandeList[i];
    }

    const m = this.magasinList.findIndex(l => l.numMagasin == formData.magasin);
    if (m > -1) {
      formData.magasin = this.magasinList[m];
    }


      const recept = new Reception(formData.numReception, formData.observation, formData.dateReception,
        false, 0, formData.description, formData.refBordLivraiRecept, this.exerciceService.selectedExo,
        formData.magasin);

      let lignesRecept: LigneReception[] = [];
      this.ligneShow.forEach((element, inde) => {
        //const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);

        element.ligneReception.ligneCommande = element.concernedLigneCom;
        if(element.qteRest <= element.ligneReception.quantiteLigneReception){
          element.ligneReception.ligneCommande.satisfaite = true;
        }
        else{
          element.ligneReception.ligneCommande.satisfaite = false;
        }
        lignesRecept.push(element.ligneReception);

      });

      if (formData.numReception == null) {
        console.log("data", formData);
        console.log('encap', recept, lignesRecept);
        this.enregistrerRecept(recept, lignesRecept);
      } else {
        this.modifierRecept(recept, lignesRecept);
      }
    }
  }

  enregistrerRecept(reception: Reception, lignesRecept: LigneReception[]): void {
    this.loading = true;

    console.log('obj', new EncapReception(reception, lignesRecept));
    this.receptionService.addAReception2(new EncapReception(reception, lignesRecept)).subscribe(
      (data) => {
        this.getAllLigneReception();
        this.getAllArticle();
        this.getAllUniter();
        this.getAllMagasin();
        this.getAllStocker();
        this.getAllAppelOffre();
        this.getAllBondTravail();
        this.getAllCommandeAchat();
        this.getAllLettreCommande();
        this.getAllLigneCommande();
        this.getAllDemandePrix();
        this.getAllFactureProFormAcha();
        this.getAllConsulterFrsForDp();
        console.log(data);

        this.receptionListByExo.unshift(data.reception);
        this.receptionFiltered = [...this.receptionListByExo.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
        setTimeout(() => {
          this.loading = false;
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      }
    );

  }

  modifierRecept(reception: Reception, lignesRecept: LigneReception[]): void {
    this.loading = true;
    this.receptionService.editAReception2(reception.numReception, new EncapReception(reception, lignesRecept)).subscribe(
      (data) => {
        this.getAllLigneReception();
        this.getAllArticle();
        this.getAllUniter();
        this.getAllMagasin();
        this.getAllStocker();
        this.getAllAppelOffre();
        this.getAllBondTravail();
        this.getAllCommandeAchat();
        this.getAllLettreCommande();
        this.getAllLigneCommande();
        this.getAllDemandePrix();
        this.getAllFactureProFormAcha();
        this.getAllConsulterFrsForDp();

        console.log(data);
          const i = this.receptionListByExo.findIndex(l => l.numReception == data.reception.numReception);
          if (i > -1) {
            this.receptionListByExo[i] = data.reception;
            this.receptionFiltered = [...this.receptionListByExo.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
          }
          
          setTimeout(() => {
            this.loading = false;
            //basculer vers la tab contenant la liste apres modification
            this.activeTabsNav = 1;
            this.resetForm();
            this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
          }, 3000);


      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);

      }
    );


  }

  confirm(content, reception: Reception) {
    this.reception = reception;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.receptionService.deleteAReception2(reception?.numReception).subscribe(
        (data) => {
          this.getAllLigneReception();
          this.getAllArticle();
          this.getAllUniter();
          this.getAllMagasin();
          this.getAllStocker();
          this.getAllAppelOffre();
          this.getAllBondTravail();
          this.getAllCommandeAchat();
          this.getAllLettreCommande();
          this.getAllLigneCommande();
          this.getAllDemandePrix();
          this.getAllFactureProFormAcha();
          this.getAllConsulterFrsForDp();
          console.log(data);
          const i = this.receptionListByExo.findIndex(l => l.numReception == reception.numReception);
          if (i > -1) {
            this.receptionListByExo.splice(i, 1);
            this.receptionFiltered = [...this.receptionListByExo.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
          }
          this.resetForm();
          this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', {progressBar: true});

        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  pushALigneAppro(){
    this.ligneShow.push({
      ligneReception: new LigneReception(0, 0, '', 0, null, null),
      listArticle: this.getNotUsedArticle(),
      uniter: null,
      selectedArticl: null,
      selectedUniter: null,
      concernedLigneCom: null,
      prixUnitaire: 0,
      concernedStocker: null,
      qteRest:0,
    });
  }

  getNotUsedArticle(): Article[]{
    let tab: Article[] = [];
    this.articleList.forEach(element => {
      let finded: boolean = false;
      for(const lig of this.ligneShow){
        if(lig.selectedArticl == element.numArticle){
          finded = true;
          break;
        }
      }
      if(!finded){
        tab.push(element);
      }
    });
    return tab;
  }

  popALigneAppro(inde:number){
    this.ligneShow.splice(inde, 1);
    this.calculTotaux();
  }


  onArticleSelectClicked(inde: number){
    let tab: Article[] = [];
    this.articleList.forEach(element => {
      let finded: boolean = false;
      for(const lig of this.ligneShow){
        if(lig.selectedArticl == element.numArticle &&  this.ligneShow[inde].selectedArticl != element.numArticle){
          finded = true;
          break;
        }
      }
      if(!finded){
        tab.push(element);
      }
    });

    this.ligneShow[inde].listArticle = tab;

  }

  calculTotaux(){

    let tot0: number = 0;
    let tot1: number = 0;
    let tot2: number = 0;

    this.ligneShow.forEach(element => {
      tot0 += (element.ligneReception.puLigneReception * element.ligneReception.quantiteLigneReception);
      tot1 += (element.ligneReception.puLigneReception * element.ligneReception.quantiteLigneReception * element.ligneReception.ligneCommande.tva/100);
      tot2 += (element.ligneReception.puLigneReception * element.ligneReception.quantiteLigneReception * (1+(element.ligneReception.ligneCommande.tva/100)));

    });

    this.totaux[0] = tot0;
    this.totaux[1] = tot1;
    this.totaux[2] = tot2;

  }

  getTotalOfARecept(row: Reception){

    let tot: number = 0;

    this.ligneReceptList.forEach(element => {
      if(element.reception.numReception == row.numReception){
        tot += element.puLigneReception * element.quantiteLigneReception;
      }
    });

    return tot;

  }

  valider(reception: Reception, eta: boolean, content){

    if(this.inventaireEnCours){
      this.toastr.error('Impossible d\'éffectuer l\'action car un Inventaire est en cours !', 'Erreur !', { timeOut: 5000 });
      
    }
    else{

      this.clotureService.isPeriodeCloturedByDate(reception.dateReception).subscribe(
        (data) => {
          if(data == false){
  
            this.etatVali = eta;

            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
              .result.then((result) => {

              //this.confirmResut = `Closed with: ${result}`;
              reception.valideRecep = eta;

              this.receptionService.editAReception3(reception.numReception, reception).subscribe(
                (data) => {
          
                  const i = this.receptionListByExo.findIndex(l => l.numReception == data.numReception);
                      if (i > -1) {
                        this.receptionListByExo[i] = data;
                        this.receptionFiltered = [...this.receptionListByExo.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
                      }
          
                      this.getAllLigneReception();
                      this.getAllArticle();
                      this.getAllUniter();
                      this.getAllMagasin();
                      this.getAllStocker();
                      this.getAllAppelOffre();
                      this.getAllBondTravail();
                      this.getAllCommandeAchat();
                      this.getAllLettreCommande();
                      this.getAllLigneCommande();
                      this.getAllDemandePrix();
                      this.getAllFactureProFormAcha();
                      this.getAllConsulterFrsForDp();
          
                      if(data.valideRecep == reception.valideRecep){
                        let msg: String = 'Validation'
                        if(eta == false) msg = 'Annulation';
                        this.toastr.success(msg+' effectuée avec succès.', 'Success', { timeOut: 5000 });
                      } else {
                        let msg: String = 'Erreur lors de l\'entrée de l\'Article dans le Magasin.'
                        if(eta == false) msg = 'Erreur lors du Retour de l\'Article dans le Magasin Annulation';
                        this.toastr.error(msg.valueOf(), 'Erreur !', { timeOut: 5000 });
                      }
          
          
                },
                (error: HttpErrorResponse) => {
                  console.log('Echec status ==> ' + error.status);
                  this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
          
                }
              );
          


            }, (reason) => {
              console.log(`Dismissed with: ${reason}`);
            });
            
          }
          else{
            this.toastr.error('Période Cloturée ', 'Erreur !', { timeOut: 5000, progressBar:true });
          }
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar:true });
          
        }
      );

      
    }

  }

  openDetail(row){
    this.makeForm(row);
    this.detailView = true;
  }

  closeDetail(){
    this.resetForm();
    this.detailView = false;
  }

  generateLignes(){

    let concernedCommande:Commande = this.getCommandeByNumFille(this.validateForm.value.numFilleComm);

    let tab: modelLigneRecept[] = [];

    for(const ligCom of this.ligneCommandeList){
      if(ligCom.numCommande.numCommande == concernedCommande.numCommande 
        && ligCom.satisfaite == false && ligCom.article.famille.magasin && ligCom.article.famille.magasin.numMagasin == this.validateForm.value.magasin){

          tab.push({
            ligneReception: new LigneReception(this.getQteRestanOfALigCom(ligCom), ligCom.puLigneCommande, '', 0, ligCom, null),
            listArticle: null,
            uniter: ligCom.uniter,
            selectedArticl: null,
            selectedUniter: null,
            concernedLigneCom: ligCom,
            prixUnitaire: ligCom.puLigneCommande,
            concernedStocker: this.getStockerByArtiAndMagasin(ligCom.article, this.validateForm.value.magasin),
            qteRest: this.getQteRestanOfALigCom(ligCom),
          });

      }
      
    }

    this.ligneShow = tab;

    this.calculTotaux();

    if(this.ligneShow.length < 1){
      this.toastr.error('Aucune ligne trouvée', 'Erreur !', { timeOut: 5000 });
    }

  }

  isAFilleComSitisfaied(numFille: String) : boolean{
    let concernedCom: Commande = this.getCommandeByNumFille(numFille);

    if(concernedCom){
      let finded: boolean = false;
      for(const lig of this.ligneCommandeList){
        if(lig.numCommande.numCommande == concernedCom.numCommande 
          && lig.satisfaite == false){
            return false;
          }
          else if(lig.numCommande.numCommande == concernedCom.numCommande){
            finded = true;
          }
      }

      if(finded == true){
        return true;
      }

      return false;

    }

    return false;

  }

  onTypeComChange(){

    this.ligneShow = [];
    this.validateForm.patchValue({
      numFilleComm:null,
    });

    this.calculTotaux();

  }

  openPdfToPrint(element: Reception){


    let totalHT : number = 0;
    let totalTVA : number = 0;
    let totalTTC : number = 0;

    const doc = new jsPDF();
    
    autoTable(doc, {
      theme: 'plain',
      margin: { top: 5, left:35, right:9, bottom:100 },
      columnStyles: {
        0: { textColor: 'blue', fontStyle: 'bold', halign: 'left' },
        1: { textColor: 'blue', fontStyle: 'bold', halign: 'right' },
      },
      body: [
        ['PORT AUTONOME DE LOME\n\nTel.: 22.27.47.42/22.27.33.91/22.27.33.92\nFax: (228) 22.27.26.27\nCARTE N° 950113V',
        'REPUBLIQUE TOGOLAISE\n\nTravail-Liberté-Patrie       ']
      ]
      ,
    });
    doc.addImage(Utils.logoUrlData, 'jpeg', 10, 5, 25, 25);
    

    doc.setDrawColor(0);
    doc.setFillColor(233 , 242, 248);
    doc.roundedRect(50, 35, 110, 10, 3, 3, 'FD');
    doc.setFontSize(20);
    doc.text('ORDRE D\'ENTREE', 70, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Ordre d\'entree N° '+element.numReception+' du '+moment(element.dateReception).format('DD/MM/YYYY')]
      ]
      ,
    });

    let numFille: String = this.getNumFilleCommandeOfARecept(element);
    let commande: Commande = this.getCommandeByNumFille(numFille);

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { right: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Réf Commande :', ''+numFille],
        ['Fournisseur :', commande.frs.codeFrs+' - '+commande.frs.identiteFrs],
        ['Magasin :', element.magasin.codeMagasin+' - '+element.magasin.libMagasin]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { left: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['N° Générique :', ''+(element.referenceReception ? element.referenceReception : '')],
        ['Ref B/L :', ''+(element.refBordLivraiRecept ? element.refBordLivraiRecept : '')],
        ['Mode :', 'Commande '+(this.isAFilleComSitisfaied(numFille) ? 'Totalement' : 'Partiellement')+' Satisfaite'],
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      //startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, halign: 'left' },
      },
      body: [
        ["\nA reçu livraison au magasin ce jour des articles décrits ci-dessous :"]
      ]
      ,
    });

    this.ligneReceptService.getLignesReceptionByCodeReception(element.numReception).subscribe(
      (ligneReceptList) => {
        let lignes = [];

        ligneReceptList.forEach(element2 => {
          if(element2.reception.numReception == element.numReception){
            let lig = [];
            lig.push(element2.ligneCommande.article.codeArticle);
            lig.push(element2.ligneCommande.article.libArticle);
            lig.push(element2.quantiteLigneReception);
            lig.push(element2.ligneCommande.uniter.libUniter);
            lig.push(element2.ligneCommande.puLigneCommande);
            lig.push(element2.ligneCommande.tva);
            let ht = element2.quantiteLigneReception*element2.ligneCommande.puLigneCommande;
            lig.push(this.salToolsService.salRound(ht*(1+(element2.ligneCommande.tva/100))));
            lignes.push(lig);
    
            totalHT+= ht;
            totalTVA+= ht*(element2.ligneCommande.tva/100);
            totalTTC+= ht*(1+(element2.ligneCommande.tva/100));
          }
    
        });
    
        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
          margin: { top: 100 },
          body: lignes
          ,
        });
    
    
        autoTable(doc, {
          theme: 'grid',
          margin: { top: 100, left:130 },
          columnStyles: {
            0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          },
          body: [
            ['Total HT', this.salToolsService.salRound(totalHT)],
            ['Total Montant TVA', this.salToolsService.salRound(totalTVA)],
            ['Total TTC', this.salToolsService.salRound(totalTTC)]
          ]
          ,
        });
    
        autoTable(doc, {
          theme: 'plain',
          margin: { top: 50, bottom:0 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
          },
          body: [
            ["Arrêté le présent Ordre d'Entrée à la Somme de : "+this.salToolsService.salNumberToLetter(this.salToolsService.salRound(totalTTC))+' Francs CFA']
          ]
          ,
        });
    
        
    
        doc.output('dataurlnewwindow');
    
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }

  openPdfToPrintPvRecept(element: Reception){


    let totalHT : number = 0;
    let totalTVA : number = 0;
    let totalTTC : number = 0;

    const doc = new jsPDF();
    
    autoTable(doc, {
      theme: 'plain',
      margin: { top: 5, left:35, right:9, bottom:100 },
      columnStyles: {
        0: { textColor: 'blue', fontStyle: 'bold', halign: 'left' },
        1: { textColor: 'blue', fontStyle: 'bold', halign: 'right' },
      },
      body: [
        ['PORT AUTONOME DE LOME\n\nTel.: 22.27.47.42/22.27.33.91/22.27.33.92\nFax: (228) 22.27.26.27\nCARTE N° 950113V',
        'REPUBLIQUE TOGOLAISE\n\nTravail-Liberté-Patrie       ']
      ]
      ,
    });
    doc.addImage(Utils.logoUrlData, 'jpeg', 10, 5, 25, 25);
    

    doc.setDrawColor(0);
    doc.setFillColor(233 , 242, 248);
    doc.roundedRect(50, 35, 110, 10, 3, 3, 'FD');
    doc.setFontSize(20);
    doc.text('PV DE RECEPTION', 70, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Ordre d\'entree N° '+element.numReception+' du '+moment(element.dateReception).format('DD/MM/YYYY')]
      ]
      ,
    });

    let numFille: String = this.getNumFilleCommandeOfARecept(element);
    let commande: Commande = this.getCommandeByNumFille(numFille);

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { right: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Réf Commande :', ''+numFille],
        ['Fournisseur :', commande.frs.codeFrs+' - '+commande.frs.identiteFrs],
        ['Magasin :', element.magasin.codeMagasin+' - '+element.magasin.libMagasin]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { left: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['N° Générique :', ''+(element.referenceReception ? element.referenceReception : '')],
        ['Ref B/L :', ''+(element.refBordLivraiRecept ? element.refBordLivraiRecept : '')],
        ['Mode :', 'Commande '+(this.isAFilleComSitisfaied(numFille) ? 'Totalement' : 'Partiellement')+' Satisfaite'],
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      //startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, halign: 'left' },
      },
      body: [
        ["\nA reçu livraison au magasin ce jour des articles décrits ci-dessous :"]
      ]
      ,
    });

    this.ligneReceptService.getLignesReceptionByCodeReception(element.numReception).subscribe(
      (ligneReceptList) => {
        
        let lignes = [];

        ligneReceptList.forEach(element2 => {
          
            let lig = [];
            lig.push(element2.ligneCommande.article.codeArticle);
            lig.push(element2.ligneCommande.article.libArticle);
            lig.push(element2.ligneCommande.qteLigneCommande)
            lig.push(element2.quantiteLigneReception);
            lig.push(this.getQteRestanOfALigCom(element2.ligneCommande));
            lig.push(element2.ligneCommande.uniter.libUniter);
            lignes.push(lig);


        });

        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité Commandée', 'Quantité Réceptionnée', 'Quantité Restante', 'Unité']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
          margin: { top: 100 },
          body: lignes
          ,
        });



        autoTable(doc, {
          theme: 'plain',
          margin: { top: 50, bottom:0 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
          },
          body: [
            ['Aujourd\'hui .......................... , l\'équipe de réception a procédé à la réception de la commande '+numFille+' .'],
            ['\nVoici les signataires : ']
          ]
          ,
        });

        doc.output('dataurlnewwindow');

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }

}


