import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CentreConsommation } from 'src/app/models/gestion/definition/centreConsommation';
import { LigneDemandeAppro } from 'src/app/models/gestion/saisie/ligneDemandeAppro.model';
import { CentreConsommationService } from 'src/app/services/gestion/definition/centreConsommation.service';
import { ApprovisionnementService } from 'src/app/services/gestion/saisie/approvisionnement.service';
import { DemandeApproService } from 'src/app/services/gestion/saisie/demande-appro.service';
import { LigneApproService } from 'src/app/services/gestion/saisie/ligne-appro.service';
import { LigneDemandeApproService } from 'src/app/services/gestion/saisie/ligne-demande-appro.service';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { Utils } from 'src/app/utilitaires/utils';


@Component({
  selector: 'app-conso-interne',
  templateUrl: './conso-interne.component.html',
  styleUrls: ['./conso-interne.component.css']
})
export class ConsoInterneComponent implements OnInit {

  validateForm: FormGroup;
  validateForm2: FormGroup;
  validateForm3: FormGroup;
  loading: boolean;
  loading2: boolean;

  centreConsList: CentreConsommation[] = [];
  magasinList: Magasin[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private centreConsService: CentreConsommationService,
    private daService: DemandeApproService,
    private ligneDaService: LigneDemandeApproService,
    private approService: ApprovisionnementService,
    private ligneApproService: LigneApproService,
    private magasinService: MagasinService,
  ) { 

    this.makeForm(null);

  }


  ngOnInit(): void {

    this.getAllCentreCons();
    this.getAllMagasin();

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
      centreCons: [ -1, [Validators.required]],
      sousCentreCons: [ true, [Validators.required]],
      magasin: [ -1, [Validators.required]],
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
    });

  }

  getAllCentreCons(){
    this.centreConsService.list().subscribe(
      (data: CentreConsommation[]) => {
        this.centreConsList = data;
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

  submit(){
    this.loading = true;
    if (this.validateForm.valid == false) {

      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      this.printJournalConsPdf();

    }

  }

  printJournalConsPdf(){

    const formData = this.validateForm.value;
    const doc = new jsPDF();

    let centres: CentreConsommation[] = [];
    let sousCen: boolean = formData.sousCentreCons;
    let ce = this.centreConsList.find((l) => l.numService == formData.centreCons); 

    if(ce){
      
      centres.push(ce);
      if(sousCen){
        let fini: boolean = false;
        let tabToMerge: CentreConsommation[] [] = [];
        tabToMerge.push([ce]);
        while (fini == false) {
          let tab2: CentreConsommation[] = [];
          tabToMerge[tabToMerge.length-1].forEach(elementDeep => {
            tab2 = [...tab2,...this.centreConsList.filter((l) => l.superService?.numService == elementDeep.numService)];
          });
          
          if(tab2.length == 0){
            fini = true;
          } else{
            tabToMerge.push(tab2);
            centres = [...centres,...tab2];
          }
        }

      }

    } else {
      centres = [...this.centreConsList];
    }

    centres.sort((a, b) => a.codeService.toString() > b.codeService.toString() ? 1 : -1)


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
    doc.roundedRect(45, 35, 123, 10, 3, 3, 'FD');
    doc.setFontSize(18);
    doc.text('JOURNAL DE DEMANDE DE BESOIN', 50, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Journal des demandes de besoin de la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      startY:60,
      margin: { right: 40 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        
        ['Centre :', ce ? ce.codeService+' - '+ce.libService : 'Tous les centres de consommation'],
        ['Centre Fille(s) Incluse(s) :', sousCen ? ' OUI ' : ' NON '],
        
      ]
      ,
    });

    this.daService.getAllDemandeAppro().subscribe(
      (data) => {
       
        let lignes = [];

        centres.forEach(element2 => {

          data.forEach(element1 => {
            if(element1.valideDA 
              && element1.dateDA.valueOf() >= formData.dateDebut.valueOf()
              && element1.dateDA.valueOf() <= formData.dateFin.valueOf()
              && element1.service.numService == element2.numService){
  
                let lig = [];
                lig.push(element1.numDA);
                lig.push(moment(element1.dateDA).format('DD/MM/YYYY'));
                lig.push(element1.description);
                lig.push(element1.service.codeService+' - '+element1.service.libService);
                
                
                lignes.push(lig);
              }
          });

        });


        lignes.sort((a, b) => {
          let el1:String = a[1];
          let el2:String = b[1];
          let dat1: Date = new Date(Number.parseInt(el1.substr(6,4)), Number.parseInt(el1.substr(3,2)), Number.parseInt(el1.substr(0,2)));
          let dat2: Date = new Date(Number.parseInt(el2.substr(6,4)), Number.parseInt(el2.substr(3,2)), Number.parseInt(el2.substr(0,2)));
          if(dat1.valueOf() > dat2.valueOf()){
            return 1;
          }
          else if(dat1.valueOf() < dat2.valueOf()){
            return -1;
          }
          else{
            return 0;
          }
          
        })

        autoTable(doc, {
          theme: 'grid',
          head: [['Demande de Bes.', 'Date', 'Référence', 'Centre']],
          headStyles:{
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold' ,
        },
          body: lignes
          ,
        });
    
        for (let index = 0; index < doc.getNumberOfPages(); index++) {
          doc.setPage(index+1);
    
          doc.setFontSize(10);
          doc.setFont('Times New Roman', 'italic', 'bold');
    
          doc.text('Powered by PerfOra-Stock Web\nLe '+moment(Date.now()).format('DD/MM/YYYY à HH:mm:ss'), 5, 290);
          
          doc.text('Page '+(index+1)+' sur '+doc.getNumberOfPages(), 185, 290);
    
          
        }
    
        this.loading = false;
        doc.output('dataurlnewwindow');
    

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );



  }



}
