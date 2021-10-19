import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { DemandePrixService } from 'src/app/services/gestion/saisie/demandePrix.service';
import { LigneDemandePrixService } from 'src/app/services/gestion/saisie/ligneDemandePrix.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { CommandeAchatService } from 'src/app/services/gestion/saisie/commande-achat.service';
import { LettreCommandeService } from 'src/app/services/gestion/saisie/lettre-commande.service';
import { BondTravailService } from 'src/app/services/gestion/saisie/bond-travail.service';
import { AppelOffreService } from 'src/app/services/gestion/saisie/appel-offre.service';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { Direction } from 'src/app/models/gestion/definition/direction';
import { HttpErrorResponse } from '@angular/common/http';
import { FactureProFormAchaService } from 'src/app/services/gestion/saisie/facture-pro-form-acha.service';
import { ConsulterFrsForDpService } from 'src/app/services/gestion/saisie/consulter-frs-for-dp.service';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { FactureProFormAcha } from 'src/app/models/gestion/saisie/factureProFormAcha.model';
import { find } from 'rxjs/operators';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { LigneReceptionService } from 'src/app/services/gestion/saisie/ligne-reception.service';
import { LigneReception } from 'src/app/models/gestion/saisie/ligneReception.model';
import { element } from 'protractor';
import { SalTools } from 'src/app/utilitaires/salTools';


@Component({
  selector: 'app-commande-engagement-article',
  templateUrl: './commande-engagement-article.component.html',
  styleUrls: ['./commande-engagement-article.component.css']
})
export class CommandeEngagementArticleComponent implements OnInit {

  validateForm: FormGroup;
  validateForm2: FormGroup;
  validateForm3: FormGroup;
  loading: boolean;
  loading2: boolean;

  fournisseurList: Fournisseur[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dpService: DemandePrixService,
    private ligneDpService: LigneDemandePrixService,
    private commandeService: CommandeService,
    private ligneCommService: LigneCommandeService,
    private comAchatService: CommandeAchatService,
    private letrreCommandeService: LettreCommandeService,
    private bondTravailService: BondTravailService,
    private appelOffreService: AppelOffreService,
    private fpfaService: FactureProFormAchaService,
    private frsConsulterService: ConsulterFrsForDpService,
    private frsService: FournisseurService,
    private ligneReceptionService: LigneReceptionService,

  ) { 

    this.makeForm(null);
    this.makeForm2(null);

  }

  ngOnInit(): void {

    this.getAllFournisseur();

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
      categorieCom1: [ -1, [Validators.required]],
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
    });

  }

  makeForm2(donne): void {
    this.validateForm2 = this.fb.group({
      categorieCom1: [ -1, [Validators.required]],
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
      modeLivr: [ -1, [Validators.required]],
      frs: [ -1, [Validators.required]],

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
      this.printJournalEngagementPdf();
    }

  }

  submit2(){
    this.loading2 = true;
    if (this.validateForm.valid == false) {

      setTimeout(() => {
        this.loading2 = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      this.printEngagementParFrsPdf();
    }

  }

  getAllFournisseur(){
    this.frsService.list().subscribe(
      (data: any) => {
        this.fournisseurList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getTotalByCommandeAndLigne(commande:Commande, ligneCom:LigneCommande[]):number{
    let total:number = 0;

    ligneCom.forEach(element => {
      if(element.numCommande.numCommande == commande.numCommande){
        total += element.puLigneCommande * element.qteLigneCommande * (1+(element.tva/100));
      }
    });

    return total;
  }

  isACommandeSatisfied(commande: Commande, lignesCommandeList: LigneCommande[], ligneReceptionList: LigneReception[]): number{

    if(commande){
      let finded: boolean = false;
      for(const lig of lignesCommandeList){
        if(lig.numCommande.numCommande == commande.numCommande 
          && lig.satisfaite == false){
            finded = false;
          }
          else if(lig.numCommande.numCommande == commande.numCommande){
            finded = true;
          }
      }

      if(finded == true){
        return 2;
      }

      for (const lig2 of ligneReceptionList) {
        if(lig2.ligneCommande.numCommande.numCommande == commande.numCommande){
          return 1;
          break;
        }
      }
      return 0;

    }
    
    return 0;

  }


  printJournalEngagementPdf(){

    this.dpService.getAllDemandePrix().subscribe(
      (data) => {
        this.comAchatService.getAllCommandeAchat().subscribe(
          (data2) => {
            
            this.appelOffreService.getAllAppelOffre().subscribe(
              (data3) => {
                
                this.bondTravailService.getAllBondTravail().subscribe(
                  (data4) => {
                    
                    this.letrreCommandeService.getAllLettreCommande().subscribe(
                      (data5) => {
                        
                        this.ligneDpService.getAllLigneDemandePrix().subscribe(
                          (data6) => {
                            
                            this.ligneCommService.getAllLigneCommande().subscribe(
                              (data7) => {

                                this.frsConsulterService.getAllConsulterFrsForDp().subscribe(
                                  (data8) => {
                                    
                                    this.fpfaService.getAllFactureProFormAcha().subscribe(
                                      (data9) => {

                                        const formData = this.validateForm.value;
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
                                        doc.text('JOURNAL DE COMMANDE', 60, 43);
                                    
                                        autoTable(doc, {
                                          theme: 'plain',
                                          startY:50,
                                          margin: { top: 0 },
                                          columnStyles: {
                                            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
                                          },
                                          body: [
                                            ['Journal des commandes ou engagements de la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
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
                                            ['Catégorie :', formData.categorieCom1 == -1 ? 'Toutes les Catégories' : formData.categorieCom1 == 0 ? 'Demande de Prix' : formData.categorieCom1 == 1 ? 'Commande Achat' : formData.categorieCom1 == 2 ? 'Lettre de Commande' : formData.categorieCom1 == 3 ? 'Bon de Travail' : 'Appel d\'Offre'],
                                            
                                          ]
                                          ,
                                        });
        
                                        let lignes = [];
        
                                        if(formData.categorieCom1 == -1 || formData.categorieCom1 == 0){
                                          //data DP
                                          data.forEach(element => {
                                            if(element.valideDemandePrix 
                                              && element.dateDemandePrix.valueOf() >= formData.dateDebut.valueOf()
                                              && element.dateDemandePrix.valueOf() <= formData.dateFin.valueOf()){

                                                let lig = [];

                                                lig.push(element.idDemandePrix);
                                                lig.push(moment(element.dateDemandePrix).format('DD/MM/YYYY'));
                                                lig.push(element.designationDemandePrix);

                                                let frs:Fournisseur = data8.find((l) => l.choisit && l.demandePrix.idDemandePrix == element.idDemandePrix)?.fournisseur;

                                                lig.push( frs ? frs.codeFrs+' - '+frs.identiteFrs : '');

                                                let fpfa: FactureProFormAcha = data9.find((l) => l.valideFpfa && l.demandePrix.idDemandePrix == element.idDemandePrix && l.fournisseur.numFournisseur == frs?.numFournisseur);

                                                if(fpfa){
                                                  lig.push(this.getTotalByCommandeAndLigne(fpfa.commande, data7));
                                                }
                                                
                                                lignes.push(lig);
                                              }
                                          });

                                        }

                                        if(formData.categorieCom1 == -1 || formData.categorieCom1 == 1){
                                          //data2
                                          data2.forEach(element => {
                                            if(element.commande.valide 
                                              && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                              && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()){

                                                let lig = [];
                                                lig.push(element.numComAchat);
                                                lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                lig.push(element.commande.description);
                                                lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                lignes.push(lig);
                                              }
                                          });


                                        }

                                        if(formData.categorieCom1 == -1 || formData.categorieCom1 == 2){
                                          //data5
                                          data5.forEach(element => {
                                            if(element.commande.valide 
                                              && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                              && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()){

                                                let lig = [];
                                                lig.push(element.numLettreComm);
                                                lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                lig.push(element.commande.description);
                                                lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                lignes.push(lig);
                                              }
                                          });
                                        }

                                        if(formData.categorieCom1 == -1 || formData.categorieCom1 == 3){
                                          //data4
                                          data4.forEach(element => {
                                            if(element.commande.valide 
                                              && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                              && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()){

                                                let lig = [];
                                                lig.push(element.numBondTravail);
                                                lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                lig.push(element.commande.description);
                                                lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                lignes.push(lig);
                                              }
                                          });
                                        }

                                        if(formData.categorieCom1 == -1 || formData.categorieCom1 == 4){
                                          //data3
                                          data3.forEach(element => {
                                            if(element.commande.valide 
                                              && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                              && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()){

                                                let lig = [];
                                                lig.push(element.numAppelOffre);
                                                lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                lig.push(element.commande.description);
                                                lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));
                                                
                                                lignes.push(lig);
                                              }
                                          });
                                        }

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
                                          head: [['Commande', 'Date', 'Référence', 'Fournisseur', 'Montant TTC']],
                                          headStyles:{
                                            fillColor: [41, 128, 185],
                                            textColor: 255,
                                            fontStyle: 'bold' ,
                                        },
                                          body: lignes
                                          ,
                                        });
                            
                                    
                                    
                                        this.loading = false;
                                        doc.output('dataurlnewwindow');
                                    
        
                                        
                                
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

  printEngagementParFrsPdf(){

    this.dpService.getAllDemandePrix().subscribe(
      (data) => {
        this.comAchatService.getAllCommandeAchat().subscribe(
          (data2) => {
            
            this.appelOffreService.getAllAppelOffre().subscribe(
              (data3) => {
                
                this.bondTravailService.getAllBondTravail().subscribe(
                  (data4) => {
                    
                    this.letrreCommandeService.getAllLettreCommande().subscribe(
                      (data5) => {
                        
                        this.ligneDpService.getAllLigneDemandePrix().subscribe(
                          (data6) => {
                            
                            this.ligneCommService.getAllLigneCommande().subscribe(
                              (data7) => {

                                this.frsConsulterService.getAllConsulterFrsForDp().subscribe(
                                  (data8) => {
                                    
                                    this.fpfaService.getAllFactureProFormAcha().subscribe(
                                      (data9) => {

                                        this.ligneReceptionService.getAllLigneReception().subscribe(
                                          (data10) => {
    
                                            const formData = this.validateForm2.value;
                                            const doc = new jsPDF({orientation: "landscape"});
                                        
                                            let concernedFrs: Fournisseur[] = formData.frs == -1 ? [...this.fournisseurList] : [this.fournisseurList.find((l) => l.numFournisseur == formData.frs)];
                                        
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
                                            doc.text('COMMANDES PAR FOURNISSEUR', 95, 43);
                                        
                                            autoTable(doc, {
                                              theme: 'plain',
                                              startY:50,
                                              margin: { top: 0 },
                                              columnStyles: {
                                                0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
                                              },
                                              body: [
                                                ['Journal des commandes ou engagements de la Période du '+moment(formData.dateDebut).format('DD/MM/YYYY')+' au '+moment(formData.dateFin).format('DD/MM/YYYY')]
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
                                                ['Catégorie :', formData.categorieCom1 == -1 ? 'Toutes les Catégories' : formData.categorieCom1 == 0 ? 'Demande de Prix' : formData.categorieCom1 == 1 ? 'Commande Achat' : formData.categorieCom1 == 2 ? 'Lettre de Commande' : formData.categorieCom1 == 3 ? 'Bon de Travail' : 'Appel d\'Offre'],
                                                ['Mode de Livraison :', formData.modeLivr == -1 ? 'Tous les Mode' : formData.modeLivr == 0 ? 'Non Livré' : formData.modeLivr == 1 ? 'Patiellement Livré' : 'Totalement Livré'],
                                                ['Fournisseur :', formData.frs == -1 ? 'Toutes les Fournisseurs' : concernedFrs[0]?.codeFrs+' - '+concernedFrs[0]?.identiteFrs],
                                              ]
                                              ,
                                            });
            
                                            let lignes = [];
            
                                            if(formData.categorieCom1 == -1 || formData.categorieCom1 == 0){
                                              //data DP
                                              data.forEach(element => {
                                                if(element.valideDemandePrix 
                                                  && element.dateDemandePrix.valueOf() >= formData.dateDebut.valueOf()
                                                  && element.dateDemandePrix.valueOf() <= formData.dateFin.valueOf()){
    
                                                    let frs:Fournisseur = data8.find((l) => l.choisit && l.demandePrix.idDemandePrix == element.idDemandePrix)?.fournisseur;

                                                    let fpfa: FactureProFormAcha = data9.find((l) => l.valideFpfa && l.demandePrix.idDemandePrix == element.idDemandePrix && l.fournisseur.numFournisseur == frs?.numFournisseur);

                                                    let lig = [];

                                                    if(fpfa && (formData.frs == -1 || formData.frs == frs.numFournisseur)){
                                                      if(formData.modeLivr == -1 || formData.modeLivr == this.isACommandeSatisfied(fpfa.commande, data7, data10)){
                                                        
                                                        lig.push(element.idDemandePrix);
                                                        lig.push(moment(element.dateDemandePrix).format('DD/MM/YYYY'));
                                                        lig.push(element.designationDemandePrix);
                                                        lig.push( frs ? frs.codeFrs+' - '+frs.identiteFrs : '');
                                                        lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(fpfa.commande, data7)));

                                                        let lignesCom:LigneCommande[] = data7.filter((l) => l.numCommande.numCommande == fpfa.commande.numCommande);

                                                        let deepLig = [];
                                                        
                                                        //['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant TTC', 'Qte Livrée', 'Qte Rest.']
                                                        let totalTtc:number = 0;
                                                        lignesCom.forEach(element2 => {
                                                          let dee = [];

                                                          dee.push(element2.article.codeArticle);
                                                          dee.push(element2.article.libArticle);
                                                          dee.push(element2.qteLigneCommande);
                                                          dee.push(element2.uniter.libUniter);
                                                          dee.push(element2.puLigneCommande);
                                                          dee.push(element2.tva);
                                                          let ht = element2.qteLigneCommande*element2.puLigneCommande;
                                                          dee.push(SalTools.salRound(ht*(1+(element2.tva/100))));
                                                          totalTtc += ht*(1+(element2.tva/100));

                                                          let qteLivr: number = 0;

                                                          data10.filter((l) => l.ligneCommande.idLigneCommande == element2.idLigneCommande)
                                                          .forEach(element3 => {
                                                            qteLivr += element3.quantiteLigneReception;
                                                          });

                                                          dee.push(qteLivr);
                                                          dee.push(element2.qteLigneCommande - qteLivr);

                                                          deepLig.push(dee);
                                                          

                                                        });

                                                        deepLig.push([{ content: 'TOTAL', colSpan: 6, styles: { halign: 'center' } }, SalTools.salRound(totalTtc), { content: '', colSpan: 2}]);
                                                        
                                                        lig.push(deepLig);
                                                        
                                                        lignes.push(lig);
                                                        
                                                      }

      
                                                    }
                                                    
                                                    
                                                  }
                                              });
    
                                            }
    
                                            if(formData.categorieCom1 == -1 || formData.categorieCom1 == 1){
                                              //data2
                                              data2.forEach(element => {
                                                if(element.commande.valide 
                                                  && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                                  && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()
                                                  && (formData.modeLivr == -1 || formData.modeLivr == this.isACommandeSatisfied(element.commande, data7, data10))
                                                  && (formData.frs == -1 || formData.frs == element.commande.frs.numFournisseur)
                                                  ){
    
                                                    let lig = [];
                                                    lig.push(element.numComAchat);
                                                    lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                    lig.push(element.commande.description);
                                                    lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                    lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                    let lignesCom:LigneCommande[] = data7.filter((l) => l.numCommande.numCommande == element.commande.numCommande);

                                                    let deepLig = [];
                                                    
                                                    //['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant TTC', 'Qte Livrée', 'Qte Rest.']
                                                    let totalTtc:number = 0;
                                                    lignesCom.forEach(element2 => {
                                                      let dee = [];

                                                      dee.push(element2.article.codeArticle);
                                                      dee.push(element2.article.libArticle);
                                                      dee.push(element2.qteLigneCommande);
                                                      dee.push(element2.uniter.libUniter);
                                                      dee.push(element2.puLigneCommande);
                                                      dee.push(element2.tva);
                                                      let ht = element2.qteLigneCommande*element2.puLigneCommande;
                                                      dee.push(SalTools.salRound(ht*(1+(element2.tva/100))));
                                                      totalTtc += ht*(1+(element2.tva/100));

                                                      let qteLivr: number = 0;

                                                      data10.filter((l) => l.ligneCommande.idLigneCommande == element2.idLigneCommande)
                                                      .forEach(element3 => {
                                                        qteLivr += element3.quantiteLigneReception;
                                                      });

                                                      dee.push(qteLivr);
                                                      dee.push(element2.qteLigneCommande - qteLivr);

                                                      deepLig.push(dee);
                                                      

                                                    });

                                                    deepLig.push([{ content: 'TOTAL', colSpan: 6, styles: { halign: 'center' } }, SalTools.salRound(totalTtc), { content: '', colSpan: 2}]);
                                                    
                                                    lig.push(deepLig);
                                                    
                                                    lignes.push(lig);

                                                  }
                                              });
    
    
                                            }
    
                                            if(formData.categorieCom1 == -1 || formData.categorieCom1 == 2){
                                              //data5
                                              data5.forEach(element => {
                                                if(element.commande.valide 
                                                  && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                                  && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()
                                                  && (formData.modeLivr == -1 || formData.modeLivr == this.isACommandeSatisfied(element.commande, data7, data10))
                                                  && (formData.frs == -1 || formData.frs == element.commande.frs.numFournisseur)
                                                  ){
    
                                                    let lig = [];
                                                    lig.push(element.numLettreComm);
                                                    lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                    lig.push(element.commande.description);
                                                    lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                    lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                    let lignesCom:LigneCommande[] = data7.filter((l) => l.numCommande.numCommande == element.commande.numCommande);

                                                    let deepLig = [];
                                                    
                                                    //['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant TTC', 'Qte Livrée', 'Qte Rest.']
                                                    let totalTtc:number = 0;
                                                    lignesCom.forEach(element2 => {
                                                      let dee = [];

                                                      dee.push(element2.article.codeArticle);
                                                      dee.push(element2.article.libArticle);
                                                      dee.push(element2.qteLigneCommande);
                                                      dee.push(element2.uniter.libUniter);
                                                      dee.push(element2.puLigneCommande);
                                                      dee.push(element2.tva);
                                                      let ht = element2.qteLigneCommande*element2.puLigneCommande;
                                                      dee.push(SalTools.salRound(ht*(1+(element2.tva/100))));
                                                      totalTtc += ht*(1+(element2.tva/100));

                                                      let qteLivr: number = 0;

                                                      data10.filter((l) => l.ligneCommande.idLigneCommande == element2.idLigneCommande)
                                                      .forEach(element3 => {
                                                        qteLivr += element3.quantiteLigneReception;
                                                      });

                                                      dee.push(qteLivr);
                                                      dee.push(element2.qteLigneCommande - qteLivr);

                                                      deepLig.push(dee);
                                                      

                                                    });

                                                    deepLig.push([{ content: 'TOTAL', colSpan: 6, styles: { halign: 'center' } }, SalTools.salRound(totalTtc), { content: '', colSpan: 2}]);
                                                    
                                                    lig.push(deepLig);
                                                    
                                                    lignes.push(lig);
                                                  }
                                              });
                                            }
    
                                            if(formData.categorieCom1 == -1 || formData.categorieCom1 == 3){
                                              //data4
                                              data4.forEach(element => {
                                                if(element.commande.valide 
                                                  && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                                  && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()
                                                  && (formData.modeLivr == -1 || formData.modeLivr == this.isACommandeSatisfied(element.commande, data7, data10))
                                                  && (formData.frs == -1 || formData.frs == element.commande.frs.numFournisseur)
                                                  ){
    
                                                    let lig = [];
                                                    lig.push(element.numBondTravail);
                                                    lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                    lig.push(element.commande.description);
                                                    lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                    lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                    let lignesCom:LigneCommande[] = data7.filter((l) => l.numCommande.numCommande == element.commande.numCommande);

                                                    let deepLig = [];
                                                    
                                                    //['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant TTC', 'Qte Livrée', 'Qte Rest.']
                                                    let totalTtc:number = 0;
                                                    lignesCom.forEach(element2 => {
                                                      let dee = [];

                                                      dee.push(element2.article.codeArticle);
                                                      dee.push(element2.article.libArticle);
                                                      dee.push(element2.qteLigneCommande);
                                                      dee.push(element2.uniter.libUniter);
                                                      dee.push(element2.puLigneCommande);
                                                      dee.push(element2.tva);
                                                      let ht = element2.qteLigneCommande*element2.puLigneCommande;
                                                      dee.push(SalTools.salRound(ht*(1+(element2.tva/100))));
                                                      totalTtc += ht*(1+(element2.tva/100));

                                                      let qteLivr: number = 0;

                                                      data10.filter((l) => l.ligneCommande.idLigneCommande == element2.idLigneCommande)
                                                      .forEach(element3 => {
                                                        qteLivr += element3.quantiteLigneReception;
                                                      });

                                                      dee.push(qteLivr);
                                                      dee.push(element2.qteLigneCommande - qteLivr);

                                                      deepLig.push(dee);
                                                      

                                                    });

                                                    deepLig.push([{ content: 'TOTAL', colSpan: 6, styles: { halign: 'center' } }, SalTools.salRound(totalTtc), { content: '', colSpan: 2}]);
                                                    
                                                    lig.push(deepLig);
                                                    
                                                    lignes.push(lig);
                                                  }
                                              });
                                            }
    
                                            if(formData.categorieCom1 == -1 || formData.categorieCom1 == 4){
                                              //data3
                                              data3.forEach(element => {
                                                if(element.commande.valide 
                                                  && element.commande.dateCommande.valueOf() >= formData.dateDebut.valueOf()
                                                  && element.commande.dateCommande.valueOf() <= formData.dateFin.valueOf()
                                                  && (formData.modeLivr == -1 || formData.modeLivr == this.isACommandeSatisfied(element.commande, data7, data10))
                                                  && (formData.frs == -1 || formData.frs == element.commande.frs.numFournisseur)
                                                  ){
    
                                                    let lig = [];
                                                    lig.push(element.numAppelOffre);
                                                    lig.push(moment(element.commande.dateCommande).format('DD/MM/YYYY'));
                                                    lig.push(element.commande.description);
                                                    lig.push(element.commande.frs.codeFrs+' - '+element.commande.frs.identiteFrs);
                                                    lig.push(SalTools.salRound(this.getTotalByCommandeAndLigne(element.commande, data7)));

                                                    let lignesCom:LigneCommande[] = data7.filter((l) => l.numCommande.numCommande == element.commande.numCommande);

                                                    let deepLig = [];

                                                    //['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant TTC', 'Qte Livrée', 'Qte Rest.']
                                                    let totalTtc:number = 0;
                                                    lignesCom.forEach(element2 => {
                                                      let dee = [];

                                                      dee.push(element2.article.codeArticle);
                                                      dee.push(element2.article.libArticle);
                                                      dee.push(element2.qteLigneCommande);
                                                      dee.push(element2.uniter.libUniter);
                                                      dee.push(element2.puLigneCommande);
                                                      dee.push(element2.tva);
                                                      let ht = element2.qteLigneCommande*element2.puLigneCommande;
                                                      dee.push(SalTools.salRound(ht*(1+(element2.tva/100))));
                                                      totalTtc += ht*(1+(element2.tva/100));

                                                      let qteLivr: number = 0;

                                                      data10.filter((l) => l.ligneCommande.idLigneCommande == element2.idLigneCommande)
                                                      .forEach(element3 => {
                                                        qteLivr += element3.quantiteLigneReception;
                                                      });

                                                      dee.push(qteLivr);
                                                      dee.push(element2.qteLigneCommande - qteLivr);

                                                      deepLig.push(dee);
                                                      

                                                    });

                                                    deepLig.push([{ content: 'TOTAL', colSpan: 6, styles: { halign: 'center' } }, SalTools.salRound(totalTtc), { content: '', colSpan: 2}]);
                                                    
                                                    lig.push(deepLig);
                                                    
                                                    lignes.push(lig);
                                                  }
                                              });
                                            }
    
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
                                            
                                            

                                            concernedFrs.forEach(element4 => {

                                              let concernedCmds = lignes.filter((l) => l[3] == element4.codeFrs+' - '+element4.identiteFrs);

                                              if(concernedCmds.length > 0){
                                                autoTable(doc, {
                                                  theme: 'plain',
                                                  
                                                  margin: { top: 0 },
                                                  columnStyles: {
                                                    0: { textColor: 0, fontStyle: 'bold', halign: 'center', fontSize:14 },
                                                  },
                                                  body: [
                                                    ['FOURNISSEUR : '+element4.codeFrs+' - '+element4.identiteFrs]
                                                  ]
                                                  ,
                                                });

                                                concernedCmds.forEach(element5 => {
                                                  
                                                  autoTable(doc, {
                                                    theme: 'plain',
                                                    pageBreak: 'avoid',
                                                    margin: { right: 100 },
                                                    columnStyles: {
                                                      0: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                                                      1: { textColor: 0, halign: 'left' },
                                                      2: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                                                      3: { textColor: 0, halign: 'left' },
                                                    },
                                                    body: [
                                                      ['Commande N° :', element5[0], 'Date : ', element5[1]],
                                                      ['Référence :', element5[2], '', ''],
                                                      
                                                    ]
                                                    ,
                                                  });
  
                                                  autoTable(doc, {
                                                    theme: 'grid',
                                                    head: [['Article', 'Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant TTC', 'Qte Livrée', 'Qte Rest.']],
                                                    headStyles:{
                                                      fillColor: [41, 128, 185],
                                                      textColor: 255,
                                                      fontStyle: 'bold' ,
                                                  },
                                                    margin: { top: 10 },
                                                    body: element5[5]
                                                    ,
                                                  });


                                                });
                                                
                                              }
                                              
                                            });


                                            this.loading2 = false;
                                            doc.output('dataurlnewwindow');
                                        
            
                                            
                                    
                                          },
                                          (error: HttpErrorResponse) => {
                                            this.loading2 = false;
                                            console.log('Echec status ==> ' + error.status);
                                          }
                                        );
    

                                        
                                
                                      },
                                      (error: HttpErrorResponse) => {
                                        this.loading2 = false;
                                        console.log('Echec status ==> ' + error.status);
                                      }
                                    );
                            
                                  },
                                  (error: HttpErrorResponse) => {
                                    this.loading2 = false;
                                    console.log('Echec status ==> ' + error.status);
                                  }
                                );
                        
                              },
                              (error: HttpErrorResponse) => {
                                this.loading2 = false;
                                console.log('Echec status ==> ' + error.status);
                              }
                            );
                    
                          },
                          (error: HttpErrorResponse) => {
                            this.loading2 = false;
                            console.log('Echec status ==> ' + error.status);
                          }
                        );
                
                      },
                      (error: HttpErrorResponse) => {
                        this.loading2 = false;
                        console.log('Echec status ==> ' + error.status);
                      }
                    );
            
                  },
                  (error: HttpErrorResponse) => {
                    this.loading2 = false;
                    console.log('Echec status ==> ' + error.status);
                  }
                );
        
              },
              (error: HttpErrorResponse) => {
                this.loading2 = false;
                console.log('Echec status ==> ' + error.status);
              }
            );
    
          },
          (error: HttpErrorResponse) => {
            this.loading2 = false;
            console.log('Echec status ==> ' + error.status);
          }
        );

      },
      (error: HttpErrorResponse) => {
        this.loading2 = false;
        console.log('Echec status ==> ' + error.status);
      }
    );



  }

}
