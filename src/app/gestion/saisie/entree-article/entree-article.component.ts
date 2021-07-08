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
import { EncapReception } from 'src/app/models/gestion/saisie/encapsuleur-model/encapReception.model';
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
import { LettreCommandeService } from 'src/app/services/gestion/saisie/lettre-commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { LigneReceptionService } from 'src/app/services/gestion/saisie/ligne-reception.service';
import { ReceptionService } from 'src/app/services/gestion/saisie/reception.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';

export interface modelLigneRecept{
  ligneReception: LigneReception;
  listArticle: Article[];
  uniter: Uniter;
  selectedArticl: number;
  selectedUniter: number;
  prixUnitaire: number;
  concernedLigneCom: LigneCommande;
  concernedStocker: Stocker;
  qteRest?: number;

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
  ligneReceptList: LigneReception[] = [];
  ligneCommandeList: LigneCommande[] = [];
  commandeList: Commande[] = [];
  commandeAchaList: CommandeAchat[] = [];
  appelOffreList: AppelOffre[] = [];
  bondTravailList: BondTravail[] = [];
  lettreCommandeList: LettreCommande[] = [];
  selectedLigneReceptList: LigneReception[] = [];
  magasinList: Magasin[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  stockerList: Stocker[] = [];
  loading: boolean;
  reception: Reception = null;
  ligneShow: modelLigneRecept[] = [];
  detailView: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

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
    private exerciceService: ExerciceService,
    private stockerService: StockerService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.receptionService.getAllReception().subscribe(
      (data) => {
        this.receptionList = [...data];
        this.receptionFiltered = this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()));
        console.log(this.receptionList);
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
      this.getAllMagasin();
      this.getAllStocker();
      this.getAllAppelOffre();
      this.getAllBondTravail();
      this.getAllCommandeAchat();
      this.getAllLettreCommande();
      this.getAllLigneCommande();
      this.getAllLigneReception();

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
        this.receptionList = [...data];
        this.receptionFiltered = this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()));
        console.log(this.receptionList);
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
      return this.receptionFiltered = [...this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
    }

    const columns = Object.keys(this.receptionList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.receptionList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.receptionFiltered = rows;
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
      this.ligneShow = [];
      //console.log(this.validateForm.value, reception.dateReception);
      if(this.detailView == true) this.detailView = false;
      for(const ligCo of this.ligneReceptList){
        if(ligCo.reception.numReception == reception.numReception){
          this.ligneShow.push({
            ligneReception: ligCo,
            listArticle: this.getNotUsedArticle(),
            uniter: ligCo.ligneCommande.uniter,
            selectedArticl: ligCo.ligneCommande.article.numArticle,
            selectedUniter: ligCo.ligneCommande.uniter ? ligCo.ligneCommande.uniter.numUniter : null,
            prixUnitaire: ligCo.puLigneReception,
            concernedLigneCom: ligCo.ligneCommande,
            concernedStocker: this.getStockerByArtiAndMagasin(ligCo.ligneCommande.article, reception.magasin),

          });
        }
      }

      this.calculTotaux();

      this.activeTabsNav = 2;
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
      if(arti.famille.magasin.numMagasin != this.validateForm.value.magasin){
        const i = this.articleList.findIndex(l => l.numArticle == arti.numArticle);
        if (i > -1) {
          this.articleList.splice(i, 1);
        }
      }
    }

    console.log(this.validateForm.value.numComm, this.validateForm.value.magasin);

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

    const i = this.commandeList.findIndex(l => l.numCommande == formData.numComm);
    if (i > -1) {
      formData.numDA = this.commandeList[i];
    }

    const m = this.magasinList.findIndex(l => l.numMagasin == formData.magasin);
    if (m > -1) {
      formData.magasin = this.magasinList[m];
    }

    /*
    numReception: [reception != null ? reception.numReception: null],
      dateReception: [reception != null ? reception.dateReception: null,
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
    */

      const recept = new Reception(formData.numReception, formData.observation, formData.dateReception,
        false, 0, formData.description, formData.refBordLivraiRecept, this.exerciceService.selectedExo,
        formData.magasin);


      let lignesRecept: LigneReception[] = [];
      this.ligneShow.forEach((element, inde) => {
        const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);

        element.ligneReception.ligneCommande = element.concernedLigneCom;
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
        console.log(data);

        this.receptionList.unshift(data.reception);
        this.receptionFiltered = [...this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
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

        console.log(data);
          const i = this.receptionList.findIndex(l => l.numReception == data.reception.numReception);
          if (i > -1) {
            this.receptionList[i] = data.reception;
            this.receptionFiltered = [...this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
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

          console.log(data);
          const i = this.receptionList.findIndex(l => l.numReception == reception.numReception);
          if (i > -1) {
            this.receptionList.splice(i, 1);
            this.receptionFiltered = [...this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
          }
          this.resetForm();
          this.toastr.success('Suppression effectué avec succès.', 'Success!', { timeOut: 5000 });
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

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

  valider(reception: Reception, eta: boolean){

    reception.valideRecep = eta;

    this.receptionService.editAReception3(reception.numReception, reception).subscribe(
      (data) => {

        const i = this.receptionList.findIndex(l => l.numReception == data.numReception);
            if (i > -1) {
              this.receptionList[i] = data;
              this.receptionFiltered = [...this.receptionList.sort((a, b) => a.numReception.localeCompare(b.numReception.valueOf()))];
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

  }

  openDetail(row){
    this.makeForm(row);
    this.detailView = true;
  }

  closeDetail(){
    this.resetForm();
    this.detailView = false;
  }

}


