import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Statut} from "../../../models/gestion/parametrage/statut";
import {StatutService} from "../../../services/gestion/parametrage/statut.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-statut',
  templateUrl: './statut.component.html',
  styleUrls: ['./statut.component.css']
})
export class StatutComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  statutFiltered;

  validateForm: FormGroup;
  statutList: Statut[] = [];
  loading: boolean;
  statut: Statut = null;
  //pour les tabs navs
  activeTabsNav;
  //end
  constructor(
    private statutService: StatutService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.statutService.list().subscribe(
      (data: any) => {
        this.statutList = [...data];
        this.statutFiltered = this.statutList;
        console.log(this.statutList);
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
      return this.statutFiltered = [...this.statutList];
    }

    const columns = Object.keys(this.statutList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.statutList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.statutFiltered = rows;
  }

  makeForm(statut: Statut): void {
    this.validateForm = this.fb.group({
      id: [statut != null ? statut.id: null],
      libelle: [statut != null ? statut.libelle: null,
        [Validators.required]],
      code: [statut != null ? statut.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (statut?.id !=null){
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
        this.enregistrerStatut(formData);
      } else {
        this.modifierStatut(formData);
      }
    }
  }

  enregistrerStatut(statut: Statut): void {
    this.statutService.createStatut(statut).subscribe(
      (data: any) => {
        console.log(data);
        this.statutList.unshift(data);
        this.statutFiltered = [...this.statutList];
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

  modifierStatut(statut: Statut): void {
    this.statutService.updateStatut(statut).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.statutList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.statutList[i]= data;
          this.statutFiltered = [...this.statutList];
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

  confirm(content, statut) {
    this.statut = statut;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.statutService.deleteStatut(statut?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.statutList.findIndex(l => l.id == statut.id);
          if(i > -1) {
            this.statutList.splice(i, 1);
            this.statutFiltered = [...this.statutList];
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
