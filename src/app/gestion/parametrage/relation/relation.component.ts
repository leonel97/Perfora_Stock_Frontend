import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RelationService} from "../../../services/gestion/parametrage/relation.service";
import {Relation} from "../../../models/gestion/parametrage/relation";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {debounceTime} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.css']
})
export class RelationComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  relationFiltered;

  validateForm: FormGroup;
  relationList: Relation[] = [];
  loading: boolean;
  relation: Relation = null;

  constructor(
    private relationService: RelationService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.relationService.list().subscribe(
      (data: any) => {
        this.relationList = [...data];
        this.relationFiltered = this.relationList;
        console.log(this.relationList);
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
      return this.relationFiltered = [...this.relationList];
    }

    const columns = Object.keys(this.relationList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.relationList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.relationFiltered = rows;
  }

  makeForm(relation: Relation): void {
    this.validateForm = this.fb.group({
      id: [relation != null ? relation.id: null],
      libelle: [relation != null ? relation.libelle: null,
        [Validators.required]],
      code: [relation != null ? relation.code: null,
        [Validators.required]],
    });
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
        this.enregistrerRelation(formData);
      } else {
        this.modifierRelation(formData);
      }
    }
  }

  enregistrerRelation(relation: Relation): void {
    this.relationService.createRelation(relation).subscribe(
      (data: any) => {
        console.log(data);
        this.relationList.unshift(data);
        this.relationFiltered = [...this.relationList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
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

  modifierRelation(relation: Relation): void {
    this.relationService.updateRelation(relation).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.relationList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.relationList[i]= data;
          this.relationFiltered = [...this.relationList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
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

  confirm(content, relation) {
    this.relation = relation;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.relationService.deleteRelation(relation?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.relationList.findIndex(l => l.id == relation.id);
          if(i > -1) {
            this.relationList.splice(i, 1);
            this.relationFiltered = [...this.relationList];
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
