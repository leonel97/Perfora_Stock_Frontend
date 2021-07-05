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

export interface modelLigneDemandePrix{
  lignesDemandePrix: LigneDemandePrix;
  listArticle: Article[];
  listUniter: Uniter[];
  selectedArticl: number;
  selectedUniter: number;

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

  makeForm(demandePrix: DemandePrix): void {
    this.validateForm = this.fb.group({
      idDemandePrix: [demandePrix != null ? demandePrix.idDemandePrix: null],
      dateDemandePrix: [demandePrix != null ? demandePrix.dateDemandePrix.toString().substr(0, 10): null,
      [Validators.required]],
      dateLimiteDemandePrix: [demandePrix != null ? demandePrix.dateLimiteDemandePrix.toString().substr(0, 10) : null],
      designationDemandePrix: [demandePrix != null ? demandePrix.designationDemandePrix.toString().substr(0, 10) : null],
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
        this.modifieDemandePrix(formData.idDemandePrix,dp, lignesDp, frsConsulters);
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

  valider(demandePrix: DemandePrix, eta: boolean){

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

    const doc = new jsPDF();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
    doc.setFontSize(25);
    doc.text('RAPPORT', 59, 30);
    let lignes = [];
  lignes.push(['Salima', 'AGONHE']);
    autoTable(doc, {
      theme: 'grid',
      head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant', 'Plage(s)']],
      headStyles:{
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold' ,
    },
      margin: { top: 100 },
      body: lignes
      ,
    });
    doc.output('dataurlnewwindow');

  }


}
