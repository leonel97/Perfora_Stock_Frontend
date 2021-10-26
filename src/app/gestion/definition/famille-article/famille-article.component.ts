import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { AuthService } from 'src/app/services/common/auth.service';
import { FamilleService } from 'src/app/services/gestion/definition/famille.service';

@Component({
  selector: 'app-famille-article',
  templateUrl: './famille-article.component.html',
  styleUrls: ['./famille-article.component.css']
})
export class FamilleArticleComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  familleFiltered;

  validateForm: FormGroup;
  familleList: Famille[] = [];
  familleList2: Famille[] = [];
  loading: boolean;
  famille: Famille = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private familleService: FamilleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.familleService.getAllFamille().subscribe(
      (data) => {
        this.familleList = [...data];
        this.familleFiltered = this.familleList.sort((a, b) => a.codeFamille.localeCompare(b.codeFamille.valueOf()));
        console.log(this.familleList);
        this.familleList2 = data;
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

  }

  getAllFamille(){

    this.familleService.getAllFamille().subscribe(
      (data) => {
        this.familleList2 = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });


  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.familleFiltered = [...this.familleList.sort((a, b) => a.codeFamille.localeCompare(b.codeFamille.valueOf()))];
    }

    const columns = Object.keys(this.familleList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.familleList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.familleFiltered = rows;
  }

  makeForm(famille: Famille): void {
    this.validateForm = this.fb.group({
      numFamille: [famille != null ? famille.numFamille: null],
      codeFamille: [famille != null ? famille.codeFamille: null,
      [Validators.required]],
      libFamille: [famille != null ? famille.libFamille : null,
        [Validators.required]],
      superFamille: [famille != null ? famille.superFamille : null],
    });

    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (famille?.numFamille !=null){
      const i = this.familleList2.findIndex(l => l.numFamille == famille.numFamille);
        if (i > -1) {
          this.validateForm.patchValue({
            superFamille: famille.superFamille != null ? famille.superFamille.numFamille : null,
          });

          this.familleList2.splice(i, 1);

        }
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

      const i = this.familleList2.findIndex(l => l.numFamille == formData.superFamille);
        if (i > -1) {
          formData.superFamille = this.familleList2[i];
          
        }
      if (formData.numFamille == null) {


        console.log("data", formData);

        this.enregistrerFamille(formData);
      } else {

        this.modifierFamille(formData.numFamille,formData);
      }
    }
  }

  enregistrerFamille(famille: Famille): void {
    this.familleService.addAFamille(famille).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        this.familleList.unshift(data);
        this.familleFiltered = [...this.familleList.sort((a, b) => a.codeFamille.localeCompare(b.codeFamille.valueOf()))];

        setTimeout(() => {
          this.loading = false;
          //basculer vers la tab contenant la liste apres enregistrement
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);

      });
  }

  modifierFamille(id: String, famille: Famille): void {
    this.familleService.editAFamille(id, famille).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        const i = this.familleList.findIndex(l => l.numFamille == data.numFamille);
        if (i > -1) {
          this.familleList[i] = data;
          this.familleFiltered = [...this.familleList.sort((a, b) => a.codeFamille.localeCompare(b.codeFamille.valueOf()))];
        }

        setTimeout(() => {
          this.loading = false;
          //basculer vers la tab contenant la liste apres modification
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Modification effectuée avec succès.', 'Success!', {progressBar: true});
        }, 3000);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);

      });
  }

  confirm(content, famille: Famille) {
    this.famille = famille;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.familleService.deleteAFamille(famille?.numFamille.toString()).subscribe(
        (data) => {
          console.log(data);
          const i = this.familleList.findIndex(l => l.numFamille == famille.numFamille);
          if (i > -1) {
            this.familleList.splice(i, 1);
            this.familleFiltered = [...this.familleList.sort((a, b) => a.codeFamille.localeCompare(b.codeFamille.valueOf()))];
            this.getAllFamille();
          }
          /*setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);*/
          this.resetForm();
          this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          /*setTimeout(() => {
            this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          }, 3000);*/
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
