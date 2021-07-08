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
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';

import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';


@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})
export class InventaireComponent implements OnInit {

  
  searchControl: FormControl = new FormControl();
  magasinFiltered;

  disabledBtnFicheInventaire: boolean;

  validateForm: FormGroup;

  magasinList: Magasin[] = [];

  activeTabsNav;
  constructor(
    private magasinService: MagasinService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    this.makeForm(null);

    this.magasinService.getAllMagasin().subscribe(
      (data: any) => {
        this.magasinList = [...data];
        this.magasinFiltered = this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()));
        console.log(this.magasinList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }
  

  
  makeForm(inventaire: Inventaire): void {
    this.validateForm = this.fb.group({
      numInv: [inventaire != null ? inventaire.numInv: null],
      dateInv: [inventaire != null ? inventaire.dateInv.toString().substr(0, 10): null,
      [Validators.required]],
      descrInv: [inventaire != null ? inventaire.descrInv : null],
      magasin: [inventaire != null ? inventaire.magasin.codeMagasin : null,  [Validators.required]],
      /*frs: [demandePrix != null ? demandePrix.commande.frs.numFournisseur : null,
        [Validators.required]],
      numComm: [demandePrix != null ? demandePrix.commande.numCommande : null],*/
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (inventaire?.numInv !=null){
     // this.ligneShow = [];

     /* for(const ligDp of this.ligneDemandePrixList){
        if(ligDp.demandePrix.idDemandePrix == demandePrix.idDemandePrix){
          this.ligneShow.push({
            lignesDemandePrix: ligDp,
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligDp.article.numArticle),
            selectedArticl: ligDp.article.numArticle,
            selectedUniter: ligDp.uniter ? ligDp.uniter.numUniter : null,
          });
        }
      }*/

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

    //this.ligneShow = [];
    //this.selectedCurrentFrsInter = [];
    //this.calculTotaux();

  }


}
