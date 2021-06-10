
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NatureJuridique} from "../../../models/gestion/parametrage/nature-juridique";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal, NgbNavChangeEvent} from "@ng-bootstrap/ng-bootstrap";
import {NatureJuridiqueService} from "../../../services/gestion/parametrage/nature-juridique.service";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-nature-juridique',
  templateUrl: './nature-juridique.component.html',
  styleUrls: ['./nature-juridique.component.css']
})
export class NatureJuridiqueComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  natureJuridiqueFiltered;

  validateForm: FormGroup;
  natureJuridiqueList: NatureJuridique[] = [];
  loading: boolean;
  natureJuridique: NatureJuridique = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private natureJuridiqueService: NatureJuridiqueService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {

    this.natureJuridiqueService.list().subscribe(
      (data: any) => {
        this.natureJuridiqueList = [...data];
        this.natureJuridiqueFiltered = this.natureJuridiqueList;
        console.log(this.natureJuridiqueList);
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
      return this.natureJuridiqueFiltered = [...this.natureJuridiqueList];
    }

    const columns = Object.keys(this.natureJuridiqueList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.natureJuridiqueList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.natureJuridiqueFiltered = rows;
  }

  makeForm(natureJuridique: NatureJuridique): void {
    this.validateForm = this.fb.group({
      id: [natureJuridique != null ? natureJuridique.id : null],
      libelle: [natureJuridique != null ? natureJuridique.libelle : null,
        [Validators.required]],
      code: [natureJuridique != null ? natureJuridique.code : null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (natureJuridique?.id !=null){
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
      if (formData.id == null) {
        this.enregistrerNatureJuridique(formData);
      } else {
        this.modifierNatureJuridique(formData);
      }
    }
  }

  enregistrerNatureJuridique(natureJuridique: NatureJuridique): void {
    this.natureJuridiqueService.createNatureJuridique(natureJuridique).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.natureJuridiqueList.unshift(data);
        this.natureJuridiqueFiltered = [...this.natureJuridiqueList];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000 );*/
        //basculer vers la tab contenant la liste apres enregistrement
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);*/
      });

  }

  modifierNatureJuridique(natureJuridique: NatureJuridique): void {
    this.natureJuridiqueService.updateNatureJuridique(natureJuridique).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.natureJuridiqueList.findIndex(l => l.id == data.id);
        if (i > -1) {
          this.natureJuridiqueList[i] = data;
          this.natureJuridiqueFiltered = [...this.natureJuridiqueList];
        }
        this.loading = true;
        this.resetForm();
        this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);*/
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);*/
      });
  }

  confirm(content, natureJuridique) {
    this.natureJuridique = natureJuridique;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.natureJuridiqueService.deleteNatureJuridique(natureJuridique?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.natureJuridiqueList.findIndex(l => l.id == natureJuridique.id);
          if (i > -1) {
            this.natureJuridiqueList.splice(i, 1);
            this.natureJuridiqueFiltered = [...this.natureJuridiqueList];
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
