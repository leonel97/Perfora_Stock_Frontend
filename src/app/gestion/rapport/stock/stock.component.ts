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
import { LigneReceptionService } from 'src/app/services/gestion/saisie/ligne-reception.service';
import { LigneApproService } from 'src/app/services/gestion/saisie/ligne-appro.service';
import { LigneReception } from 'src/app/models/gestion/saisie/ligneReception.model';
import { LigneAppro } from 'src/app/models/gestion/saisie/ligneAppro.model';
import { LigneInventaireService } from 'src/app/services/gestion/saisie/ligneInventaire.service';
import { LigneInventaire } from 'src/app/models/gestion/saisie/ligneInventaire.model';
import { Inventaire } from 'src/app/models/gestion/saisie/inventaire.model';
import { SalTools } from 'src/app/utilitaires/salTools';

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
  validateForm6: FormGroup;
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
  loading6: boolean;
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
    private ligneReceptionService: LigneReceptionService,
    private ligneApproService: LigneApproService,
    private ligneInventaireService: LigneInventaireService,
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
    this.makeForm6(null);
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

  makeForm6(donne): void {
    this.validateForm6 = this.fb.group({
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
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

  submit6(){
    this.loading6 = true;
    if (this.validateForm2.valid == false) {

      setTimeout(() => {
        this.loading6 = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else if(this.selectedArticleForMvt.length == 0){
      
      setTimeout(() => {
        this.loading6 = false;
        this.toastr.error('Veuillez Choisir un article.', ' Erreur !', {progressBar: true});
      }, 3000);
    }
    else {
      this.printEtatMvtArticlePdf();
    }

  }

  printEtatMvtArticlePdf(){
    
    const formData = this.validateForm6.value;
    
    const doc = new jsPDF({orientation: "landscape"});

    let articles: Article[] = [...this.selectedArticleForMvt];
    let dateSto: Date = new Date(formData.dateDebut.toString());

    dateSto = new Date(dateSto.getFullYear(), dateSto.getMonth(), dateSto.getDate()-1);
    
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
    doc.roundedRect(90, 35, 130, 10, 3, 3, 'FD');
    doc.setFontSize(20);
    doc.text('MOUVEMENT D\'ARTICLE', 110, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Mouvement d\'article entre sur la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
      ]
      ,
    });

    this.ligneInventaireService.getAllLigneInventaire().subscribe(
      (data3) => {
        this.ligneApproService.getAllLigneAppro().subscribe(
          (data4) => {
    
            this.ligneReceptionService.getAllLigneReception().subscribe(
              (data5) => {
    
                let validLigneReception: LigneReception[] = data5.filter((l) => l.reception.valideRecep && Date.parse(l.reception.dateReception.toString()) >= Date.parse(formData.dateDebut) && Date.parse(l.reception.dateReception.toString()) <= Date.parse(formData.dateFin));
                
                let validLigneAppro: LigneAppro[] = data4.filter((l) => l.appro.valideAppro && Date.parse(l.appro.dateAppro.toString()) >= Date.parse(formData.dateDebut) && Date.parse(l.appro.dateAppro.toString()) <= Date.parse(formData.dateFin));
                
                let validLigneInventaire: LigneInventaire[] = data3.filter((l) => l.inventaire.valideInve && Date.parse(l.inventaire.dateInv.toString()) >= Date.parse(formData.dateDebut) && Date.parse(l.inventaire.dateInv.toString()) <= Date.parse(formData.dateFin))
    
                articles.forEach(elemente => {
    
    
                  let lignes = [];
                  
                  
                  if(elemente.exo && Date.parse(elemente.datStInitArtTres.toString()) >= Date.parse(formData.dateDebut) && Date.parse(elemente.datStInitArtTres.toString()) <= Date.parse(formData.dateFin)){

                    let lig = [];
                    lig.push(moment(elemente.datStInitArtTres).format('DD/MM/YYYY'));
                    lig.push('Stock Init');
                    lig.push('');
                    lig.push('');
                    lig.push(elemente.qteStIniTres);
                    lig.push('');
                    lig.push(elemente.puStIniTres);
                    lig.push(elemente.qteStIniTres*elemente.puStIniTres);
                    lig.push('');
                    lig.push('');
                    lig.push(-1);
                    lig.push(Date.parse(elemente.datStInitArtTres.toString()));
                    
    
                    lignes.push(lig);


                  }
    
                  validLigneReception.filter((l) => l.ligneCommande.article.numArticle == elemente.numArticle).forEach(element2 => {
    
                   

                    let lig = [];
                    lig.push(moment(element2.reception.dateReception).format('DD/MM/YYYY'));
                    lig.push(element2.reception.numReception);
                    lig.push('');
                    lig.push('');
                    lig.push(element2.quantiteLigneReception*element2.ligneCommande.uniter.poids);
                    lig.push('');
                    lig.push(element2.puLigneReception/element2.ligneCommande.uniter.poids);
                    lig.push(element2.quantiteLigneReception*element2.puLigneReception*(1+(element2.ligneCommande.tva/100)));
                    lig.push('');
                    lig.push('');
                    lig.push(0);
                    lig.push(Date.parse(element2.reception.dateValidation.toString()));
                    lig.push(1+(element2.ligneCommande.tva/100));
    
                    lignes.push(lig);
    
                  });
    
    
                  validLigneAppro.filter((l) => l.ligneDA.article.numArticle == elemente.numArticle).forEach(element2 => {
    
                    let lig = [];
                    lig.push(moment(element2.appro.dateAppro).format('DD/MM/YYYY'));
                    lig.push(element2.appro.numAppro);
                    lig.push('');
                    lig.push('');
                    lig.push('');
                    lig.push(element2.quantiteLigneAppro*element2.ligneDA.uniter.poids);
                    lig.push(element2.puligneAppro);
                    lig.push(element2.quantiteLigneAppro*element2.ligneDA.uniter.poids*element2.puligneAppro);
                    lig.push('');
                    lig.push('');
                    lig.push(1);
                    lig.push(Date.parse(element2.appro.dateValidation.toString()));
    
                    lignes.push(lig);
    
                  });

                  validLigneInventaire.filter((l) => l.article.numArticle == elemente.numArticle).forEach(element2 => {
    
                    let lig = [];
                    lig.push(moment(element2.inventaire.dateInv).format('DD/MM/YYYY'));
                    lig.push(element2.inventaire.numInv);
                    lig.push('');
                    lig.push('');
                    lig.push(element2.stockTheoriq < element2.stockreel ? element2.stockreel-element2.stockTheoriq : '');
                    lig.push(element2.stockTheoriq >= element2.stockreel ? element2.stockTheoriq-element2.stockreel : '');
                    lig.push(element2.pu);
                    lig.push(Math.abs(element2.stockreel-element2.stockTheoriq)*element2.pu);
                    lig.push('');
                    lig.push('');
                    lig.push(2);
                    lig.push(Date.parse(element2.inventaire.dateValidation.toString()));
                    lig.push(element2.stockreel);
    
                    lignes.push(lig);
    
                  });

                  lignes.sort((a, b) => {
                    
                    let dat1 = a[11];
                    let dat2 = b[11];
                    if(dat1 > dat2){
                      return 1;
                    }
                    else if(dat1 < dat2){
                      return -1;
                    }
                    else{
                      return 0;
                    }
                    
                  });

                  //console.log(lignes);
                  lignes.push(['', '', '', '', '', '', '', '', '', '', '', ''])

                  lignes.forEach((element2, inde) => {
                    if(inde == 0){
                      let tabSto = this.getStockOfArtiAtADate(elemente, data3, data5, data4, new Date(formData.dateDebut.toString()));
                      element2[2] = tabSto[0];
                      element2[3] = tabSto[1];

                    }
                    else{
                      if(lignes[inde-1][10] == 0){
                        element2[2] = lignes[inde-1][2]+lignes[inde-1][4];
                        element2[3] = ((lignes[inde-1][2]*lignes[inde-1][3])+(lignes[inde-1][4]*lignes[inde-1][6]*lignes[inde-1][12]))/(lignes[inde-1][2]+lignes[inde-1][4]);
                        lignes[inde-1][8] = element2[2];
                        lignes[inde-1][9] = element2[3];

                      }
                      else if(lignes[inde-1][10] == 1){
                        element2[2] = lignes[inde-1][2]-lignes[inde-1][5];
                        element2[3] = lignes[inde-1][6];
                        lignes[inde-1][8] = element2[2];
                        lignes[inde-1][9] = element2[3];

                      }
                      else if(lignes[inde-1][10] == 2){
                        element2[2] = lignes[inde-1][12];
                        element2[3] = lignes[inde-1][6];
                        lignes[inde-1][8] = element2[2];
                        lignes[inde-1][9] = element2[3];
                        lignes[inde-1][4] = lignes[inde-1][2] < lignes[inde-1][12] ? lignes[inde-1][12]-lignes[inde-1][2] : '';
                        lignes[inde-1][5] = lignes[inde-1][2] >= lignes[inde-1][12] ? lignes[inde-1][2]-lignes[inde-1][12] : '';
                      }
                      else if(lignes[inde-1][10] == -1){
                        element2[2] = lignes[inde-1][4];//lignes[inde-1][2]+lignes[inde-1][4];
                        element2[3] = lignes[inde-1][6];
                        lignes[inde-1][8] = element2[2];
                        lignes[inde-1][9] = element2[3];
                      }

                    }
                    
                  });

                  lignes.splice(lignes.length-1, 1);
                                
                  autoTable(doc, {
                    theme: 'plain',
                    columnStyles: {
                      0: { textColor: 0, fontStyle: 'bold', halign: 'center', fontSize:16 },
                    },
                    body: [
                      [elemente.codeArticle+' - '+elemente.libArticle],
                      
                    ]
                    ,
                  });

                  lignes.forEach((elementArrond, inde) => {

                    elementArrond[3] = SalTools.salRound(elementArrond[3]);
                    elementArrond[6] = SalTools.salRound(elementArrond[6]);
                    elementArrond[7] = SalTools.salRound(elementArrond[7]);
                    elementArrond[9] = SalTools.salRound(elementArrond[9]);

                    lignes[inde] = elementArrond;
                    
                  });
    
                  autoTable(doc, {
                    theme: 'grid',
                    columnStyles: {
                      2: { halign: 'right', },
                      3: { halign: 'right', },
                      4: { halign: 'right', },
                      5: { halign: 'right', },
                      6: { halign: 'right', },
                      7: { halign: 'right', },
                      8: { halign: 'right', },
                      9: { halign: 'right', },
                    },
                    head: [['Date', 'Pièce', 'Qte Init.', 'Valeur', 'Entrée', 'Sortie', 'PU', 'Montant', 'Qte Finale', 'Valeur']],
                    headStyles:{
                      fillColor: [41, 128, 185],
                      textColor: 255,
                      fontStyle: 'bold' ,
                  },
                    body: lignes
                    ,
                  });
    
    
    
                });
    
                        
                this.loading6 = false;
                //doc.output('dataurlnewwindow');
                doc.save('sal.pdf');
    
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


        for (let index = 0; index < doc.getNumberOfPages(); index++) {
          doc.setPage(index+1);
    
          doc.setFontSize(10);
          doc.setFont('Times New Roman', 'italic', 'bold');
    
          doc.text('Powered by PerfOra-Stock Web\nLe '+moment(Date.now()).format('DD/MM/YYYY à HH:mm:ss'), 5, 290);
          
          doc.text('Page '+(index+1)+' sur '+doc.getNumberOfPages(), 185, 290);
    
          
        }


        this.loading = false;
        //doc.output('dataurlnewwindow');
        
        doc.save('articleParMagasin.pdf');


      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );


  }
  

  printEtatStockPdf(){

    const formData = this.validateForm2.value;
    const doc = new jsPDF();

    let dateSto: Date = new Date(formData.date.toString());

    dateSto = new Date(dateSto.getFullYear(), dateSto.getMonth(), dateSto.getDate());

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
        ['Etat de Stock Par Magasin au PORT AUTONOME DE LOME à la date du '+moment(formData.date).format('DD/MM/YYYY')]
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

        this.ligneInventaireService.getAllLigneInventaire().subscribe(
          (data2) => {

            this.ligneReceptionService.getAllLigneReception().subscribe(
              (data3) => {

                this.ligneApproService.getAllLigneAppro().subscribe(
                  (data4) => {

                    this.stockerService.getAllStocker().subscribe(
                      (data5) => {
            
                        magasin.forEach(elemente => {

                          let concernedFictifStocker: Stocker[] = data5.filter((l) => l.magasin.numMagasin == elemente.numMagasin);

                          /* */
                          concernedFictifStocker.forEach(ele => {
                            let info = this.getStockOfArtiAtADate(ele.article, data2, data3, data4, dateSto);
                            
                            ele.quantiterStocker = info[0];
                            ele.cmup = info[1];
                            
                          });
                          
                          
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

                          lignes.forEach((elementArrond, inde) => {
                            
                            elementArrond[3] = SalTools.salRound(elementArrond[3]);
                            elementArrond[4] = SalTools.salRound(elementArrond[4]);

                            lignes[inde]
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

  getStockOfArtiAtADate(article:Article, lignesIventaire: LigneInventaire[], lignesReception: LigneReception[], lignesAppro: LigneAppro[], dateSt: Date): number[]{
    let tab:number[] = [0, 0];

    let lig = [];

    let concernedLignInv = lignesIventaire.filter((l) => l.inventaire.valideInve && l.article.numArticle == article.numArticle && Date.parse(l.inventaire.dateInv.toString()) <= dateSt.valueOf()).sort((a, b) => Date.parse(a.inventaire.dateInv.toString()) > Date.parse(b.inventaire.dateInv.toString()) ? -1 : 1 )[0];
    let concernedLignRecep = lignesReception.filter((l) => l.reception.valideRecep && l.ligneCommande.article.numArticle == article.numArticle && Date.parse(l.reception.dateReception.toString()) <= dateSt.valueOf()).sort((a, b) => Date.parse(a.reception.dateReception.toString()) > Date.parse(b.reception.dateReception.toString())? -1 : 1 )[0];
    let concernedLignAppro = lignesAppro.filter((l) => l.appro.valideAppro && l.ligneDA.article.numArticle == article.numArticle && Date.parse(l.appro.dateAppro.toString()) <= dateSt.valueOf()).sort((a, b) => Date.parse(a.appro.dateAppro.toString()) > Date.parse(b.appro.dateAppro.toString())? -1 : 1 )[0];

    if(article.exo && Date.parse(article.datStInitArtTres.toString()) <= dateSt.valueOf()) {
      let li = [];
      li.push(Date.parse(article.datStInitArtTres.toString()));
      li.push(article.qteStIniTres);
      li.push(article.puStIniTres);

      lig.push(li);
    }
    
    if(concernedLignInv) {
      let li = [];
      li.push(Date.parse(concernedLignInv.inventaire.dateInv.toString()));
      li.push(concernedLignInv.stockreel);
      li.push(concernedLignInv.pu);

      lig.push(li);
    }

    if(concernedLignRecep) {
      let li = [];
      li.push(Date.parse(concernedLignRecep.reception.dateReception.toString()));
      li.push(concernedLignRecep.lastStockQte+(concernedLignRecep.quantiteLigneReception*concernedLignRecep.ligneCommande.uniter.poids));
      concernedLignRecep.lastCump = ((concernedLignRecep.lastStockQte*concernedLignRecep.lastCump)+((concernedLignRecep.quantiteLigneReception*concernedLignRecep.ligneCommande.uniter.poids)*(concernedLignRecep.ligneCommande.puLigneCommande/concernedLignRecep.ligneCommande.uniter.poids)))/(concernedLignRecep.lastStockQte+(concernedLignRecep.quantiteLigneReception*concernedLignRecep.ligneCommande.uniter.poids));
      li.push(concernedLignRecep.lastCump);

      lig.push(li);
    }

    if(concernedLignAppro) {
      let li = [];
      li.push(Date.parse(concernedLignAppro.appro.dateAppro.toString()));
      li.push(concernedLignAppro.lastStockQte-(concernedLignAppro.quantiteLigneAppro*concernedLignAppro.ligneDA.uniter.poids));
      li.push(concernedLignAppro.puligneAppro);

      lig.push(li);
    }

    lig.sort((a, b) => a[0] < b[0] ? 1: -1 );
    console.log('liii', lig);
    if(lig.length > 0){
      tab[0] = lig[0][1];
      tab[1] = lig[0][2];
    }
    
    return tab;

  }

}

