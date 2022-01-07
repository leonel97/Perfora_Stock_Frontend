import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Command } from 'protractor';
import { debounceTime } from 'rxjs/operators';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { CommandeAchat } from 'src/app/models/gestion/saisie/commandeAchat.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CommandeAchatService } from 'src/app/services/gestion/saisie/commande-achat.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { NumberToLetter } from 'convertir-nombre-lettre';
import { AuthService } from 'src/app/services/common/auth.service';
import { SalTools } from 'src/app/utilitaires/salTools';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';



export interface modelLigneCommande{
  lignesCommande: LigneCommande;
  listArticle: Article[];
  listUniter: Uniter[];
  selectedArticl: number;
  selectedUniter: number;
  artii?: Article;
  qteRest?: number;

}


@Component({
  selector: 'app-commande-achat',
  templateUrl: './commande-achat.component.html',
  styleUrls: ['./commande-achat.component.css']
})
export class CommandeAchatComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  commandeAchatFiltered;

  //--------Pour les articles-----------
  searchControlArticle: FormControl = new FormControl();
  articleFiltered;

  validateForm: FormGroup;
  commandeAchatList: CommandeAchat[] = [];
  ligneCommandeList: LigneCommande[] = [];
  selectedLigneCommandeList: LigneCommande[] = [];
  fournisseurList: Fournisseur[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  loading: boolean;
  commandeAchat: CommandeAchat = null;
  ligneShow: modelLigneCommande[] = [];
  ligneCom: LigneCommande = null;

  etatVali: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private commandeAchatService: CommandeAchatService,
    private ligneCommandeService: LigneCommandeService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private commandeService: CommandeService,
    private exerciceService: ExerciceService,
    private affectUniterToArticleService: AffectUniterToArticleService,
    private clotureService: CloturePeriodiqService,
    public salToolsService: SalTools,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.commandeAchatService.getAllCommandeAchat().subscribe(
      (data) => {
        this.commandeAchatList = [...data];
        this.commandeAchatFiltered = this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()));
        console.log(this.commandeAchatList);
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

    this.searchControlArticle.valueChanges
    .pipe(debounceTime(200))
    .subscribe(value => {
      this.filerDataArticle(value);
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
        this.articleFiltered = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllCommandeAchat(){
    this.commandeAchatService.getAllCommandeAchat().subscribe(
      (data) => {
        this.commandeAchatList = [...data];
        this.commandeAchatFiltered = this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()));
        console.log(this.commandeAchatList);
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
      return this.commandeAchatFiltered = [...this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()))];
    }

    const columns = Object.keys(this.commandeAchatList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.commandeAchatList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.commandeAchatFiltered = rows;
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


  makeForm(commandeAchat: CommandeAchat): void {
    this.validateForm = this.fb.group({
      numComAchat: [commandeAchat != null ? commandeAchat.numComAchat: null],
      dateCommande: [commandeAchat != null ? commandeAchat.commande.dateCommande: null,
      [Validators.required]],
      delaiLivraison: [commandeAchat != null ? commandeAchat.commande.delaiLivraison : null,
        [Validators.required]],
      dateRemise: [commandeAchat != null ? commandeAchat.commande.dateRemise : null],

      description: [commandeAchat != null ? commandeAchat.commande.description : null],
      frs: [commandeAchat != null ? commandeAchat.commande.frs.numFournisseur : null,
        [Validators.required]],
      numComm: [commandeAchat != null ? commandeAchat.commande.numCommande : null],

      procesByLc: [commandeAchat != null ? commandeAchat.procesByLc : false],

      departement: [commandeAchat != null ? commandeAchat.commande.departement : false],

      justif: [commandeAchat != null ? commandeAchat.commande.justif : false],

      numDa: [commandeAchat != null ? commandeAchat.commande.numDa : false],

    }, {
      validators : SalTools.validatorDateOrdre('dateCommande', 'dateRemise', false)
    });

    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (commandeAchat?.numComAchat !=null){
      this.ligneShow = [];

      for(const ligCo of this.ligneCommandeList){
        if(ligCo.numCommande.numCommande == commandeAchat.commande.numCommande){
          this.ligneShow.push({
            lignesCommande: ligCo,
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligCo.article.numArticle),
            selectedArticl: ligCo.article.numArticle,
            selectedUniter: ligCo.uniter ? ligCo.uniter.numUniter : null,
            artii: ligCo.article,

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
    //console.log(this.validateForm?.value['dateRemise']);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    let lignShowValid: boolean = true;
    
    
    for(const lig of this.ligneShow){
      if(lig.lignesCommande.puLigneCommande <=0 || lig.selectedUniter == null
        || lig.lignesCommande.qteLigneCommande <=0 || lig.lignesCommande.tva < 0){
        lignShowValid = false;
        break;
      }
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      console.log(this.validateForm);
      
      setTimeout(() => {
        this.loading = false;
        let msgForm:String = '\n';
        for (const key in this.validateForm.errors) {
          if (Object.prototype.hasOwnProperty.call(this.validateForm.errors, key)) {
            const element = this.validateForm.errors[key];
            msgForm += element.value+'\n';
          }
        }

        this.toastr.error('Veuillez remplir le Formulaire convenablement.'+msgForm, ' Erreur !', {progressBar: true});
      }, 3000);
    } else if (this.ligneShow.length == 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else if (lignShowValid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Renseigner les Lignes Convenablement.', ' Erreur !', {progressBar: true});

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
      console.log('sal', lignesCom);
      
      const com = new Commande(formData.dateCommande, formData.dateRemise, formData.description,
        formData.delaiLivraison, false, 0, false, false, formData.frs, this.exerciceService.selectedExo, formData.departement,
        formData.numDa, formData.justif);
      console.log(com);
      
        com.numCommande = formData.numComm;
      if (formData.numComAchat == null) {
        console.log("data", formData);

        this.enregistrerCommandeAchat(com, lignesCom);
      } else {
        this.modifierCommandeAchat(formData.numComAchat,com, lignesCom);
      }
    }
  }

  enregistrerCommandeAchat(commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    console.log('obj', new EncapCommande(commande, lignesCo));
    this.commandeService.addACommande2(new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();
        this.commandeAchatService.addACommandeAchat(new CommandeAchat(Date.now().toString(), 0, data2.commande, this.exerciceService.selectedExo, this.validateForm.value['procesByLc'])).subscribe(
          (data) => {
            console.log(data);

            this.commandeAchatList.unshift(data);
            this.commandeAchatFiltered = [...this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()))];
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

  modifierCommandeAchat(id: String, commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    this.commandeService.editACommande2(commande.numCommande.toString(), new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();

        this.commandeAchatService.editACommandeAchat(id, new CommandeAchat('', 0, data2.commande, this.exerciceService.selectedExo, this.validateForm.value['procesByLc'])).subscribe(
          (data) => {
            console.log(data);

            const i = this.commandeAchatList.findIndex(l => l.numComAchat == data.numComAchat);
            if (i > -1) {
              this.commandeAchatList[i] = data;
              this.commandeAchatFiltered = [...this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()))];
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

  confirm(content, commandeAchat: CommandeAchat) {
    this.commandeAchat = commandeAchat;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.commandeAchatService.deleteACommandeAchat(commandeAchat?.numComAchat.toString()).subscribe(
        (data) => {

          this.commandeService.deleteACommande2(commandeAchat.commande.numCommande.toString()).subscribe(
            (data) => {

            },
            (error: HttpErrorResponse) => {
              console.log('Echec status ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );

          console.log(data);
          const i = this.commandeAchatList.findIndex(l => l.numComAchat == commandeAchat.numComAchat);
          if (i > -1) {
            this.commandeAchatList.splice(i, 1);
            this.commandeAchatFiltered = [...this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()))];
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

  addLignByDialog(article:Article){

    if(this.ligneShow.find((l) => l.selectedArticl == article.numArticle)){
      const ind = this.ligneShow.findIndex((l) => l.selectedArticl == article.numArticle);
      if(ind > -1){
        this.ligneShow.splice(ind, 1);
      }      
    }
    else{
      this.pushALigneComAcha();
      this.ligneShow[this.ligneShow.length-1].artii = article;
      this.ligneShow[this.ligneShow.length-1].selectedArticl = article.numArticle;
      this.getUniterOfSelectArt(this.ligneShow.length-1);
    }
    

  }

  isArticleAlreadySelected(article:Article):boolean{
    for(const lig of this.ligneShow){
      if(lig.selectedArticl == article.numArticle){
        return true;
      }
    }
    return false;
  }

  showModalSelectArticle(content){

    this.modalService.open(content,
      {ariaLabelledBy: 'modal-basic-title', centered: true, scrollable: true, size:'lg'})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;


    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
      //this.selectedCurrentFrsInter = [];
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

  modalPopALigneComAcha(inde, content){
    this.ligneCom = this.ligneShow[inde].lignesCommande;
    this.ligneCom.article = this.ligneShow[inde].artii;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
            .result.then((result) => {
            
              this.popALigneComAcha(inde);

          }, (reason) => {
            console.log(`Dismissed with: ${reason}`);
          });
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

  getTotalTtcOfACom(row: CommandeAchat){

    let tot: number = 0;

    this.ligneCommandeList.forEach(element => {
      if(element.numCommande.numCommande == row.commande.numCommande){
        tot += element.puLigneCommande * element.qteLigneCommande * (1+(element.tva/100));
      }
    });

    return tot;

  }

  valider(commandeAchat: CommandeAchat, eta: boolean, content){

    this.clotureService.isPeriodeCloturedByDate(commandeAchat.commande.dateCommande).subscribe(
      (data) => {
        if(data == false){
          this.etatVali = eta;
          if(!eta){
            this.commandeService.getIfACommandeHasReceptById(commandeAchat.commande.numCommande.toString()).subscribe(
              (data) => {
                if(data == true){
                  this.toastr.error('Impossible car la commande est liée à au moins une réception.', 'Erreur !', { timeOut: 5000, progressBar:true });
                }
                else {
                  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
                  .result.then((result) => {
                  //this.confirmResut = `Closed with: ${result}`;
                    commandeAchat.commande.valide = eta;

                    this.commandeService.editACommande(commandeAchat.commande.numCommande.toString(), commandeAchat.commande).subscribe(
                      (data) => {

                        commandeAchat.commande = data;

                        const i = this.commandeAchatList.findIndex(l => l.numComAchat == commandeAchat.numComAchat);
                            if (i > -1) {
                              this.commandeAchatList[i] = commandeAchat;
                              this.commandeAchatFiltered = [...this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()))];
                            }

                            let msg: String = 'Annulation';
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
              }, 
              (error: HttpErrorResponse) => {
                console.log('Echec status ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
              }
            );


          }
          else {
            
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
            .result.then((result) => {
              //this.confirmResut = `Closed with: ${result}`;
              commandeAchat.commande.valide = eta;

              this.commandeService.editACommande(commandeAchat.commande.numCommande.toString(), commandeAchat.commande).subscribe(
                (data) => {

                  commandeAchat.commande = data;

                  const i = this.commandeAchatList.findIndex(l => l.numComAchat == commandeAchat.numComAchat);
                      if (i > -1) {
                        this.commandeAchatList[i] = commandeAchat;
                        this.commandeAchatFiltered = [...this.commandeAchatList.sort((a, b) => a.numComAchat.localeCompare(b.numComAchat.valueOf()))];
                      }

                      let msg: String = 'Validation'
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

  openPdfToPrint(element: CommandeAchat){

    let totalHT : number = 0;
    let totalTVA : number = 0;
    let totalTTC : number = 0;

    const doc = new jsPDF();

    
    autoTable(doc, {
      //startY: 0,
      theme: "grid",
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
        { content: 'BON DE COMMANDE', rowSpan: 4}],
        ['Date : 03/12/2021',
        ],
        ['Version : 01',
        ],
        ['Page: ../..',
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
        ['Numéro du bond',': '+element.numComAchat],
        ['Département',': '+ (element.commande.departement?element.commande.departement.toString():'')],
        ['N° DA',': '+(element.commande.numDa?element.commande.numDa.toString():'')],
        ['Justificatif ',': '+(element.commande.justif?element.commande.justif.toString():'')],
        ['Nom du Fournisseur',': '+element.commande.frs.codeFrs+'\t'+element.commande.frs.identiteFrs],
        ['Date d\'émission',': '+moment(element.commande.dateCommande).format('DD/MM/YYYY')],
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
        lig.push(this.salToolsService.salRound(ht*(1+(element2.tva/100))));
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
        ['Total HT', this.salToolsService.salRound(totalHT)],
        ['Total Montant TVA', this.salToolsService.salRound(totalTVA)],
        ['Total TTC', this.salToolsService.salRound(totalTTC)]
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
        ['Délais de Livraison '+element.commande.delaiLivraison+'  Jour(s)',
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

    console.log('sal',doc );

    doc.output('dataurlnewwindow');


  }



}
