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
import { AppelOffre } from 'src/app/models/gestion/saisie/appelOffre.model';
import { Commande } from 'src/app/models/gestion/saisie/commande.model';
import { EncapCommande } from 'src/app/models/gestion/saisie/encapsuleur-model/encapCommande.model';
import { LigneCommande } from 'src/app/models/gestion/saisie/ligneCommande.model';
import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { AppelOffreService } from 'src/app/services/gestion/saisie/appel-offre.service';
import { CommandeService } from 'src/app/services/gestion/saisie/commande.service';
import { LigneCommandeService } from 'src/app/services/gestion/saisie/ligne-commande.service';
import { modelLigneCommande } from '../commande-achat/commande-achat.component';

@Component({
  selector: 'app-appel-offre',
  templateUrl: './appel-offre.component.html',
  styleUrls: ['./appel-offre.component.css']
})
export class AppelOffreComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  appelOffreFiltered;

  validateForm: FormGroup;
  appelOffreList: AppelOffre[] = [];
  ligneCommandeList: LigneCommande[] = [];
  selectedLigneCommandeList: LigneCommande[] = [];
  fournisseurList: Fournisseur[] = [];
  articleList: Article[] = [];
  uniterList: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];
  loading: boolean;
  appelOffre: AppelOffre = null;
  ligneShow: modelLigneCommande[] = [];

  totaux: number[] = [0, 0, 0];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private appelOffreService: AppelOffreService,
    private ligneCommandeService: LigneCommandeService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService,
    private uniterService: UniterService,
    private commandeService: CommandeService,
    private exerciceService: ExerciceService,
    private affectUniterToArticleService: AffectUniterToArticleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.appelOffreService.getAllAppelOffre().subscribe(
      (data) => {
        this.appelOffreList = [...data];
        this.appelOffreFiltered = this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()));
        console.log(this.appelOffreList);
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
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllAppelOffre(){
    this.appelOffreService.getAllAppelOffre().subscribe(
      (data) => {
        this.appelOffreList = [...data];
        this.appelOffreFiltered = this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()));
        console.log(this.appelOffreList);
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
      return this.appelOffreFiltered = [...this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()))];
    }

    const columns = Object.keys(this.appelOffreList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.appelOffreList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.appelOffreFiltered = rows;
  }

  makeForm(appelOffre: AppelOffre): void {
    this.validateForm = this.fb.group({
      numAppelOffre: [appelOffre != null ? appelOffre.numAppelOffre: null],
      dateCommande: [appelOffre != null ? appelOffre.commande.dateCommande: null,
      [Validators.required]],
      delaiLivraison: [appelOffre != null ? appelOffre.commande.delaiLivraison : null,
        [Validators.required]],
      dateRemise: [appelOffre != null ? appelOffre.commande.dateRemise : null],

      description: [appelOffre != null ? appelOffre.commande.description : null],
      frs: [appelOffre != null ? appelOffre.commande.frs.numFournisseur : null,
        [Validators.required]],
      numComm: [appelOffre != null ? appelOffre.commande.numCommande : null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (appelOffre?.numAppelOffre !=null){
      this.ligneShow = [];

      for(const ligCo of this.ligneCommandeList){
        if(ligCo.numCommande.numCommande == appelOffre.commande.numCommande){
          this.ligneShow.push({
            lignesCommande: ligCo,
            listArticle: this.getNotUsedArticle(),
            listUniter: this.getUniterOfAArticle(ligCo.article.numArticle),
            selectedArticl: ligCo.article.numArticle,
            selectedUniter: ligCo.uniter ? ligCo.uniter.numUniter : null,
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

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir le Formulaire convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else if (this.ligneShow.length == 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Ajouter au moins une Ligne.', ' Erreur !', {progressBar: true});
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

      const com = new Commande(formData.dateCommande, formData.dateRemise, formData.description,
        formData.delaiLivraison, false, 0, false, false, formData.frs, this.exerciceService.selectedExo );
        com.numCommande = formData.numComm;
      if (formData.numAppelOffre == null) {
        console.log("data", formData);

        this.enregistrerAppelOffre(com, lignesCom);
      } else {
        this.modifierAppelOffre(formData.numAppelOffre,com, lignesCom);
      }
    }
  }

  enregistrerAppelOffre(commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    console.log('obj', new EncapCommande(commande, lignesCo));
    this.commandeService.addACommande2(new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();
        this.appelOffreService.addAAppelOffre(new AppelOffre(Date.now().toString(), 0, data2.commande, this.exerciceService.selectedExo)).subscribe(
          (data) => {
            console.log(data);

            this.appelOffreList.unshift(data);
            this.appelOffreFiltered = [...this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()))];
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

  modifierAppelOffre(id: String, commande: Commande, lignesCo: LigneCommande[]): void {
    this.loading = true;
    this.commandeService.editACommande2(commande.numCommande.toString(), new EncapCommande(commande, lignesCo)).subscribe(
      (data2) => {
        this.getAllLigneCommande();

        this.appelOffreService.editAAppelOffre(id, new AppelOffre('', 0, data2.commande, this.exerciceService.selectedExo)).subscribe(
          (data) => {
            console.log(data);

            const i = this.appelOffreList.findIndex(l => l.numAppelOffre == data.numAppelOffre);
            if (i > -1) {
              this.appelOffreList[i] = data;
              this.appelOffreFiltered = [...this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()))];
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

  confirm(content, appelOffre: AppelOffre) {
    this.appelOffre = appelOffre;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.appelOffreService.deleteAAppelOffre(appelOffre?.numAppelOffre.toString()).subscribe(
        (data) => {

          this.commandeService.deleteACommande2(appelOffre.commande.numCommande.toString()).subscribe(
            (data) => {

            },
            (error: HttpErrorResponse) => {
              console.log('Echec status ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );

          console.log(data);
          const i = this.appelOffreList.findIndex(l => l.numAppelOffre == appelOffre.numAppelOffre);
          if (i > -1) {
            this.appelOffreList.splice(i, 1);
            this.appelOffreFiltered = [...this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()))];
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

  getTotalTtcOfACom(row: AppelOffre){

    let tot: number = 0;

    this.ligneCommandeList.forEach(element => {
      if(element.numCommande.numCommande == row.commande.numCommande){
        tot += element.puLigneCommande * element.qteLigneCommande * (1+(element.tva/100));
      }
    });

    return tot;

  }

  valider(appelOffre: AppelOffre, eta: boolean){

    appelOffre.commande.valide = eta;

    this.commandeService.editACommande(appelOffre.commande.numCommande.toString(), appelOffre.commande).subscribe(
      (data) => {

        appelOffre.commande = data;

        const i = this.appelOffreList.findIndex(l => l.numAppelOffre == appelOffre.numAppelOffre);
            if (i > -1) {
              this.appelOffreList[i] = appelOffre;
              this.appelOffreFiltered = [...this.appelOffreList.sort((a, b) => a.numAppelOffre.localeCompare(b.numAppelOffre.valueOf()))];
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

}
