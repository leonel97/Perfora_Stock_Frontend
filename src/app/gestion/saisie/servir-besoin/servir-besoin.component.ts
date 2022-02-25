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
import { Approvisionnement } from 'src/app/models/gestion/saisie/approvisionnement.model';
import { DemandeApprovisionnement } from 'src/app/models/gestion/saisie/demandeApprovisionnement.model';
import { EncapApprovisionnement } from 'src/app/models/gestion/saisie/encapsuleur-model/encapApprovisionnement.model';
import { LigneAppro } from 'src/app/models/gestion/saisie/ligneAppro.model';
import { LigneDemandeAppro } from 'src/app/models/gestion/saisie/ligneDemandeAppro.model';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { ApprovisionnementService } from 'src/app/services/gestion/saisie/approvisionnement.service';
import { DemandeApproService } from 'src/app/services/gestion/saisie/demande-appro.service';
import { LigneApproService } from 'src/app/services/gestion/saisie/ligne-appro.service';
import { LigneDemandeApproService } from 'src/app/services/gestion/saisie/ligne-demande-appro.service';
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
import { SalEncapGene } from 'src/app/models/gestion/saisie/encapsuleur-model/salEncapGene.model';


export interface modelLigneAppro{
  ligneAppro: LigneAppro;
  listArticle: Article[];
  uniter: Uniter;
  selectedArticl: number;
  selectedUniter: number;
  coutUnitaire: number;
  concernedLigneDa: LigneDemandeAppro;
  concernedStocker: Stocker;
  qteRest: number;

}


@Component({
  selector: 'app-servir-besoin',
  templateUrl: './servir-besoin.component.html',
  styleUrls: ['./servir-besoin.component.css']
})
export class ServirBesoinComponent  implements OnInit {

  listNbrElmtByPage = [2, 4, 10, 25, 50, 100];
  nbrElmtByPage: number = 2;

  searchControl: FormControl = new FormControl();
  approFiltered;

  searchAffForm: FormGroup;
  validateForm: FormGroup;
  approList: Approvisionnement[] = [];
  approListByExo: Approvisionnement[] = [];
  ligneApproList: LigneAppro[] = [];
  ligneDemandeApproList: LigneDemandeAppro[] = [];
  demandeApproList: DemandeApprovisionnement[] = [];
  selectedLigneApproList: LigneAppro[] = [];
  magasinList: Magasin[] = [];
  magasinList2: Magasin[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  stockerList: Stocker[] = [];
  loading: boolean;
  appro: Approvisionnement = null;
  ligneShow: modelLigneAppro[] = [];
  detailView: boolean = false;

  etatVali: boolean = false;
  etatVali2: boolean = false;

  totaux: number[] = [0, 0, 0];

  userMag: Magasin[] = [];

  //pour les tabs navs
  activeTabsNav;
  //end

  inventaireEnCours: boolean = true;

  constructor(
    private approService: ApprovisionnementService,
    private ligneApproService: LigneApproService,
    private ligneDemandeApproService: LigneDemandeApproService,
    private magasinService: MagasinService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private demandeApproService: DemandeApproService,
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

    /*this.approService.getAllAppro().subscribe(
      (data) => {
        this.approList = [...data];
        this.approFiltered = this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()));
        console.log(this.approList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });*/

    this.userMag = SalTools.getConnectedUser().magasins;

    this.getAllApproByCodeExoSelected();

    this.searchAffForm = this.fb.group({
      radioAffich: [0, [Validators.required]],

    });

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

      //this.getAllArticle();
      this.getAllUniter();
      this.getAllLigneAppro();
      this.getAllDemandeAppro();
      this.getAllLigneDemandeAppro();
      this.getAllMagasin();
      this.getAllStocker();
      this.getAllInventaire();
      
      this.magasinList2 = SalTools.getConnectedUser().magasins;

  }

  isAllowedMagasin(ligne:Approvisionnement):boolean{
    let b:boolean = false;
    for (const mag of this.magasinList2) {
      if(ligne.magasin.numMagasin == mag.numMagasin){
        b = true;
        break;
      }
    }
    return b;
  }

  getAllApproByCodeExoSelected(){
    this.approService.getApprovisionnementByCodeExo(this.exerciceService.selectedExo.codeExercice).subscribe(
      (data) => {

        this.approListByExo = [...data.filter( l => this.isAllowedMagasin(l))];
        this.approFiltered = this.approListByExo.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()));

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
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

  getAllAppro(){
    this.approService.getAllAppro().subscribe(
      (data) => {
        this.approList = [...data.filter( l => this.isAllowedMagasin(l))];
        //this.approFiltered = this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()));
        //console.log(this.approList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllLigneAppro(){
    this.ligneApproService.getAllLigneAppro().subscribe(
      (data) => {
        this.ligneApproList = data;
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

  getAllLigneDemandeAppro(){
    this.ligneDemandeApproService.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeApproList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getAllDemandeAppro(){
    this.demandeApproService.getAllDemandeAppro().subscribe(
      (data) => {
        data.sort((a, b) => a.numDA.localeCompare(b.numDA.toString()));
        this.demandeApproList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getQteRestanteOfALigneDa(ligne: LigneDemandeAppro) : number{
    let qteLivrer: number = 0;

    this.ligneApproList.forEach(element => {
      if(element.ligneDA.idLigneDA == ligne.idLigneDA){
        qteLivrer += element.quantiteLigneAppro;
      }
    });

    return ligne.quantiteDemandee - qteLivrer;

  }

  searchAffElmtChanged(){
    //this.filerData(this.searchControl.value);
    if(this.searchAffForm.value['radioAffich'] == 0){

      this.approFiltered = [...this.approFiltered];
    }
    else if(this.searchAffForm.value['radioAffich'] == 1){
      this.approFiltered = [...this.approFiltered.filter(l => (l.valideAppro1 && !l.valideAppro))];
    }
    else if(this.searchAffForm.value['radioAffich'] == 2){
      this.approFiltered = [...this.approFiltered.filter(l => !l.valideAppro1)];
    }
    else {
      this.approFiltered = [...this.approFiltered.filter(l => l.valideAppro)];
    }
    //console.log('sall',this.searchAffForm.value['radioAffich']); 
    
  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      this.approFiltered = [...this.approListByExo.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()))];
      this.searchAffElmtChanged();
      return;
    }

    const columns = Object.keys(this.approListByExo[0]);
    
    if (!columns.length) {
      return;
    }

    let rows = this.approListByExo.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }



    });


    if(rows.length == 0){
      rows = this.approListByExo.filter((l) => this.subSearch(l));
    }

    this.approFiltered = rows;
    this.searchAffElmtChanged();
  }

  subSearch(appro: Approvisionnement){
    let textee: String = this.searchControl.value;
    const columns2 = Object.keys(this.ligneApproList[0].ligneDA.appro);

    let da = this.getDemandeApproOfAAppro(appro);

    for (let i = 0; i <= columns2.length; i++) {
      const column = columns2[i];
      if (da[column] && da[column].toString().toLowerCase().indexOf(textee.toLowerCase()) > -1) {
        return true;
      }
    }

    return false;

  }

  makeForm(appro: Approvisionnement): void {
    this.validateForm = this.fb.group({
      numAppro: [appro != null ? appro.numAppro: null],
      dateAppro: [appro != null ? appro.dateAppro: moment(Date.now()).format('yyyy-MM-DD'),
      [Validators.required]],
      description: [appro != null ? appro.descriptionAppro : null],
      magasin: [appro != null ? appro.magasin.numMagasin : null,
        [Validators.required]],
      valideAppro: [appro != null ? appro.valideAppro : false],
      numDA: [appro != null ? this.getDemandeApproOfAAppro(appro)?.numDA : null,
        [Validators.required]],
      notProcessAgain: [appro != null ? this.getDemandeApproOfAAppro(appro)?.notProcessAgain : false],

    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (appro?.numAppro !=null){

      this.ligneApproService.getLignesApproByCodeAppro( appro.numAppro).subscribe(
        (ligneApproList) => {
          this.ligneShow = [];
          if(this.detailView == true) this.detailView = false;
          for(const ligCo of ligneApproList){
            
              this.ligneShow.push({
                ligneAppro: ligCo,
                listArticle: this.getNotUsedArticle(),
                uniter: ligCo.ligneDA.uniter,
                selectedArticl: ligCo.ligneDA.article.numArticle,
                selectedUniter: ligCo.ligneDA.uniter ? ligCo.ligneDA.uniter.numUniter : null,
                coutUnitaire: ligCo.puligneAppro,
                concernedLigneDa: ligCo.ligneDA,
                concernedStocker: this.getStockerByArtiAndMagasin(ligCo.ligneDA.article, appro.magasin),
                qteRest: this.getQteRestanteOfALigneDa(ligCo.ligneDA) + ligCo.quantiteLigneAppro,
    
              });
            
          }
    
          this.getInfosOnDaSelected(true);
          this.getInfosOnMagasinSelected();
    
          this.calculTotaux();
    
          this.activeTabsNav = 2;
        }, 
        (error: HttpErrorResponse) => {

          console.log('Echec status ==> '+error.status);

        }
      );


    }
  }

  getStockerByArtiAndMagasin(article: Article, magasin: Magasin): Stocker{

    for(const sto of this.stockerList){
      if(article.numArticle == sto.article.numArticle && magasin.numMagasin == sto.magasin.numMagasin){
        return sto;
      }
    }

    return new Stocker(0, 0, 0, 0, article, magasin);

  }

  getInfosOnDaSelected(modif:boolean = false){
    if(!modif){
      this.emptyLigneShow();
      this.getNotUsedArticle();
    } 
    let articlesOfDa: Article[] = [];    
    for(const lig1 of this.ligneDemandeApproList){
      if(lig1.appro.numDA == this.validateForm.value.numDA){
        articlesOfDa.push(lig1.article);
      }
    }

    this.articleList = articlesOfDa;

    let magasinsOfDa: Magasin[] = [];

    for (const artt of articlesOfDa) {
      if(!(magasinsOfDa.find(l => l.numMagasin == artt.famille?.magasin?.numMagasin)) && SalTools.getConnectedUser().magasins.find(l => l.numMagasin == artt.famille?.magasin?.numMagasin)){
        magasinsOfDa.push(artt.famille?.magasin);
      }
    }

    magasinsOfDa.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()));

    this.magasinList2 = magasinsOfDa;

  }

  emptyLigneShow(){
    this.getAllStocker();
    this.ligneShow = [];
  }

  getInfosOnMagasinSelected(){

    for(const arti of this.articleList){
      if(arti.famille.magasin.numMagasin != this.validateForm.value.magasin){
        const i = this.articleList.findIndex(l => l.numArticle == arti.numArticle);
        if (i > -1) {
          this.articleList.splice(i, 1);
        }
      }
    }

    this.getAllStocker();

  }

  getLigneDaBySelectedNumArti(numArt:number, idDa:String): LigneDemandeAppro{
    for(const lig1 of this.ligneDemandeApproList){
      if(lig1.article.numArticle == numArt && lig1.appro.numDA == idDa){
        return lig1;
      }
    }

    return null;
  }

  getInfosOfSelectArt(ind:number){
    
    
    this.ligneShow[ind].concernedLigneDa = this.getLigneDaBySelectedNumArti(this.ligneShow[ind].selectedArticl, this.validateForm.value.numDA);
    let mag: Magasin = new Magasin('', '');
    const i = this.magasinList.findIndex(l => l.numMagasin == this.validateForm.value.magasin);
    if(i > -1){
      mag = this.magasinList[i];
    }

    let salEnc = new SalEncapGene();

    salEnc.article = this.ligneShow[ind].concernedLigneDa.article;
    salEnc.magasin = mag;

    this.stockerService.getAStockerByArticleAndMagasin(salEnc).subscribe(
      (data) => {
        this.ligneShow[ind].concernedStocker = data;
        this.ligneShow[ind].listArticle = this.getNotUsedArticle();

        this.ligneShow[ind].ligneAppro.quantiteLigneAppro = this.getQteRestanteOfALigneDa(this.ligneShow[ind].concernedLigneDa);
        this.ligneShow[ind].ligneAppro.puligneAppro = this.ligneShow[ind].concernedStocker?.cmup;
        this.ligneShow[ind].qteRest = this.getQteRestanteOfALigneDa(this.ligneShow[ind].concernedLigneDa);
      }, 
      (erreur: HttpErrorResponse) => {

      }
    );


  }

  getDemandeApproOfAAppro(appro: Approvisionnement) : DemandeApprovisionnement{
    for(const lig1 of this.ligneApproList){
      if(lig1.appro.numAppro == appro.numAppro){
        return lig1.ligneDA.appro;
      }
    }
    return null;
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

    for(const lig of this.ligneShow){
      if(lig.concernedStocker?.quantiterStocker < (lig.ligneAppro.quantiteLigneAppro*lig.concernedLigneDa?.uniter.poids)
        || lig.concernedLigneDa?.quantiteDemandee < lig.ligneAppro.quantiteLigneAppro 
        || lig.qteRest < lig.ligneAppro.quantiteLigneAppro || lig.ligneAppro.quantiteLigneAppro <= 0){
        lignShowValid = false;
        break;
      }
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir le Formulaire convenablement.', ' Erreur !', { timeOut: 5000, progressBar:true });
      }, 3000);
    } else if (this.ligneShow.length == 0 || lignShowValid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        if(this.ligneShow.length == 0)
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', { timeOut: 5000, progressBar:true });
        if(lignShowValid == false)
        this.toastr.error('Veuillez Renseigner les Quantités Convenablement.', ' Erreur !', { timeOut: 5000, progressBar:true });

      }, 3000);
    } else if (this.ligneShow[0].concernedLigneDa.appro.dateDA.valueOf() > (new Date(formData.dateAppro)).valueOf()) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('La date de l\'Ordre de Sortie est antérieur à la date de la Demande de besoin.', ' Erreur !', { timeOut: 5000, progressBar:true });

      }, 3000);
    } else {
      

    const i = this.demandeApproList.findIndex(l => l.numDA == formData.numDA);
    if (i > -1) {
      formData.numDA = this.demandeApproList[i];
    }

    const m = this.magasinList.findIndex(l => l.numMagasin == formData.magasin);
    if (m > -1) {
      formData.magasin = this.magasinList[m];
    }
      const approo = new Approvisionnement(formData.numAppro, formData.description, formData.dateAppro,
        formData.valideAppro, 0, this.exerciceService.selectedExo, formData.magasin);


      let lignesAppr: LigneAppro[] = [];
      this.ligneShow.forEach((element, inde) => {
        //const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);

        element.ligneAppro.ligneDA = element.concernedLigneDa;
        
        if(element.qteRest <= element.ligneAppro.quantiteLigneAppro){
          element.ligneAppro.ligneDA.satisfaite = true;
        }
        else {
          element.ligneAppro.ligneDA.satisfaite = false;
        }

        lignesAppr.push(element.ligneAppro);
        

      });

      let demAppr = this.demandeApproList[i];

      demAppr.notProcessAgain = formData.notProcessAgain;

      if (formData.numAppro == null) {
        console.log("data", formData);

        this.enregistrerAppro(approo, lignesAppr, demAppr);
      } else {
        this.modifierAppro(approo, lignesAppr, demAppr);
      }
    }
  }

  enregistrerAppro(appro: Approvisionnement, lignesAppro: LigneAppro[], demAppr: DemandeApprovisionnement): void {
    this.loading = true;
    this.getAllLigneAppro();
    console.log('obj', new EncapApprovisionnement(appro, lignesAppro, demAppr));
    this.approService.addAAppro2(new EncapApprovisionnement(appro, lignesAppro, demAppr)).subscribe(
      (data) => {

        console.log(data);

        this.approListByExo.unshift(data.approvisionnement);
        //this.approFiltered = [...this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()))];
        this.filerData(this.searchControl.value);

        setTimeout(() => {
          this.loading = false;
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', { timeOut: 5000, progressBar:true });
        }, 3000);

        //this.getAllArticle();
        this.getAllUniter();
        this.getAllLigneAppro();
        this.getAllDemandeAppro();
        this.getAllLigneDemandeAppro();
        this.getAllMagasin();
        this.getAllStocker();

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', { timeOut: 5000, progressBar:true });
        }, 3000);
      }
    );

  }

  modifierAppro(appro: Approvisionnement, lignesAppro: LigneAppro[], demAppr: DemandeApprovisionnement): void {
    this.loading = true;
    this.approService.editAAppro2(appro.numAppro, new EncapApprovisionnement(appro, lignesAppro, demAppr)).subscribe(
      (data) => {
        this.getAllLigneAppro();

        console.log(data);
          const i = this.approListByExo.findIndex(l => l.numAppro == data.approvisionnement.numAppro);
          if (i > -1) {
            this.approListByExo[i] = data.approvisionnement;
            //this.approFiltered = [...this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()))];
            this.filerData(this.searchControl.value);
          }
          setTimeout(() => {
            this.loading = false;
            this.activeTabsNav = 1;
            this.resetForm();
            this.toastr.success('Modification effectuée avec succès.', 'Success!', { timeOut: 5000, progressBar:true });
          }, 3000);

          this.getAllArticle();
          this.getAllUniter();
          this.getAllLigneAppro();
          this.getAllDemandeAppro();
          this.getAllLigneDemandeAppro();
          this.getAllMagasin();
          this.getAllStocker();


      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', { timeOut: 5000, progressBar:true });
        }, 3000);


      }
    );


  }

  confirm(content, appro: Approvisionnement) {
    this.appro = appro;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.approService.deleteAAppro2(appro?.numAppro).subscribe(
        (data) => {

          console.log(data);
          const i = this.approListByExo.findIndex(l => l.numAppro == appro.numAppro);
          if (i > -1) {
            this.approListByExo.splice(i, 1);
            //this.approFiltered = [...this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()))];
            this.filerData(this.searchControl.value);
          }
          this.resetForm();
          this.toastr.success('Suppression effectué avec succès.', 'Success!', { timeOut: 5000, progressBar:true });
          this.getAllUniter();
          this.getAllLigneAppro();
          this.getAllDemandeAppro();
          this.getAllLigneDemandeAppro();
          this.getAllMagasin();
          this.getAllStocker();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar:true });

        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  pushALigneAppro(){
    if(this.getNotUsedArticle().length != 0)
    this.ligneShow.push({
      ligneAppro: new LigneAppro(0, 0, null, null),
      listArticle: this.getNotUsedArticle(),
      uniter: null,
      selectedArticl: null,
      selectedUniter: null,
      concernedLigneDa: null,
      coutUnitaire: 0,
      concernedStocker: null,
      qteRest: 0,

    });
    else this.toastr.error('Aucune Ligne Trouvée.', ' Erreur !', {progressBar: true, timeOut: 5000});
  }

  getNotUsedArticle(): Article[]{
    let tab: Article[] = [];
    this.articleList.filter(l => (this.validateForm.value.magasin && l.famille.magasin && l.famille.magasin.numMagasin == this.validateForm.value.magasin)).forEach(element => {
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
    this.articleList.filter(l => (this.validateForm.value.magasin && l.famille.magasin.numMagasin == this.validateForm.value.magasin)).forEach(element => {
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

    this.ligneShow.forEach(element => {
      tot0 += (element.ligneAppro.puligneAppro * element.ligneAppro.quantiteLigneAppro *element.concernedLigneDa?.uniter.poids);

    });

    this.totaux[0] = tot0;
    this.totaux[1] = 0;
    this.totaux[2] = 0;

  }

  getTotalOfAAppro(row: Approvisionnement){

    let tot: number = 0;

    this.ligneApproList.forEach(element => {
      if(element.appro.numAppro == row.numAppro){
        tot += element.puligneAppro * element.quantiteLigneAppro * element.ligneDA.uniter.poids;
      }
    });

    return tot;

  }

  valider1(appro: Approvisionnement, eta: boolean, content){

    appro = {...appro};
    this.inventaireService.getAllInventaire().subscribe(
      (dataInv) => {
        let finded = false;
        for (const element of dataInv) {
          if(element.valideInve == false && element.magasin.numMagasin == appro.magasin.numMagasin){
            finded = true;
          }
        }

        if(finded){
          this.toastr.error('Impossible d\'éffectuer l\'action car un Inventaire est en cours dans ce magasin!', 'Erreur !', { timeOut: 5000, progressBar:true });
          
        }
        else{

          this.clotureService.isPeriodeCloturedByDate(appro.dateAppro).subscribe(
            (data) => {
              if(data == false){
              
                this.etatVali = eta;

                this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
                .result.then((result) => {
                //this.confirmResut = `Closed with: ${result}`;
                
                  
                  appro.valideAppro1 = eta;
            
                  this.approService.editAAppro4(appro.numAppro, appro).subscribe(
                    (data) => {
            
                      const i = this.approListByExo.findIndex(l => l.numAppro == data.numAppro);
                          if (i > -1) {
                            this.approListByExo[i] = data;
                            //this.approFiltered = [...this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()))];
                            this.filerData(this.searchControl.value);
                          }
            
                          if(data.valideAppro1 == appro.valideAppro1){
                            let msg: String = 'Validation'
                            if(eta == false) msg = 'Annulation';
                            this.toastr.success(msg+' effectuée avec succès.', 'Success', { timeOut: 5000, progressBar:true });
                          } else {
                            let msg: String = 'Erreur lors de la Validation de la Consommation Interne'
                            
                            this.toastr.error(msg.valueOf(), 'Erreur !', { timeOut: 5000, progressBar:true });
                          }
            
            
                    },
                    (error: HttpErrorResponse) => {
                      console.log('Echec status ==> ' + error.status);
                      this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar:true });
            
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



      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }

  valider(appro: Approvisionnement, eta: boolean, content){

    appro = {...appro};

    this.inventaireService.getAllInventaire().subscribe(
      (dataInv) => {
        let finded = false;
        for (const element of dataInv) {
          if(element.valideInve == false  && element.magasin.numMagasin == appro.magasin.numMagasin){
            finded = true;
          }
        }

        if(finded){
          this.toastr.error('Impossible d\'éffectuer l\'action car un Inventaire est en cours !', 'Erreur !', { timeOut: 5000, progressBar:true });
          
        }
        else{
    
          this.clotureService.isPeriodeCloturedByDate(appro.dateAppro).subscribe(
            (data) => {
              if(data == false){
               
                this.etatVali2 = eta;
    
                this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
                .result.then((result) => {
                //this.confirmResut = `Closed with: ${result}`;
                
    
                  appro.valideAppro = eta;
            
                  this.approService.editAAppro3(appro.numAppro, appro).subscribe(
                    (data) => {
            
                      const i = this.approListByExo.findIndex(l => l.numAppro == data.numAppro);
                          if (i > -1) {
                            this.approListByExo[i] = data;
                            //this.approFiltered = [...this.approList.sort((a, b) => a.numAppro.localeCompare(b.numAppro.valueOf()))];
                            this.filerData(this.searchControl.value);
                          }
            
                          if(data.valideAppro == appro.valideAppro){
                            let msg: String = 'Sortie'
                            if(eta == false) msg = 'Retour';
                            this.toastr.success(msg+' effectuée avec succès.', 'Success', { timeOut: 5000, progressBar:true });
                          } else {
                            let msg: String = 'Erreur lors de la Sortie de d\'Article du Magasin, la quantité disponible de l\'un des articles dans ce magasin n\'est pas satisfaisante.'
                            if(eta == false) msg = 'Erreur lors du Retour de l\'Article dans le Magasin Annulation';
                            this.toastr.error(msg.valueOf(), 'Erreur !', { timeOut: 5000, progressBar:true });
                          }
            
                          this.getAllArticle();
                          this.getAllUniter();
                          this.getAllLigneAppro();
                          this.getAllDemandeAppro();
                          this.getAllLigneDemandeAppro();
                          this.getAllMagasin();
                          this.getAllStocker();
            
            
                    },
                    (error: HttpErrorResponse) => {
                      console.log('Echec status ==> ' + error.status);
                      this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar:true });
            
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

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );






  }

  openDetail(row){
    this.makeForm(row);
    this.detailView = true;
  }

  closeDetail(){
    this.resetForm();
    this.detailView = false;
  }

  isADemApproSitisfaied(da: DemandeApprovisionnement) : boolean{
    //let concernedCom: Commande = this.getCommandeByNumFille(numFille);

    //if(this.ligneApproList.some( l => l.ligneDA.appro.numDA == da.numDA)) return true; par le dg

    if(da){
      let concerned: boolean = false;
      let finded: boolean = false;

      
      for(const lig of this.ligneDemandeApproList){
 
        if(lig.appro.numDA == da.numDA && this.userMag.find(l => l.numMagasin == lig.article?.famille?.magasin.numMagasin)){
          
          concerned = true;

        }

      }

      if(!concerned) return true;

      for(const lig of this.ligneDemandeApproList){
        if(lig.appro.numDA == da.numDA && lig.satisfaite == false){
          finded = false;
          break;
        }
        else if(lig.appro.numDA == da.numDA){
          finded = true;
        }

      }


      return finded;

    }
    
    return false;

  }

  openPdfToPrint(element: Approvisionnement){


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
    doc.text('ORDRE DE SORTIE', 67, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Ordre de Sortie N° '+element.numAppro+' du '+moment(element.dateAppro).format('DD/MM/YYYY')]
      ]
      ,
    });

    this.ligneApproService.getLignesApproByCodeAppro(element.numAppro).subscribe(
      (ligneApproList) => {
        let lignes = [];
        let demAppr: DemandeApprovisionnement = null;
    
        ligneApproList.forEach(element2 => {
          
            demAppr = element2.ligneDA.appro;
            let lig = [];
            lig.push(element2.ligneDA.article.codeArticle);
            lig.push(element2.ligneDA.article.libArticle);
            lig.push(element2.quantiteLigneAppro);
            lig.push(element2.ligneDA.uniter.libUniter);
            lig.push(this.salToolsService.salRound(element2.puligneAppro*element2.ligneDA.uniter.poids));
            let ht = element2.quantiteLigneAppro*element2.puligneAppro*element2.ligneDA.uniter.poids;
            lig.push(this.salToolsService.salRound(ht));
            lignes.push(lig);
    
            totalTTC+= ht;
          
    
        });
    
        autoTable(doc, {
          theme: 'plain',
          startY:60,
          margin: { right: 50 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
            1: { textColor: 0, halign: 'left' },
          },
          body: [
            ['Réf Demande de Besoins :', ''+demAppr?.numDA],
            ['Centre Demandeur :', demAppr?.service.codeService+' - '+demAppr?.service.libService],
            ['Magasin :', element.magasin.codeMagasin+' - '+element.magasin.libMagasin]
          ]
          ,
        });
    
        
    
        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'Montant']],
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
            ["Arrêté le présent Ordre de Sortie à la Somme de : "+this.salToolsService.salNumberToLetter(this.salToolsService.salRound(totalTTC))+' Francs CFA']
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

  openPdfToPrintTicket(element: Approvisionnement){


    let totalTTC : number = 0;

    const doc = new jsPDF('p', 'mm', [80, 900]);
    
    autoTable(doc, {
      //startY: 0,
      theme: "grid",
      margin: { top: 5, left:5, right:5, bottom:0 },
      columnStyles: {
        0: { textColor: 'black', fontStyle: 'bold', fontSize:7, font: 'Times New Roman', halign: 'center', minCellHeight: 100, cellWidth: 20, },
        1: { textColor: 'blue', fontStyle: 'bold', fontSize: 10, font: 'Times New Roman', halign: 'center', valign: "middle" },
      },
      body: [
        [{content: '\n\n\n\nPORT AUTONOME DE LOME\nLomé Togo',
        rowSpan: 4,}, 
        { content: 'ORDRE DE SORTIE', rowSpan: 4}],
        
      ]
      ,
    });
    
    doc.addImage(Utils.logoUrlData, 'jpeg', 10, 7, 11, 11);
    

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontSize: 8, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Ordre de Sortie N° '+element.numAppro+' du '+moment(element.dateAppro).format('DD/MM/YYYY')]
      ]
      ,
    });

    this.ligneApproService.getLignesApproByCodeAppro(element.numAppro).subscribe(
      (ligneApproList) => {
        let lignes = [];
        let demAppr: DemandeApprovisionnement = null;
    
        ligneApproList.forEach(element2 => {
          
            demAppr = element2.ligneDA.appro;
            let lig = [];
            lig.push(element2.ligneDA.article.codeArticle);
            lig.push(element2.ligneDA.article.libArticle);
            lig.push(element2.quantiteLigneAppro);
            lig.push(element2.ligneDA.uniter.libUniter);
            lig.push(this.salToolsService.salRound(element2.puligneAppro*element2.ligneDA.uniter.poids));
            let ht = element2.quantiteLigneAppro*element2.puligneAppro*element2.ligneDA.uniter.poids;
            lig.push(this.salToolsService.salRound(ht));
            lignes.push(lig);
    
            totalTTC+= ht;
          
    
        });
    
        autoTable(doc, {
          theme: 'plain',
          margin: { left:5, right:5 },
          styles: {fontSize: 7},
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
            1: { textColor: 0, halign: 'left' },
          },
          body: [
            ['Réf Demande de Besoins :', ''+demAppr?.numDA],
            ['Centre Demandeur :', demAppr?.service.codeService+' - '+demAppr?.service.libService],
            ['Magasin :', element.magasin.codeMagasin+' - '+element.magasin.libMagasin]
          ]
          ,
        });
    
        
    
        autoTable(doc, {
          theme: 'grid',
          margin: { left:5, right:5 },
          styles: {fontSize: 6},
          head: [['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'Montant']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
        
          body: lignes
          ,
        });
    
    
        autoTable(doc, {
          theme: 'grid',
          margin: { top: 10, left:13 },
          columnStyles: {
            0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          },
          body: [
            ['Total TTC', this.salToolsService.salRound(totalTTC)]
          ]
          ,
        });
    
        autoTable(doc, {
          theme: 'plain',
          margin: { left:5, right:5 },
          styles: {fontSize: 8},
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
          },
          body: [
            ["Arrêté le présent Ordre de Sortie à la Somme de : "+this.salToolsService.salNumberToLetter(this.salToolsService.salRound(totalTTC))+' Francs CFA']
          ]
          ,
        });
    
        doc.output('dataurlnewwindow');
    
      }, 
      (error: HttpErrorResponse) => {
        console.log('Echec status ==>'+ error.status);
      }
    );


  }

}

