import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {TypeFournisseur} from "../../../models/gestion/definition/typeFournisseur";
import {TypeFournisseurService} from "../../../services/gestion/definition/typeFournisseur.service";

@Component({
  selector: 'app-type-fournisseur',
  templateUrl: './type-fournisseur.component.html',
  styleUrls: ['./type-fournisseur.component.css']
})
export class TypeFournisseurComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  typeFournisseurFiltered;

  validateForm: FormGroup;
  typeFournisseurList: TypeFournisseur[] = [];
  loading: boolean;
  typeFournisseur: TypeFournisseur = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private typeFournisseurService: TypeFournisseurService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

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
      return this.typeFournisseurFiltered = [...this.typeFournisseurList.sort((a, b) => a.codeCatFrs.localeCompare(b.codeCatFrs))];
    }

    const columns = Object.keys(this.typeFournisseurList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.typeFournisseurList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.typeFournisseurFiltered = rows;
  }

  makeForm(typeFournisseur: TypeFournisseur): void {
    this.validateForm = this.fb.group({
      numCatFrs: [typeFournisseur != null ? typeFournisseur.numCatFrs : null],
      libCatFrs: [typeFournisseur != null ? typeFournisseur.libCatFrs : null,[Validators.required]],
      codeCatFrs: [typeFournisseur != null ? typeFournisseur.codeCatFrs: null, [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (typeFournisseur?.numCatFrs !=null){
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
      if (formData.numCatFrs == null) {
        console.log("data", formData);
        
        this.enregistrerTypeFournisseur(formData);
      } else {
        this.modifierTypeFournisseur(formData.numCatFrs,formData);
      }
    }
  }

  enregistrerTypeFournisseur(typeFournisseur: TypeFournisseur): void {
    this.typeFournisseurService.createTypeFournisseur(typeFournisseur).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.typeFournisseurList.unshift(data);
        this.typeFournisseurFiltered = [...this.typeFournisseurList.sort((a, b) => a.codeCatFrs.localeCompare(b.codeCatFrs))];
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

  modifierTypeFournisseur(id: String, typeFournisseur: TypeFournisseur): void {
    this.typeFournisseurService.updateTypeFournisseur(id, typeFournisseur).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.typeFournisseurList.findIndex(l => l.numCatFrs == data.numCatFrs);
        if (i > -1) {
          this.typeFournisseurList[i] = data;
          this.typeFournisseurFiltered = [...this.typeFournisseurList.sort((a, b) => a.codeCatFrs.localeCompare(b.codeCatFrs))];
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

  confirm(content, typeFournisseur) {
    this.typeFournisseur = typeFournisseur;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.typeFournisseurService.deleteTypeFournisseur(typeFournisseur?.numCatFrs).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.typeFournisseurList.findIndex(l => l.numCatFrs == typeFournisseur.numCatFrs);
          if (i > -1) {
            this.typeFournisseurList.splice(i, 1);
            this.typeFournisseurFiltered = [...this.typeFournisseurList.sort((a, b) => a.codeCatFrs.localeCompare(b.codeCatFrs))];
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
