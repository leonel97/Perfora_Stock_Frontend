import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { OrigineProcedure } from 'src/app/models/gestion/parametrage/origine-procedure';
import { OrigineProcedureService } from 'src/app/services/gestion/parametrage/origine-procedure.service';

@Component({
  selector: 'app-origine-procedure',
  templateUrl: './origine-procedure.component.html',
  styleUrls: ['./origine-procedure.component.css']
})
export class OrigineProcedureComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  origineProcedureFiltered;

  validateForm: FormGroup;
  origineProcedureList: OrigineProcedure[] = [];
  loading: boolean;
  origineProcedure: OrigineProcedure = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private origineProcedureService: OrigineProcedureService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }



  ngOnInit(): void {
    this.origineProcedureService.list().subscribe(
      (data: any) => {
        this.origineProcedureList = [...data];
        this.origineProcedureFiltered = this.origineProcedureList;
        console.log(this.origineProcedureList);
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
      return this.origineProcedureFiltered = [...this.origineProcedureList];
    }

    const columns = Object.keys(this.origineProcedureList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.origineProcedureList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.origineProcedureFiltered = rows;
  }

  makeForm(origineProcedure: OrigineProcedure): void {
    this.validateForm = this.fb.group({
      id: [origineProcedure != null ? origineProcedure.id : null],
      libelle: [origineProcedure != null ? origineProcedure.libelle : null,
      [Validators.required]],
      code: [origineProcedure != null ? origineProcedure.code : null,
      [Validators.required]],
      description: [origineProcedure != null ? origineProcedure.description : null,
      [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (origineProcedure?.id !=null){
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
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', { progressBar: true });
      }, 3000);
    } else {
      const formData = this.validateForm.value;
      if (formData.id == null) {
        this.enregistrerOrigineProcedure(formData);
      } else {
        this.modifierOrigineProcedure(formData);
      }
    }
  }

  enregistrerOrigineProcedure(origineProcedure: OrigineProcedure): void {
    this.origineProcedureService.createOrigineProcedure(origineProcedure).subscribe(
      (data: any) => {
        console.log(data);
        this.origineProcedureList.unshift(data);
        this.origineProcedureFiltered = [...this.origineProcedureList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', { progressBar: true });
        }, 3000);
        //basculer vers la tab contenant la liste apres enregistrement
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', { progressBar: true });
        }, 3000);
      });
  }

  modifierOrigineProcedure(origineProcedure: OrigineProcedure): void {
    this.origineProcedureService.updateOrigineProcedure(origineProcedure).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.origineProcedureList.findIndex(l => l.id == data.id);
        if (i > -1) {
          this.origineProcedureList[i] = data;
          this.origineProcedureFiltered = [...this.origineProcedureList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', { progressBar: true });
        }, 3000);
        this.resetForm();
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', { progressBar: true });
        }, 3000);
      });
  }

  confirm(content, origineProcedure) {
    this.origineProcedure = origineProcedure;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        //this.confirmResut = `Closed with: ${result}`;
        this.origineProcedureService.deleteOrigineProcedure(origineProcedure?.id).subscribe(
          (data: any) => {
            console.log(data);
            const i = this.origineProcedureList.findIndex(l => l.id == origineProcedure.id);
            if (i > -1) {
              this.origineProcedureList.splice(i, 1);
              this.origineProcedureFiltered = [...this.origineProcedureList];
            }
            setTimeout(() => {
              this.toastr.success('Suppression effectuée avec succès.', 'Success!', { progressBar: true });
            }, 3000);
            this.resetForm();
          },
          (error: HttpErrorResponse) => {
            console.log('Echec atatus ==> ' + error.status);
            setTimeout(() => {
              this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', { progressBar: true });
            }, 3000);
          });
      }, (reason) => {
        console.log(`Dismissed with: ${reason}`);
      });
  }



}
