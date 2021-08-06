import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { TypeArticle } from 'src/app/models/gestion/definition/typeArticle.model';
import { CloturePeriodiq } from 'src/app/models/gestion/saisie/cloturePeriodiq.model';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FamilleService } from 'src/app/services/gestion/definition/famille.service';
import { TypeArticleService } from 'src/app/services/gestion/definition/type-article.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { InventaireService } from 'src/app/services/gestion/saisie/inventaire.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';
import { ReceptionService } from 'src/app/services/gestion/saisie/reception.service';
import { ApprovisionnementService } from 'src/app/services/gestion/saisie/approvisionnement.service';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { element } from 'protractor';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  validateForm: FormGroup;
  validateForm2: FormGroup;
  validateForm3: FormGroup;
  validateForm4: FormGroup;
  validateForm5: FormGroup;
  cloturePeriodiqList: CloturePeriodiq[] = [];
  familleList: Famille[] = [];
  filteredFamilleList: Famille[] = [];
  articleList: Article[] = [];
  magasinList: Magasin[] = [];
  typeArticleList: TypeArticle[] = [];
  loading: boolean;
  loading2: boolean;
  loading3: boolean;
  loading4: boolean;
  loading5: boolean;
  lastCloture: CloturePeriodiq = null;

    //--------Pour les articles-----------
    searchControlArticle: FormControl = new FormControl();
    articleFiltered;
    selectedArticleForMvt:Article[] = [];

  constructor(
    private cloturePeriodiquService: CloturePeriodiqService,
    private familleService: FamilleService,
    private typeArticleService: TypeArticleService,
    private articleService: ArticleService,
    private magasinService: MagasinService,
    private inventaireService: InventaireService,
    private stockerService: StockerService,
    private rceptionService: ReceptionService,
    private approService: ApprovisionnementService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {

    this.searchControlArticle.valueChanges
    .pipe(debounceTime(200))
    .subscribe(value => {
      this.filerDataArticle(value);
    });

    this.makeForm(null);
    this.makeForm2(null);
    this.getAllFamille();
    this.getAllTypeArticle();
    this.getAllMagasin();
    this.getAllArticle();

  }

  ngOnInit(): void {
  }

  isArticleAlreadySelected(article:Article):boolean{
    for(const lig of this.selectedArticleForMvt){
      if(lig.numArticle == article.numArticle){
        return true;
      }
    }
    return false;
  }

  addLignByDialog(article:Article){
    if(this.selectedArticleForMvt.find((l) => l.numArticle == article.numArticle)){
      const ind = this.selectedArticleForMvt.findIndex((l) => l.numArticle == article.numArticle);
      if(ind > -1){
        this.selectedArticleForMvt.splice(ind, 1);
      }      
    }
    else{
      this.selectedArticleForMvt.push(article);
    }
  }

  selectAllArtForMvt(){
    if(this.selectedArticleForMvt.length < 1) this.selectedArticleForMvt = [...this.articleFiltered];
    else this.selectedArticleForMvt = [];

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

  getAllFamille(){
    this.familleService.getAllFamille().subscribe(
      (data) => {
        this.familleList = data;
        this.filteredFamilleList = data.filter((l) => l.magasin);

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


  getAllTypeArticle(){
    this.typeArticleService.getAllTypeArticle().subscribe(
      (data) => {
        this.typeArticleList = data;

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

  getFamillesOnMagasinChanged(){
    if(this.validateForm.value.magasin == -1){
      this.filteredFamilleList = this.familleList.filter((l) => l.magasin);
      
    }
    else{
      this.filteredFamilleList = this.familleList.filter((l) => l.magasin?.numMagasin == this.validateForm.value.magasin);

    }

    this.validateForm.patchValue({
      famille:-1,
    });

  }


  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);
  }

  makeForm(donne): void {
    this.validateForm = this.fb.group({
      magasin: [ -1, [Validators.required]],
      famille: [ -1, [Validators.required]],
      categorie: [ -1, [Validators.required]],
      sousFamille: [true],
    });

  }

  submit(){
    this.loading = true;
    if (this.validateForm.valid == false) {

      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      this.printArticleParFamillePdf();
    }

  }

  resetForm2(): void {
    this.validateForm2.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);
  }

  makeForm2(donne): void {
    this.validateForm2 = this.fb.group({
      magasin: [ -1, [Validators.required]],
      date: [ moment(Date.now()).format('yyyy-MM-DD'), [Validators.required]],
    });

  }

  submit2(){
    this.loading2 = true;
    if (this.validateForm2.valid == false) {

      setTimeout(() => {
        this.loading2 = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      this.printEtatStockPdf();
    }

  }

  printArticleParFamillePdf(){

    const formData = this.validateForm.value;
    const doc = new jsPDF();

    let famille: Famille = null;
    let categorie: TypeArticle = null;
    let sousFa: boolean = this.validateForm.value.sousFamille;
    let magasin: Magasin = null;

    famille = this.filteredFamilleList.find((l) => l.numFamille == this.validateForm.value.famille);
    categorie = this.typeArticleList.find((l) => l.numTypeArt == this.validateForm.value.categorie);
    magasin = this.magasinList.find((l) => l.numMagasin == this.validateForm.value.magasin);

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
    doc.text('ARTICLES PAR MAGASIN', 67, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Liste des Articles Par Magasin au PORT AUTONOME DE LOME au '+moment(Date.now()).format('DD/MM/YYYY')]
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
        ['Magasin :', magasin ? magasin.codeMagasin+' - '+magasin.libMagasin : ' Tous les Magasins'],
        ['Famille :', famille ? famille.codeFamille+' - '+famille.libFamille : ' Toutes les Familles'],
        ['Catégorie :', categorie ? categorie.codeTypeArt+' - '+categorie.libTypeArt : ' Toutes les catégories'],
        ['Sous-Famille(s) Incluse(s) :', sousFa ? ' OUI ' : ' NON '],
      ]
      ,
    });

    let listFaToShow: Famille[] = [];

    if(famille){
      listFaToShow.push(famille);
      if(sousFa){
        let fini: boolean = false;
        let tabToMerge: Famille[] [] = [];
        tabToMerge.push([famille]);
        while (fini == false) {
          let tab2: Famille[] = [];
          tabToMerge[tabToMerge.length-1].forEach(elementDeep => {
            tab2 = [...tab2,...this.filteredFamilleList.filter((l) => l.superFamille?.numFamille == elementDeep.numFamille)];
          });
          //console.log('tab', tab2, 'fini', fini);
          if(tab2.length == 0){
            fini = true;
          } else{
            tabToMerge.push(tab2);
            listFaToShow = [...listFaToShow,...tab2];
          }
        }

      }

    } else {
      listFaToShow = [...this.filteredFamilleList];
    }

    listFaToShow.sort((a, b) => a.codeFamille.toString() > b.codeFamille.toString() ? 1 : -1)



    this.articleService.getAllArticle().subscribe(
      (data) => {
        this.articleList = data;

        listFaToShow.forEach(elemente => {
          let artiOfAFa:Article[] = [];

          if(categorie){
            artiOfAFa = data.filter((l) => l.famille.numFamille == elemente.numFamille && l.typeArticle.numTypeArt == categorie.numTypeArt);
          } else {
            artiOfAFa = data.filter((l) => l.famille.numFamille == elemente.numFamille)
          }

          let lignes = [];

          artiOfAFa.forEach(element2 => {

            let lig = [];
            lig.push(element2.codeArticle);
            lig.push(element2.libArticle);
            lig.push(element2.tvaArticle);
            lig.push(element2.taxeSpecifiqArticle);
            lig.push(element2.famille.magasin?.codeMagasin+' - '+element2.famille.magasin?.libMagasin);

            lignes.push(lig);

          });

          if(artiOfAFa.length != 0){

            autoTable(doc, {
              theme: 'plain',
              margin: { right: 0 },
              columnStyles: {
                0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                1: { textColor: 0, halign: 'left' },
              },
              body: [
                ['Famille :', elemente ? elemente.codeFamille+' - '+elemente.libFamille : ' Aucun'],
                ['Super-Famille :', elemente.superFamille ? elemente.superFamille.codeFamille+' - '+elemente.superFamille.libFamille : ' Aucun '],
              ]
              ,
            });

            autoTable(doc, {
              theme: 'grid',
              head: [['Article(code)', 'Désignation', 'TVA', 'Taxe Spécifiq.', 'Magasin de Gest.']],
              headStyles:{
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold' ,
            },
              body: lignes
              ,
            });

          }

        });





        this.loading = false;
        doc.output('dataurlnewwindow');



      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }


  printEtatStockPdf(){

    const formData = this.validateForm.value;
    const doc = new jsPDF();

    let magasin: Magasin[] = null;

    magasin = formData.magasin == -1 ? [...this.magasinList] : [this.magasinList.find((l) => l.numMagasin == formData.magasin)];

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
    doc.text('ETAT DE STOCK', 67, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Etat de Stock Par Magasin au PORT AUTONOME DE LOME à la date du '+moment(Date.now()).format('DD/MM/YYYY')]
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
        ['Magasin :', magasin.length <= 1 ? magasin[0]?.codeMagasin+' - '+magasin[0]?.libMagasin : ' Tous les Magasins'],
      ]
      ,
    });



    this.articleService.getAllArticle().subscribe(
      (data) => {
        this.articleList = data;

        this.inventaireService.getAllInventaire().subscribe(
          (data2) => {

            this.rceptionService.getAllReception().subscribe(
              (data3) => {

                this.approService.getAllAppro().subscribe(
                  (data4) => {

                    this.stockerService.getAllStocker().subscribe(
                      (data5) => {
            
                        magasin.forEach(elemente => {

                          let concernedFictifStocker: Stocker[] = data5.filter((l) => l.magasin.numMagasin == elemente.numMagasin);

                          data.filter((l) => l.famille && l.famille.magasin && l.famille.magasin.numMagasin == elemente.numMagasin).forEach(eleme => {
                            if(!concernedFictifStocker.find((l) => l.article.numArticle == eleme.numArticle)){
                              concernedFictifStocker.push(new Stocker(0, 0, 0, 0, eleme, elemente));
                            }
                          });

                          let lignes = [];

                          concernedFictifStocker.forEach(element2 => {

                            let lig = [];
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.quantiterStocker);
                            lig.push(element2.cmup);
                            lig.push(element2.quantiterStocker*element2.cmup);

                            lignes.push(lig);

                          });
                                        
                          autoTable(doc, {
                            theme: 'plain',
                            columnStyles: {
                              0: { textColor: 0, fontStyle: 'bold', halign: 'center', fontSize:16 },
                            },
                            body: [
                              [elemente.codeMagasin+' - '+elemente.libMagasin],
                              
                            ]
                            ,
                          });

                          autoTable(doc, {
                            theme: 'grid',
                            head: [['Article(code)', 'Désignation', 'Qte Stockée', 'CUMP', 'Montant']],
                            headStyles:{
                              fillColor: [41, 128, 185],
                              textColor: 255,
                              fontStyle: 'bold' ,
                          },
                            body: lignes
                            ,
                          });



                        });

                                
                        this.loading2 = false;
                        //doc.output('dataurlnewwindow');
                        doc.save('EtatDeStock.pdf');

                      },
                      (error: HttpErrorResponse) => {
                        console.log('Echec status ==> ' + error.status);
                      }
                    );
        
                  },
                  (error: HttpErrorResponse) => {
                    console.log('Echec status ==> ' + error.status);
                  }
                );
    
              },
              (error: HttpErrorResponse) => {
                console.log('Echec status ==> ' + error.status);
              }
            );

          },
          (error: HttpErrorResponse) => {
            console.log('Echec status ==> ' + error.status);
          }
        );

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }

}
