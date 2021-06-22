import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CloturePeriodiq } from 'src/app/models/gestion/saisie/cloturePeriodiq.model';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';

@Component({
  selector: 'app-cloture-periodique',
  templateUrl: './cloture-periodique.component.html',
  styleUrls: ['./cloture-periodique.component.css']
})
export class CloturePeriodiqueComponent implements OnInit {

  validateForm: FormGroup;
  cloturePeriodiqList: CloturePeriodiq[] = [];
  loading: boolean;
  lastCloture: CloturePeriodiq = null;


  constructor(
    private cloturePeriodiquService: CloturePeriodiqService,
    private exerciceService: ExerciceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.makeForm(null);
   }

  ngOnInit(): void {
  }

  getLastCloture(){
    this.cloturePeriodiquService.getAllCloturePeriodiq().subscribe(
      (data) => {
        this.lastCloture = null;
        let val : number = -1;
        data.forEach((element, inde) => {
          if(element.idCloturePer > val){
            val = element.idCloturePer;
          }
          if(inde == data.length-1){

          }
        });

      const i = data.findIndex(l => l.idCloturePer == val);

      if (i > -1) {
        this.lastCloture = data[i];
      }

      this.makeForm(this.lastCloture);

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }
  

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);
    this.getLastCloture();
  }

  makeForm(lastClo : CloturePeriodiq): void {
    this.validateForm = this.fb.group({
      dateDebut0: [ lastClo != null ? lastClo.dateDebutCloturePer: null],
        dateFin0: [ lastClo != null ? lastClo.dateFinCloturePer: null],
      dateDebut: [ null, [Validators.required]],
      dateFin: [ null, [Validators.required]],
    });
    
  }

  submit(content){

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
      
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
        .result.then((result) => {
          console.log(new CloturePeriodiq(this.validateForm.value.dateDebut, this.validateForm.value.dateFin, this.exerciceService.selectedExo));
        this.loading = true;
        this.cloturePeriodiquService.addACloturePeriodiq(new CloturePeriodiq(this.validateForm.value.dateDebut, this.validateForm.value.dateFin, this.exerciceService.selectedExo)).subscribe(
          (data) => {

            console.log(data);
            
            this.resetForm();
            this.toastr.success('Suppression effectué avec succès.', 'Success!', { timeOut: 5000 });
            this.loading = false;
          },
          (error: HttpErrorResponse) => {
            console.log('Echec status ==> ' + error.status);
            this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
            this.loading = false;
          });
      }, (reason) => {
        console.log(`Dismissed with: ${reason}`);
      });

    }

   
  }

}
