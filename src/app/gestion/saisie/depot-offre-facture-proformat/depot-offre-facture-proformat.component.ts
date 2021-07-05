import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { ConsulterFrsForDp } from 'src/app/models/gestion/saisie/consulterFrsForDp.model';
import { DemandePrix } from 'src/app/models/gestion/saisie/demandPrix.model';
import { EncapFactureProformAchat } from 'src/app/models/gestion/saisie/encapsuleur-model/encapFactureProformAchat.model';
import { FactureProFormAcha } from 'src/app/models/gestion/saisie/factureProFormAcha.model';
import { LigneDemandePrix } from 'src/app/models/gestion/saisie/ligneDemandePrix.model';
import { LigneFactureProFormAchat } from 'src/app/models/gestion/saisie/ligneFactureProFormAchat.model';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { ConsulterFrsForDpService } from 'src/app/services/gestion/saisie/consulter-frs-for-dp.service';
import { DemandePrixService } from 'src/app/services/gestion/saisie/demandePrix.service';
import { FactureProFormAchaService } from 'src/app/services/gestion/saisie/facture-pro-form-acha.service';
import { LigneFactureProFormAchatService } from 'src/app/services/gestion/saisie/ligne-facture-pro-form-achat.service';
import { LigneDemandePrixService } from 'src/app/services/gestion/saisie/ligneDemandePrix.service';

export interface modelLigneFactureProFormAchat{
  lignesFactureProFormAchat: LigneFactureProFormAchat;
  listArticle: Article[];
  concernedLigneDp: LigneDemandePrix;
  selectedArticl: number;

}


@Component({
  selector: 'app-depot-offre-facture-proformat',
  templateUrl: './depot-offre-facture-proformat.component.html',
  styleUrls: ['./depot-offre-facture-proformat.component.css']
})
export class DepotOffreFactureProformatComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  fpfaFiltered;

  validateForm: FormGroup;
  fpfaList: FactureProFormAcha[] = [];
  ligneFpfatList: LigneFactureProFormAchat[] = [];
  ligneDpList: LigneDemandePrix[] = [];
  commandeList: Commande[] = [];
  dpList: DemandePrix[] = [];
  selectedLigneFpfaList: LigneFactureProFormAchat[] = [];
  consulterFrsForDpList: ConsulterFrsForDp[] = [];
  frsList: Fournisseur[] = [];
  articleList: Article[] = [];
  loading: boolean;
  fpfa: FactureProFormAcha = null;
  ligneShow: modelLigneFactureProFormAchat[] = [];
  detailView: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private fpfaService: FactureProFormAchaService,
    private ligneFpfaService: LigneFactureProFormAchatService,
    private ligneDpService: LigneDemandePrixService,
    private frsService: FournisseurService,
    private articleService: ArticleService,
    private commandeService: CommandeService,
    private dpService: DemandePrixService,
    private exerciceService: ExerciceService,
    private consulterFrsForDpService: ConsulterFrsForDpService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.fpfaService.getAllFactureProFormAcha().subscribe(
      (data) => {
        this.fpfaList = [...data];
        this.fpfaFiltered = this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()));
        console.log(this.fpfaList);
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
      this.getAllConsulterFrsForDp();
      this.getAllDemandePrix();
      this.getAllLigneDemandePrix();
      this.getAllLigneFactureProFormAcha();


  }

  getAllDemandePrix(){
    this.dpService.getAllDemandePrix().subscribe(
      (data) => {
        this.dpList = data;
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

  getAllFpfa(){
    this.fpfaService.getAllFactureProFormAcha().subscribe(
      (data) => {
        this.fpfaList = [...data];
        this.fpfaFiltered = this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()));
        console.log(this.fpfaList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllLigneDemandePrix(){
    this.ligneDpService.getAllLigneDemandePrix().subscribe(
      (data) => {
        this.ligneDpList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllLigneFactureProFormAcha(){
    this.ligneFpfaService.getAllLigneFactureProFormAchat().subscribe(
      (data) => {
        this.ligneFpfatList = data;
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
      return this.fpfaFiltered = [...this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()))];
    }

    const columns = Object.keys(this.fpfaList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.fpfaList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.fpfaFiltered = rows;
  }

  makeForm(fpfa: FactureProFormAcha): void {
    this.validateForm = this.fb.group({
      idFpfa: [fpfa != null ? fpfa.idFpfa: null],
      dateFpfa: [fpfa != null ? fpfa.dateFpfa.toString().substr(0, 10) : null,
      [Validators.required]],
      datePriseFpfa: [fpfa != null ? fpfa.datePriseFpfa.toString().substr(0, 10) : null],
      dateDeplisFpfa: [fpfa != null ? fpfa.dateDeplisFpfa.toString().substr(0, 10) : null],
      obserFpfa: [fpfa != null ? fpfa.obserFpfa : null],
      fournisseur: [fpfa != null ? fpfa.fournisseur.numFournisseur : null,
        [Validators.required]],
      valideFpfa: [fpfa != null ? fpfa.valideFpfa : false],
      demandePrix: [fpfa != null ? fpfa.demandePrix.idDemandePrix : null,
        [Validators.required]],
      designationFpfa: [fpfa != null ? fpfa.designationFpfa : null],

    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (fpfa?.idFpfa !=null){
      this.ligneShow = [];

      if(this.detailView == true) this.detailView = false;
      for(const ligCo of this.ligneFpfatList){
        if(ligCo.factureProFormAcha.idFpfa == fpfa.idFpfa){
          this.ligneShow.push({
            lignesFactureProFormAchat: ligCo,
            listArticle: this.getNotUsedArticle(),
            concernedLigneDp: this.getLigneDpBySelectedNumArti(ligCo.article.numArticle),
            selectedArticl: ligCo.article.numArticle,

          });
        }
      }

      this.frsList = this.getFrsOfADpByNumDp(fpfa?.demandePrix.idDemandePrix);

      this.calculTotaux();

      this.activeTabsNav = 2;
    }
  }

  getFrsOfADpByNumDp(numDp: String): Fournisseur[]{
    let fournisseurs: Fournisseur[] = [];

    this.consulterFrsForDpList.forEach(element => {
      if(element.demandePrix.idDemandePrix == numDp){
        fournisseurs.push(element.fournisseur);
      }
    });

    return fournisseurs;

  }

  getInfosOnDpSelected(){
    let articlesOfDp = [];

    for(const lig1 of this.ligneDpList){
      if(lig1.demandePrix.idDemandePrix == this.validateForm.value.demandePrix){
        articlesOfDp.push(lig1.article);
      }
    }

    this.frsList = this.getFrsOfADpByNumDp(this.validateForm.value.demandePrix);

    this.ligneShow = [];

    this.articleList = articlesOfDp;

  }


  getLigneDpBySelectedNumArti(numArt:number): LigneDemandePrix{
    for(const lig1 of this.ligneDpList){
      if(lig1.article.numArticle == numArt && lig1.demandePrix.idDemandePrix == this.validateForm.value.demandePrix){
        return lig1;
      }
    }
    return null;

  }

  getInfosOfSelectArt(ind:number){

    this.ligneShow[ind].concernedLigneDp = this.getLigneDpBySelectedNumArti(this.ligneShow[ind].selectedArticl);

    this.ligneShow[ind].listArticle = this.getNotUsedArticle();

    this.ligneShow[ind].lignesFactureProFormAchat.qteLigneFpfa = this.ligneShow[ind]?.concernedLigneDp?.qteLigneDemandePrix;


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

    const i = this.dpList.findIndex(l => l.idDemandePrix == formData.demandePrix);
    if (i > -1) {
      formData.demandePrix = this.dpList[i];
    }

    const m = this.frsList.findIndex(l => l.numFournisseur == formData.fournisseur);
    if (m > -1) {
      formData.fournisseur = this.frsList[m];
    }

      const factu = new FactureProFormAcha(formData.idFpfa, formData.dateFpfa, formData.designationFpfa, false,
        formData.datePriseFpfa, formData.dateDeplisFpfa, formData.obserFpfa, 0, formData.fournisseur,
        this.exerciceService.selectedExo, null, formData.demandePrix);


      let lignesFpfa: LigneFactureProFormAchat[] = [];
      this.ligneShow.forEach((element, inde) => {
        const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);

        element.lignesFactureProFormAchat.article = element.listArticle[j];
        element.lignesFactureProFormAchat.uniter = element.concernedLigneDp.uniter;

        lignesFpfa.push(element.lignesFactureProFormAchat);

      });

      if (formData.idFpfa == null) {
        this.enregistrerFactureProFormAcha(factu, lignesFpfa);
      } else {
        this.modifierRecept(factu, lignesFpfa);
      }
    }
  }

  enregistrerFactureProFormAcha(fpfa: FactureProFormAcha, lignesFpfa: LigneFactureProFormAchat[]): void {
    this.loading = true;

    console.log('obj', new EncapFactureProformAchat(fpfa, lignesFpfa));
    this.fpfaService.addAFactureProFormAcha2(new EncapFactureProformAchat(fpfa, lignesFpfa)).subscribe(
      (data) => {
        this.getAllLigneFactureProFormAcha();
        this.getAllArticle();
        this.getAllConsulterFrsForDp();
        this.getAllDemandePrix();
        this.getAllLigneDemandePrix();

        this.fpfaList.unshift(data.factureProFormAcha);
        this.fpfaFiltered = [...this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()))];
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

  modifierRecept(fpfa: FactureProFormAcha, lignesFpfa: LigneFactureProFormAchat[]): void {
    this.loading = true;
    this.fpfaService.editAFactureProFormAcha2(fpfa.idFpfa, new EncapFactureProformAchat(fpfa, lignesFpfa)).subscribe(
      (data) => {

        this.getAllLigneFactureProFormAcha();
        this.getAllArticle();
        this.getAllConsulterFrsForDp();
        this.getAllDemandePrix();
        this.getAllLigneDemandePrix();

        console.log(data);
          const i = this.fpfaList.findIndex(l => l.idFpfa == data.factureProFormAcha.idFpfa);
          if (i > -1) {
            this.fpfaList[i] = data.factureProFormAcha;
            this.fpfaFiltered = [...this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()))];
          }
          this.resetForm();
          this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });

          //basculer vers la tab contenant la liste apres modification
          this.loading = false;
          this.activeTabsNav = 1;


      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status, error);
        this.loading = false;
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

      }
    );


  }

  confirm(content, fpfa: FactureProFormAcha) {
    this.fpfa = fpfa;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.fpfaService.deleteAFactureProFormAcha2(fpfa?.idFpfa).subscribe(
        (data) => {

          this.getAllLigneFactureProFormAcha();
          this.getAllArticle();
          this.getAllConsulterFrsForDp();
          this.getAllDemandePrix();
          this.getAllLigneDemandePrix();

          console.log(data);
          const i = this.fpfaList.findIndex(l => l.idFpfa == fpfa.idFpfa);
          if (i > -1) {
            this.fpfaList.splice(i, 1);
            this.fpfaFiltered = [...this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()))];
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

  pushALigneFactureProFormAcha(){
    this.ligneShow.push({
      lignesFactureProFormAchat: new LigneFactureProFormAchat(0, 0, '', 0, 0, 0, 0, null, null, null),
      listArticle: this.getNotUsedArticle(),
      selectedArticl: null,
      concernedLigneDp: null,

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
      tot0 += (element.lignesFactureProFormAchat.prixUnitHtLigneFpfa * element.lignesFactureProFormAchat.qteLigneFpfa);
      tot1 += (element.lignesFactureProFormAchat.prixUnitHtLigneFpfa * element.lignesFactureProFormAchat.qteLigneFpfa * element.lignesFactureProFormAchat.tauxTvaLigneFpfa/100);
      tot2 += (element.lignesFactureProFormAchat.prixUnitHtLigneFpfa * element.lignesFactureProFormAchat.qteLigneFpfa * (1+(element.lignesFactureProFormAchat.tauxTvaLigneFpfa/100)));

    });

    this.totaux[0] = tot0;
    this.totaux[1] = tot1;
    this.totaux[2] = tot2;

  }

  getTotalOfAFpfa(row: FactureProFormAcha){

    let tot: number = 0;

    this.ligneFpfatList.forEach(element => {
      if(element.factureProFormAcha.idFpfa == row.idFpfa){
        tot += element.prixUnitHtLigneFpfa * element.qteLigneFpfa * (1+(element.tauxTvaLigneFpfa/100));
      }
    });

    return tot;

  }

  valider(fpfa: FactureProFormAcha, eta: boolean){

    fpfa.valideFpfa = eta;

    this.fpfaService.editAFactureProFormAcha(fpfa.idFpfa, fpfa).subscribe(
      (data) => {

        this.getAllLigneFactureProFormAcha();
        this.getAllArticle();
        this.getAllConsulterFrsForDp();
        this.getAllDemandePrix();
        this.getAllLigneDemandePrix();

        const i = this.fpfaList.findIndex(l => l.idFpfa == data.idFpfa);
            if (i > -1) {
              this.fpfaList[i] = data;
              this.fpfaFiltered = [...this.fpfaList.sort((a, b) => a.idFpfa.localeCompare(b.idFpfa.valueOf()))];
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

  openDetail(row){
    this.makeForm(row);
    this.detailView = true;
  }

  closeDetail(){
    this.resetForm();
    this.detailView = false;
  }

}


