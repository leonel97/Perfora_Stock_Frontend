import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {TypeFournisseur} from "../../../models/gestion/definition/typeFournisseur";
import {Fournisseur} from "../../../models/gestion/definition/fournisseur";
import {TypeFournisseurService} from "../../../services/gestion/definition/typeFournisseur.service";
import {FournisseurService} from "../../../services/gestion/definition/fournisseur.service";


@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  fournisseurFiltered;
  typeFournisseurFiltered;

  validateForm: FormGroup;
  
  fournisseurList: Fournisseur[] = [];
  typeFournisseurList: TypeFournisseur[] = [];
  loading: boolean;
  fournisseur: Fournisseur = null;
  typefournisseur: TypeFournisseur = null;


  //gestion des sexe
  sexeList = [
    { code: 'Masculin', libelle: 'Masculin' },
    { code: 'Féminin', libelle: 'Féminin' }
  ];
  

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private fournisseurService: FournisseurService,
    private typeFournisseurService: TypeFournisseurService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.fournisseurService.list().subscribe(
      (data: any) => {
        this.fournisseurList = [...data];
        this.fournisseurFiltered = this.fournisseurList.sort((a, b) => a.codeFrs.localeCompare(b.codeFrs));
        console.log(this.fournisseurList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
      });

      // liste catégorie fournisseur
    this.typeFournisseurService.list().subscribe(
      (data: any) => {
        this.typeFournisseurList = [...data];
        this.typeFournisseurFiltered = this.typeFournisseurList.sort((a, b) => a.codeCatFrs.localeCompare(b.codeCatFrs));
        console.log(this.typeFournisseurList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
      });

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.fournisseurFiltered = [...this.fournisseurList.sort((a, b) => a.codeFrs.localeCompare(b.codeFrs))];
    }

    const columns = Object.keys(this.fournisseurList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.fournisseurList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.fournisseurFiltered = rows;
  }

  makeForm(fournisseur: Fournisseur): void {
    this.validateForm = this.fb.group({
      numFournisseur: [fournisseur != null ? fournisseur.numFournisseur : null],
      codeFrs: [fournisseur != null ? fournisseur.codeFrs: null, [Validators.required]],
      identiteFrs: [fournisseur != null ? fournisseur.identiteFrs : null,[Validators.required]],
      adresseFrs: [fournisseur != null ? fournisseur.adresseFrs : null],
      raisonSociale: [fournisseur != null ? fournisseur.raisonSociale : null],
      numIfuFrs: [fournisseur != null ? fournisseur.numIfuFrs : null,[Validators.required]],
      telFRS: [fournisseur != null ? fournisseur.telFRS : null],
      description: [fournisseur != null ? fournisseur.description : null],
      domaineInterven: [fournisseur != null ? fournisseur.domaineInterven : null,[Validators.required]],
      compteAvanceFrs: [fournisseur != null ? fournisseur.compteAvanceFrs : null],
      compteFacturationFrs: [fournisseur != null ? fournisseur.compteFacturationFrs : null],
      compteConsignationFrs: [fournisseur != null ? fournisseur.compteConsignationFrs : null],
      compteAvoirFrs: [fournisseur != null ? fournisseur.compteAvoirFrs : null],
      agreerFrs: [fournisseur != null ? fournisseur.agreerFrs : null],
      numAgrementFrs: [fournisseur != null ? fournisseur.numAgrementFrs : null],
      categorieFrs: [fournisseur != null ? fournisseur.categorieFrs : null,[Validators.required]],
      regComFrs: [fournisseur != null ? fournisseur.regComFrs : null,[Validators.required]],
      dateNaissance: [fournisseur != null ? fournisseur.dateNaissance : null,[Validators.required]],
      sexe: [fournisseur != null ? fournisseur.sexe : null,[Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (fournisseur?.numFournisseur !=null){
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
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      const formData = this.validateForm.value;
      if (formData.numFournisseur == null) {
        //console.log("data", formData);
        if(formData.agreerFrs == undefined)
        formData.agreerFrs = false;
        console.log("data", formData);
        
        this.enregistrerFournisseur(formData);
      } else {
        this.modifierFournisseur(formData.numFournisseur,formData);
      }
    }
  }

  enregistrerFournisseur(fournisseur: Fournisseur): void {
    this.fournisseurService.createFournisseur(fournisseur).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.fournisseurList.unshift(data);
        this.fournisseurFiltered = [...this.fournisseurList.sort((a, b) => a.codeFrs.localeCompare(b.codeFrs))];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        this.loading = false;
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
       
      });
  }

  modifierFournisseur(id: String, fournisseur: Fournisseur): void {
    this.fournisseurService.updateFournisseur(id, fournisseur).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.fournisseurList.findIndex(l => l.numFournisseur == data.numFournisseur);
        if (i > -1) {
          this.fournisseurList[i] = data;
          this.fournisseurFiltered = [...this.fournisseurList.sort((a, b) => a.codeFrs.localeCompare(b.codeFrs))];
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
        
      });
  }

  confirm(content, fournisseur) {
    this.fournisseur = fournisseur;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.fournisseurService.deleteFournisseur(fournisseur?.numFrs).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.fournisseurList.findIndex(l => l.numFournisseur == fournisseur.numFournisseur);
          if (i > -1) {
            this.fournisseurList.splice(i, 1);
            this.fournisseurFiltered = [...this.fournisseurList.sort((a, b) => a.codeFrs.localeCompare(b.codeFrs))];
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


}
