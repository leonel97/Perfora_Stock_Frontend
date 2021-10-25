import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Fonction} from "../../../models/gestion/parametrage/fonction";
import {FonctionService} from "../../../services/gestion/parametrage/fonction.service";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-fonction',
  templateUrl: './fonction.component.html',
  styleUrls: ['./fonction.component.css']
})
export class FonctionComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  fonctionFiltered;

  validateForm: FormGroup;
  fonctionList: Fonction[] = [];
  loading: boolean;
  fonction: Fonction = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private fonctionService: FonctionService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) { }

  ngOnInit(): void {

    this.fonctionService.list().subscribe(
      (data: any) => {
        this.fonctionList = [...data];
        this.fonctionFiltered = this.fonctionList;
        console.log(this.fonctionList);
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
      return this.fonctionFiltered = [...this.fonctionList];
    }

    const columns = Object.keys(this.fonctionList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.fonctionList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.fonctionFiltered = rows;
  }

  makeForm(fonction: Fonction): void {
    this.validateForm = this.fb.group({
      numFonction: [fonction != null ? fonction.numFonction: null],
      libFonction: [fonction != null ? fonction.libFonction: null,
        [Validators.required]],
        codeFonction: [fonction != null ? fonction.codeFonction: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (fonction?.numFonction !=null){
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
      if(formData.numFonction == null) {
        this.enregistrerLangueJuridique(formData);
      } else {
        this.modifierLangueJuridique(formData.numFonction, formData);
      }
    }
  }

  enregistrerLangueJuridique(fonction: Fonction): void {
    this.fonctionService.createFonction(fonction).subscribe(
      (data: any) => {
        console.log(data);
        this.fonctionList.unshift(data);
        this.fonctionFiltered = [...this.fonctionList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
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

  modifierLangueJuridique(id: string, fonction: Fonction): void {
    this.fonctionService.updateFonction(id, fonction).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.fonctionList.findIndex(l => l.numFonction == data.numFonction);
        if(i > -1) {
          this.fonctionList[i]= data;
          this.fonctionFiltered = [...this.fonctionList];
        }

        setTimeout(() => {
          this.loading = false;
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Modification effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
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

  confirm(content, fonction) {
    this.fonction = fonction;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.fonctionService.deleteFonction(fonction?.numFonction).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.fonctionList.findIndex(l => l.numFonction == fonction.numFonction);
          if(i > -1) {
            this.fonctionList.splice(i, 1);
            this.fonctionFiltered = [...this.fonctionList];
          }
         /* setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);*/
          this.resetForm();
          this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> '+error.status);
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          /*setTimeout(() => {
            this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          }, 3000);*/
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
