import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {RoleAuxiliaire} from "../../../models/gestion/parametrage/role-auxiliaire";
import {LangueJuridiqueService} from "../../../services/gestion/parametrage/langue-juridique.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RoleAuxiliaireService} from "../../../services/gestion/parametrage/role-auxiliaire.service";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-role-auxiliaire',
  templateUrl: './role-auxiliaire.component.html',
  styleUrls: ['./role-auxiliaire.component.css']
})
export class RoleAuxiliaireComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  roleAuxiliaireFiltered;

  validateForm: FormGroup;
  roleAuxiliaireList: RoleAuxiliaire[] = [];
  loading: boolean;
  roleAuxiliaire: RoleAuxiliaire = null;

  //pour les tabs navs
  activeTabsNav;

  constructor(
    private roleAuxiliaireService: RoleAuxiliaireService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.roleAuxiliaireService.list().subscribe(
      (data: any) => {
        this.roleAuxiliaireList = [...data];
        this.roleAuxiliaireFiltered = this.roleAuxiliaireList;
        console.log(this.roleAuxiliaireList);
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
      return this.roleAuxiliaireFiltered = [...this.roleAuxiliaireList];
    }

    const columns = Object.keys(this.roleAuxiliaireList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.roleAuxiliaireList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.roleAuxiliaireFiltered = rows;
  }

  makeForm(roleAuxiliaire: RoleAuxiliaire): void {
    this.validateForm = this.fb.group({
      id: [roleAuxiliaire != null ? roleAuxiliaire.id: null],
      libelle: [roleAuxiliaire != null ? roleAuxiliaire.libelle: null,
        [Validators.required]],
      code: [roleAuxiliaire != null ? roleAuxiliaire.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (roleAuxiliaire?.id !=null){
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

  enregistrerLangueJuridique(roleAuxiliaire: RoleAuxiliaire): void {
    this.roleAuxiliaireService.createRoleAuxiliaire(roleAuxiliaire).subscribe(
      (data: any) => {
        console.log(data);
        this.roleAuxiliaireList.unshift(data);
        this.roleAuxiliaireFiltered = [...this.roleAuxiliaireList];
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

  modifierLangueJuridique(roleAuxiliaire: RoleAuxiliaire): void {
    this.roleAuxiliaireService.updateRoleAuxiliaire(roleAuxiliaire).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.roleAuxiliaireList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.roleAuxiliaireList[i]= data;
          this.roleAuxiliaireFiltered = [...this.roleAuxiliaireList];
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

  confirm(content, roleAuxiliaire) {
    this.roleAuxiliaire = roleAuxiliaire;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.roleAuxiliaireService.deleteRoleAuxiliaire(roleAuxiliaire?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.roleAuxiliaireList.findIndex(l => l.id == roleAuxiliaire.id);
          if(i > -1) {
            this.roleAuxiliaireList.splice(i, 1);
            this.roleAuxiliaireFiltered = [...this.roleAuxiliaireList];
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
