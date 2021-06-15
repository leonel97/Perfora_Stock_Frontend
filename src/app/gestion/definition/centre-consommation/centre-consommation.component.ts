import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {CentreConsommation} from "../../../models/gestion/definition/centreConsommation";
import {TypeCentreConsommation} from "../../../models/gestion/definition/typeCentreConsommation";
import {Direction} from "../../../models/gestion/definition/direction";
import {CentreConsommationService} from "../../../services/gestion/definition/centreConsommation.service";
import {TypeCentreConsommationService} from "../../../services/gestion/definition/typeCentreConsommation.service";
import {DirectionService} from "../../../services/gestion/definition/direction.service";


@Component({
  selector: 'app-centre-consommation',
  templateUrl: './centre-consommation.component.html',
  styleUrls: ['./centre-consommation.component.css']
})
export class CentreConsommationComponent implements OnInit {

  
  searchControl: FormControl = new FormControl();
  centreConsommationFiltered;
  typeCentreConsommationFiltered;
  directionFiltered;

  validateForm: FormGroup;
  centreConsommationList: CentreConsommation[] = [];
  typeCentreConsommationList: TypeCentreConsommation[] = [];
  directionList: Direction[] = [];
  loading: boolean;
  centreConsommation: CentreConsommation = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private centreConsommationService: CentreConsommationService,
    private typeCentreConsommationService: TypeCentreConsommationService,
    private directionService: DirectionService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    //list des directions
    this.directionService.list().subscribe(
      (data: any) => {
        this.directionList = [...data];
        this.directionFiltered = this.directionList;
        console.log(this.directionList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
      });

    //list des types centre consommation
    this.typeCentreConsommationService.list().subscribe(
      (data: any) => {
        this.typeCentreConsommationList = [...data];
        this.typeCentreConsommationFiltered = this.typeCentreConsommationList;
        console.log(this.typeCentreConsommationList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
      });

    this.centreConsommationService.list().subscribe(
      (data: any) => {
        this.centreConsommationList = [...data];
        this.centreConsommationFiltered = this.centreConsommationList.sort((a, b) => a.codeService.localeCompare(b.codeService));
        console.log(this.centreConsommationList);
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
      return this.centreConsommationFiltered = [...this.centreConsommationList.sort((a, b) => a.codeService.localeCompare(b.codeService))];
    }

    const columns = Object.keys(this.centreConsommationList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.centreConsommationList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.centreConsommationFiltered = rows;
  }

  makeForm(centreConsommation: CentreConsommation): void {
    this.validateForm = this.fb.group({
      numService: [centreConsommation != null ? centreConsommation.numService : null],
      libService: [centreConsommation != null ? centreConsommation.libService : null, [Validators.required]],
      codeService: [centreConsommation != null ? centreConsommation.codeService: null, [Validators.required]],
      typeService: [centreConsommation != null ? centreConsommation.typeService: null, [Validators.required]],
      direction: [centreConsommation != null ? centreConsommation.direction: null, [Validators.required]],
      superService: [centreConsommation != null ? centreConsommation.superService: null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (centreConsommation?.numService !=null){
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
      if (formData.numService == null) {
        console.log("data", formData);
        
        this.enregistrerCentreConsommation(formData);
      } else {
        this.modifierCentreConsommation(formData.numService,formData);
      }
    }
  }

  enregistrerCentreConsommation(centreConsommation: CentreConsommation): void {
    this.centreConsommationService.createCentreConsommation(centreConsommation).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.centreConsommationList.unshift(data);
        this.centreConsommationFiltered = [...this.centreConsommationList.sort((a, b) => a.codeService.localeCompare(b.codeService))];
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

  modifierCentreConsommation(id: String, centreConsommation: CentreConsommation): void {
    this.centreConsommationService.updateCentreConsommation(id, centreConsommation).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.centreConsommationList.findIndex(l => l.numService == data.numService);
        if (i > -1) {
          this.centreConsommationList[i] = data;
          this.centreConsommationFiltered = [...this.centreConsommationList.sort((a, b) => a.codeService.localeCompare(b.codeService))];
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

  confirm(content, centreConsommation) {
    this.centreConsommation = centreConsommation;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.centreConsommationService.deleteCentreConsommation(centreConsommation?.numService).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.centreConsommationList.findIndex(l => l.numService == centreConsommation.numService);
          if (i > -1) {
            this.centreConsommationList.splice(i, 1);
            this.centreConsommationFiltered = [...this.centreConsommationList.sort((a, b) => a.codeService.localeCompare(b.codeService))];
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
