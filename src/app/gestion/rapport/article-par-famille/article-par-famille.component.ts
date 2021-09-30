import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { AuthService } from 'src/app/services/common/auth.service';


@Component({
  selector: 'app-article-par-famille',
  templateUrl: './article-par-famille.component.html',
  styleUrls: ['./article-par-famille.component.css']
})
export class ArticleParFamilleComponent implements OnInit {

  validateForm: FormGroup;
  cloturePeriodiqList: CloturePeriodiq[] = [];
  familleList: Famille[] = [];
  articleList: Article[] = [];
  typeArticleList: TypeArticle[] = [];
  loading: boolean;
  lastCloture: CloturePeriodiq = null;


  constructor(
    private cloturePeriodiquService: CloturePeriodiqService,
    private familleService: FamilleService,
    private typeArticleService: TypeArticleService,
    private articleService: ArticleService,
    private exerciceService: ExerciceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
    this.makeForm(null);
    this.getAllFamille();
    this.getAllTypeArticle();


  }

  ngOnInit(): void {
  }


  getAllFamille(){
    this.familleService.getAllFamille().subscribe(
      (data) => {
        this.familleList = data;

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

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

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

  printArticleParFamillePdf(){

    const formData = this.validateForm.value;
    const doc = new jsPDF();

    let famille: Famille = null;
    let categorie: TypeArticle = null;
    let sousFa: boolean = this.validateForm.value.sousFamille;

    famille = this.familleList.find((l) => l.numFamille == this.validateForm.value.famille);
    categorie = this.typeArticleList.find((l) => l.numTypeArt == this.validateForm.value.categorie);

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
    doc.text('LISTE DES ARTICLES', 67, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Liste des Articles du PORT AUTONOME DE LOME au '+moment(Date.now()).format('DD/MM/YYYY')]
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
            tab2 = [...tab2,...this.familleList.filter((l) => l.superFamille?.numFamille == elementDeep.numFamille)];
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
      listFaToShow = [...this.familleList];
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
       //doc.output('dataurlnewwindow');
        doc.save('fichier');



      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }


}
