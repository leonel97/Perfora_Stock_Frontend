import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { CentreConsommation } from 'src/app/models/gestion/definition/centreConsommation';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { DemandeApprovisionnement } from 'src/app/models/gestion/saisie/demandeApprovisionnement.model';
import { EncapDemandeAppro } from 'src/app/models/gestion/saisie/encapsuleur-model/encapDemandeAppro.model';
import { LigneDemandeAppro } from 'src/app/models/gestion/saisie/ligneDemandeAppro.model';
import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { CentreConsommationService } from 'src/app/services/gestion/definition/centreConsommation.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { DemandeApproService } from 'src/app/services/gestion/saisie/demande-appro.service';
import { LigneDemandeApproService } from 'src/app/services/gestion/saisie/ligne-demande-appro.service';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';


export interface modelLigneDemandeAppro{
  ligneDemandeAppro: LigneDemandeAppro;
  listArticle: Article[];
  listUniter: Uniter[];
  selectedArticl: number;
  selectedUniter: number;
  artii?: Article;

}

@Component({
  selector: 'app-demande-besoin',
  templateUrl: './demande-besoin.component.html',
  styleUrls: ['./demande-besoin.component.css']
})
export class DemandeBesoinComponent  implements OnInit {

  searchControl: FormControl = new FormControl();
  demandeApproFiltered;
  //--------Pour les articles-----------
  searchControlArticle: FormControl = new FormControl();
  articleFiltered;

  validateForm: FormGroup;
  demandeApproList: DemandeApprovisionnement[] = [];
  ligneDemandeApproList: LigneDemandeAppro[] = [];
  selectedLigneDemandeApproList: LigneDemandeAppro[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  serviceList: CentreConsommation[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  loading: boolean;
  demandeAppro: DemandeApprovisionnement = null;
  ligneShow: modelLigneDemandeAppro[] = [];

  etatVali: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private demandeApproService: DemandeApproService,
    private ligneDemandeApproService: LigneDemandeApproService,
    private centreConsommationService: CentreConsommationService,
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

    this.demandeApproService.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeApproList = [...data];
        this.demandeApproFiltered = this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()));
        console.log(this.demandeApproList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });

    this.makeForm(null);

    this.searchControlArticle.valueChanges
    .pipe(debounceTime(200))
    .subscribe(value => {
      this.filerDataArticle(value);
    });
  
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

      this.getAllArticle();
      this.getAllUniter();
      this.getAllLigneDemandeAppro();
      this.getAllAffecterUniterToArticle();
      this.getAllService();

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

  getAllDemandeAppro(){
    this.demandeApproService.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeApproList = [...data];
        this.demandeApproFiltered = this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()));
        console.log(this.demandeApproList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
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

  getAllService(){
    this.centreConsommationService.list().subscribe(
      (data: any) => {
        this.serviceList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

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

  addLignByDialog(article:Article){

    if(this.ligneShow.find((l) => l.selectedArticl == article.numArticle)){
      const ind = this.ligneShow.findIndex((l) => l.selectedArticl == article.numArticle);
      if(ind > -1){
        this.ligneShow.splice(ind, 1);
      }      
    }
    else{
      this.pushALigneDa();
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



  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.demandeApproFiltered = [...this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()))];
    }

    const columns = Object.keys(this.demandeApproList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.demandeApproList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.demandeApproFiltered = rows;
  }

  makeForm(demandeAppro: DemandeApprovisionnement): void {
    this.validateForm = this.fb.group({
      numDA: [demandeAppro != null ? demandeAppro.numDA: null],
      dateDA: [demandeAppro != null ? demandeAppro.dateDA: null,
      [Validators.required]],
      description: [demandeAppro != null ? demandeAppro.description : null],
      service: [demandeAppro != null ? demandeAppro.service.numService : null,
        [Validators.required]],
      valideDA: [demandeAppro != null ? demandeAppro.valideDA : false],

    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (demandeAppro?.numDA !=null){
      this.ligneShow = [];

      for(const ligCo of this.ligneDemandeApproList){
        if(ligCo.appro.numDA == demandeAppro.numDA){
          this.ligneShow.push({
            ligneDemandeAppro: ligCo,
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligCo.article.numArticle),
            selectedArticl: ligCo.article.numArticle,
            selectedUniter: ligCo.uniter ? ligCo.uniter.numUniter : null,
            artii: ligCo.article,

          });
        }
      }

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

      const i = this.serviceList.findIndex(l => l.numService == formData.service);

      if (i > -1) {
        formData.service = this.serviceList[i];
      }
      let lignesDa: LigneDemandeAppro[] = [];
      this.ligneShow.forEach((element, inde) => {
        const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);
        const k = element.listUniter.findIndex(l => l.numUniter == element.selectedUniter);

        element.ligneDemandeAppro.article = null;
        element.ligneDemandeAppro.uniter = null;

        if (j > -1) {
          element.ligneDemandeAppro.article = element.listArticle[j];
        }

        if (k > -1) {
          element.ligneDemandeAppro.uniter = element.listUniter[k];
        }

        lignesDa.push(element.ligneDemandeAppro);

      });

      const da = new DemandeApprovisionnement(formData.numDA, formData.dateDA, 0, formData.valideDA, this.exerciceService.selectedExo,
        formData.service, formData.description);
      if (formData.numDA == null) {
        console.log("data", formData);

        this.enregistrerDemandeAppro(da, lignesDa);
      } else {
        this.modifierDemandeAppro(da.numDA,da, lignesDa);
      }
    }
  }

  enregistrerDemandeAppro(demandeAppro: DemandeApprovisionnement, lignesDa: LigneDemandeAppro[]): void {
    this.loading = true;
    console.log('obj', new EncapDemandeAppro(demandeAppro, lignesDa));
    this.demandeApproService.addADemandeAppro2(new EncapDemandeAppro(demandeAppro, lignesDa)).subscribe(
      (data) => {
        this.getAllLigneDemandeAppro();
        console.log(data);

            this.demandeApproList.unshift(data.demandeApprovisionnement);
            this.demandeApproFiltered = [...this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()))];
            this.resetForm();
            this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
            this.loading = false;
            //basculer vers la tab contenant la liste apres modification
            this.activeTabsNav = 1;

            this.getAllArticle();
            this.getAllUniter();
            this.getAllAffecterUniterToArticle();
            this.getAllService();

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        this.loading = false;
      }
    );


  }

  modifierDemandeAppro(id: String, demandeAppro: DemandeApprovisionnement, lignesDa: LigneDemandeAppro[]): void {
    this.loading = true;
    console.log('Send',new EncapDemandeAppro(demandeAppro, lignesDa));
    this.demandeApproService.editADemandeAppro2(id, new EncapDemandeAppro(demandeAppro, lignesDa)).subscribe(
      (data) => {
        this.getAllLigneDemandeAppro();

        console.log(data);

            const i = this.demandeApproList.findIndex(l => l.numDA == data.demandeApprovisionnement.numDA);
            if (i > -1) {
              this.demandeApproList[i] = data.demandeApprovisionnement;
              this.demandeApproFiltered = [...this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()))];
            }

            this.resetForm();
            this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });

            //basculer vers la tab contenant la liste apres modification
            this.loading = false;
            this.activeTabsNav = 1;

            this.getAllArticle();
            this.getAllUniter();
            this.getAllLigneDemandeAppro();
            this.getAllAffecterUniterToArticle();
            this.getAllService();

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = false;
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

      }
    );


  }

  confirm(content, demandeAppro: DemandeApprovisionnement) {
    this.demandeAppro = demandeAppro;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.demandeApproService.deleteADemandeAppro2(demandeAppro?.numDA).subscribe(
        (data) => {

          console.log(data);
          const i = this.demandeApproList.findIndex(l => l.numDA == demandeAppro.numDA);
          if (i > -1) {
            this.demandeApproList.splice(i, 1);
            this.demandeApproFiltered = [...this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()))];
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

  pushALigneDa(){
    this.ligneShow.push({
      ligneDemandeAppro: new LigneDemandeAppro(0, null, null, null),
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

  popALigneDa(inde:number){
    this.ligneShow.splice(inde, 1);

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


  valider(demandeAppro: DemandeApprovisionnement, eta: boolean, content){

    this.etatVali = eta;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
    .result.then((result) => {
    //this.confirmResut = `Closed with: ${result}`;
    
      demandeAppro.valideDA = eta;

      this.demandeApproService.editADemandeAppro(demandeAppro.numDA, demandeAppro).subscribe(
        (data) => {

          demandeAppro = data;

          const i = this.demandeApproList.findIndex(l => l.numDA == demandeAppro.numDA);
              if (i > -1) {
                this.demandeApproList[i] = demandeAppro;
                this.demandeApproFiltered = [...this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()))];
              }

              this.getAllArticle();
              this.getAllUniter();
              this.getAllLigneDemandeAppro();
              this.getAllAffecterUniterToArticle();
              this.getAllService();

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

  openPdfToPrint(element: DemandeApprovisionnement){

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
    doc.text('DEMANDE DE BESOIN', 67, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Expression de Besoin N° '+element.numDA+' du '+moment(element.dateDA).format('DD/MM/YYYY')]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { right: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Centre Demandeuse :', element.service.codeService+' - '+element.service.libService],
      ]
      ,
    });

    let lignes = [];

    this.ligneDemandeApproList.forEach(element2 => {
      if(element2.appro.numDA == element.numDA){
        let lig = [];
        lig.push(element2.article.codeArticle);
        lig.push(element2.article.libArticle);
        lig.push(element2.quantiteDemandee);
        lig.push(element2.uniter.libUniter);

        lignes.push(lig);
      }

    });

    autoTable(doc, {
      theme: 'grid',
      head: [['Article', 'Désignation', 'Quantité', 'Unité']],
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
