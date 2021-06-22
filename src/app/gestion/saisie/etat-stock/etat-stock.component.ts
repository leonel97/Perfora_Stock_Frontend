import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';

export interface modelLigneEtatStock{
  concernedStocker: Stocker;
}

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.css']
})
export class EtatStockComponent implements OnInit {

  loading = false;
  ligneShow : modelLigneEtatStock[] = [];
  magasinList : Magasin[] = [];
  stockerList : Stocker[] = [];
  searchControl: FormControl = new FormControl();
  ligneShowFiltered;

  validateForm: FormGroup;

  constructor(
    private stockerService: StockerService,
    private magasinService: MagasinService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {

    this.makeForm();

   }

  ngOnInit(): void {

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

    this.getAllMagasin();
    this.getAllStocker();
  }

  makeForm(): void {
    this.validateForm = this.fb.group({
      magasin: [null, [Validators.required]]
    });
    
  }

  getAllMagasin(){
    this.magasinService.getAllMagasin().subscribe(
      (data) => {
        this.magasinList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllStocker(){
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.ligneShowFiltered = [...this.ligneShow.sort((a, b) => a.concernedStocker.idStocker.toString().localeCompare(b.concernedStocker.idStocker.toString()))];
    }

    const columns = Object.keys(this.ligneShow[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.ligneShow.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.ligneShowFiltered = rows;
  }

  submit(){

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Choisir un Magasin.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      
      this.getLignShowOfSelectedMagasin();
        
    }

   
  }

  getLignShowOfSelectedMagasin(){
    this.ligneShow = [];
    this.loading = true;
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
        let selectedMag : Magasin = null;

        const i = this.magasinList.findIndex(l => l.numMagasin == this.validateForm.value.magasin);

        if (i > -1) {
          selectedMag= this.magasinList[i];
          this.stockerList.forEach(element => {
            if(element.magasin.numMagasin == selectedMag.numMagasin){
              this.ligneShow.push({
                concernedStocker : element,
              })
            }
          });

          this.ligneShowFiltered = [...this.ligneShow];

          this.loading = false;

          console.log(this.ligneShowFiltered);

        }
        else{
          this.loading = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading = false;
      }
    );
    

  }


}
