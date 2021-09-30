import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {TypeCentreConsommation} from "../../../models/gestion/definition/typeCentreConsommation";
import {TypeCentreConsommationService} from "../../../services/gestion/definition/typeCentreConsommation.service";
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-type-centre-consommation',
  templateUrl: './type-centre-consommation.component.html',
  styleUrls: ['./type-centre-consommation.component.css']
})
export class TypeCentreConsommationComponent implements OnInit {

  
  searchControl: FormControl = new FormControl();
  typeCentreConsommationFiltered;

  validateForm: FormGroup;
  typeCentreConsommationList: TypeCentreConsommation[] = [];
  loading: boolean;
  typeCentreConsommation: TypeCentreConsommation = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private typeCentreConsommationService: TypeCentreConsommationService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.typeCentreConsommationService.list().subscribe(
      (data: any) => {
        this.typeCentreConsommationList = [...data];
        this.typeCentreConsommationFiltered = this.typeCentreConsommationList.sort((a, b) => a.codeTypService.localeCompare(b.codeTypService));
        console.log(this.typeCentreConsommationList);
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
      return this.typeCentreConsommationFiltered = [...this.typeCentreConsommationList.sort((a, b) => a.codeTypService.localeCompare(b.codeTypService))];
    }

    const columns = Object.keys(this.typeCentreConsommationList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.typeCentreConsommationList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.typeCentreConsommationFiltered = rows;
  }

  makeForm(typeCentreConsommation: TypeCentreConsommation): void {
    this.validateForm = this.fb.group({
      numTypService: [typeCentreConsommation != null ? typeCentreConsommation.numTypService : null],
      libTypService: [typeCentreConsommation != null ? typeCentreConsommation.libTypService : null,
        [Validators.required]],
        codeTypService: [typeCentreConsommation != null ? typeCentreConsommation.codeTypService: null, 
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (typeCentreConsommation?.numTypService !=null){
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
      if (formData.numTypService == null) {
        console.log("data", formData);
        
        this.enregistrerTypeCentreConsommation(formData);
      } else {
        this.modifierTypeCentreConsommation(formData.numTypService,formData);
      }
    }
  }

  enregistrerTypeCentreConsommation(typeCentreConsommation: TypeCentreConsommation): void {
    this.typeCentreConsommationService.createTypecentreConsommation(typeCentreConsommation).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.typeCentreConsommationList.unshift(data);
        this.typeCentreConsommationFiltered = [...this.typeCentreConsommationList.sort((a, b) => a.codeTypService.localeCompare(b.codeTypService))];
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

  modifierTypeCentreConsommation(id: String, typeCentreConsommation: TypeCentreConsommation): void {
    this.typeCentreConsommationService.updateTypecentreConsommation(id, typeCentreConsommation).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.typeCentreConsommationList.findIndex(l => l.numTypService == data.numTypService);
        if (i > -1) {
          this.typeCentreConsommationList[i] = data;
          this.typeCentreConsommationFiltered = [...this.typeCentreConsommationList.sort((a, b) => a.codeTypService.localeCompare(b.codeTypService))];
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

  confirm(content, typeCentreConsommation) {
    this.typeCentreConsommation = typeCentreConsommation;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.typeCentreConsommationService.deleteTypecentreConsommation(typeCentreConsommation?.numTypService).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.typeCentreConsommationList.findIndex(l => l.numTypService == typeCentreConsommation.numTypService);
          if (i > -1) {
            this.typeCentreConsommationList.splice(i, 1);
            this.typeCentreConsommationFiltered = [...this.typeCentreConsommationList.sort((a, b) => a.codeTypService.localeCompare(b.codeTypService))];
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
