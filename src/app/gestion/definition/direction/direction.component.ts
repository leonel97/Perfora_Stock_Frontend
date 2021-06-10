import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {Annee} from "../../../models/gestion/parametrage/annee";
import {AnneeService} from "../../../services/gestion/parametrage/annee.service";
import {Direction} from "../../../models/gestion/definition/direction";
import {DirectionService} from "../../../services/gestion/definition/direction.service";

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.css']
})
export class DirectionComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  directionFiltered;

  validateForm: FormGroup;
  directionList: Direction[] = [];
  loading: boolean;
  direction: Direction = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private directionService: DirectionService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.directionService.list().subscribe(
      (data: any) => {
        this.directionList = [...data];
        this.directionFiltered = this.directionList.sort((a, b) => a.codeDirection.localeCompare(b.codeDirection));
        console.log(this.directionList);
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
      return this.directionFiltered = [...this.directionList.sort((a, b) => a.codeDirection.localeCompare(b.codeDirection))];
    }

    const columns = Object.keys(this.directionList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.directionList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.directionFiltered = rows;
  }

  makeForm(direction: Direction): void {
    this.validateForm = this.fb.group({
      numDirection: [direction != null ? direction.numDirection : null],
      libDirection: [direction != null ? direction.libDirection : null,
        [Validators.required]],
        codeDirection: [direction != null ? direction.codeDirection: null, 
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (direction?.numDirection !=null){
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
      if (formData.numDirection == null) {
        console.log("data", formData);
        
        this.enregistrerDirection(formData);
      } else {
        this.modifierDirection(formData.numDirection,formData);
      }
    }
  }

  enregistrerDirection(direction: Direction): void {
    this.directionService.createDirection(direction).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.directionList.unshift(data);
        this.directionFiltered = [...this.directionList.sort((a, b) => a.codeDirection.localeCompare(b.codeDirection))];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        this.loading = false;
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
       
      });
  }

  modifierDirection(id: String, direction: Direction): void {
    this.directionService.updateDirection(id, direction).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.directionList.findIndex(l => l.numDirection == data.numDirection);
        if (i > -1) {
          this.directionList[i] = data;
          this.directionFiltered = [...this.directionList.sort((a, b) => a.codeDirection.localeCompare(b.codeDirection))];
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
        
      });
  }

  confirm(content, direction) {
    this.direction = direction;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.directionService.deleteDirection(direction?.numDirection).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.directionList.findIndex(l => l.numDirection == direction.numDirection);
          if (i > -1) {
            this.directionList.splice(i, 1);
            this.directionFiltered = [...this.directionList.sort((a, b) => a.codeDirection.localeCompare(b.codeDirection))];
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
