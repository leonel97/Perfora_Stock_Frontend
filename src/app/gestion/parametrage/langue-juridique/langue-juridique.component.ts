import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LangueJuridiqueService} from "../../../services/gestion/parametrage/langue-juridique.service";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {debounceTime} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-langue-juridique',
  templateUrl: './langue-juridique.component.html',
  styleUrls: ['./langue-juridique.component.css']
})
export class LangueJuridiqueComponent implements OnInit {

  active = 1;
  searchControl: FormControl = new FormControl();
  langueJuridiqueFiltered;

  validateForm: FormGroup;
  langueJuridiqueList: LangueJuridique[] = [];
  loading: boolean;
  langueJuridique: LangueJuridique = null;

  //pour les tabs navs
  activeTabsNav;

  constructor(
    private langueJuridiqueService: LangueJuridiqueService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.langueJuridiqueService.list().subscribe(
      (data: any) => {
        this.langueJuridiqueList = [...data];
        this.langueJuridiqueFiltered = this.langueJuridiqueList;
        console.log(this.langueJuridiqueList);
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
      return this.langueJuridiqueFiltered = [...this.langueJuridiqueList];
    }

    const columns = Object.keys(this.langueJuridiqueList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.langueJuridiqueList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.langueJuridiqueFiltered = rows;
  }

  makeForm(langueJuridique: LangueJuridique): void {
    this.validateForm = this.fb.group({
      id: [langueJuridique != null ? langueJuridique.id: null],
      libelle: [langueJuridique != null ? langueJuridique.libelle: null,
        [Validators.required]],
      code: [langueJuridique != null ? langueJuridique.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (langueJuridique?.id !=null){
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
      if(formData.id == null) {
        this.enregistrerLangueJuridique(formData);
      } else {
        this.modifierLangueJuridique(formData);
      }
    }
  }

  enregistrerLangueJuridique(langueJuridique: LangueJuridique): void {
    this.langueJuridiqueService.createLangue(langueJuridique).subscribe(
      (data: any) => {
        console.log(data);
        this.langueJuridiqueList.unshift(data);
        this.langueJuridiqueFiltered = [...this.langueJuridiqueList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.activeTabsNav = 1;
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

  modifierLangueJuridique(langueJuridique: LangueJuridique): void {
    this.langueJuridiqueService.updateLangue(langueJuridique).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.langueJuridiqueList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.langueJuridiqueList[i]= data;
          this.langueJuridiqueFiltered = [...this.langueJuridiqueList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
        this.activeTabsNav = 1;
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

  confirm(content, langueJuridique) {
    this.langueJuridique = langueJuridique;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.langueJuridiqueService.deleteLanguage(langueJuridique?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.langueJuridiqueList.findIndex(l => l.id == langueJuridique.id);
          if(i > -1) {
            this.langueJuridiqueList.splice(i, 1);
            this.langueJuridiqueFiltered = [...this.langueJuridiqueList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> '+error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
