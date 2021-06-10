import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CorpsJuridique} from "../../../models/gestion/parametrage/corps-juridique";
import {CorpsJuridiqueService} from "../../../services/gestion/parametrage/corps-juridique.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-corps-juridique',
  templateUrl: './corps-juridique.component.html',
  styleUrls: ['./corps-juridique.component.css']
})
export class CorpsJuridiqueComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  corpsJuridiqueFiltered;

  validateForm: FormGroup;
  corpsJuridiqueList: CorpsJuridique[] = [];
  loading: boolean;
  corpsJuridique: CorpsJuridique = null;
  activeTabsNav;

  constructor(
    private corpsJuridiqueService: CorpsJuridiqueService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.corpsJuridiqueService.list().subscribe(
      (data: any) => {
        this.corpsJuridiqueList = [...data];
        this.corpsJuridiqueFiltered = this.corpsJuridiqueList;
        console.log(this.corpsJuridiqueList);
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
      return this.corpsJuridiqueFiltered = [...this.corpsJuridiqueList];
    }

    const columns = Object.keys(this.corpsJuridiqueList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.corpsJuridiqueList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.corpsJuridiqueFiltered = rows;
  }

  makeForm(corpsJuridique: CorpsJuridique): void {
    this.validateForm = this.fb.group({
      id: [corpsJuridique != null ? corpsJuridique.id: null],
      libelle: [corpsJuridique != null ? corpsJuridique.libelle: null,
        [Validators.required]],
    });
    if (corpsJuridique?.id !=null){
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
        this.enregistrerCorpsJuridique(formData);
      } else {
        this.modifierCorpsJuridique(formData);
      }
    }
  }

  enregistrerCorpsJuridique(corpsJuridique: CorpsJuridique): void {
    this.corpsJuridiqueService.createCorps(corpsJuridique).subscribe(
      (data: any) => {
        console.log(data);
        this.corpsJuridiqueList.unshift(data);
        this.corpsJuridiqueFiltered = [...this.corpsJuridiqueList];
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

  modifierCorpsJuridique(corpsJuridique: CorpsJuridique): void {
    this.corpsJuridiqueService.updateCorps(corpsJuridique).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.corpsJuridiqueList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.corpsJuridiqueList[i]= data;
          this.corpsJuridiqueFiltered = [...this.corpsJuridiqueList];
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

  confirm(content, corpsJuridique) {
    this.corpsJuridique = corpsJuridique;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.corpsJuridiqueService.deleteCorps(corpsJuridique?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.corpsJuridiqueList.findIndex(l => l.id == corpsJuridique.id);
          if(i > -1) {
            this.corpsJuridiqueList.splice(i, 1);
            this.corpsJuridiqueFiltered = [...this.corpsJuridiqueList];
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
