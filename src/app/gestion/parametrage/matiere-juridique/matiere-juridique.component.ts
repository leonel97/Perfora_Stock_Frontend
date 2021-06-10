import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatiereJuridiqueService} from "../../../services/gestion/parametrage/matiere-juridique.service";
import {MatiereJuridique} from "../../../models/gestion/parametrage/matiere-juridique";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {debounceTime} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-matiere-juridique',
  templateUrl: './matiere-juridique.component.html',
  styleUrls: ['./matiere-juridique.component.css']
})
export class MatiereJuridiqueComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  matiereJuridiqueFiltered;

  validateForm: FormGroup;
  matiereJuridiqueList: MatiereJuridique[] = [];
  loading: boolean;
  matiereJuridique: MatiereJuridique = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private matiereJuridiqueService: MatiereJuridiqueService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.matiereJuridiqueService.list().subscribe(
      (data: any) => {
        this.matiereJuridiqueList = [...data];
        this.matiereJuridiqueFiltered = this.matiereJuridiqueList;
        console.log(this.matiereJuridiqueList);
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
      return this.matiereJuridiqueFiltered = [...this.matiereJuridiqueList];
    }

    const columns = Object.keys(this.matiereJuridiqueList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.matiereJuridiqueList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.matiereJuridiqueFiltered = rows;
  }

  makeForm(matiereJuridique: MatiereJuridique): void {
    this.validateForm = this.fb.group({
      id: [matiereJuridique != null ? matiereJuridique.id: null],
      libelle: [matiereJuridique != null ? matiereJuridique.libelle: null,
        [Validators.required]],
      code: [matiereJuridique != null ? matiereJuridique.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (matiereJuridique?.id !=null){
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
        this.enregistrerMatiereJuridique(formData);
      } else {
        this.modifierMatiereJuridique(formData);
      }
    }
  }

  enregistrerMatiereJuridique(matiereJuridique: MatiereJuridique): void {
    this.matiereJuridiqueService.createMatiere(matiereJuridique).subscribe(
      (data: any) => {
        console.log(data);
        this.matiereJuridiqueList.unshift(data);
        this.matiereJuridiqueFiltered = [...this.matiereJuridiqueList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        //basculer vers la tab contenant la liste apres enregistrement
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

  modifierMatiereJuridique(matiereJuridique: MatiereJuridique): void {
    this.matiereJuridiqueService.updateMatiere(matiereJuridique).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.matiereJuridiqueList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.matiereJuridiqueList[i]= data;
          this.matiereJuridiqueFiltered = [...this.matiereJuridiqueList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
        //basculer vers la tab contenant la liste apres modification
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

  confirm(content, matiereJuridique) {
    this.matiereJuridique = matiereJuridique;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.matiereJuridiqueService.deleteLanguage(matiereJuridique?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.matiereJuridiqueList.findIndex(l => l.id == matiereJuridique.id);
          if(i > -1) {
            this.matiereJuridiqueList.splice(i, 1);
            this.matiereJuridiqueFiltered = [...this.matiereJuridiqueList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> '+error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
