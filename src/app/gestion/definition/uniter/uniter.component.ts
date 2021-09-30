import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { AuthService } from 'src/app/services/common/auth.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';

@Component({
  selector: 'app-uniter',
  templateUrl: './uniter.component.html',
  styleUrls: ['./uniter.component.css']
})
export class UniterComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  uniteFiltered;


  validateForm: FormGroup;
  uniteList: Uniter[] = [];
  loading: boolean;
  unite: Uniter = null;


  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private uniteService: UniterService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.uniteService.getAllUniter().subscribe(
      (data: any) => {
        this.uniteList = [...data];
        this.uniteFiltered = this.uniteList.sort((a, b) => a.codeUniter.localeCompare(b.codeUniter.valueOf()));
        console.log(this.uniteList);
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


  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.uniteFiltered = [...this.uniteList.sort((a, b) => a.codeUniter.localeCompare(b.codeUniter.valueOf()))];
    }

    const columns = Object.keys(this.uniteList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.uniteList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.uniteFiltered = rows;
  }

  makeForm(unite: Uniter): void {
    this.validateForm = this.fb.group({
      numUniter: [unite != null ? unite.numUniter: null],
      codeUniter: [unite != null ? unite.codeUniter: null,
      [Validators.required]],
      libUniter: [unite != null ? unite.libUniter : null,
        [Validators.required]],
      poids: [unite != null ? unite.poids : null,
        [Validators.required]],

    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (unite?.numUniter !=null){

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
    this.loading = true;
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

      if (formData.numUniter == null) {
        console.log("data", formData);

        this.enregistrerUnite(formData);
      } else {
        this.modifierUnite(formData.numUniter,formData);
      }
    }
  }

  enregistrerUnite(unite: Uniter): void {

    this.uniteService.addAUniter(unite).subscribe(
      (data: any) => {
        console.log(data);
        //this.loading = true;
        this.uniteList.unshift(data);
        this.uniteFiltered = [...this.uniteList.sort((a, b) => a.codeUniter.localeCompare(b.codeUniter.valueOf()))];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        this.loading = false;
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        this.loading = false;

      });

  }

  modifierUnite(id: String, unite: Uniter): void {
    this.uniteService.editAUniter(id, unite).subscribe(
      (data) => {
        console.log(data);
        //this.loading = true;
        const i = this.uniteList.findIndex(l => l.numUniter == data.numUniter);
        if (i > -1) {
          this.uniteList[i] = data;
          this.uniteFiltered = [...this.uniteList.sort((a, b) => a.codeUniter.localeCompare(b.codeUniter.valueOf()))];
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
        this.loading = false;
      });

  }

  confirm(content, unite: Uniter) {

    this.unite = unite;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.uniteService.deleteAUniter(unite?.numUniter.toString()).subscribe(
        (data) => {
          console.log(data);
          const i = this.uniteList.findIndex(l => l.numUniter == unite.numUniter);
          if (i > -1) {
            this.uniteList.splice(i, 1);
            this.uniteFiltered = [...this.uniteList.sort((a, b) => a.codeUniter.localeCompare(b.codeUniter.toString()))];
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

