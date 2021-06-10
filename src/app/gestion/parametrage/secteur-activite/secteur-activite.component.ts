import { Component, OnInit } from '@angular/core';
import {LangueJuridiqueService} from "../../../services/gestion/parametrage/langue-juridique.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SecteurActiviteService} from "../../../services/gestion/parametrage/secteur-activite.service";
import {RoleAuxiliaire} from "../../../models/gestion/parametrage/role-auxiliaire";
import {SecteurActivite} from "../../../models/gestion/parametrage/secteur-activite";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {LangueJuridique} from "../../../models/gestion/parametrage/langue-juridique";

@Component({
  selector: 'app-secteur-activite',
  templateUrl: './secteur-activite.component.html',
  styleUrls: ['./secteur-activite.component.css']
})
export class SecteurActiviteComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  secteurActiviteFiltered;

  validateForm: FormGroup;
  secteurActiviteList: SecteurActivite[] = [];
  loading: boolean;
  secteurActivite: SecteurActivite = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private secteurActiviteService: SecteurActiviteService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.secteurActiviteService.list().subscribe(
      (data: any) => {
        this.secteurActiviteList = [...data];
        this.secteurActiviteFiltered = this.secteurActiviteList;
        console.log(this.secteurActiviteList);
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
      return this.secteurActiviteFiltered = [...this.secteurActiviteList];
    }

    const columns = Object.keys(this.secteurActiviteList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.secteurActiviteList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.secteurActiviteFiltered = rows;
  }

  makeForm(secteurActivite: SecteurActivite): void {
    this.validateForm = this.fb.group({
      id: [secteurActivite != null ? secteurActivite.id: null],
      libelle: [secteurActivite != null ? secteurActivite.libelle: null,
        [Validators.required]],
      uuid: [secteurActivite != null ? secteurActivite.uuid: null,
        [Validators.required]],
    });

    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (secteurActivite?.id !=null){
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

  enregistrerLangueJuridique(secteurActivite: SecteurActivite): void {
    this.secteurActiviteService.createSecteurActivite(secteurActivite).subscribe(
      (data: any) => {
        console.log(data);
        this.secteurActiviteList.unshift(data);
        this.secteurActiviteFiltered = [...this.secteurActiviteList];
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

  modifierLangueJuridique(secteurActivite: SecteurActivite): void {
    this.secteurActiviteService.updateSecteurActivite(secteurActivite).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.secteurActiviteList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.secteurActiviteList[i]= data;
          this.secteurActiviteFiltered = [...this.secteurActiviteList];
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

  confirm(content, secteurActivite) {
    this.secteurActivite = secteurActivite;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.secteurActiviteService.deleteSecteurActivite(secteurActivite?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.secteurActiviteList.findIndex(l => l.id == secteurActivite.id);
          if(i > -1) {
            this.secteurActiviteList.splice(i, 1);
            this.secteurActiviteFiltered = [...this.secteurActiviteList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> '+error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
