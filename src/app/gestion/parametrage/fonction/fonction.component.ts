import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NatureJuridique} from "../../../models/gestion/parametrage/nature-juridique";
import {NatureJuridiqueService} from "../../../services/gestion/parametrage/nature-juridique.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Fonction} from "../../../models/gestion/parametrage/fonction";
import {FonctionService} from "../../../services/gestion/parametrage/fonction.service";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";

@Component({
  selector: 'app-fonction',
  templateUrl: './fonction.component.html',
  styleUrls: ['./fonction.component.css']
})
export class FonctionComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  fonctionFiltered;

  validateForm: FormGroup;
  fonctionList: Fonction[] = [];
  loading: boolean;
  fonction: Fonction = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private fonctionService: FonctionService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.fonctionService.list().subscribe(
      (data: any) => {
        this.fonctionList = [...data];
        this.fonctionFiltered = this.fonctionList;
        console.log(this.fonctionList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
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
      return this.fonctionFiltered = [...this.fonctionList];
    }

    const columns = Object.keys(this.fonctionList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.fonctionList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.fonctionFiltered = rows;
  }

  makeForm(fonction: Fonction): void {
    this.validateForm = this.fb.group({
      id: [fonction != null ? fonction.id: null],
      libelle: [fonction != null ? fonction.libelle: null,
        [Validators.required]],
      code: [fonction != null ? fonction.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (fonction?.id !=null){
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

    if(this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else  {
      const formData = this.validateForm.value;
      if(formData.id == null) {
        this.enregistrerLangueJuridique(formData);
      } else {
        this.modifierLangueJuridique(formData);
      }
    }
  }

  enregistrerLangueJuridique(fonction: Fonction): void {
    this.fonctionService.createFonction(fonction).subscribe(
      (data: any) => {
        console.log(data);
        this.fonctionList.unshift(data);
        this.fonctionFiltered = [...this.fonctionList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  modifierLangueJuridique(fonction: Fonction): void {
    this.fonctionService.updateFonction(fonction).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.fonctionList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.fonctionList[i]= data;
          this.fonctionFiltered = [...this.fonctionList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  confirm(content, fonction) {
    this.fonction = fonction;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.fonctionService.deleteFonction(fonction?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.fonctionList.findIndex(l => l.id == fonction.id);
          if(i > -1) {
            this.fonctionList.splice(i, 1);
            this.fonctionFiltered = [...this.fonctionList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> '+error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
