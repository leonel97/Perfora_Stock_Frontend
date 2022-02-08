import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CentreConsommation } from 'src/app/models/gestion/definition/centreConsommation';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { CentreConsommationService } from 'src/app/services/gestion/definition/centreConsommation.service';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { ApprovisionnementService } from 'src/app/services/gestion/saisie/approvisionnement.service';
import { DemandeApproService } from 'src/app/services/gestion/saisie/demande-appro.service';
import { LigneApproService } from 'src/app/services/gestion/saisie/ligne-appro.service';
import { LigneDemandeApproService } from 'src/app/services/gestion/saisie/ligne-demande-appro.service';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { SalTools } from 'src/app/utilitaires/salTools';

@Component({
  selector: 'app-bon-servir',
  templateUrl: './bon-servir.component.html',
  styleUrls: ['./bon-servir.component.css']
})
export class BonServirComponent implements OnInit {

  validateForm: FormGroup;
  validateForm2: FormGroup;
  validateForm3: FormGroup;
  loading: boolean;
  loading2: boolean;
  loading3: boolean;

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
    this.makeForm2(null);
    this.makeForm3(null);

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

  resetForm2(): void {
    this.validateForm2.reset();
    for (const key in this.validateForm2.controls) {
      this.validateForm2.controls[key].markAsPristine();
      this.validateForm2.controls[key].updateValueAndValidity();
    }
    this.makeForm2(null);
  }

  makeForm2(donne): void {
    this.validateForm2 = this.fb.group({
      centreCons: [ -1, [Validators.required]],
      sousCentreCons: [ true, [Validators.required]],
      magasin: [ -1, [Validators.required]],
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
    });

  }

  resetForm3(): void {
    this.validateForm3.reset();
    for (const key in this.validateForm3.controls) {
      this.validateForm3.controls[key].markAsPristine();
      this.validateForm3.controls[key].updateValueAndValidity();
    }
    this.makeForm2(null);
  }

  makeForm3(donne): void {
    this.validateForm3 = this.fb.group({
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
      this.printJournalConsIntPdf();

    }

  }

  submit2(){
    this.loading2 = true;
    if (this.validateForm2.valid == false) {

      setTimeout(() => {
        this.loading2 = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      this.printConsIntParCentrePdf();

    }

  }

  submit3(){
    this.loading3 = true;
    if (this.validateForm3.valid == false) {

      setTimeout(() => {
        this.loading3 = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      this.printConsIntParCentreParArticlePdf();

    }

  }

  printJournalConsIntPdf(){

    const formData = this.validateForm.value;
    const doc = new jsPDF();

    let centres: CentreConsommation[] = [];
    let sousCen: boolean = formData.sousCentreCons;
    let ce = this.centreConsList.find((l) => l.numService == formData.centreCons); 
    let mag = this.magasinList.find((l) => l.numMagasin == formData.magasin); 
    let mags: Magasin[] = [];

    if(mag){
      mags = [mag];
    }else{
      mags = this.magasinList;
    }

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
    doc.text('JOURNAL DES BONS DE SORTIE', 50, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Journal des bons de sortie de la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
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
        ['Magsin :', mag ? mag.codeMagasin+' - '+mag.libMagasin : 'Tous les magasins'],
        
      ]
      ,
    });

    this.approService.getAllAppro().subscribe(
      (data) => {
       
       this.ligneApproService.getAllLigneAppro().subscribe(
         (data2) => {

          let lignes = [];
          let totaux = 0;

          centres.forEach(element2 => {

            mags.forEach(element3 => {
              
              
              data.forEach(element1 => {
                let lign = data2.filter((l) => l.appro.numAppro == element1.numAppro);
                if(element1.valideAppro 
                  && element1.dateAppro.valueOf() >= formData.dateDebut.valueOf()
                  && element1.dateAppro.valueOf() <= formData.dateFin.valueOf()
                  && element1.magasin.numMagasin == element3.numMagasin
                  && lign[0] && lign[0].ligneDA.appro.service.numService == element2.numService
                  ){

                    let lig = [];
                    lig.push(element1.numAppro);
                    lig.push(moment(element1.dateAppro).format('DD/MM/YYYY'));
                    lig.push(element1.descriptionAppro);
                    lig.push(lign[0].ligneDA.appro.numDA);
                    lig.push(element2.codeService+' - '+element2.libService);
                    lig.push(element3.codeMagasin+' - '+element3.libMagasin);

                    let tota = 0;
                    lign.forEach(element4 => {
                      tota += element4.puligneAppro * element4.quantiteLigneAppro * element4.ligneDA.uniter.poids;

                    });

                    lig.push(SalTools.salRound(tota));

                    totaux += tota;
                    
                    lignes.push(lig);
                  }
              });


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

          lignes.push([{content: 'Total', styles: {fontStyle: 'bold', halign: 'center'}, colSpan: '6'}, SalTools.salRound(totaux) ])

          autoTable(doc, {
            theme: 'grid',
            margin: { right: 5, left: 5 },
            head: [['Bon Servi', 'Date', 'Référence', 'Demande de Bes.', 'Centre', 'Magasin', 'Montant']],
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
          this.loading = false;
        }
       ); 

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading = false;
      }
    );

    

  }

  printConsIntParCentrePdf(){

    const formData = this.validateForm2.value;
    const doc = new jsPDF();

    let centres: CentreConsommation[] = [];
    let sousCen: boolean = formData.sousCentreCons;
    let ce = this.centreConsList.find((l) => l.numService == formData.centreCons); 
    let mag = this.magasinList.find((l) => l.numMagasin == formData.magasin); 
    let mags: Magasin[] = [];

    if(mag){
      mags = [mag];
    }else{
      mags = this.magasinList;
    }

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
    doc.roundedRect(45, 35, 115, 10, 3, 3, 'FD');
    doc.setFontSize(18);
    doc.text('BONS DE SORTIE PAR CENTRE', 52, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Journal des bons de sortie par centre de consommation sur la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
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
        ['Consommation des Centre Enfant(s) Inclu(s) :', sousCen ? ' OUI ' : ' NON '],
        ['Magsin :', mag ? mag.codeMagasin+' - '+mag.libMagasin : 'Tous les magasins'],
        
      ]
      ,
    });

    this.approService.getAllAppro().subscribe(
      (data) => {
       
       this.ligneApproService.getAllLigneAppro().subscribe(
         (data2) => {

          
          let totaux = 0;

          centres.forEach(element2 => {

            let lignes = [];
            let total = 0;

            mags.forEach(element3 => {
              
              
              data.forEach(element1 => {
                let lign = data2.filter((l) => l.appro.numAppro == element1.numAppro);
                if(element1.valideAppro 
                  && element1.dateAppro.valueOf() >= formData.dateDebut.valueOf()
                  && element1.dateAppro.valueOf() <= formData.dateFin.valueOf()
                  && element1.magasin.numMagasin == element3.numMagasin
                  && lign[0] && lign[0].ligneDA.appro.service.numService == element2.numService
                  ){

                    let lig = [];
                    lig.push(element1.numAppro);
                    lig.push(moment(element1.dateAppro).format('DD/MM/YYYY'));
                    lig.push(element1.descriptionAppro);
                    lig.push(lign[0].ligneDA.appro.numDA);
                    lig.push(element2.codeService+' - '+element2.libService);
                    lig.push(element3.codeMagasin+' - '+element3.libMagasin);

                    let tota = 0;
                    lign.forEach(element4 => {
                      tota += element4.puligneAppro * element4.quantiteLigneAppro * element4.ligneDA.uniter.poids;

                    });

                    lig.push(SalTools.salRound(tota));

                    total += tota;
                    
                    lignes.push(lig);
                  }
              });


            });

            if(lignes.length > 0){
                
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
                theme: 'plain',
                margin: { left: 40 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                  1: { textColor: 0, halign: 'left' },
                },
                body: [
                  
                  ['Centre :', element2.codeService+' - '+element2.libService ],
                  ['Catégorie :', element2.typeService ? element2.typeService.codeTypService+' - '+element2.typeService.libTypService : 'aucun'],
                  ['Centre Parent :', element2.superService ? element2.superService.codeService+' - '+element2.superService.libService : 'aucun'],
                  
                  
                ]
                ,
              });
    
              lignes.push([{content: 'Total', styles: {fontStyle: 'bold', halign: 'center'}, colSpan: '6'}, SalTools.salRound(total) ])
    
              totaux += total;

              autoTable(doc, {
                theme: 'grid',
                margin: { right: 5, left: 5 },
                head: [['Bon Servi', 'Date', 'Référence', 'Demande de Bes.', 'Centre', 'Magasin', 'Montant']],
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


          autoTable(doc, {
            theme: 'grid',
            margin: { top: 0,},
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            },
            body: [
              ['Total Général', SalTools.salRound(totaux)],
              
            ]
            ,
          });

          for (let index = 0; index < doc.getNumberOfPages(); index++) {
            doc.setPage(index+1);
      
            doc.setFontSize(10);
            doc.setFont('Times New Roman', 'italic', 'bold');
      
            doc.text('Powered by PerfOra-Stock Web\nLe '+moment(Date.now()).format('DD/MM/YYYY à HH:mm:ss'), 5, 290);
            
            doc.text('Page '+(index+1)+' sur '+doc.getNumberOfPages(), 185, 290);
      
            
          }

          this.loading2 = false;
          doc.output('dataurlnewwindow');



         },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.loading2 = false;
        }
       ); 

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading2 = false;
      }
    );

    

  }

  printConsIntParCentreParArticlePdf(){

    const formData = this.validateForm3.value;
    const doc = new jsPDF({orientation : "l"});

    let centres0: CentreConsommation[] = [];
    let sousCen: boolean = formData.sousCentreCons;
    let ce0 = this.centreConsList.find((l) => l.numService == formData.centreCons); 
    let mag = this.magasinList.find((l) => l.numMagasin == formData.magasin); 
    let mags: Magasin[] = [];

    if(mag){
      mags = [mag];
    }else{
      mags = this.magasinList;
    }

    if(ce0){
      centres0 = [ce0];
    } else {
      centres0 = [...this.centreConsList];
    }

    centres0.sort((a, b) => a.codeService.toString() > b.codeService.toString() ? 1 : -1);

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
    doc.roundedRect(72, 35, 160, 10, 3, 3, 'FD');
    doc.setFontSize(20);
    doc.text('CONSOMMATION INTERNE PAR ARTICLE', 81, 43);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
      },
      body: [
        ['Consommation interne d\'article par centre de consommation sur la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
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
        
        ['Centre :', ce0 ? ce0.codeService+' - '+ce0.libService : 'Tous les centres de consommation'],
        ['Centre Enfant(s) Inclu(s) :', sousCen ? ' OUI ' : ' NON '],
        ['Magsin :', mag ? mag.codeMagasin+' - '+mag.libMagasin : 'Tous les magasins'],
        
      ]
      ,
    });


    

    this.approService.getAllAppro().subscribe(
      (data) => {
       
       this.ligneApproService.getAllLigneAppro().subscribe(
         (data2) => {

          centres0.forEach(ce => {
            
            let centres: CentreConsommation[] = [];
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

            let lignes = [];
            let totaux = 0;
            let totalQte = 0;

            centres.forEach(element2 => {

              mags.forEach(element3 => {
                
                
                data.forEach(element1 => {
                  let lign = data2.filter((l) => l.appro.numAppro == element1.numAppro);
                  if(element1.valideAppro 
                    && element1.dateAppro.valueOf() >= formData.dateDebut.valueOf()
                    && element1.dateAppro.valueOf() <= formData.dateFin.valueOf()
                    && element1.magasin.numMagasin == element3.numMagasin
                    && lign[0] && lign[0].ligneDA.appro.service.numService == element2.numService
                    ){

                      lign.forEach(element4 => {
                        let i = lignes.findIndex( l => l[0] == element4.ligneDA.article.codeArticle);
                        if(i > -1){
                          lignes[i][2] += element4.quantiteLigneAppro ;
                          lignes[i][3] += element4.puligneAppro * element4.quantiteLigneAppro * element4.ligneDA.uniter.poids;
                        }
                        else {
                          lignes.push([element4.ligneDA.article.codeArticle, element4.ligneDA.article.libArticle, element4.quantiteLigneAppro, element4.puligneAppro * element4.quantiteLigneAppro * element4.ligneDA.uniter.poids])
                        }
                        
                        totaux += element4.puligneAppro * element4.quantiteLigneAppro * element4.ligneDA.uniter.poids;
                        totalQte += element4.quantiteLigneAppro;

                      });

                      
                    }
                });


              });

            });

            lignes.forEach(lig => {
              lig[3] = SalTools.salRound(lig[3]);
            });

            lignes.sort((a, b) => {
              let el1:String = a[0];
              let el2:String = b[0];
              
              return el1.localeCompare(el2.toString());
              
            })

            if(lignes.length > 0) {
                lignes.push([{content: 'Total', styles: {fontStyle: 'bold', halign: 'center'}, colSpan: '2'}, totalQte, SalTools.salRound(totaux)])

                autoTable(doc, {
                  theme: 'plain',
                  margin: { left: 40 },
                  columnStyles: {
                    0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                    1: { textColor: 0, halign: 'left' },
                  },
                  body: [
                    
                    ['Centre :', ce.codeService+' - '+ce.libService ],
                    ['Catégorie :', ce.typeService ? ce.typeService.codeTypService+' - '+ce.typeService.libTypService : 'aucun'],
                    ['Centre Parent :', ce.superService ? ce.superService.codeService+' - '+ce.superService.libService : 'aucun'],
                    
                    
                  ]
                  ,
                });

                autoTable(doc, {
                  theme: 'grid',
                  margin: { right: 5, left: 5 },
                  head: [['Code Article', 'Libellé', 'Quantité', 'Montant']],
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
      
            doc.text('Powered by PerfOra-Stock Web\nLe '+moment(Date.now()).format('DD/MM/YYYY à HH:mm:ss'), 5, 205);
            
            doc.text('Page '+(index+1)+' sur '+doc.getNumberOfPages(), 270, 205);
      
            
          }

          this.loading3 = false;
          doc.output('dataurlnewwindow');



         },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.loading3 = false;
        }
       ); 

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading3 = false;
      }
    );

    

  }

}
