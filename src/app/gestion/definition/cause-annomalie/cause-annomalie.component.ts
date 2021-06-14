import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {CauseAnomalie} from "../../../models/gestion/definition/causeAnomalie";
import {CauseAnomalieService} from "../../../services/gestion/definition/causeAnomalie.service";

@Component({
  selector: 'app-cause-annomalie',
  templateUrl: './cause-annomalie.component.html',
  styleUrls: ['./cause-annomalie.component.css']
})
export class CauseAnnomalieComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  causeAnomalieFiltered;

  validateForm: FormGroup;
  causeAnomalieList: CauseAnomalie[] = [];
  loading: boolean;
  causeAnomalie: CauseAnomalie = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private causeAnomalieService: CauseAnomalieService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.causeAnomalieService.list().subscribe(
      (data: any) => {
        this.causeAnomalieList = [...data];
        this.causeAnomalieFiltered = this.causeAnomalieList.sort((a, b) => a.codeCauseAno.localeCompare(b.codeCauseAno));
        console.log(this.causeAnomalieList);
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
      return this.causeAnomalieFiltered = [...this.causeAnomalieList.sort((a, b) => a.codeCauseAno.localeCompare(b.codeCauseAno))];
    }

    const columns = Object.keys(this.causeAnomalieList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.causeAnomalieList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.causeAnomalieFiltered = rows;
  }

  makeForm(causeAnomalie: CauseAnomalie): void {
    this.validateForm = this.fb.group({
      numCauseAno: [causeAnomalie != null ? causeAnomalie.numCauseAno : null],
      libCauseAno: [causeAnomalie != null ? causeAnomalie.libCauseAno : null,[Validators.required]],
      codeCauseAno: [causeAnomalie != null ? causeAnomalie.codeCauseAno: null, [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (causeAnomalie?.numCauseAno !=null){
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
      if (formData.numCauseAno == null) {
        console.log("data", formData);
        
        this.enregistrerCauseAnomalie(formData);
      } else {
        this.modifierCauseAnomalie(formData.numCauseAno,formData);
      }
    }
  }

  enregistrerCauseAnomalie(causeAnomalie: CauseAnomalie): void {
    this.causeAnomalieService.createCauseAnomalie(causeAnomalie).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.causeAnomalieList.unshift(data);
        this.causeAnomalieFiltered = [...this.causeAnomalieList.sort((a, b) => a.codeCauseAno.localeCompare(b.codeCauseAno))];
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

  modifierCauseAnomalie(id: String, causeAnomalie: CauseAnomalie): void {
    this.causeAnomalieService.updateCauseAnomalie(id, causeAnomalie).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.causeAnomalieList.findIndex(l => l.numCauseAno == data.numCauseAno);
        if (i > -1) {
          this.causeAnomalieList[i] = data;
          this.causeAnomalieFiltered = [...this.causeAnomalieList.sort((a, b) => a.codeCauseAno.localeCompare(b.codeCauseAno))];
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

  confirm(content, causeAnomalie) {
    this.causeAnomalie = causeAnomalie;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.causeAnomalieService.deleteCauseAnomalie(causeAnomalie?.numCauseAno).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.causeAnomalieList.findIndex(l => l.numCauseAno == causeAnomalie.numCauseAno);
          if (i > -1) {
            this.causeAnomalieList.splice(i, 1);
            this.causeAnomalieFiltered = [...this.causeAnomalieList.sort((a, b) => a.codeCauseAno.localeCompare(b.codeCauseAno))];
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
