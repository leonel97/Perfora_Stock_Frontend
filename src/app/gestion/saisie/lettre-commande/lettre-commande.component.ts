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
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { LettreCommande } from 'src/app/models/gestion/saisie/lettreCommande.model';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { LettreCommandeService } from 'src/app/services/gestion/saisie/lettre-commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { modelLigneCommande } from '../commande-achat/commande-achat.component';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';
import { NumberToLetter } from 'convertir-nombre-lettre';
import { AuthService } from 'src/app/services/common/auth.service';
import { SalTools } from 'src/app/utilitaires/salTools';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';
import { CommandeAchatService } from 'src/app/services/gestion/saisie/commande-achat.service';
import { CommandeAchat } from 'src/app/models/gestion/saisie/commandeAchat.model';


@Component({
  selector: 'app-lettre-commande',
  templateUrl: './lettre-commande.component.html',
  styleUrls: ['./lettre-commande.component.css']
})
export class LettreCommandeComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  lettreCommandeFiltered;
  //--------Pour les articles-----------
  searchControlArticle: FormControl = new FormControl();
  articleFiltered;

  validateForm: FormGroup;
  lettreCommandeList: LettreCommande[] = [];
  ligneCommandeList: LigneCommande[] = [];
  selectedLigneCommandeList: LigneCommande[] = [];
  fournisseurList: Fournisseur[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  commandeAchatList: CommandeAchat[] = [];
  loading: boolean;
  lettreCommande: LettreCommande = null;
  ligneShow: modelLigneCommande[] = [];

  etatVali: boolean = false;

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private lettreCommandeService: LettreCommandeService,
    private ligneCommandeService: LigneCommandeService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private commandeService: CommandeService,
    private exerciceService: ExerciceService,
    private affectUniterToArticleService: AffectUniterToArticleService,
    private clotureService: CloturePeriodiqService,
    public salToolsService: SalTools,
    private commandeAchatService: CommandeAchatService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.lettreCommandeService.getAllLettreCommande().subscribe(
      (data) => {
        this.lettreCommandeList = [...data];
        this.lettreCommandeFiltered = this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()));
        console.log(this.lettreCommandeList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });

    this.makeForm(null);

    this.searchControlArticle.valueChanges
    .pipe(debounceTime(200))
    .subscribe(value => {
      this.filerDataArticle(value);
    });
  

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

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

  getAllLettreCommande(){
    this.lettreCommandeService.getAllLettreCommande().subscribe(
      (data) => {
        this.lettreCommandeList = [...data];
        this.lettreCommandeFiltered = this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()));
        console.log(this.lettreCommandeList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  getAllCommandeAchat(){
    this.commandeAchatService.getAllCommandeAchat().subscribe(
      (data) => {
        this.commandeAchatList = [...data.filter( l => (l.commande.valide && l.procesByLc && !this.isAComAchatFullProcessed(l)))];
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });
  }

  isAComAchatFullProcessed(commandeAchat: CommandeAchat){
    
    for (const lig of this.ligneCommandeList.filter( l => l.numCommande.numCommande == commandeAchat.commande.numCommande)) {
      if(this.getQteRestanOfALigComAch(lig) > 0){
        return false;
      }

    }

    return true;

  }

  getAllLigneCommande(){
    this.ligneCommandeService.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandeList = data;
        this.getAllCommandeAchat();
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

  getQteRestanOfALigComAch(ligne: LigneCommande): number {
    let qute = 0;
    this.lettreCommandeList.forEach(element => {
      if(element.commandeAchat && element.commandeAchat.commande.numCommande == ligne.numCommande.numCommande){
        
          let lig = this.ligneCommandeList.find(l => (l.numCommande.numCommande == element.commande.numCommande && l.article.numArticle == ligne.article.numArticle));
          if(lig){
            qute += lig.qteLigneCommande;
          }

      }
    });

    return (ligne.qteLigneCommande - qute);

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

      let ligneComAchat = this.ligneCommandeList.find( l => (l.article.numArticle == article.numArticle && l.numCommande.numCommande == this.commandeAchatList.find( m => m.numComAchat == this.validateForm.value['numComAchat'])?.commande.numCommande) );

      this.ligneShow[this.ligneShow.length-1].lignesCommande.puLigneCommande = ligneComAchat.prixUnitTtc ? ligneComAchat.puLigneCommande/(1+(ligneComAchat.tva/100)) : ligneComAchat.puLigneCommande;
      this.ligneShow[this.ligneShow.length-1].lignesCommande.tva = ligneComAchat.tva;
      this.ligneShow[this.ligneShow.length-1].selectedUniter = ligneComAchat.uniter.numUniter;
      this.ligneShow[this.ligneShow.length-1].lignesCommande.uniter = ligneComAchat.uniter;
      let qter = this.getQteRestanOfALigComAch(ligneComAchat);
      this.ligneShow[this.ligneShow.length-1].lignesCommande.qteLigneCommande = qter;
      this.ligneShow[this.ligneShow.length-1].qteRest = qter;
      

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

  selectedComAchatChanged(){
    let selectedComAchat = this.commandeAchatList.filter( l => l.numComAchat == this.validateForm.value['numComAchat'])[0];
    this.articleFiltered = [];
    this.articleList = [];
    this.ligneShow = [];
    if(selectedComAchat){
      this.validateForm.patchValue({frs: selectedComAchat.commande.frs.codeFrs + ' - ' + selectedComAchat.commande.frs.identiteFrs});
      let lignesSelectedComAcha = this.ligneCommandeList.filter( l => (l.numCommande.numCommande == selectedComAchat.commande.numCommande));

      lignesSelectedComAcha.forEach(element => {
        this.articleList.push(element.article);
        this.articleFiltered.push(element.article);

      });

      

    }
    else {
      this.validateForm.patchValue({frs: null});
    }
  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.lettreCommandeFiltered = [...this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()))];
    }

    const columns = Object.keys(this.lettreCommandeList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.lettreCommandeList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.lettreCommandeFiltered = rows;
  }

  makeForm(lettreCommande: LettreCommande): void {
    this.validateForm = this.fb.group({
      numLettreComm: [lettreCommande != null ? lettreCommande.numLettreComm: null],
      dateCommande: [lettreCommande != null ? lettreCommande.commande.dateCommande: null,
      [Validators.required]],
      delaiLivraison: [lettreCommande != null ? lettreCommande.commande.delaiLivraison : null,
        [Validators.required]],
      dateRemise: [lettreCommande != null ? lettreCommande.commande.dateRemise : null],

      description: [lettreCommande != null ? lettreCommande.commande.description : null],
      frs: [lettreCommande != null ? lettreCommande.commande.frs.numFournisseur +' - '+ lettreCommande.commande.frs.identiteFrs : null,
        [Validators.required]],
      numComm: [lettreCommande != null ? lettreCommande.commande.numCommande : null],

      numComAchat: [lettreCommande != null ? lettreCommande.commandeAchat.numComAchat : null, 
        [Validators.required]],
    }, {
      validators : SalTools.validatorDateOrdre('dateCommande', 'dateRemise', false)
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (lettreCommande?.numLettreComm !=null){
      this.ligneShow = [];

      for(const ligCo of this.ligneCommandeList){
        if(ligCo.numCommande.numCommande == lettreCommande.commande.numCommande){
          
          this.ligneShow.push({
            lignesCommande: {...ligCo},
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligCo.article.numArticle),
            selectedArticl: ligCo.article.numArticle,
            selectedUniter: ligCo.uniter ? ligCo.uniter.numUniter : null,
            artii: ligCo.article,
            qteRest: ligCo.qteLigneCommande + this.getQteRestanOfALigComAch(this.ligneCommandeList.find(l => (l.numCommande.numCommande == lettreCommande.commandeAchat?.commande?.numCommande && l.article.numArticle == ligCo.article.numArticle))),

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

    let lignShowValid: boolean = true;
    
    
    for(const lig of this.ligneShow){
      if(lig.lignesCommande.puLigneCommande <=0 || lig.selectedUniter == null
        || lig.lignesCommande.qteLigneCommande <=0 || lig.lignesCommande.tva < 0
        ){
        lignShowValid = false;
        break;
      }
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
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
    }else if (lignShowValid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Renseigner les Lignes Convenablement.', ' Erreur !', {progressBar: true});

      }, 3000);
    } else {
      const formData = this.validateForm.value;

      const i = this.commandeAchatList.findIndex(l => l.numComAchat == formData.numComAchat);

      if (i > -1) {
        formData.frs = this.commandeAchatList[i].commande.frs;
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
      if (formData.numLettreComm == null) {
        console.log("data", formData);

        this.enregistrerLettreCommande(com, lignesCom);
      } else {
        this.modifierLettreCommande(formData.numLettreComm,com, lignesCom);
      }
    }
  }

  enregistrerLettreCommande(commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    console.log('obj', new EncapCommande(commande, lignesCo));
    this.commandeService.addACommande2(new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();
        this.lettreCommandeService.addALettreCommande(new LettreCommande(Date.now().toString(), 0, data2.commande, this.exerciceService.selectedExo, this.commandeAchatList.find( l => this.validateForm.value['numComAchat'] == l.numComAchat))).subscribe(
          (data) => {
            console.log(data);

            this.lettreCommandeList.unshift(data);
            this.lettreCommandeFiltered = [...this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()))];
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

  modifierLettreCommande(id: String, commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    this.commandeService.editACommande2(commande.numCommande.toString(), new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();

        this.lettreCommandeService.editALettreCommande(id, new LettreCommande('', 0, data2.commande, this.exerciceService.selectedExo, this.commandeAchatList.find( l => this.validateForm.value['numComAchat'] == l.numComAchat))).subscribe(
          (data) => {
            console.log(data);

            const i = this.lettreCommandeList.findIndex(l => l.numLettreComm == data.numLettreComm);
            if (i > -1) {
              this.lettreCommandeList[i] = data;
              this.lettreCommandeFiltered = [...this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()))];
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

  confirm(content, lettreCommande: LettreCommande) {
    this.lettreCommande = lettreCommande;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.lettreCommandeService.deleteALettreCommande(lettreCommande?.numLettreComm.toString()).subscribe(
        (data) => {

          this.commandeService.deleteACommande2(lettreCommande.commande.numCommande.toString()).subscribe(
            (data) => {

            },
            (error: HttpErrorResponse) => {
              console.log('Echec status ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );

          console.log(data);
          const i = this.lettreCommandeList.findIndex(l => l.numLettreComm == lettreCommande.numLettreComm);
          if (i > -1) {
            this.lettreCommandeList.splice(i, 1);
            this.lettreCommandeFiltered = [...this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()))];
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

  getTotalTtcOfACom(row: LettreCommande){

    let tot: number = 0;

    this.ligneCommandeList.forEach(element => {
      if(element.numCommande.numCommande == row.commande.numCommande){
        tot += element.puLigneCommande * element.qteLigneCommande * (1+(element.tva/100));
      }
    });

    return tot;

  }

  valider(lettreCommande: LettreCommande, eta: boolean, content){

    this.clotureService.isPeriodeCloturedByDate(lettreCommande.commande.dateCommande).subscribe(
      (data) => {
        if(data == false){
          

          this.etatVali = eta;

          this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
            .result.then((result) => {
            //this.confirmResut = `Closed with: ${result}`;
      
          lettreCommande.commande.valide = eta;
      
          this.commandeService.editACommande(lettreCommande.commande.numCommande.toString(), lettreCommande.commande).subscribe(
            (data) => {
      
              lettreCommande.commande = data;
      
              const i = this.lettreCommandeList.findIndex(l => l.numLettreComm == lettreCommande.numLettreComm);
                  if (i > -1) {
                    this.lettreCommandeList[i] = lettreCommande;
                    this.lettreCommandeFiltered = [...this.lettreCommandeList.sort((a, b) => a.numLettreComm.localeCompare(b.numLettreComm.valueOf()))];
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

  openPdfToPrint(element: LettreCommande){


    let totalHT : number = 0;
    let totalTVA : number = 0;
    let totalTTC : number = 0;

    const doc = new jsPDF();

    /*autoTable(doc, {
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


    autoTable(doc, {
      startY:35,
      theme: 'plain',
      //margin: { right: 100 },
      columnStyles: {
        0: { textColor: 0, halign: 'left', fontSize:9 },
        1: { textColor: 0, fontStyle:'bold', halign: 'right', fontSize:9 },
      },
      body: [
        ['B.P. 1225', 'Lomé, le '+moment(Date.now()).format('DD/MM/YYYY')],
        ['Tél. : 22 27 47 42 / 22 27 33 91 / 22 27 33 92'],
        ['Télex : 5243 TOGOPORT'],
        ['TELEFAX : 22 27 26 27 DG'],
        ['TELEFAX : 22 27 90 66 DFC'],
        ['Adresse Télégr. Togoport'],
        ['Union Togolaise de Banque: 60164'],
      ]
      ,
    });*/

    //doc.setFontSize(14);
    //doc.text('Lettre de Commande N° '+element.numLettreComm+' | AP/ST', 95, 65);

    doc.addImage('/assets/images/grandLogo.jpg','jpeg', 10, 5, 190, 100);

    doc.setFontSize(18);
    //doc.text('A', 150, 40);
    autoTable(doc, {
      startY:60,
      theme: 'plain',
      margin: { left: 110 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left', fontSize:12 },
      },
      body: [
        ['Monsieur le Directeur de \n'+element.commande.frs.identiteFrs]
      ]
      ,
    });

    /*autoTable(doc, {
      startY:85,
      theme: 'plain',
      margin: { right: 125 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'right', fontSize:10 },
        1: { textColor: 0, halign: 'left', fontSize:10 },
      },
      body: [
        ['N/Ref',element.commande?.description?.valueOf()],
        ['V/Ref','']
      ]
      ,
    });*/

    autoTable(doc, {
      startY:110,
      theme: 'plain',
      margin: { right: 100 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left', fontSize:11 },
      },
      body: [
        ['Objet : Lettre de Commande']
      ]
      ,
    });

    autoTable(doc, {
      //startY:91,
      theme: 'plain',
      //margin: { right: 100 },
      columnStyles: {
        0: { textColor: 0, halign: 'left', fontSize:11, cellPadding: { left: 5},  },
      },
      body: [
        [{content:'Messieurs, ', }],
        ['Nous passons commande des articles suivants conformément au marché N° '+element.commandeAchat?.commande?.description+' suivant les prix unitaires figurant sur votre bordereau de prix.'],
        
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
        lig.push(this.salToolsService.salRound(element2.puLigneCommande));
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
      margin: { top: 100 },
      body: lignes
      ,
    });


    autoTable(doc, {
      theme: 'grid',
      margin: { top: 0, left:130 },
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
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, halign: 'right' },
        1: { textColor: 0, fontStyle: 'bold', halign: 'left' },
      },
      body: [
        ['MONTANT TOTAL :', this.salToolsService.salNumberToLetter(this.salToolsService.salRound(totalTTC))+' Francs CFA'],
        ['Délais de livraison :', element.commande.delaiLivraison+' Jour(s)']
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'left' },

      },
      body: [
        ['Veuillez agréer, Monsieur le Directeur, l\'expression de nos salutations distinguées.']
      ]
      ,
    });

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 0 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'center' },

      },
      body: [
        ['Le Directeur Général\n\n\n\n\n\n\n\nContre-Amiral Fogan K. ADEGNON']
      ]
      ,
    });

    doc.output('dataurlnewwindow');

  }

}
