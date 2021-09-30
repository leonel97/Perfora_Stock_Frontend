import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {HttpErrorResponse} from "@angular/common/http";

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';

import { EcritureComptable } from 'src/app/models/gestion/comptabilisation/ecritureComptable.model';
import { EcritureComptableService } from 'src/app/services/gestion/comptabilisation/ecritureComptable.service';
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-ecriture-comptable',
  templateUrl: './ecriture-comptable.component.html',
  styleUrls: ['./ecriture-comptable.component.css']
})
export class EcritureComptableComponent implements OnInit {

  validateForm: FormGroup;
  loading: boolean;
  
  EcritureComptableList: EcritureComptable[] = [];
  ecritureList: EcritureComptable[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ecritureComptableService: EcritureComptableService,
    public authService: AuthService) { 
      this.makeForm(null);
    }

  ngOnInit(): void {
    this.getAllEcritureComptable();
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
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
    });

  }

  //Get all ecriture comptable
  getAllEcritureComptable(){
    this.ecritureComptableService.list().subscribe(
      (data) => {
        this.EcritureComptableList = [...data];
        console.log(this.EcritureComptableList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
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
      this.printJournalComptableBetweenTwoPeriode();
      this.loading = false;
    }

  }

  // printJournalComptable Between two periode
  printJournalComptableBetweenTwoPeriode(){

    const formData = this.validateForm.value;
    const doc = new jsPDF({orientation: "landscape"});
    let lignes = [];
    this.ecritureList = [];

    this.ecritureComptableService.list().subscribe(
      (data) => {
        //debut select between Date 
        
        let totalDebit:number = 0;
        let totalCredit:number = 0;
        data.forEach(element => {
          if(element.dateEcri.valueOf() >= formData.dateDebut.valueOf()
            && element.dateEcri.valueOf() <= formData.dateFin.valueOf()){
              let lig = [];
              lig.push(element.journal);
              lig.push(moment(element.dateEcri).format('DD/MM/YYYY'));
              lig.push(element.famille.codeFamille);
              lig.push(element.compteEcri);
              if(element.credit == true){
                lig.push(0);
                lig.push(element.montantEcri);
                totalCredit += element.montantEcri

              }else if(element.credit == false){
                lig.push(element.montantEcri);
                lig.push(0);
                totalDebit += element.montantEcri

              }
              lig.push(element.libEcri);
              lig.push(element.centreConsEcri);
              lig.push(element.referenceEcri);

              lignes.push(lig);

            }
            
        });
        lignes.push([{ content: 'Totaux', colSpan: 4, styles: { halign: 'center' } }, totalDebit, totalDebit, { content: '', colSpan: 3}]);
        console.log('Ecriture periode', lignes);

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
        doc.text('JOURNAL COMPTABLE', 110, 43);
    
        autoTable(doc, {
          theme: 'plain',
          startY:50,
          margin: { top: 0 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
          },
          body: [
            ['Journal comptable de la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
          ]
          ,
        });
  
        autoTable(doc, {
          theme: 'grid',
          head: [['Journal', 'Date', 'Famille', 'Compte', 'Débit', 'Crédit', 'Libellé', 'Centre', 'Référence']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
          margin: { top: 10 },
          body: lignes
          ,
        });
  
      
        //console.log("ecr", lignes);
        doc.output('dataurlnewwindow');
        //doc.save('leo.pdf');
        

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
      

      
      

  }
  

}
