import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import { OperationJournal } from 'src/app/models/gestion/comptabilisation/operJournal.model';
import { OperationJournalService } from 'src/app/services/gestion/comptabilisation/operJournal.service';

@Component({
  selector: 'app-operation-journal',
  templateUrl: './operation-journal.component.html',
  styleUrls: ['./operation-journal.component.css']
})
export class OperationJournalComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  operationJournalFiltered;

  validateForm: FormGroup;
  operationJournalList: OperationJournal[] = [];
  loading: boolean;
  operationJournal: OperationJournal = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private operationJournalService: OperationJournalService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.operationJournalService.list().subscribe(
      (data: any) => {
        this.operationJournalList = [...data];
        this.operationJournalFiltered = this.operationJournalList.sort((a, b) => a.numParam.toString().localeCompare(b.numParam.toString()));
        console.log(this.operationJournalList);
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
      return this.operationJournalFiltered = [...this.operationJournalList.sort((a, b) => a.numParam.toString().localeCompare(b.numParam.toString()))];
    }

    const columns = Object.keys(this.operationJournalList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.operationJournalList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.operationJournalFiltered = rows;
  }

  makeForm(operationJournal: OperationJournal): void {
    this.validateForm = this.fb.group({
      numParam: [operationJournal != null ? operationJournal.numParam : null],
      operation: [operationJournal != null ? operationJournal.operation : null,
        [Validators.required]],
        journal: [operationJournal != null ? operationJournal.journal: null, 
        [Validators.required]],
        dateDebut: [operationJournal != null ? operationJournal.dateDebut : null],
        dateFin: [operationJournal != null ? operationJournal.dateFin : null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (operationJournal?.numParam !=null){
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
      if (formData.numParam == null) {
        console.log("data", formData);
        
        this.enregistrerOperationJournal(formData);
      } else {
        this.modifierOperationJournal(formData.numParam,formData);
      }
    }
  }

  enregistrerOperationJournal(operationJournal: OperationJournal): void {
    this.operationJournalService.createOperationJournal(operationJournal).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.operationJournalList.unshift(data);
        this.operationJournalFiltered = [...this.operationJournalList.sort((a, b) => a.numParam.toString().localeCompare(b.numParam.toString()))];
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

  modifierOperationJournal(id: number, operationJournal: OperationJournal): void {
    this.operationJournalService.updateOperationJournal(id, operationJournal).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.operationJournalList.findIndex(l => l.numParam== data.numParam);
        if (i > -1) {
          this.operationJournalList[i] = data;
          this.operationJournalFiltered = [...this.operationJournalList.sort((a, b) => a.numParam.toString().localeCompare(b.numParam.toString()))];
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

  confirm(content, operationJournal) {
    this.operationJournal = operationJournal;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.operationJournalService.deleteOperationJournal(operationJournal?.numParam).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.operationJournalList.findIndex(l => l.numParam == operationJournal.numParam);
          if (i > -1) {
            this.operationJournalList.splice(i, 1);
            this.operationJournalFiltered = [...this.operationJournalList.sort((a, b) => a.numParam.toString().localeCompare(b.numParam.toString()))];
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
