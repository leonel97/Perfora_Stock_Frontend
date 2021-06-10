import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {Annee} from "../../../models/gestion/parametrage/annee";
import {AnneeService} from "../../../services/gestion/parametrage/annee.service";

@Component({
  selector: 'app-annee',
  templateUrl: './annee.component.html',
  styleUrls: ['./annee.component.css']
})
export class AnneeComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  anneeFiltered;

  validateForm: FormGroup;
  anneeList: Annee[] = [];
  loading: boolean;
  annee: Annee = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private anneeService: AnneeService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.anneeService.list().subscribe(
      (data: any) => {
        this.anneeList = [...data];
        this.anneeFiltered = this.anneeList;
        console.log(this.anneeList);
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
      return this.anneeFiltered = [...this.anneeList];
    }

    const columns = Object.keys(this.anneeList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.anneeList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.anneeFiltered = rows;
  }

  makeForm(annee: Annee): void {
    this.validateForm = this.fb.group({
      id: [annee != null ? annee.id : null],
      valeur: [annee != null ? annee.valeur : null,
        [Validators.required]],
      code: [annee != null ? annee.code : null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (annee?.id !=null){
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
      if (formData.id == null) {
        this.enregistrerAnnee(formData);
      } else {
        this.modifierAnnee(formData);
      }
    }
  }

  enregistrerAnnee(annee: Annee): void {
    this.anneeService.createAnnee(annee).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.anneeList.unshift(data);
        this.anneeFiltered = [...this.anneeList];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000 );*/
        //basculer vers la tab contenant la liste apres enregistrement
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);*/
      });
  }

  modifierAnnee(annee: Annee): void {
    this.anneeService.updateAnnee(annee).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.anneeList.findIndex(l => l.id == data.id);
        if (i > -1) {
          this.anneeList[i] = data;
          this.anneeFiltered = [...this.anneeList];
        }
        this.loading = true;
        this.resetForm();
        this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);*/
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);*/
      });
  }

  confirm(content, annee) {
    this.annee = annee;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.anneeService.deleteAnnee(annee?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.anneeList.findIndex(l => l.id == annee.id);
          if (i > -1) {
            this.anneeList.splice(i, 1);
            this.anneeFiltered = [...this.anneeList];
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
