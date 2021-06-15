import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { TypeArticle } from 'src/app/models/gestion/definition/typeArticle.model';
import { TypeArticleService } from 'src/app/services/gestion/definition/type-article.service';

@Component({
  selector: 'app-type-article',
  templateUrl: './type-article.component.html',
  styleUrls: ['./type-article.component.css']
})
export class TypeArticleComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  typeArticleFiltered;

  validateForm: FormGroup;
  typeArticleList: TypeArticle[] = [];
  loading: boolean;
  typeArticle: TypeArticle = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private typeArticleService: TypeArticleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.typeArticleService.getAllTypeArticle().subscribe(
      (data) => {
        this.typeArticleList = [...data];
        this.typeArticleFiltered = this.typeArticleList.sort((a, b) => a.codeTypeArt.localeCompare(b.codeTypeArt.valueOf()));
        console.log(this.typeArticleList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
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
      return this.typeArticleFiltered = [...this.typeArticleList.sort((a, b) => a.codeTypeArt.localeCompare(b.codeTypeArt.valueOf()))];
    }

    const columns = Object.keys(this.typeArticleList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.typeArticleList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.typeArticleFiltered = rows;
  }

  makeForm(typeArticle: TypeArticle): void {
    this.validateForm = this.fb.group({
      numTypeArt: [typeArticle != null ? typeArticle.numTypeArt: null],
      codeTypeArt: [typeArticle != null ? typeArticle.codeTypeArt: null,
      [Validators.required]],
      libTypeArt: [typeArticle != null ? typeArticle.libTypeArt : null,
        [Validators.required]],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (typeArticle?.numTypeArt !=null){
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
      if (formData.numTypeArt == null) {
        console.log("data", formData);

        this.enregistrerTypeArticle(formData);
      } else {
        this.modifierTypeArticle(formData.numTypeArt,formData);
      }
    }
  }

  enregistrerTypeArticle(typeArticle: TypeArticle): void {
    this.typeArticleService.addATypeArticle(typeArticle).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        this.typeArticleList.unshift(data);
        this.typeArticleFiltered = [...this.typeArticleList.sort((a, b) => a.codeTypeArt.localeCompare(b.codeTypeArt.valueOf()))];
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

  modifierTypeArticle(id: String, typeArticle: TypeArticle): void {
    this.typeArticleService.editATypeArticle(id, typeArticle).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        const i = this.typeArticleList.findIndex(l => l.numTypeArt == data.numTypeArt);
        if (i > -1) {
          this.typeArticleList[i] = data;
          this.typeArticleFiltered = [...this.typeArticleList.sort((a, b) => a.codeTypeArt.localeCompare(b.codeTypeArt.valueOf()))];
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

  confirm(content, typeArticle: TypeArticle) {
    this.typeArticle = typeArticle;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.typeArticleService.deleteATypeArticle(typeArticle?.numTypeArt.toString()).subscribe(
        (data) => {
          console.log(data);
          const i = this.typeArticleList.findIndex(l => l.numTypeArt == typeArticle.numTypeArt);
          if (i > -1) {
            this.typeArticleList.splice(i, 1);
            this.typeArticleFiltered = [...this.typeArticleList.sort((a, b) => a.codeTypeArt.localeCompare(b.codeTypeArt.valueOf()))];
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
