import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { CloturePeriodiq } from 'src/app/models/gestion/saisie/cloturePeriodiq.model';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { CloturePeriodiqService } from 'src/app/services/gestion/saisie/cloture-periodiq.service';

@Component({
  selector: 'app-cloture-periodique',
  templateUrl: './cloture-periodique.component.html',
  styleUrls: ['./cloture-periodique.component.css']
})
export class CloturePeriodiqueComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  cloturePeriodiqFiltered;

  validateForm: FormGroup;
  cloturePeriodiqList: CloturePeriodiq[] = [];
  cloturePeriodiq: CloturePeriodiq = null;
  loading: boolean;
  lastCloture: CloturePeriodiq = null;
  etatVali: boolean = false;
  activeTabsNav;

  constructor(
    private cloturePeriodiquService: CloturePeriodiqService,
    private exerciceService: ExerciceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.makeForm(null);
    this.searchControl.valueChanges.
    pipe(debounceTime(200)).subscribe((data) => {
      this.filerData(data);
    });
   }

  ngOnInit(): void {
    this.resetForm();
  }

  filerData(val) {
    if (val) {
      val = (val+'').toLowerCase();
    } else {
      return this.cloturePeriodiqFiltered = [...this.cloturePeriodiqList.sort((a, b) => a.idCloturePer.toString().localeCompare(b.idCloturePer.toString()))];
    }

    const columns = Object.keys(this.cloturePeriodiqList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.cloturePeriodiqList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.cloturePeriodiqFiltered = rows;
  }

  getLastCloture(){
    this.cloturePeriodiquService.getAllCloturePeriodiq().subscribe(
      (data) => {
        //console.log(data);
        this.cloturePeriodiqList = data;
        this.filerData(this.searchControl.value);
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
          
          this.loading = true;
          this.cloturePeriodiquService.addACloturePeriodiq(new CloturePeriodiq(this.validateForm.value.dateDebut, this.validateForm.value.dateFin, this.exerciceService.selectedExo, null)).subscribe(
          (data) => {

            console.log(data);
            
            this.resetForm();
            this.toastr.success('Clôture effectuée avec succès.', 'Success!', { timeOut: 5000, progressBar: true});
            this.loading = false;
            this.activeTabsNav = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Echec status ==> ' + error.status);
            this.toastr.error(error.error.text, 'Erreur '+error.status+' !', { timeOut: 5000, progressBar:true});
            this.loading = false;
          });
      }, (reason) => {
        console.log(`Dismissed with: ${reason}`);
      });

    }

   
  }

  valider(periode: CloturePeriodiq, eta: boolean, content){
    this.cloturePeriodiq = {...periode};
    this.etatVali = eta;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;

      this.cloturePeriodiq.valide = eta;

      this.cloturePeriodiquService.validateACloturePeriodiq(periode.idCloturePer.toString(), this.cloturePeriodiq).subscribe(
        (data) => {
          console.log(data);
          const i = this.cloturePeriodiqList.findIndex(l => l.idCloturePer == periode.idCloturePer);
              if (i > -1) {
                this.cloturePeriodiqList[i] = this.cloturePeriodiq;
                this.cloturePeriodiqFiltered = [...this.cloturePeriodiqList.sort((a, b) => a.idCloturePer.toString().localeCompare(b.idCloturePer.toString()))];
                this.filerData(this.validateForm.value);

              }

              let msg: String = 'Validation'
              if(eta == false) msg = 'Annulation';
              this.toastr.success(msg+' effectuée avec succès.', 'Success', { timeOut: 5000 });

        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error(error.error.text, 'Erreur '+error.status+' !', { timeOut: 5000, progressBar:true});

        }
      );

    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });

  }

  isLast(periode: CloturePeriodiq): boolean {
    let liste: CloturePeriodiq[] = [...this.cloturePeriodiqList];
    liste.sort((a, b) => a.dateDebutCloturePer.valueOf() - b.dateDebutCloturePer.valueOf());
    
    return liste[liste.length - 1].idCloturePer == periode.idCloturePer;

  }

  delete(content, periode: CloturePeriodiq) {
    this.cloturePeriodiq = {...periode};
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.cloturePeriodiquService.deleteACloturePeriodiq(this.cloturePeriodiq?.idCloturePer.toString()).subscribe(
        (data) => {
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
