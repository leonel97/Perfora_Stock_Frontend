import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Command } from 'protractor';
import { debounceTime } from 'rxjs/operators';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';

import { Inventaire } from 'src/app/models/gestion/saisie/inventaire.model';
import { LigneInventaire } from 'src/app/models/gestion/saisie/ligneInventaire.model';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { EncapInventaire } from 'src/app/models/gestion/saisie/encapsuleur-model/encapInventaire.model';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { InventaireService } from 'src/app/services/gestion/saisie/inventaire.service';
import { LigneInventaireService } from 'src/app/services/gestion/saisie/ligneInventaire.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { SalTools } from 'src/app/utilitaires/salTools';


export interface modelLigneEtatStock{
  concernedStocker: Stocker;
}

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})
export class InventaireComponent implements OnInit {

  loading = false;
  searchControl: FormControl = new FormControl();
  magasinFiltered;
  stockerList : Stocker[] = [];
  magasinList: Magasin[] = [];
  ligneShowFiltered;
  inventaireFiltered;
  ligneInventaireFiltered;

  ligneShow : modelLigneEtatStock[] = [];
  tempateLigneInventaire : LigneInventaire[] = [];

  
  inventaireList: Inventaire[] = [];
  inventaireListByExo: Inventaire[] = [];
  ligneInventaireList: LigneInventaire[] = [];
  inventaire: Inventaire = null;

  disabledBtnFicheInventaire: boolean;

  validateForm: FormGroup;

  detailView: boolean = false;

  etatVali: boolean = false;

  

  activeTabsNav;
  constructor(
    private magasinService: MagasinService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private stockerService: StockerService,
    private exerciceService: ExerciceService,
    private inventaireService: InventaireService,
    private ligneInventaireService: LigneInventaireService,
    public authService: AuthService,
    public salToolsService: SalTools,) { 

    }

  ngOnInit(): void {

    this.makeForm(null);

    this.getAllMagasin();
    this.getAllStocker();
    this.getAllInventaireByCodeExoSelected();
    this.getAllLignenventaire();

   
  }

  getAllMagasin(){
    this.magasinService.getAllMagasin().subscribe(
      (data: any) => {
        this.magasinList = [...data];
        this.magasinFiltered = this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()));
        console.log('All magasin',this.magasinList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  // All stocker 
  getAllStocker(){
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
        console.log('All stocker', this.stockerList);
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  // All inventaire
  getAllInventaire(){
    this.inventaireService.getAllInventaire().subscribe(
      (data) => {
        this.inventaireList = data;
        //this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
        //console.log('All innventaire', this.inventaireList);
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getAllInventaireByCodeExoSelected(){
    this.inventaireService.getInventaireByCodeExo(this.exerciceService.selectedExo.codeExercice).subscribe(
      (data) => {
        this.inventaireListByExo = data;
        this.inventaireFiltered = [...this.inventaireListByExo.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
        console.log('All innventaire', this.inventaireListByExo);
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  //All ligne inventaire 
  getAllLignenventaire(){
    this.ligneInventaireService.getAllLigneInventaire().subscribe(
      (data) => {
        this.ligneInventaireList = data;
        this.ligneInventaireFiltered = [...this.ligneInventaireList.sort((a, b) => a.idLigneInv.toString().localeCompare(b.idLigneInv.toString().valueOf()))];
        console.log('All innventaire lines', this.ligneInventaireList);
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getLignShowOfSelectedMagasin(){
    this.tempateLigneInventaire = [];
    this.ligneShow = [];
    this.loading = true;
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
        let selectedMag : Magasin = null;

        const i = this.magasinList.findIndex(l => l.numMagasin == this.validateForm.value.magasin.numMagasin);

        if (i > -1) {
          selectedMag= this.magasinList[i];
          this.stockerList.forEach(element => {
            if(element.magasin.numMagasin == selectedMag.numMagasin){
              this.ligneShow.push({
                concernedStocker : element,
              })
              this.tempateLigneInventaire.push(new LigneInventaire(element.cmup, element.quantiterStocker, 0, '', element.article, null));
            }
          });

          this.ligneShowFiltered = [...this.ligneShow];

          this.loading = false;

          console.log(this.ligneShowFiltered);
          

        }
        else{
          this.loading = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading = false;
      }
    );
    

  }
  
  reporterStockTheorique(){
    this.tempateLigneInventaire.forEach(element => {
      element.stockreel = (!this.validateForm.value.report == true ? element.stockTheoriq : 0);
    });
  }
  
  makeForm(inventaire: Inventaire): void {
    this.validateForm = this.fb.group({
      numInv: [inventaire != null ? inventaire.numInv: null],
      dateInv: [inventaire != null ? inventaire.dateInv.toString().substr(0, 10): null,
      [Validators.required]],
      descrInv: [inventaire != null ? inventaire.descrInv : null],
      magasin: [inventaire != null ? inventaire.magasin : null,  [Validators.required]],
      /*frs: [demandePrix != null ? demandePrix.commande.frs.numFournisseur : null,
        [Validators.required]],
      numComm: [demandePrix != null ? demandePrix.commande.numCommande : null],*/
      report : false,
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (inventaire?.numInv !=null){

      this.ligneInventaireService.getLignesInventaireByCodeInventaire(inventaire?.numInv).subscribe(
        (ligneInventaireList) => {

          this.tempateLigneInventaire = [];

          for(const ligInventaire of ligneInventaireList){
            
              this.tempateLigneInventaire.push(ligInventaire);
            
          }
          console.log('lines of inventaire', this.tempateLigneInventaire);
          

          this.activeTabsNav = 2;

        }, 
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
        }
      );
      
    }
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);
    this.tempateLigneInventaire = [];

    if(this.detailView == true) this.detailView = false;

    //this.ligneShow = [];
    //this.selectedCurrentFrsInter = [];
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
    } else if (this.tempateLigneInventaire.length == 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      const formData = this.validateForm.value;


      const inventaire = new Inventaire(formData.numInv,formData.dateInv,formData.descrInv,
         false, 0, this.exerciceService.selectedExo,formData.magasin);

      if (formData.numInv == null) {
        this.enregistrerInventaire(inventaire, this.tempateLigneInventaire);
      } else {
        this.modifieInventaire(formData.numInv, inventaire, this.tempateLigneInventaire);
      }
    }
  }

  // save inventaire
  
  enregistrerInventaire(inv: Inventaire, lignesInventaire: LigneInventaire[]): void {
    this.loading = true;

    console.log('obj', new EncapInventaire(inv, lignesInventaire));
    this.inventaireService.addInventaire2(new EncapInventaire(inv, lignesInventaire)).subscribe(
      (data) => {
        this.getAllMagasin();
        this.getAllInventaire();
        this.getAllLignenventaire();

        this.inventaireListByExo.unshift(data.inventaire);
        this.inventaireFiltered = [...this.inventaireListByExo.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
        setTimeout(() => {
          this.loading = false;
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);

      }
    );

  }

  // Update inventaire
  modifieInventaire(id: String, inventaire: Inventaire, lignesInventaire: LigneInventaire[]): void {
    this.loading = true;
    this.inventaireService.editInventaire2(inventaire.numInv.toString(), new EncapInventaire(inventaire, lignesInventaire)).subscribe(
      (data2) => {
        this.getAllLignenventaire();
        //this.getAllInventaire();
        this.getAllMagasin();
      

        console.log(data2);

            const i = this.inventaireListByExo.findIndex(l => l.numInv == data2.inventaire.numInv);
            if (i > -1) {
              this.inventaireList[i] = data2.inventaire;
              this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
            }
            
            setTimeout(() => {
              this.loading = false;
              this.activeTabsNav = 1;
              this.resetForm();
              this.toastr.success('Modification effectué avec succès.', 'Success!', {progressBar: true});
            }, 3000);

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);

        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);

      }
    );


  }

  // Delete inventaire
  confirm(content, inventaire: Inventaire) {
    this.inventaire = inventaire;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {

      this.inventaireService.deleteInventaire2(inventaire?.numInv.toString()).subscribe(
        (data) => {

          console.log(data);
          const i = this.inventaireListByExo.findIndex(l => l.numInv == inventaire.numInv);
          if (i > -1) {
              this.inventaireListByExo.splice(i, 1);
              this.inventaireFiltered = [...this.inventaireListByExo.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
          }

          this.resetForm();
          this.toastr.success('Suppression effectué avec succès.', 'Success!', { progressBar: true });
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        });

    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  //Validate inventaire 
  valider(inventaire: Inventaire, eta: boolean, content){

    this.etatVali = eta;
    

    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
    .result.then((result) => {
      inventaire.valideInve = eta;
   
            // Procéder à l'ajustement des stocks
            this.inventaireService.editInventaire3(inventaire.numInv.toString(), inventaire).subscribe(
              (data) => {

                this.toastr.success('Validation effectuée avec succès.', 'Success', { progressBar: true });

                this.toastr.success('stock ajusté avec succès ', 'Success !', { progressBar: true });


                const i = this.inventaireListByExo.findIndex(l => l.numInv == data.numInv);
                if (i > -1) {
                  this.inventaireListByExo[i] = data;
                  this.inventaireFiltered = [...this.inventaireListByExo.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
                  console.log('value inventaire ', this.inventaireFiltered);
                  
                }
        
              },
              (error: HttpErrorResponse) => {
                console.log('Echec status ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { progressBar: true });
        
              }
            );


            //End ajustement des stocks
    

  }, (reason) => {
    console.log(`Dismissed with: ${reason}`);
  });


  }

  // Détail
  openDetail(row){
    this.makeForm(row);
    this.detailView = true;
  }

  closeDetail(){
    this.resetForm();
    this.detailView = false;
  }

  // show all article concerned magasin selected 
  showAllLigneArticleConcernedMagasin(){

    console.log('Num magasin',  this.validateForm.value.magasin.numMagasin);
    this.getLignShowOfSelectedMagasin();

   
  }

  //Rapport d'inventaire
  openPdfToPrint(element: Inventaire){

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
    doc.roundedRect(50, 35, 90, 10, 3, 3, 'FD');
    doc.setFontSize(20);
    doc.text('INVENTAIRE', 70, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Inventaire N° '+element.numInv+' du '+moment(element.dateInv).format('DD/MM/YYYY')]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left', cellWidth: 30 },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Exercice :', ''+element.exercice.codeExercice],
        ['Magasin :', element.magasin.codeMagasin+' - '+element.magasin.libMagasin],
        ['Inventaire :', element.numInv.toString()],
        ['Observation :', ''+(element.descrInv ? element.descrInv : '')],
      ]
      ,
    });

    this.ligneInventaireService.getLignesInventaireByCodeInventaire(element.numInv).subscribe(
      (ligneInventaireList) => {
        let lignes = [];

        ligneInventaireList.forEach(element2 => {
          if(element2.inventaire.numInv == element.numInv){
            let lig = [];
            lig.push(element2.article.codeArticle);
            lig.push(element2.article.libArticle);
            lig.push(element2.stockTheoriq);
            lig.push(element2.stockreel);
            lig.push(SalTools.salRound(element2.pu));
            lig.push(element2.stockreel - element2.stockTheoriq );
            lig.push( SalTools.salRound((element2.stockreel*element2.pu) - (element2.stockTheoriq*element2.pu)) );
            //let ht = element2.quantiteLigneReception*element2.ligneCommande.puLigneCommande;
            //lig.push(ht*(1+(element2.ligneCommande.tva/100)));
            lignes.push(lig);

          /* totalHT+= ht;
            totalTVA+= ht*(element2.ligneCommande.tva/100);
            totalTTC+= ht*(1+(element2.ligneCommande.tva/100));*/
          }

        });

        lignes.sort((a, b) => a[0].localeCompare(b[0].toString()));

        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Stock Théo.', 'Stock Réel', 'PU', 'Ecart Qté', ' Ecart Montant']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
          margin: { top: 0 },
          body: lignes
          ,
        });


        doc.save('inventaire.pdf');

      }, 
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

    

  }

  // Fiche inventaire en fonction du choix
  ficheInventaire(etatChoice: boolean){

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
    doc.text('FICHE INVENTAIRE', 70, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Fiche Inventaire du '+moment(this.validateForm.value.dateInv).format('DD/MM/YYYY')]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { right: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Exercice :', ''+this.exerciceService.selectedExo.codeExercice],
        ['Magasin :', this.validateForm.value.magasin.codeMagasin+' - '+this.validateForm.value.magasin.libMagasin],
       // ['Inventaire :', element.numInv.toString()]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { left: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
       // ['Observation :', ''+(element.descrInv ? element.descrInv : '')],
        ['Observation :', this.validateForm.value.descrInv ?  this.validateForm.value.descrInv : ''],
        
      ]
      ,
    });

   // this.tempateLigneInventaire.forEach()


    autoTable(doc, {
      theme: 'grid',
      head: [['Article', 'Désignation', 'Stock Théo.', 'Stock Réel', 'PU', 'Ecart Qté', ' Ecart Montant']],
      headStyles:{
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold' ,
    },
      margin: { top: 0 },
      //body: lignes
      body: []
      ,
    });



    doc.save('fiche_inventaire.pdf');;

  }


}
