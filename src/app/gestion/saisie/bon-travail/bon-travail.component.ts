import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { BondTravail } from 'src/app/models/gestion/saisie/bondTravail.model';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { BondTravailService } from 'src/app/services/gestion/saisie/bond-travail.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { modelLigneCommande } from '../commande-achat/commande-achat.component';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { NumberToLetter } from 'convertir-nombre-lettre';


@Component({
  selector: 'app-bon-travail',
  templateUrl: './bon-travail.component.html',
  styleUrls: ['./bon-travail.component.css']
})
export class BonTravailComponent  implements OnInit {

  searchControl: FormControl = new FormControl();
  bondTravailFiltered;

  validateForm: FormGroup;
  bondTravailList: BondTravail[] = [];
  ligneCommandeList: LigneCommande[] = [];
  selectedLigneCommandeList: LigneCommande[] = [];
  fournisseurList: Fournisseur[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  loading: boolean;
  bondTravail: BondTravail = null;
  ligneShow: modelLigneCommande[] = [];

  etatVali: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private bondTravailService: BondTravailService,
    private ligneCommandeService: LigneCommandeService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private commandeService: CommandeService,
    private exerciceService: ExerciceService,
    private affectUniterToArticleService: AffectUniterToArticleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.bondTravailService.getAllBondTravail().subscribe(
      (data) => {
        this.bondTravailList = [...data];
        this.bondTravailFiltered = this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()));
        console.log(this.bondTravailList);
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
      this.getAllLigneCommande();
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

  getAllBondTravail(){
    this.bondTravailService.getAllBondTravail().subscribe(
      (data) => {
        this.bondTravailList = [...data];
        this.bondTravailFiltered = this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()));
        console.log(this.bondTravailList);
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
      return this.bondTravailFiltered = [...this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()))];
    }

    const columns = Object.keys(this.bondTravailList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.bondTravailList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.bondTravailFiltered = rows;
  }

  makeForm(bondTravail: BondTravail): void {
    this.validateForm = this.fb.group({
      numBondTravail: [bondTravail != null ? bondTravail.numBondTravail: null],
      dateCommande: [bondTravail != null ? bondTravail.commande.dateCommande: null,
      [Validators.required]],
      delaiLivraison: [bondTravail != null ? bondTravail.commande.delaiLivraison : null,
        [Validators.required]],
      dateRemise: [bondTravail != null ? bondTravail.commande.dateRemise : null],

      description: [bondTravail != null ? bondTravail.commande.description : null],
      frs: [bondTravail != null ? bondTravail.commande.frs.numFournisseur : null,
        [Validators.required]],
      numComm: [bondTravail != null ? bondTravail.commande.numCommande : null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (bondTravail?.numBondTravail !=null){
      this.ligneShow = [];

      for(const ligCo of this.ligneCommandeList){
        if(ligCo.numCommande.numCommande == bondTravail.commande.numCommande){
          this.ligneShow.push({
            lignesCommande: ligCo,
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligCo.article.numArticle),
            selectedArticl: ligCo.article.numArticle,
            selectedUniter: ligCo.uniter ? ligCo.uniter.numUniter : null,
          });
        }
      }

      this.calculTotaux();

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
    this.calculTotaux();

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
      let lignesCom: LigneCommande[] = [];
      this.ligneShow.forEach((element, inde) => {
        const j = element.listArticle.findIndex(l => l.numArticle == element.selectedArticl);
        const k = element.listUniter.findIndex(l => l.numUniter == element.selectedUniter);

        element.lignesCommande.article = null;
        element.lignesCommande.uniter = null;

        if (j > -1) {
          element.lignesCommande.article = element.listArticle[j];
        }

        if (k > -1) {
          element.lignesCommande.uniter = element.listUniter[k];
        }

        lignesCom.push(element.lignesCommande);

      });

      const com = new Commande(formData.dateCommande, formData.dateRemise, formData.description,
        formData.delaiLivraison, false, 0, false, false, formData.frs, this.exerciceService.selectedExo );
        com.numCommande = formData.numComm;
      if (formData.numBondTravail == null) {
        console.log("data", formData);

        this.enregistrerBondTravail(com, lignesCom);
      } else {
        this.modifierBondTravail(formData.numBondTravail,com, lignesCom);
      }
    }
  }

  enregistrerBondTravail(commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    console.log('obj', new EncapCommande(commande, lignesCo));
    this.commandeService.addACommande2(new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();
        this.bondTravailService.addABondTravail(new BondTravail(Date.now().toString(), 0, data2.commande, this.exerciceService.selectedExo)).subscribe(
          (data) => {
            console.log(data);

            this.bondTravailList.unshift(data);
            this.bondTravailFiltered = [...this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()))];
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
          });

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        this.loading = false;
      }
    );


  }

  modifierBondTravail(id: String, commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    this.commandeService.editACommande2(commande.numCommande.toString(), new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();

        this.bondTravailService.editABondTravail(id, new BondTravail('', 0, data2.commande, this.exerciceService.selectedExo)).subscribe(
          (data) => {
            console.log(data);

            const i = this.bondTravailList.findIndex(l => l.numBondTravail == data.numBondTravail);
            if (i > -1) {
              this.bondTravailList[i] = data;
              this.bondTravailFiltered = [...this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()))];
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

  confirm(content, bondTravail: BondTravail) {
    this.bondTravail = bondTravail;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.bondTravailService.deleteABondTravail(bondTravail?.numBondTravail.toString()).subscribe(
        (data) => {

          this.commandeService.deleteACommande2(bondTravail.commande.numCommande.toString()).subscribe(
            (data) => {

            },
            (error: HttpErrorResponse) => {
              console.log('Echec status ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );

          console.log(data);
          const i = this.bondTravailList.findIndex(l => l.numBondTravail == bondTravail.numBondTravail);
          if (i > -1) {
            this.bondTravailList.splice(i, 1);
            this.bondTravailFiltered = [...this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()))];
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
      lignesCommande: new LigneCommande(0, 0, 0, 0, 0, 0, null, null, null),
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
    this.calculTotaux();
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

    let tot0: number = 0;
    let tot1: number = 0;
    let tot2: number = 0;

    this.ligneShow.forEach(element => {
      tot0 += (element.lignesCommande.puLigneCommande * element.lignesCommande.qteLigneCommande);
      tot1 += (element.lignesCommande.puLigneCommande * element.lignesCommande.qteLigneCommande * element.lignesCommande.tva/100);
      tot2 += (element.lignesCommande.puLigneCommande * element.lignesCommande.qteLigneCommande * (1+(element.lignesCommande.tva/100)));
    });

    this.totaux[0] = tot0;
    this.totaux[1] = tot1;
    this.totaux[2] = tot2;

  }

  getTotalTtcOfACom(row: BondTravail){

    let tot: number = 0;

    this.ligneCommandeList.forEach(element => {
      if(element.numCommande.numCommande == row.commande.numCommande){
        tot += element.puLigneCommande * element.qteLigneCommande * (1+(element.tva/100));
      }
    });

    return tot;

  }

  valider(bondTravail: BondTravail, eta: boolean, content){

    this.etatVali = eta;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;

      bondTravail.commande.valide = eta;

      this.commandeService.editACommande(bondTravail.commande.numCommande.toString(), bondTravail.commande).subscribe(
        (data) => {

          bondTravail.commande = data;

          const i = this.bondTravailList.findIndex(l => l.numBondTravail == bondTravail.numBondTravail);
              if (i > -1) {
                this.bondTravailList[i] = bondTravail;
                this.bondTravailFiltered = [...this.bondTravailList.sort((a, b) => a.numBondTravail.localeCompare(b.numBondTravail.valueOf()))];
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

  openPdfToPrint(element: BondTravail){

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
    doc.text('BOND DE TRAVAIL', 67, 43);
    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 1000 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Bond de Commande N° '+element.numBondTravail+' du '+moment(element.commande.dateCommande).format('DD/MM/YYYY')]
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
        ['Le Fournisseur : '+element.commande.frs.codeFrs+'  '+element.commande.frs.identiteFrs+'\n\nest prié de livrer au PORT AUTONOME les matières et objets désignés ci-après :']
      ]
      ,
    });


    let lignes = [];
    this.ligneCommandeList.forEach(element2 => {
      if(element2.numCommande.numCommande == element.commande.numCommande){
        let lig = [];
        lig.push(element2.article.codeArticle);
        lig.push(element2.article.libArticle);
        lig.push(element2.qteLigneCommande);
        lig.push(element2.uniter.libUniter);
        lig.push(element2.puLigneCommande);
        lig.push(element2.tva);
        let ht = element2.qteLigneCommande*element2.puLigneCommande;
        lig.push(ht*(1+(element2.tva/100)));
        lignes.push(lig);

        totalHT+= ht;
        totalTVA+= ht*(element2.tva/100);
        totalTTC+= ht*(1+(element2.tva/100));
      }

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
        ['Délais de Livraison '+element.commande.delaiLivraison+'  Jour(s)',
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
}
