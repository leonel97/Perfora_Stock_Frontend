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

export interface modelLigneDemandePrix{
  lignesDemandePrix: LigneDemandePrix;
  listArticle: Article[];
  listUniter: Uniter[];
  selectedArticl: number;
  selectedUniter: number;

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
  demandePrixList: DemandePrix[] = [];
  ligneDemandePrixList: LigneDemandePrix[] = [];
  selectedLigneDemandePrixList: LigneDemandePrix[] = [];
  fournisseurList: Fournisseur[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  loading: boolean;
  demandePrix: DemandePrix = null;
  ligneShow: modelLigneDemandePrix[] = [];

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private demandePrixService: DemandePrixService,
    private ligneDemandePrixService: LigneDemandePrixService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private exerciceService: ExerciceService,
    private affectUniterToArticleService: AffectUniterToArticleService,
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
      dateDemandePrix: [demandePrix != null ? demandePrix.dateDemandePrix: null,
      [Validators.required]],
      dateLimiteDemandePrix: [demandePrix != null ? demandePrix.dateLimiteDemandePrix : null],
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

      const dp = new DemandePrix(formData.idDemandePrix,formData.designationDemandePrix, formData.dateDemandePrix, formData.dateLimiteDemandePrix,
         false, 0, false, this.exerciceService.selectedExo );
        dp.idDemandePrix = formData.idDemandePrix;
      if (formData.idDemandePrix == null) {
        console.log("data", formData);

        this.enregistrerDemandePrix(dp, lignesDp);
      } else {
        this.modifieDemandePrix(formData.idDemandePrix,dp, lignesDp);
      }
    }
  }

  enregistrerDemandePrix(demandePrix: DemandePrix, lignesDpO: LigneDemandePrix[]): void {
    this.loading = true;
    console.log('obj', new EncapDemandePrix(demandePrix, lignesDpO));
    this.demandePrixService.addDemandePrix2(new EncapDemandePrix(demandePrix, lignesDpO)).subscribe(
      (data) => {
        this.getAllLigneDemandePrix();
        this.demandePrixList.unshift(demandePrix);
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

  modifieDemandePrix(id: String, demandePrix: DemandePrix, lignesDpl: LigneDemandePrix[]): void {
    this.loading = true;
    this.demandePrixService.editDemandePrix2(demandePrix.idDemandePrix.toString(), new EncapDemandePrix(demandePrix, lignesDpl)).subscribe(
      (data2) => {
        this.getAllLigneDemandePrix();

        this.demandePrixService.editDemandePrix(id, new DemandePrix('','',new Date(),new Date(),false,0,false,this.exerciceService.selectedExo)).subscribe(
          (data) => {
            console.log(data);

            const i = this.demandePrixList.findIndex(l => l.idDemandePrix == data.idDemandePrix);
            if (i > -1) {
              this.demandePrixList[i] = data;
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
          });


      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);

        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

      }
    );


  }

  confirm(content, demandePrix: DemandePrix) {
    this.demandePrix = demandePrix;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.demandePrixService.deleteDemandePrix(demandePrix?.idDemandePrix.toString()).subscribe(
        (data) => {

          this.demandePrixService.deleteDemandePrix2(demandePrix.idDemandePrix.toString()).subscribe(
            (data) => {

            },
            (error: HttpErrorResponse) => {
              console.log('Echec status ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );

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

}
