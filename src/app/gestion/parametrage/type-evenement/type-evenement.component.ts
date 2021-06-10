import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TypeEvenement} from "../../../models/gestion/parametrage/type-evenement";
import {TypeEvenementService} from "../../../services/gestion/parametrage/type-evenement.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-type-evenement',
  templateUrl: './type-evenement.component.html',
  styleUrls: ['./type-evenement.component.css']
})
export class TypeEvenementComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  typeEvenementFiltered;

  validateForm: FormGroup;
  typeEvenementList: TypeEvenement[] = [];
  loading: boolean;
  typeEvenement: TypeEvenement = null;
  //pour les tabs navs
  activeTabsNav;
  //end
  constructor(
    private typeEvenementService: TypeEvenementService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.typeEvenementService.list().subscribe(
      (data: any) => {
        this.typeEvenementList = [...data];
        this.typeEvenementFiltered = this.typeEvenementList;
        console.log(this.typeEvenementList);
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
      return this.typeEvenementFiltered = [...this.typeEvenementList];
    }

    const columns = Object.keys(this.typeEvenementList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.typeEvenementList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.typeEvenementFiltered = rows;
  }

  makeForm(typeEvenement: TypeEvenement): void {
    this.validateForm = this.fb.group({
      id: [typeEvenement != null ? typeEvenement.id : null],
      libelle: [typeEvenement != null ? typeEvenement.libelle : null,
        [Validators.required]],
      code: [typeEvenement != null ? typeEvenement.code : null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (typeEvenement?.id !=null){
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
        this.enregistrerTypeEvenement(formData);
      } else {
        this.modifierTypeEvenement(formData);
      }
    }
  }

  enregistrerTypeEvenement(typeEvenement: TypeEvenement): void {
    this.typeEvenementService.createTypeEvenement(typeEvenement).subscribe(
      (data: any) => {
        console.log(data);
        this.typeEvenementList.unshift(data);
        this.typeEvenementFiltered = [...this.typeEvenementList];
        this.resetForm();
        this.loading = true;
        /*setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);*/
        //basculer vers la tab contenant la liste apres enregistrement
        this.activeTabsNav = 1;
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

  modifierTypeEvenement(typeEvenement: TypeEvenement): void {
    this.typeEvenementService.updateTypeEvenement(typeEvenement).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.typeEvenementList.findIndex(l => l.id == data.id);
        if (i > -1) {
          this.typeEvenementList[i] = data;
          this.typeEvenementFiltered = [...this.typeEvenementList];
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
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  confirm(content, typeEvenement) {
    this.typeEvenement = typeEvenement;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.typeEvenementService.deleteTypeEvenement(typeEvenement?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.typeEvenementList.findIndex(l => l.id == typeEvenement.id);
          if (i > -1) {
            this.typeEvenementList.splice(i, 1);
            this.typeEvenementFiltered = [...this.typeEvenementList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
