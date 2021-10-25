import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {debounceTime} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { Profession } from '../../../models/gestion/parametrage/profession';
import { ProfessionService } from '../../../services/gestion/parametrage/profession.service';
import { AuthService } from 'src/app/services/common/auth.service';


@Component({
  selector: 'app-profession',
  templateUrl: './profession.component.html',
  styleUrls: ['./profession.component.css']
})
export class ProfessionComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  professionFiltered;

  validateForm: FormGroup;
  professionList: Profession[] = [];
  loading: boolean;
  profession: Profession = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private professionService: ProfessionService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.professionService.list().subscribe(
      (data: any) => {
        this.professionList = [...data];
        this.professionFiltered = this.professionList;
        console.log(this.professionList);
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
      return this.professionFiltered = [...this.professionList];
    }

    const columns = Object.keys(this.professionList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.professionList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.professionFiltered = rows;
  }

  makeForm(profession: Profession): void {
    this.validateForm = this.fb.group({
      numProfession: [profession != null ? profession.numProfession: null],
      libProfession: [profession != null ? profession.libProfession: null,
        [Validators.required]],
        codeProfession: [profession != null ? profession.codeProfession: null,
        [Validators.required]],
    });

    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (profession?.numProfession !=null){
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
      if(formData.numProfession == null) {
        this.enregistrerProfession(formData);
      } else {
        this.modifierProfession(formData.numProfession, formData);
      }
    }
  }

  enregistrerProfession(profession: Profession): void {
    this.professionService.createProfession(profession).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.professionList.unshift(data);
        this.professionFiltered = [...this.professionList];

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

  modifierProfession(id: string, profession: Profession): void {
    this.professionService.updateProfession(id, profession).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.professionList.findIndex(p => p.numProfession == data.numProfession);
        if(i > -1) {
          this.professionList[i]= data;
          this.professionFiltered = [...this.professionList];
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

  confirm(content, profession) {
    this.profession = profession;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.professionService.deleteProfession(profession?.numProfession).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.professionList.findIndex(l => l.numProfession == profession.numProfession);
          if(i > -1) {
            this.professionList.splice(i, 1);
            this.professionFiltered = [...this.professionList];
          }
          /*setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);*/
          this.resetForm();
          this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> '+error.status);
          
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
