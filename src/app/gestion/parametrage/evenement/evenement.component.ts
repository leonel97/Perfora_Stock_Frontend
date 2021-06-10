import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Evenement} from "../../../models/gestion/parametrage/evenement";
import {EvenementService} from "../../../services/gestion/parametrage/evenement.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {TypeEvenementService} from "../../../services/gestion/parametrage/type-evenement.service";
import {TypeEvenement} from "../../../models/gestion/parametrage/type-evenement";

@Component({
  selector: 'app-evenement',
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.css']
})
export class EvenementComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  evenementFiltered;

  validateForm: FormGroup;
  evenementList: Evenement[] = [];
  typeEvenementList: TypeEvenement[] = [];
  loading: boolean;
  evenement: Evenement = null;
  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private typeEvenementService: TypeEvenementService,
    private evenementService: EvenementService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  ngOnInit(): void {
    this.evenementService.list().subscribe(
      (data: any) => {
        this.evenementList = [...data];
        this.evenementFiltered = this.evenementList;
        console.log(this.evenementList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
      });

    this.typeEvenementService.list().subscribe(
      (data: any) => {
        this.typeEvenementList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec chargement des types atatus ==> ' + error.status);
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
      return this.evenementFiltered = [...this.evenementList];
    }

    const columns = Object.keys(this.evenementList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.evenementList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.evenementFiltered = rows;
  }

  makeForm(evenement: Evenement): void {
    this.validateForm = this.fb.group({
      id: [evenement != null ? evenement.id: null],
      typeevenementId: [evenement != null ? evenement.typeevenementId: null],
      typeevenementCode: [evenement != null ? evenement.typeevenementCode: null],
      libelle: [evenement != null ? evenement.libelle: null,
        [Validators.required]],
      code: [evenement != null ? evenement.code: null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (evenement?.id !=null){
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
      const formData1 = this.validateForm.value;
      // setting the typeEvenement code
      const i = this.typeEvenementList.findIndex(d => d.id == formData1.typeevenementId);
      if (i > -1) {
        let typeEvenement = this.typeEvenementList[i];
        this.validateForm.get('typeevenementCode').setValue(typeEvenement.code);
      }
      const formData = this.validateForm.value;
      if(formData.id == null) {
        this.enregistrerEvenement(formData);
      } else {
        this.modifierEvenement(formData);
      }
    }
  }

  enregistrerEvenement(evenement: Evenement): void {
    this.evenementService.createEvenement(evenement).subscribe(
      (data: any) => {
        console.log(data);
        this.evenementList.unshift(data);
        this.evenementFiltered = [...this.evenementList];
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
        console.log('Echec atatus ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  modifierEvenement(evenement: Evenement): void {
    this.evenementService.updateEvenement(evenement).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.evenementList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.evenementList[i]= data;
          this.evenementFiltered = [...this.evenementList];
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

  confirm(content, evenement) {
    this.evenement = evenement;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.evenementService.deleteEvenement(evenement?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.evenementList.findIndex(l => l.id == evenement.id);
          if(i > -1) {
            this.evenementList.splice(i, 1);
            this.evenementFiltered = [...this.evenementList];
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
