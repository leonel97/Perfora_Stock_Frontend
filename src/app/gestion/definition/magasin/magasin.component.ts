import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { FamilleService } from 'src/app/services/gestion/definition/famille.service';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';

@Component({
  selector: 'app-magasin',
  templateUrl: './magasin.component.html',
  styleUrls: ['./magasin.component.css']
})
export class MagasinComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  magasinFiltered;


  validateForm: FormGroup;
  magasinList: Magasin[] = [];
  loading: boolean;
  magasin: Magasin = null;
  familleList: Famille[] = [];
  selectedFamille: Famille[] = [];


  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private magasinService: MagasinService,
    private familleService: FamilleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.magasinService.getAllMagasin().subscribe(
      (data: any) => {
        this.magasinList = [...data];
        this.magasinFiltered = this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()));
        console.log(this.magasinList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

    this.getAllFamille();

  }

  cliii(){
    console.log(this.validateForm.value.familles);
  }


  getAllFamille(){

    this.familleService.getAllFamille().subscribe(
      (data) => {
        this.familleList = data;
        console.log('all', this.familleList);

      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getFamillesOfAMag(magasin: Magasin) : Famille[] {
    let tab: Famille[] = [];
    this.familleList.forEach(element => {
      if(element.magasin && element.magasin.numMagasin == magasin.numMagasin){
        tab.push(element);

      }
    });

    return tab;

  }

  getFamillesOfAMag2(magasin: Magasin) : number[] {
    let tab: number[] = [];
    this.familleList.forEach(element => {
      if(element.magasin && element.magasin.numMagasin == magasin.numMagasin){
        tab.push(element.numFamille);

      }
    });

    return tab;

  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.magasinFiltered = [...this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()))];
    }

    const columns = Object.keys(this.magasinList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.magasinList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.magasinFiltered = rows;
  }

  makeForm(magasin: Magasin): void {
    this.validateForm = this.fb.group({
      numMagasin: [magasin != null ? magasin.numMagasin: null],
      codeMagasin: [magasin != null ? magasin.codeMagasin: null,
      [Validators.required]],
      libMagasin: [magasin != null ? magasin.libMagasin : null,
        [Validators.required]],
      familles: [[]]
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (magasin?.numMagasin !=null){
      this.validateForm.patchValue({
        familles: this.getFamillesOfAMag2(magasin),
      });

      this.activeTabsNav = 2;

      this.selectedFamille = this.getFamillesOfAMag(magasin);

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

      let tab: Famille[] = [];

      formData.familles.forEach((element) => {
        for (const fa of this.familleList){
          if(element == fa.numFamille){
            tab.push(fa);
            break;
          }
        }
      });

      formData.familles = tab;

      if (formData.numMagasin == null) {
        console.log("data", formData);

        this.enregistrerMagasin(formData, formData.familles);
      } else {
        this.modifierMagasin(formData.numMagasin,formData, formData.familles);
      }
    }
  }

  enregistrerMagasin(magasin: Magasin, famil: Famille[]): void {
    this.magasinService.addAMagasin(magasin).subscribe(
      (data) => {

        famil.forEach((element, inde) => {
          element.magasin = data;
          (function(familleService, element, toastr, ind, famil, familleList){

            familleService.editAFamille(element.numFamille.toString(), element).subscribe(
              (data2) => {
                if(famil.length-1 == ind){
                  familleService.getAllFamille().subscribe(
                    (data) => {
                      familleList = data;
                    },
                    (error: HttpErrorResponse) => {
                      console.log('Echec status ==> ' + error.status);
                    }
                  );
                }
              },
              (error: HttpErrorResponse) => {
                console.log('Echec atatus ==> ' + error.status);
                toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

              }
            );

          })(this.familleService, element, this.toastr, inde, famil, this.familleList);


        });


        console.log(data);
        this.loading = true;
        this.magasinList.unshift(data);
        this.magasinFiltered = [...this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()))];
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

  modifierMagasin(id: String, magasin: Magasin, famil: Famille[]): void {
    this.magasinService.editAMagasin(id, magasin).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        const i = this.magasinList.findIndex(l => l.numMagasin == data.numMagasin);
        if (i > -1) {
          this.magasinList[i] = data;
          this.magasinFiltered = [...this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()))];
        }

        famil.forEach(element => {
          let nnewer: boolean = true;

          for(const old of this.selectedFamille){
            if(element.numFamille == old.numFamille){
              nnewer = false;
              break;
            }
          }

          if(nnewer){
            element.magasin = data;
            this.familleService.editAFamille(element.numFamille.toString(), element).subscribe(
              (data2) => {
                this.getAllFamille();
              },
              (error: HttpErrorResponse) => {
                console.log('Echec atatus ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

              }
            );
          }

        });

        this.selectedFamille.forEach(element => {
          let finde: boolean = false;

          for(const fam of famil){
            if(element.numFamille == fam.numFamille){
              finde = true;
              break;
            }
          }

          if(!finde){
            element.magasin = null;
            this.familleService.editAFamille(element.numFamille.toString(), element).subscribe(
              (data2) => {
                this.getAllFamille();
              },
              (error: HttpErrorResponse) => {
                console.log('Echec atatus ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

              }
            );
          }

        });

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

  confirm(content, magasin: Magasin) {
    this.magasin = magasin;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.magasinService.deleteAMagasin(magasin?.numMagasin.toString()).subscribe(
        (data) => {
          console.log(data);
          const i = this.magasinList.findIndex(l => l.numMagasin == magasin.numMagasin);
          if (i > -1) {
            this.magasinList.splice(i, 1);
            this.magasinFiltered = [...this.magasinList.sort((a, b) => a.codeMagasin.localeCompare(b.codeMagasin.valueOf()))];
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

