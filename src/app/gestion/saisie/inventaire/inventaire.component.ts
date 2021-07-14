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
  ligneInventaireList: LigneInventaire[] = [];
  inventaire: Inventaire = null;

  disabledBtnFicheInventaire: boolean;

  validateForm: FormGroup;

  generateLine: boolean = false ;
  detailView: boolean = false;

  

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
    private ligneInventaireService: LigneInventaireService) { }

  ngOnInit(): void {

    this.makeForm(null);

    this.getAllMagasin();
    this.getAllStocker();
    this.getAllInventaire();
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
        this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
        console.log('All innventaire', this.inventaireList);
        
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
        console.log('All innventaire', this.ligneInventaireList);
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getLignShowOfSelectedMagasin(){
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
          console.log('ligne Inventaire', this.tempateLigneInventaire);
          

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
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (inventaire?.numInv !=null){
      this.tempateLigneInventaire = [];

      for(const ligInventaire of this.ligneInventaireList){
        if(ligInventaire.inventaire.numInv == inventaire.numInv){
          /*this.ligneShow.push({
            this.templateLign: ligDp;
          });*/
          this.tempateLigneInventaire.push(ligInventaire);
        }
      }
      console.log('lines of inventaire', this.tempateLigneInventaire);
      

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

        this.inventaireList.unshift(data.inventaire);
        this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
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

  // Update inventaire
  modifieInventaire(id: String, inventaire: Inventaire, lignesInventaire: LigneInventaire[]): void {
    this.loading = true;
    this.inventaireService.editInventaire2(inventaire.numInv.toString(), new EncapInventaire(inventaire, lignesInventaire)).subscribe(
      (data2) => {
        this.getAllLignenventaire();
        this.getAllInventaire();
        this.getAllMagasin();
      

        console.log(data2);

            const i = this.inventaireList.findIndex(l => l.numInv == data2.inventaire.numInv);
            if (i > -1) {
              this.inventaireList[i] = data2.inventaire;
              this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
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
      }
    );


  }

  // Delete inventaire
  confirm(content, inventaire: Inventaire) {
    this.inventaire = inventaire;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.inventaireService.deleteInventaire2(inventaire?.numInv.toString()).subscribe(
        (data) => {

          console.log(data);
          const i = this.inventaireList.findIndex(l => l.numInv == inventaire.numInv);
          if (i > -1) {
            this.inventaireList.splice(i, 1);
            this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
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

  //Validate inventaire 
  valider(inventaire: Inventaire, eta: boolean){

    inventaire.valideInve = eta;

    this.inventaireService.editInventaire(inventaire.numInv.toString(), inventaire).subscribe(
      (data) => {

        // Procéder à l'ajustement des stocks

        inventaire = data;

        const i = this.inventaireList.findIndex(l => l.numInv == inventaire.numInv);
            if (i > -1) {
              this.inventaireList[i] = inventaire;
              this.inventaireFiltered = [...this.inventaireList.sort((a, b) => a.numInv.localeCompare(b.numInv.valueOf()))];
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
    if(this.generateLine == false){
      console.log('Num magasin',  this.validateForm.value.magasin.numMagasin);
      this.getLignShowOfSelectedMagasin();
      this.generateLine = true;
    }
    else{
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Ces articles existent déjà.', ' Attention !', {progressBar: true});
      }, 3000);
    }

   

  }


}
