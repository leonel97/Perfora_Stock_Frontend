import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { LigneTravaux } from 'src/app/models/gestion/saisie/ligneTravaux.model';
import { Travaux } from 'src/app/models/gestion/saisie/travaux.model';
import { AuthService } from 'src/app/services/common/auth.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';
import { LigneTravauxService } from 'src/app/services/gestion/saisie/ligneTravaux.service';
import { TravauxService } from 'src/app/services/gestion/saisie/travaux.service';
import * as moment from  'moment';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { EncapTravaux } from 'src/app/models/gestion/saisie/encapsuleur-model/encapTravaux.model';
import { SalTools } from 'src/app/utilitaires/salTools';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Utils } from 'src/app/utilitaires/utils';

export interface modelLigneTravaux {
  ligneTravaux: LigneTravaux;
  listUniter: Uniter[];
  selectedUniter: number;

}

@Component({
  selector: 'app-travaux',
  templateUrl: './travaux.component.html',
  styleUrls: ['./travaux.component.css']
})
export class TravauxComponent   implements OnInit {

  searchControl: FormControl = new FormControl();
  travauxFiltered;
  
  searchAffForm: FormGroup;
  validateForm: FormGroup;
  travauxList: Travaux[] = [];
  travauxListByExo: Travaux[] = [];
  ligneTravauxList: LigneTravaux[] = [];
  ligneShow: modelLigneTravaux[] = [];
  
  uniterList: Uniter[] = [];
  fournisseurList: Fournisseur[] = [];
  loading: boolean;
  travaux: Travaux = null;
  ligneTrava: LigneTravaux = null;

  etatVali: boolean = false;
  affichNb: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private travauxService: TravauxService,
    private ligneTravauxService: LigneTravauxService,
    private uniterService: UniterService,
    private fournisseurService: FournisseurService,
    private exerciceService: ExerciceService,
    private clotureService: CloturePeriodiqService,
    public salToolsService: SalTools,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService, 
  ) {
  }

  ngOnInit(): void {

    this.makeForm(null);
  
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

      this.getAllUniter();
      this.getAllLigneTravaux();
      this.getAllTravauxByCodeExoSelected();
      this.getAllFournisseur();

  }

  getAllTravaux(){
    this.travauxService.getAllTravaux().subscribe(
      (data) => {
        this.travauxList = [...data];
        //this.travauxFiltered = this.travauxFiltered.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()));
        //console.log(data);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllTravauxByCodeExoSelected(){
    this.travauxService.getTravauxByCodeExo(this.exerciceService.selectedExo.codeExercice).subscribe(
      (data) => {
        this.travauxListByExo = [...data];
        this.travauxFiltered = this.travauxListByExo.sort((a, b) => a.numTravaux.localeCompare(b.numTravaux.valueOf()));
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });

  }


  getAllLigneTravaux(){
    this.ligneTravauxService.getAllLigneTravaux().subscribe(
      (data) => {
        this.ligneTravauxList = data;
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

  getAllFournisseur(){
    this.fournisseurService.list().subscribe(
      (data: Fournisseur[]) => {
        this.fournisseurList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }


  searchAffElmtChanged(){
    //this.filerData(this.searchControl.value);
    /*if(this.searchAffForm.value['radioAffich'] == 0){

      this.travauxFiltered = [...this.travauxFiltered];
    }
    else if(this.searchAffForm.value['radioAffich'] == 1){
      this.travauxFiltered = [...this.travauxFiltered.filter(l => l.valideDA)];
    }
    else{
      this.travauxFiltered = [...this.travauxFiltered.filter(l => !l.valideDA)];
    }*/
    //console.log('sall',this.searchAffForm.value['radioAffich']); 
    
  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      this.travauxFiltered = [...this.travauxListByExo.sort((a, b) => a.numTravaux.localeCompare(b.numTravaux.valueOf()))];
      this.searchAffElmtChanged();
      return;
    }

    const columns = Object.keys(this.travauxListByExo[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.travauxListByExo.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.travauxFiltered = rows;
    this.searchAffElmtChanged();
  }

  makeForm(travaux: Travaux): void {
    this.validateForm = this.fb.group({
      numTravaux: [travaux != null ? travaux.numTravaux: null],
      dateCommande: [travaux != null ? moment(travaux.dateCommande).format('yyyy-MM-DD'): null,
        [Validators.required]],
      dateRemise: [travaux != null ? moment(travaux.dateRemise).format('yyyy-MM-DD'): null],
      delaiLivraison: [travaux != null ? travaux.delaiLivraison : 0, 
        [Validators.required]],
      departement: [travaux != null ? travaux.departement : null, ],
      description: [travaux != null ? travaux.description : null, ],
      frs: [travaux != null ? travaux.frs.numFournisseur : null, 
        [Validators.required]],
      justif: [travaux != null ? travaux.justif : null, ],
      numDa: [travaux != null ? travaux.numDa : null,],
      cmdDe: [travaux != null ? travaux.cmdDe : null,],

    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (travaux?.numTravaux !=null){
      
      this.ligneTravauxService.getLignesTravauxByCodeTravaux(travaux?.numTravaux).subscribe(
        (ligneTravauxList) => {
          this.ligneShow = [];

          for(const ligCo of ligneTravauxList){
            
              this.ligneShow.push({
                ligneTravaux: ligCo,
                listUniter: [...this.uniterList],
                selectedUniter: ligCo.uniter.numUniter,
    
              });
            
          }
    
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

    this.ligneShow = [];

  }

  submit(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    let lignShowValid: boolean = true;
    
    
    for(const lig of this.ligneShow){
      if(lig.ligneTravaux.qteLigneCommande <=0 || lig.ligneTravaux.puLigneCommande <=0 
        || lig.selectedUniter == null || lig.ligneTravaux.tva <=0 ){
        lignShowValid = false;
        break;
      }
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir le Formulaire convenablement.', ' Erreur !', { timeOut: 5000, progressBar: true});
      }, 3000);
    } else if (this.ligneShow.length == 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', { timeOut: 5000, progressBar: true});
      }, 3000);
    } else if (lignShowValid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Renseigner les Lignes Convenablement.', ' Erreur !', { timeOut: 5000, progressBar: true});

      }, 3000);
    } else {
      const formData = this.validateForm.value;

      const i = this.fournisseurList.findIndex(l => l.numFournisseur == formData.frs);

      if (i > -1) {
        formData.frs = this.fournisseurList[i];
      }
      let lignesTravaux: LigneTravaux[] = [];
      this.ligneShow.forEach((element, inde) => {
        
        const k = element.listUniter.findIndex(l => l.numUniter == element.selectedUniter);

        element.ligneTravaux.uniter = null;


        if (k > -1) {
          element.ligneTravaux.uniter = element.listUniter[k];
        }

        lignesTravaux.push(element.ligneTravaux);

      });


      const trava = new Travaux(formData.numTravaux, formData.dateCommande, formData.dateRemise, formData.description, 
        formData.delaiLivraison, false, false, false, formData.frs, this.exerciceService.selectedExo, formData.departement,
        formData.numDa, formData.justif, formData.cmdDe);
      console.log("data", formData);
      if (formData.numTravaux == null) {
        
        this.enregistrerTravaux(trava, lignesTravaux);
      } else {
        this.modifierTravaux(trava.numTravaux, trava, lignesTravaux);
      }
    }
  }

  enregistrerTravaux(travaux: Travaux, lignesTravaux: LigneTravaux[]): void {
    this.loading = true;
    console.log('obj', new EncapTravaux(travaux, lignesTravaux));
    this.travauxService.addATravaux2(new EncapTravaux(travaux, lignesTravaux)).subscribe(
      (data) => {
        this.getAllLigneTravaux();
        console.log(data);

            this.travauxListByExo.unshift(data.travaux);
            this.travauxFiltered = [...this.travauxListByExo.sort((a, b) => a.numTravaux.localeCompare(b.numTravaux.valueOf()))];

            setTimeout(() => {
              this.loading = false;
              this.activeTabsNav = 1;
              this.resetForm();
              this.toastr.success('Enregistrement effectué avec succès.', 'Success!', { timeOut: 5000, progressBar: true});
            }, 3000);


      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', { timeOut: 5000, progressBar: true});
        }, 3000);

      }
    );


  }

  modifierTravaux(id: String, travaux: Travaux, lignesTravaux: LigneTravaux[]): void {
    this.loading = true;
    console.log('Send',new EncapTravaux(travaux, lignesTravaux));
    this.travauxService.editATravaux2(id, new EncapTravaux(travaux, lignesTravaux)).subscribe(
      (data) => {
        this.getAllLigneTravaux();

        console.log(data);

            const i = this.travauxListByExo.findIndex(l => l.numTravaux == data.travaux.numTravaux);
            if (i > -1) {
              this.travauxListByExo[i] = data.travaux;
              this.travauxFiltered = [...this.travauxListByExo.sort((a, b) => a.numTravaux.localeCompare(b.numTravaux.valueOf()))];
            }

        setTimeout(() => {
          this.loading = false;
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Modification effectué avec succès.', 'Success!', { timeOut: 5000, progressBar: true});
        }, 3000);

            
            this.getAllUniter();
            

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', { timeOut: 5000, progressBar: true });
        }, 3000);

      }
    );


  }

  confirm(content, travaux: Travaux) {
    this.travaux = travaux;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.travauxService.deleteATravaux2(travaux?.numTravaux).subscribe(
        (data) => {

          console.log(data);
          const i = this.travauxListByExo.findIndex(l => l.numTravaux == travaux.numTravaux);
          if (i > -1) {
            this.travauxListByExo.splice(i, 1);
            this.travauxFiltered = [...this.travauxListByExo.sort((a, b) => a.numTravaux.localeCompare(b.numTravaux.valueOf()))];
          }
         
          this.resetForm();
          this.toastr.success('Suppression effectué avec succès.', 'Success!', { timeOut: 5000, progressBar: true});
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar: true});
          
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  pushALigneTravaux(){
    this.ligneShow.push({
      ligneTravaux: new LigneTravaux(0, 0, 0, 0, 0, 0, false, false, null, null, null),
      listUniter: this.uniterList,
      selectedUniter: null,
    });

    this.calculTotaux();

  }


  popALigneT(inde:number){
    this.ligneShow.splice(inde, 1);
    this.calculTotaux();
  }

  getTotalTtcOfATravaux(row: Travaux){

    let tot: number = 0;

    this.ligneTravauxList.forEach(element => {
      if(element.travaux.numTravaux == row.numTravaux){
        tot += !element.prixUnitTtc?element.puLigneCommande * element.qteLigneCommande*(1+(element.tva/100)): element.puLigneCommande * element.qteLigneCommande;
      }
    });

    return tot;

  }

  modalPopALigneTravaux(inde, content){
    this.ligneTrava = this.ligneShow[inde].ligneTravaux;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
            .result.then((result) => {
            
              this.popALigneT(inde);

          }, (reason) => {
            console.log(`Dismissed with: ${reason}`);
          });
  }

  modalImpressio(travaux: Travaux, content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
            .result.then((result) => {
            
              this.openPdfToPrint(travaux);

          }, (reason) => {
            console.log(`Dismissed with: ${reason}`);
          });
  }

  calculTotaux(){

    let tot0: number = 0;
    let tot1: number = 0;
    let tot2: number = 0;

    this.ligneShow.forEach(element => {
      tot0 += (!element.ligneTravaux.prixUnitTtc? element.ligneTravaux.puLigneCommande * element.ligneTravaux.qteLigneCommande : (element.ligneTravaux.puLigneCommande * element.ligneTravaux.qteLigneCommande)/((element.ligneTravaux.tva/100)+1));
      //tot1 += (element.lignesCommande.puLigneCommande * element.lignesCommande.qteLigneCommande * element.lignesCommande.tva/100);
      tot2 += (!element.ligneTravaux.prixUnitTtc?element.ligneTravaux.puLigneCommande * element.ligneTravaux.qteLigneCommande*(1+(element.ligneTravaux.tva/100)): element.ligneTravaux.puLigneCommande * element.ligneTravaux.qteLigneCommande);
      tot1 = tot2-tot0;
    });

    this.totaux[0] = tot0;
    this.totaux[1] = tot1;
    this.totaux[2] = tot2;

  }

  valider(travaux: Travaux, eta: boolean, content){

    travaux = {...travaux};

    this.clotureService.isPeriodeCloturedByDate(travaux.dateCommande).subscribe(
      (data) => {
        if(data == false){
          
          this.etatVali = eta;

          this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
          .result.then((result) => {
          //this.confirmResut = `Closed with: ${result}`;
          
            travaux.valide = eta;
      
            this.travauxService.editATravaux3(travaux.numTravaux, travaux).subscribe(
              (data) => {
      
                travaux = data;
      
                const i = this.travauxListByExo.findIndex(l => l.numTravaux == travaux.numTravaux);
                    if (i > -1) {
                      this.travauxListByExo[i] = travaux;
                      //this.demandeApproFiltered = [...this.demandeApproList.sort((a, b) => a.numDA.localeCompare(b.numDA.valueOf()))];
                      this.filerData(this.searchControl.value);
                    }
      
                    
                    this.getAllUniter();
                    
      
                    let msg: String = 'Validation'
                    if(eta == false) msg = 'Annulation';
                    this.toastr.success(msg+' effectuée avec succès.', 'Success', { timeOut: 5000, progressBar:true });
      
              },
              (error: HttpErrorResponse) => {
                console.log('Echec status ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar:true });
      
              }
            );
      
      
      
          }, (reason) => {
            console.log(`Dismissed with: ${reason}`);
          });
      
          
        }
        else{
          this.toastr.error('Période Cloturée ', 'Erreur !', { timeOut: 5000, progressBar:true });
        }
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000, progressBar:true });
        
      }
    );



  }

  openPdfToPrint(element: Travaux){

    let totalHT : number = 0;
    let totalTVA : number = 0;
    let totalTTC : number = 0;

    const doc = new jsPDF();

    
    autoTable(doc, {
      //startY: 0,
      theme: "grid",
      styles: {
        lineColor: 'black'
      },
      margin: { top: 5, left:5, right:5, bottom:100 },
      columnStyles: {
        0: { textColor: 'black', fontStyle: 'bold', fontSize:7, font: 'Times New Roman', halign: 'center', cellWidth: 60 },
        1: { textColor: 'black', fontStyle: 'bold', font: 'Times New Roman', halign: 'left', cellWidth: 50 },
        2: { textColor: 'blue', fontStyle: 'bold', fontSize: 15, font: 'Times New Roman', halign: 'center', valign: "middle", cellWidth: 90 },
      },
      body: [
        [{content: '\n\n\n\nPORT AUTONOME DE LOME\nTel : +228 22 23 77 00\nFax : +228 22 27 26 27 / 22 27 02 48\nE-mail : togoport@togoport.tg\nWebsite : www.togoport.tg\nLomé Togo',
        rowSpan: 4},
        'ACH-IDC-47-PAL17', 
        { content: 'BON DE COMMANDE'+(element.cmdDe ? ' DE '+element.cmdDe.toUpperCase() : ''), rowSpan: 4}],
        ['Date : 03/12/2021',
        ],
        ['Version : 01',
        ],
        ['Page: 1 / 1',
        ]
      ]
      ,
    });
    
    doc.addImage(Utils.logoUrlData, 'jpeg', 28, 7, 11, 11);

    autoTable(doc, {
      theme: 'plain',
      startY:50,
      margin: { },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left', cellWidth: 60 },
        1: { textColor: 0, fontStyle: 'bold', halign: 'left' },
      },
      body: [
        ['Numéro du bond',': '+element.numTravaux],
        ['Département',': '+ (element.departement?element.departement.toString():'')],
        ['N° DA',': '+(element.numDa?element.numDa.toString():'')],
        ['Justificatif ',': '+(element.justif?element.justif.toString():'')],
        ['Nom du Fournisseur',': '+element.frs.codeFrs+'\t'+element.frs.identiteFrs],
        ['Date d\'émission',': '+moment(element.dateCommande).format('DD/MM/YYYY')],
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
        ['Le FOURNISSEUR est prié de livrer au PORT AUTONOME les matières et objets désignés ci-après :']
      ]
      ,
    });

    this.ligneTravauxService.getLignesTravauxByCodeTravaux(element.numTravaux.toString()).subscribe(
      (ligneCommandeList) => {
        let lignes = [];
        ligneCommandeList.forEach(element2 => {
         
            let lig = [];
            lig.push(element2.designationLigne);
            lig.push(element2.qteLigneCommande);
            lig.push(element2.uniter.libUniter);
            lig.push(element2.puLigneCommande+(element2.prixUnitTtc?' (TTC)':''));
            lig.push(element2.tva);
            let ht = !element2.prixUnitTtc? element2.puLigneCommande * element2.qteLigneCommande : (element2.puLigneCommande * element2.qteLigneCommande)/((element2.tva/100)+1);
            lig.push(this.salToolsService.salRound(ht));
            lignes.push(lig);
    
            totalHT+= ht;
            //totalTVA+= ht*(element2.tva/100);
            totalTTC+= !element2.prixUnitTtc?element2.puLigneCommande * element2.qteLigneCommande*(1+(element2.tva/100)) : element2.puLigneCommande * element2.qteLigneCommande;
            totalTVA = totalTTC - totalHT;
          
    
        });
        
        autoTable(doc, {
          theme: 'grid',
          head: [['Désignation', 'Quantité', 'Unité', 'PU', 'TVA(%)', 'Montant HT']],
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
            ['Total HT', this.salToolsService.salRound(totalHT)],
            ['Total Montant TVA', this.salToolsService.salRound(totalTVA)],
            ['Total TTC', this.salToolsService.salRound(totalTTC)]
          ]
          ,
        });

        if(this.affichNb)
        autoTable(doc, {
          theme: 'grid',
          margin: { top: 10, bottom:10 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'left', minCellWidth:11 },
            1: { textColor: 0,font: 'Times New Roman', fontStyle: 'italic', halign: 'justify' },
          },
          body: [
            ['NB : ', 'Le fournisseur devra prendre toutes les dispositions pour éviter que le dépotage du produit ne pollue l\'environnement, ni ne porte atteinte à la santé-sécurité des personnes.' ]
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
            ['Arrêté le présent Bon de Commande à la somme de : '+this.salToolsService.salNumberToLetter(this.salToolsService.salRound(totalTTC))+' Francs CFA']
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
            ['Délais de Livraison '+element.delaiLivraison+'  Jour(s)',
            'Lomé, le '+moment(Date.now()).format('DD/MM/YYYY')],
          ]
          ,
        });
    
        autoTable(doc, {
          theme: 'plain',
          margin: { top: 100 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center', cellWidth: 80 },
            
            2: { textColor: 0, fontStyle: 'bold', halign: 'center', cellWidth: 80 },
          },
          body: [
            ['La Personne Responsable des Marchés Publics\n\n\n\n\n\n\n\nPassamani ATCHO',
            '',
            'Le Directeur Général\n\n\n\n\n\n\n\n\nContre-Amiral Fogan Kodjo ADEGNON']
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
    
    
        doc.output('dataurlnewwindow');
    
    
      }, 
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

    

  }

}
