import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {debounceTime} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { Modele } from '../../../models/gestion/parametrage/modele';
import { ModeleService } from '../../../services/gestion/parametrage/modele.service';




@Component({
  selector: 'app-modele',
  templateUrl: './modele.component.html',
  styleUrls: ['./modele.component.css']
})
export class ModeleComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  modeleFiltered;

  validateForm: FormGroup;
  modeleList: Modele[] = [];
  loading: boolean;
  modele: Modele = null;

   //pour les tabs navs
   activeTabsNav;
   //end

  constructor(
    private modeleService: ModeleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.modeleService.list().subscribe(
      (data: any) => {
        console.log(data);
        this.modeleList = [...data];
        this.modeleFiltered = this.modeleList;
        console.log(this.modeleList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> '+error.status);
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
      return this.modeleFiltered = [...this.modeleList];
    }

    const columns = Object.keys(this.modeleList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.modeleList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.modeleFiltered = rows;
  }

  makeForm(modele: Modele): void {
    this.validateForm = this.fb.group({
      id: [modele != null ? modele.id: null],
      libelle: [modele != null ? modele.libelle: null,
        [Validators.required]],
      numero: [modele != null ? modele.numero: null,
        [Validators.required]],
      chemim: [modele != null ? modele.chemim: null,
          [Validators.required]],
    });

    if (modele?.id !=null){
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
    } else {
      console.log("Form");
      console.log(this.validateForm.value);
      const formData = this.validateForm.value;

      if(formData.id == null) {
        this.enregistrerModele(formData);
      } else {
        this.modifierModele(formData);
      }
    }
  }

  enregistrerModele(modele: Modele): void {
    this.modeleService.createModele(modele).subscribe(
      (data: any) => {
        console.log(data);
        this.modeleList.unshift(data);
        this.modeleFiltered = [...this.modeleList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  modifierModele(modele: Modele): void {
    this.modeleService.updateModele(modele).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.modeleList.findIndex(p => p.id == data.id);
        if(i > -1) {
          this.modeleList[i]= data;
          this.modeleFiltered = [...this.modeleList];
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
        console.log('Echec status ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  confirm(content, modele) {
    this.modele = modele;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.modeleService.deleteModele(modele?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.modeleList.findIndex(l => l.id == modele.id);
          if(i > -1) {
            this.modeleList.splice(i, 1);
            this.modeleFiltered = [...this.modeleList];
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
