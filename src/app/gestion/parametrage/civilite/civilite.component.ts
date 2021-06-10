import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Civilite} from "../../../models/gestion/parametrage/civilite";
import {CiviliteService} from "../../../services/gestion/parametrage/civilite.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-civilite',
  templateUrl: './civilite.component.html',
  styleUrls: ['./civilite.component.css']
})
export class CiviliteComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  civiliteFiltered;

  validateForm: FormGroup;
  civiliteList: Civilite[] = [];
  loading: boolean;
  civilite: Civilite = null;
  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private civiliteService: CiviliteService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.civiliteService.list().subscribe(
      (data: any) => {
        this.civiliteList = [...data];
        this.civiliteFiltered = this.civiliteList;
        console.log(this.civiliteList);
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
      return this.civiliteFiltered = [...this.civiliteList];
    }

    const columns = Object.keys(this.civiliteList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.civiliteList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.civiliteFiltered = rows;
  }

  makeForm(civilite: Civilite): void {
    this.validateForm = this.fb.group({
      id: [civilite != null ? civilite.id: null],
      libelle: [civilite != null ? civilite.libelle: null,
        [Validators.required]],
      code: [civilite != null ? civilite.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (civilite?.id !=null){
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
        this.enregistrerCivilite(formData);
      } else {
        this.modifierCivilite(formData);
      }
    }
  }

  enregistrerCivilite(civilite: Civilite): void {
    this.civiliteService.createCivilite(civilite).subscribe(
      (data: any) => {
        console.log(data);
        this.civiliteList.unshift(data);
        this.civiliteFiltered = [...this.civiliteList];
        this.resetForm();
        this.loading = true;
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);*/
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

  modifierCivilite(civilite: Civilite): void {
    this.civiliteService.updateCivilite(civilite).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.civiliteList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.civiliteList[i]= data;
          this.civiliteFiltered = [...this.civiliteList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
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

  confirm(content, civilite) {
    this.civilite = civilite;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.civiliteService.deleteCivilite(civilite?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.civiliteList.findIndex(l => l.id == civilite.id);
          if(i > -1) {
            this.civiliteList.splice(i, 1);
            this.civiliteFiltered = [...this.civiliteList];
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
