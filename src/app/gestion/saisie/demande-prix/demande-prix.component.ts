import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Command } from 'protractor';
import { debounceTime } from 'rxjs/operators';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { DemandePrix } from 'src/app/models/gestion/saisie/demandPrix.model';
import { CommandeAchat } from 'src/app/models/gestion/saisie/commandeAchat.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { EncapDemandePrix } from 'src/app/models/gestion/saisie/encapsuleur-model/encapDemandePrix.model';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { LigneDemandePrix } from 'src/app/models/gestion/saisie/ligneDemandePrix.model';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { NumberToLetter } from 'convertir-nombre-lettre';

import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CommandeAchatService } from 'src/app/services/gestion/saisie/commande-achat.service';
import { DemandePrixService } from 'src/app/services/gestion/saisie/demandePrix.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { LigneDemandePrixService } from 'src/app/services/gestion/saisie/ligneDemandePrix.service';
import { ConsulterFrsForDpService } from 'src/app/services/gestion/saisie/consulter-frs-for-dp.service';
import { ConsulterFrsForDp } from 'src/app/models/gestion/saisie/consulterFrsForDp.model';
import { FactureProFormAchaService } from 'src/app/services/gestion/saisie/facture-pro-form-acha.service';
import { FactureProFormAcha } from 'src/app/models/gestion/saisie/factureProFormAcha.model';
import { Utils } from 'src/app/utilitaires/utils';

export interface modelLigneDemandePrix{
  lignesDemandePrix: LigneDemandePrix;
  listArticle: Article[];
  listUniter: Uniter[];
  selectedArticl: number;
  selectedUniter: number;
  artii?:Article;

}

export interface selectedCurrentFrsInt{
  selectedFrs: number;
  listFrs: Fournisseur[];
  dateRemis: any | Date;
  choisit: boolean;

}

@Component({
  selector: 'app-demande-prix',
  templateUrl: './demande-prix.component.html',
  styleUrls: ['./demande-prix.component.css']
})
export class DemandePrixComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  //--------Pour les articles-----------
  searchControlArticle: FormControl = new FormControl();
  articleFiltered;

  demandePrixFiltered;

  validateForm: FormGroup;
  validateForm2: FormGroup;
  demandePrixList: DemandePrix[] = [];
  ligneDemandePrixList: LigneDemandePrix[] = [];
  selectedLigneDemandePrixList: LigneDemandePrix[] = [];
  fournisseurList: Fournisseur[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  consulterFrsForDpList: ConsulterFrsForDp[] = [];
  loading: boolean;
  loading2: boolean;
  demandePrix: DemandePrix = null;
  ligneShow: modelLigneDemandePrix[] = [];
  selectedCurrentFrs: ConsulterFrsForDp[] = [];
  selectedCurrentFrsInter: selectedCurrentFrsInt[] = [];
  etatChoix: boolean = false;
  etatChoixConcernedFrs: Fournisseur = null;

  etatVali: boolean = false;

  totaux: number[] = [0, 0, 0];

  bondCommandeToShow;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private demandePrixService: DemandePrixService,
    private ligneDemandePrixService: LigneDemandePrixService,
    private fournisseurService: FournisseurService,
    private consulterFrsForDpService: ConsulterFrsForDpService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private exerciceService: ExerciceService,
    private affectUniterToArticleService: AffectUniterToArticleService,
    private fpfaService: FactureProFormAchaService,
    private ligneCommandeService: LigneCommandeService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {

  }

  ngOnInit(): void {

    this.demandePrixService.getAllDemandePrix().subscribe(
      (data) => {
        this.demandePrixList = [...data];
        this.demandePrixFiltered = this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()));
        console.log(this.demandePrixList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });

    

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

    this.searchControlArticle.valueChanges
    .pipe(debounceTime(200))
    .subscribe(value => {
      this.filerDataArticle(value);
    });

      this.getAllArticle();
      this.getAllUniter();
      this.getAllLigneDemandePrix();
      this.getAllAffecterUniterToArticle();
      this.getAllFournisseur();
      this.getAllConsulterFrsForDp();

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

  getAllArticle(){
    this.articleService.getAllArticle().subscribe(
      (data) => {
        this.articleList = data;
        this.articleFiltered = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllDemandePrix(){
    this.demandePrixService.getAllDemandePrix().subscribe(
      (data) => {
        this.demandePrixList = [...data];
        this.demandePrixFiltered = this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()));
        console.log(this.demandePrixList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllLigneDemandePrix(){
    this.ligneDemandePrixService.getAllLigneDemandePrix().subscribe(
      (data) => {
        this.ligneDemandePrixList = data;
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

  getAllAffecterUniterToArticle(){
    this.affectUniterToArticleService.getAllAffectUniterToArticle().subscribe(
      (data) => {
        this.affectUniterToArticleList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getUniterOfAArticle(id: number): Uniter[]{

    let tab: Uniter[] = [];

    this.affectUniterToArticleList.forEach(element => {
      if(element.article.numArticle == id){
        tab.push(element.uniter);
      }
    });

    return tab;

  }

  getAllFournisseur(){
    this.fournisseurService.list().subscribe(
      (data: any) => {
        this.fournisseurList = data;
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
      return this.demandePrixFiltered = [...this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()))];
    }

    const columns = Object.keys(this.demandePrixList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.demandePrixList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.demandePrixFiltered = rows;
  }

  filerDataArticle(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.articleFiltered = [...this.articleList.sort((a, b) => a.codeArticle.localeCompare(b.codeArticle.valueOf()))];
    }

    const columns = Object.keys(this.articleList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.articleList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.articleFiltered = rows;
  }

  makeForm(demandePrix: DemandePrix): void {
    this.validateForm = this.fb.group({
      idDemandePrix: [demandePrix != null ? demandePrix.idDemandePrix: null],
      dateDemandePrix: [demandePrix != null ? demandePrix.dateDemandePrix.toString().substr(0, 10): null,
      [Validators.required]],
      dateLimiteDemandePrix: [demandePrix != null ? demandePrix.dateLimiteDemandePrix.toString().substr(0, 10) : null],
      designationDemandePrix: [demandePrix != null ? demandePrix.designationDemandePrix : null],
      /*frs: [demandePrix != null ? demandePrix.commande.frs.numFournisseur : null,
        [Validators.required]],
      numComm: [demandePrix != null ? demandePrix.commande.numCommande : null],*/
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (demandePrix?.idDemandePrix !=null){
      this.ligneShow = [];

      for(const ligDp of this.ligneDemandePrixList){
        if(ligDp.demandePrix.idDemandePrix == demandePrix.idDemandePrix){
          this.ligneShow.push({
            lignesDemandePrix: ligDp,
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligDp.article.numArticle),
            selectedArticl: ligDp.article.numArticle,
            selectedUniter: ligDp.uniter ? ligDp.uniter.numUniter : null,
            artii: ligDp.article,

          });
        }
      }

      this.selectedCurrentFrsInter = [];

      for(const ligCons of this.consulterFrsForDpList){
        if(ligCons.demandePrix.idDemandePrix == demandePrix.idDemandePrix){
          this.selectedCurrentFrsInter.push({
            selectedFrs: ligCons.fournisseur.numFournisseur,
            listFrs: this.getNotUsedFrs(),
            dateRemis: moment(ligCons.dateRemise).format('yyyy-MM-DD'),
            choisit: ligCons.choisit,
          });
        }
      }

     // this.calculTotaux();

      this.activeTabsNav = 2;
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);

    this.ligneShow = [];
    this.selectedCurrentFrsInter = [];
    //this.calculTotaux();

  }

  submit(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir le Formulaire convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else if (this.ligneShow.length == 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      const formData = this.validateForm.value;

      const i = this.fournisseurList.findIndex(l => l.numFournisseur == formData.frs);

      if (i > -1) {
        formData.frs = this.fournisseurList[i];
      }
      let lignesDp: LigneDemandePrix[] = [];
      this.ligneShow.forEach((element, inde) => {
        const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);
        const k = element.listUniter.findIndex(l => l.numUniter == element.selectedUniter);

        element.lignesDemandePrix.article = null;
        element.lignesDemandePrix.uniter = null;

        if (j > -1) {
          element.lignesDemandePrix.article = element.listArticle[j];
        }

        if (k > -1) {
          element.lignesDemandePrix.uniter = element.listUniter[k];
        }

        lignesDp.push(element.lignesDemandePrix);

      });

      let frsConsulters: ConsulterFrsForDp[] = [];

      for(const ligInt of this.selectedCurrentFrsInter){
        let fourn: Fournisseur = null;
        const i = ligInt.listFrs.findIndex(l => l.numFournisseur == ligInt.selectedFrs);
        if(i>-1){
          fourn = ligInt.listFrs[i];
        }

        if(ligInt.dateRemis == 'Invalid date') ligInt.dateRemis = null;

        frsConsulters.push(new ConsulterFrsForDp(ligInt.dateRemis, ligInt.choisit, fourn, null));

      }

      const dp = new DemandePrix(formData.idDemandePrix,formData.designationDemandePrix, formData.dateDemandePrix, formData.dateLimiteDemandePrix,
         false, 0, false, this.exerciceService.selectedExo );
         console.log('obj', dp);
        dp.idDemandePrix = formData.idDemandePrix;
      if (formData.idDemandePrix == null) {
        console.log("data", formData);

        this.enregistrerDemandePrix(dp, lignesDp, frsConsulters);
      } else {
        console.log(frsConsulters);
        this.modifieDemandePrix(formData.idDemandePrix,dp, lignesDp, frsConsulters);
        console.log(lignesDp);
      }
    }
  }

  enregistrerDemandePrix(demandePrix: DemandePrix, lignesDpO: LigneDemandePrix[], consulters: ConsulterFrsForDp[]): void {
    this.loading = true;
    console.log('obj', new EncapDemandePrix(demandePrix, lignesDpO, consulters));
    this.demandePrixService.addDemandePrix2(new EncapDemandePrix(demandePrix, lignesDpO, consulters)).subscribe(
      (data) => {

        this.getAllLigneDemandePrix();
        this.getAllFournisseur();
        this.getAllArticle();
        this.getAllLigneDemandePrix();
        this.getAllUniter();
        this.getAllAffecterUniterToArticle();
        this.getAllConsulterFrsForDp();

        this.selectedCurrentFrsInter = [];

        this.demandePrixList.unshift(data.demandePrix);
        this.demandePrixFiltered = [...this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()))];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        this.loading = false;
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        this.loading = false;
      }
    );


  }

  modifieDemandePrix(id: String, demandePrix: DemandePrix, lignesDpl: LigneDemandePrix[], consulters: ConsulterFrsForDp[]): void {
    this.loading = true;
    this.demandePrixService.editDemandePrix2(demandePrix.idDemandePrix.toString(), new EncapDemandePrix(demandePrix, lignesDpl, consulters)).subscribe(
      (data2) => {
        this.getAllLigneDemandePrix();
        this.getAllFournisseur();
        this.getAllArticle();
        this.getAllLigneDemandePrix();
        this.getAllUniter();
        this.getAllAffecterUniterToArticle();
        this.getAllConsulterFrsForDp();

        this.selectedCurrentFrsInter = [];

        console.log(data2);

            const i = this.demandePrixList.findIndex(l => l.idDemandePrix == data2.demandePrix.idDemandePrix);
            if (i > -1) {
              this.demandePrixList[i] = data2.demandePrix;
              this.demandePrixFiltered = [...this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()))];
            }

            this.resetForm();
            this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });

            //basculer vers la tab contenant la liste apres modification
            this.loading = false;
            this.activeTabsNav = 1;

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);

        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        this.loading = false;
      }
    );


  }

  confirm(content, demandePrix: DemandePrix) {
    this.demandePrix = demandePrix;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.demandePrixService.deleteDemandePrix2(demandePrix?.idDemandePrix.toString()).subscribe(
        (data) => {

          console.log(data);
          const i = this.demandePrixList.findIndex(l => l.idDemandePrix == demandePrix.idDemandePrix);
          if (i > -1) {
            this.demandePrixList.splice(i, 1);
            this.demandePrixFiltered = [...this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()))];
          }
          /*setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);*/
          this.resetForm();
          this.toastr.success('Suppression effectué avec succès.', 'Success!', { timeOut: 5000 });
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
          /*setTimeout(() => {
            this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          }, 3000);*/
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  pushALigneComAcha(){
    this.ligneShow.push({
      lignesDemandePrix: new LigneDemandePrix(0,'', '', null, null, null),
      listArticle: this.getNotUsedArticle(),
      listUniter: [],
      selectedArticl: null,
      selectedUniter: null,
    });
  }

  showModalSelectArticle(content){

    this.modalService.open(content,
      {ariaLabelledBy: 'modal-basic-title', centered: true, scrollable: true, size:'lg'})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;


    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
      //this.selectedCurrentFrsInter = [];
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

  getNotUsedFrs(): Fournisseur[]{
    let tab: Fournisseur[] = [];
    this.fournisseurList.forEach(element => {
      let finded: boolean = false;
      for(const lig of this.selectedCurrentFrsInter){
        if(lig.selectedFrs == element.numFournisseur){
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


  popALigneComAcha(inde:number){
    this.ligneShow.splice(inde, 1);
    //this.calculTotaux();
  }

  getUniterOfSelectArt(i: number){
    this.ligneShow[i].listUniter = this.getUniterOfAArticle(this.ligneShow[i].selectedArticl);
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

  onFrsSelectClicked(inde: number){
    let tab: Fournisseur[] = [];
    this.fournisseurList.forEach(element => {
      let finded: boolean = false;
      for(const lig of this.selectedCurrentFrsInter){
        if(lig.selectedFrs == element.numFournisseur &&  this.selectedCurrentFrsInter[inde].selectedFrs != element.numFournisseur){
          finded = true;
          break;
        }
      }
      if(!finded){
        tab.push(element);
      }
    });

    this.selectedCurrentFrsInter[inde].listFrs = tab;

  }

  calculTotaux(){

    /*let tot0: number = 0;
    let tot1: number = 0;
    let tot2: number = 0;*/

    //this.ligneShow.forEach(element => {
     // tot0 += (element.lignesDemandePrix.article.prixVenteArticle * element.lignesDemandePrix.qteLigneDemandePrix);
      //tot1 += (element.lignesDemandePrix.article.prixVenteArticle * element.lignesDemandePrix.qteLigneDemandePrix * element.lignesDemandePrix.tva/100);
      //tot2 += (element.lignesCommande.puLigneCommande * element.lignesCommande.qteLigneCommande * (1+(element.lignesCommande.tva/100)));
   // });

    //this.totaux[0] = tot0;
    //this.totaux[1] = tot1;
    //this.totaux[2] = tot2;

  }

  getTotalTtcOfACom(row: DemandePrix){

    let tot: number = 0;

    this.ligneDemandePrixList.forEach(element => {
      if(element.demandePrix.idDemandePrix == row.idDemandePrix){
        tot += element.article.prixVenteArticle * element.qteLigneDemandePrix;
      }
    });

    return tot;

  }

  addLignByDialog(article:Article){

    if(this.ligneShow.find((l) => l.selectedArticl == article.numArticle)){
      const ind = this.ligneShow.findIndex((l) => l.selectedArticl == article.numArticle);
      if(ind > -1){
        this.ligneShow.splice(ind, 1);
      }      
    }
    else{
      this.pushALigneComAcha();
      this.ligneShow[this.ligneShow.length-1].artii = article;
      this.ligneShow[this.ligneShow.length-1].selectedArticl = article.numArticle;
      this.getUniterOfSelectArt(this.ligneShow.length-1);
    }
    

  }

  isArticleAlreadySelected(article:Article):boolean{
    for(const lig of this.ligneShow){
      if(lig.selectedArticl == article.numArticle){
        return true;
      }
    }
    return false;
  }

  valider(demandePrix: DemandePrix, eta: boolean, content){

    this.etatVali = eta;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;

      demandePrix.valideDemandePrix = eta;

      this.demandePrixService.editDemandePrix(demandePrix.idDemandePrix.toString(), demandePrix).subscribe(
        (data) => {

          demandePrix = data;

          const i = this.demandePrixList.findIndex(l => l.idDemandePrix == demandePrix.idDemandePrix);
              if (i > -1) {
                this.demandePrixList[i] = demandePrix;
                this.demandePrixFiltered = [...this.demandePrixList.sort((a, b) => a.idDemandePrix.localeCompare(b.idDemandePrix.valueOf()))];
              }

              let msg: String = 'Validation'
              if(eta == false) msg = 'Annulation';
              this.toastr.success(msg+' effectuée avec succès.', 'Success', { timeOut: 5000 });

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

  openFrsConsulterDialog(content){
    this.modalService.open(content,
      {ariaLabelledBy: 'modal-basic-title', centered: true, scrollable: true, size:'lg'})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;


    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
      //this.selectedCurrentFrsInter = [];
    });

  }

  onChoiceAFrsClickedDialog(content, inde: number){

    this.etatChoix = this.selectedCurrentFrsInter[inde].choisit;
    console.log(this.selectedCurrentFrsInter[inde].choisit);

    this.etatChoixConcernedFrs = null;
        const i = this.fournisseurList.findIndex(l => l.numFournisseur == this.selectedCurrentFrsInter[inde].selectedFrs);
        if(i>-1){
          this.etatChoixConcernedFrs = this.fournisseurList[i];
        }

    this.modalService.open(content,
      {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {

        this.selectedCurrentFrsInter.forEach((element, ind) => {
          if(inde != ind){
            element.choisit = false;
          }
        });

        console.log(this.selectedCurrentFrsInter[inde].choisit);


    }, (reason) => {
      this.selectedCurrentFrsInter[inde].choisit = !this.selectedCurrentFrsInter[inde].choisit;
      console.log(this.selectedCurrentFrsInter[inde].choisit);
      console.log(`Dismissed with: ${reason}`);
      //this.selectedCurrentFrsInter = [];
    });

  }

  pushALigneFrsConsulter(){
    this.selectedCurrentFrsInter.push({ selectedFrs: null,
    listFrs: this.getNotUsedFrs(), dateRemis: null, choisit: false});
  }

  popALigneFrsConsulter(inde: number){
    this.selectedCurrentFrsInter.splice(inde, 1);
  }

  onGeneratBondClicked(content, row: DemandePrix){
    let frsSelected: boolean = false;
    let selectedFrsCons: ConsulterFrsForDp = null;
    console.log(row);
    console.log(this.consulterFrsForDpList);
    for(const lig of this.consulterFrsForDpList){
      if(lig.demandePrix.idDemandePrix == row.idDemandePrix && lig.choisit == true){
        frsSelected = true;
        selectedFrsCons = lig;
        break;
      }
    }

    if(frsSelected){
      this.fpfaService.getAllFactureProFormAcha().subscribe(
        (data) => {
          let concernedFpfa: FactureProFormAcha = null;
          for(const lig of data){
            if(lig.demandePrix.idDemandePrix == row.idDemandePrix && lig.fournisseur.numFournisseur == selectedFrsCons.fournisseur.numFournisseur){
              concernedFpfa = lig;
              break;
            }
          }

          if(concernedFpfa){

            this.makeForm2(concernedFpfa);

            this.modalService.open(content,
              {ariaLabelledBy: 'modal-basic-title', centered: true, size:'lg'});

          } else {
            this.toastr.error('Veuillez Enrégistrer une Facture Proformat concernant le DP pour le Fournisseur choisi.', 'Erreur !', { timeOut: 5000 });
          }

        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

        }
      );
    }
    else{
      this.toastr.error('Veuillez Choisir un Fournisseur pour cette Demande de Prix d\'abord.', 'Erreur !', { timeOut: 5000 });
    }

  }

  generateBond(modalRef){
    this.loading2 = true;
    if(this.validateForm2.invalid){
      this.toastr.error('Veuillez vous Rassuré que le Formulaire est rempli convenablement d\'abord.', 'Erreur !', { timeOut: 5000 });
      this.loading2 = false;

    }
    else{

      let formData = this.validateForm2.value;

      this.fpfaService.getACommandeOfFpfaById(formData.concernedFpfa.idFpfa,
        new Commande(formData.dateCommande, formData.dateRemise, '', formData.delaiLivraison,
        true, 0, false, false, formData.fournisseur, this.exerciceService.selectedExo)).subscribe(
          (data) => {
            console.log('Commande Obtenue', data);
            this.loading2 = false;
            modalRef.close('Ok');
            this.getAllDemandePrix();
            this.getAllConsulterFrsForDp();
            this.bondCommandeToPdf(data, formData.concernedFpfa, formData.fournisseur);

          },
          (error: HttpErrorResponse) => {
            console.log('Echec status ==> ' + error.status);
            this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

          }
        );
    }
  }

  makeForm2(concernedFpfa: FactureProFormAcha){
    this.validateForm2 = this.fb.group({
      concernedFpfa: concernedFpfa,
      fournisseur: concernedFpfa.fournisseur,
      idDemandePrix: [concernedFpfa != null ? concernedFpfa.demandePrix.idDemandePrix : null,
        [Validators.required]],
      dateCommande: [concernedFpfa.commande != null ? concernedFpfa.commande.dateCommande : null,
        [Validators.required]],
      delaiLivraison: [concernedFpfa.commande != null ? concernedFpfa.commande.delaiLivraison : null,
        [Validators.required]],
      dateRemise: [concernedFpfa.commande != null ? concernedFpfa.commande.dateRemise : null,
        [Validators.required]],
      frs: [concernedFpfa != null ? concernedFpfa.fournisseur?.codeFrs+' - '+concernedFpfa.fournisseur?.identiteFrs : null,
        [Validators.required]],

    });
  }

  bondCommandeToPdf(encapCommannde: EncapCommande, fpfa: FactureProFormAcha, frs: Fournisseur){

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
    doc.text('BOND DE COMMANDE', 67, 43);
    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 1000 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['ACH-ERQ-11-PAL13\n\nBond de Commande faisant Référence à la Demande de Prix N° '+fpfa.demandePrix.idDemandePrix+' du '+moment(fpfa.demandePrix.dateDemandePrix).format('DD/MM/YYYY')]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 0, bottom: 0 },
      columnStyles: {
        0: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Le Fournisseur : '+fpfa.fournisseur.codeFrs+'  '+fpfa.fournisseur.identiteFrs+'\n\nest prié de livrer au PORT AUTONOME les matières et objets désignés ci-après :']
      ]
      ,
    });


    let lignes = [];
    encapCommannde.ligneCommandes.forEach(element => {
      let lig = [];
      lig.push(element.article.codeArticle);
      lig.push(element.article.libArticle);
      lig.push(element.qteLigneCommande);
      lig.push(element.uniter.libUniter);
      lig.push(element.puLigneCommande);
      lig.push(element.tva);
      let ht = element.qteLigneCommande*element.puLigneCommande;
      lig.push(ht*(1+(element.tva/100)));
      lignes.push(lig);

      totalHT+= ht;
      totalTVA+= ht*(element.tva/100);
      totalTTC+= ht*(1+(element.tva/100));

    });
    autoTable(doc, {
      theme: 'grid',
      head: [['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant']],
      headStyles:{
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold' ,
    },
      margin: { top: 10 },
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
        ['Total HT', totalHT],
        ['Total Montant TVA', totalTVA],
        ['Total TTC', totalTTC]
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
        ['Arrêté le présent Bon de Commande à la somme de : '+NumberToLetter(totalTTC)+' Francs CFA']
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, fontStyle: 'bold', halign: 'right' },
      },
      body: [
        ['Délais de Livraison '+encapCommannde.commande.delaiLivraison+'  Jour(s)',
        'Lomé, le '+moment(Date.now()).format('DD/MM/YYYY')],
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
        2: { textColor: 0, fontStyle: 'bold', halign: 'left' },
      },
      body: [
        ['Le Directeur Général\n\n\n\n\n',
        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
        'Le Fournisseur\n\n\n\n\n\t\t\t\t\t\t\t\t\t\t\t\t']
      ]
      ,
    });

    doc.output('dataurlnewwindow');

  }

  openPdfToPrint(element: DemandePrix){


    const doc = new jsPDF();
    let listFrs : Fournisseur[] = [];
    this.consulterFrsForDpList.forEach(element3 => {
      if(element3.demandePrix.idDemandePrix == element.idDemandePrix){
        listFrs.push(element3.fournisseur);
      }
    });

    let lignes = [];

    this.ligneDemandePrixList.forEach(element2 => {
      if(element.idDemandePrix == element2.demandePrix.idDemandePrix){
        let lig = [];

        lig.push(element2.article.codeArticle);
        lig.push(element2.article.libArticle);
        lig.push('');
        lig.push(element2.qteLigneDemandePrix);
        lig.push(element2.uniter.libUniter);
        lig.push('');
        lig.push('');

        lignes.push(lig);

      }
    });

    listFrs.forEach((element3, ind) => {

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
      doc.text('DEMANDE DE PRIX', 67, 43);
      doc.setFontSize(14);
      doc.text('Demande de Prix N° '+element.idDemandePrix+' | AP/ST', 95, 55);
      doc.setFontSize(18);
      doc.text('A', 95, 65);
      autoTable(doc, {
        startY:68,
        theme: 'plain',
        margin: { left: 94 },
        columnStyles: {
          0: { textColor: 0, fontStyle: 'bold', halign: 'left', fontSize:12 },
        },
        body: [
          [''+element3.identiteFrs]
        ]
        ,
      });

      autoTable(doc, {

        theme: 'plain',
        margin: { top: 20 },
        columnStyles: {
          0: { textColor: 0, halign: 'left', fontSize:11 },
        },
        body: [
          ["Vous êtes prié de faire parvenir au Port Autonome de Lomé, sous pli fermé et au plus tard le "+moment(element.dateLimiteDemandePrix).format('DD/MM/yyyy')+" votre offre de prix relative aux articles suivants :"]
        ]
        ,
      });

      autoTable(doc, {
        startY: 100,
        theme: 'grid',
        head: [['Article', 'Désignation', 'Réf Fourn', 'Quantité', 'Unité', 'PU HT', 'TVA(%)']],
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
        margin: { top: 100 },
        columnStyles: {
          0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
          2: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        },
        body: [
          ['Le Directeur Général\n\n\n\n\n',
          '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
          'Le Fournisseur\n\n\n\n\n\t\t\t\t\t\t\t\t\t\t\t\t']
        ]
        ,
      });


      autoTable(doc, {
        theme: 'plain',
        margin: { top: 20 },
        columnStyles: {
          0: { textColor: 0, fontStyle: 'bold', halign: 'right', fontSize:8.5 },
          1: { textColor: 0, halign: 'left', fontSize:8.5 },
        },
        body: [
          ['NB :', "1) Nous retrouner l'original de cette demande de prix"],
          ['', "2) Nous répondre par une facture proforma sur votre papier en-tête en précisant le N° de la demande"],
          ['', "3) Indiquer le taux de la TVA sur la facture proforma"],
          ['', "4) Sous pli fermé obligatoire, les plis doivent être déposés au service APPRO-STOCK du PORT AUTONOME DE LOME"],
          ['', "5) Préciser sur l'enveloppe, le delai de retour du pli et le N° de la demande de prix"],
          ['', "6) Ne pas mettre sur l'enveloppe un signe quelconque qui permettrait de vous identifier"],
          ['', "7) Préciser sur la facture proforma les montants HTVA et TTC"]
        ]
        ,
      });


      if(ind != listFrs.length - 1){
        doc.addPage();
      }

    });


    doc.output('dataurlnewwindow');

  }


}
