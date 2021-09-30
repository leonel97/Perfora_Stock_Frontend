import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { AffectUniterToArticle } from 'src/app/models/gestion/definition/affectUniterToArticle.model';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { TypeArticle } from 'src/app/models/gestion/definition/typeArticle.model';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { AuthService } from 'src/app/services/common/auth.service';
import { AffectUniterToArticleService } from 'src/app/services/gestion/definition/affect-uniter-to-article.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { FamilleService } from 'src/app/services/gestion/definition/famille.service';
import { TypeArticleService } from 'src/app/services/gestion/definition/type-article.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  articleFiltered;

  validateForm: FormGroup;
  articleList: Article[] = [];
  familleList2: Famille[] = [];
  typeArticleList: TypeArticle[] = [];
  loading: boolean;
  article: Article = null;
  uniterList: Uniter[] = [];
  selectedUniter: Uniter[] = [];
  affectUniterToArticleList: AffectUniterToArticle[] = [];

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private articleService: ArticleService,
    private familleService: FamilleService,
    private uniterService: UniterService,
    private affectUniterToArticleService: AffectUniterToArticleService,
    private typeArticleService: TypeArticleService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.articleService.getAllArticle().subscribe(
      (data) => {
        this.articleList = [...data];
        this.articleFiltered = this.articleList.sort((a, b) => a.codeArticle.localeCompare(b.codeArticle.valueOf()));
        console.log(this.articleList);
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

    this.getAllFamille();
    this.getAllTypeArticle();
    this.getAllUniter();
    this.getAllAffectUniterToArticle();

  }

  getAllAffectUniterToArticle(){
    this.affectUniterToArticleService.getAllAffectUniterToArticle().subscribe(
      (data) => {
        this.affectUniterToArticleList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllUniter(){
    this.uniterService.getAllUniter().subscribe(
      (data) => {
        this.uniterList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  getUniterOfAArticle(article: Article): Uniter[]{
    let tab: Uniter[] = [];

    this.affectUniterToArticleList.forEach(element => {
      if(element.article.numArticle == article.numArticle){
        tab.push(element.uniter);
      }
    });

    return tab;
  }

  getUniterOfAArticle2(article: Article): number[]{
    let tab: number[] = [];

    this.affectUniterToArticleList.forEach(element => {
      if(element.article.numArticle == article.numArticle){
        tab.push(element.uniter.numUniter);
      }
    });

    return tab;
  }

  getAllFamille(){

    this.familleService.getAllFamille().subscribe(
      (data) => {
        this.familleList2 = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });

  }

  getAllTypeArticle(){

    this.typeArticleService.getAllTypeArticle().subscribe(
      (data) => {
        this.typeArticleList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      });


  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.articleFiltered = [...this.articleList.sort((a, b) => a.codeArticle.localeCompare(b.codeArticle.valueOf()))];
    }

    const columns = Object.keys(this.articleList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.articleList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.articleFiltered = rows;
  }

  makeForm(article: Article): void {
    this.validateForm = this.fb.group({
      numArticle: [article != null ? article.numArticle: null],
      codeArticle: [article != null ? article.codeArticle: null, [Validators.required]],
      libArticle: [article != null ? article.libArticle : null, [Validators.required]],
      taxeSpecifiqArticle: [article != null ? article.taxeSpecifiqArticle : 0, [Validators.required]],
      tvaArticle: [article != null ? article.tvaArticle : 0, [Validators.required]],
      famille: [article != null ? article.famille : null],
      typeArticle: [article != null ? article.typeArticle : null],
      uniters: [[]],

    });

    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (article?.numArticle !=null){

      const i = this.articleList.findIndex(l => l.numArticle == article.numArticle);

      if (i > -1) {
        this.validateForm.patchValue({
          famille: article.famille != null ? article.famille.numFamille : null,
          typeArticle: article.typeArticle != null ? article.typeArticle.numTypeArt : null,
          uniters: this.getUniterOfAArticle2(article),

        });
      }

      this.activeTabsNav = 2;

      this.selectedUniter = this.getUniterOfAArticle(article);
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

      const i = this.familleList2.findIndex(l => l.numFamille == formData.famille);
      const j = this.typeArticleList.findIndex(l => l.numTypeArt == formData.typeArticle);
      if (i > -1) {
        formData.famille = this.familleList2[i];
        formData.typeArticle = this.typeArticleList[j];
        console.log(formData.typeArticle);

      }

      let tab: Uniter[] = [];

      formData.uniters.forEach((element: number) => {
        for(const unit of this.uniterList){
          if(unit.numUniter == element){
            tab.push(unit);
            break;
          }
        }

      });

      formData.uniters = tab;

      if (formData.numArticle == null) {

        console.log("data", formData);

        this.enregistrerArticle(formData, formData.uniters);

      } else {

        this.modifierArticle(formData.numArticle,formData, formData.uniters);
      }
    }
  }

  enregistrerArticle(article: Article, uniters: Uniter[]): void {
    this.articleService.addArticle(article).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        this.articleList.unshift(data);
        this.articleFiltered = [...this.articleList.sort((a, b) => a.codeArticle.localeCompare(b.codeArticle.valueOf()))];

        uniters.forEach(element => {
          this.affectUniterToArticleService.addAAffectUniterToArticle(new AffectUniterToArticle(data, element)).subscribe(
            (data2) => {
              this.getAllAffectUniterToArticle();
            },
            (error: HttpErrorResponse) => {
              console.log('Echec atatus ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );
        });

        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        this.loading = false;
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
        this.getAllFamille();
        this.getAllTypeArticle();
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

      });
  }

  modifierArticle(id: String, article: Article, uniters: Uniter[]): void {
    this.articleService.editArticle(id, article).subscribe(
      (data) => {
        console.log(data);
        this.loading = true;
        const i = this.articleList.findIndex(l => l.numArticle == data.numArticle);
        if (i > -1) {
          this.articleList[i] = data;
          this.articleFiltered = [...this.articleList.sort((a, b) => a.codeArticle.localeCompare(b.codeArticle.valueOf()))];
        }

        uniters.forEach(element => {
          let newer: boolean = true;

          for(const old of this.selectedUniter){
            if(element.numUniter == old.numUniter){
              newer = false;
              break;
            }
          }

          if(newer){
            this.affectUniterToArticleService.addAAffectUniterToArticle(new AffectUniterToArticle(data, element)).subscribe(
              (data2) => {
                this.getAllAffectUniterToArticle();
              },
              (error: HttpErrorResponse) => {
                console.log('Echec atatus ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

              }
            );
          }

        });

        this.selectedUniter.forEach(element => {
          let finded: boolean = false;

          for(const uni of uniters){
            if(element.numUniter == uni.numUniter){
              finded = true;
              break;
            }
          }

          if(!finded){
            this.affectUniterToArticleService.getAllAffectUniterToArticle().subscribe(
              (data3) => {
                data3.forEach(element3 => {
                  if(element3.article.numArticle == data.numArticle && element3.uniter.numUniter == element.numUniter){
                    this.affectUniterToArticleService.deleteAAffectUniterToArticle(element3.idAffectUniterToArticle.toString()).subscribe(
                      (data4) => {
                        this.getAllAffectUniterToArticle();
                      },
                      (error: HttpErrorResponse) => {
                        console.log('Echec atatus ==> ' + error.status);
                        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

                      }
                    );
                  }
                });
              },
              (error: HttpErrorResponse) => {
                console.log('Echec atatus ==> ' + error.status);
                this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

              }
            );

          }

        });

        this.resetForm();
        this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });
        this.getAllFamille();

        //basculer vers la tab contenant la liste apres modification
        this.loading = false;
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);

        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

      });
  }

  confirm(content, article: Article) {
    this.article = article;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.articleService.deleteArticle(article?.numArticle.toString()).subscribe(
        (data) => {
          console.log(data);
          const i = this.articleList.findIndex(l => l.numArticle == article.numArticle);
          if (i > -1) {
            this.articleList.splice(i, 1);
            this.articleFiltered = [...this.articleList.sort((a, b) => a.codeArticle.localeCompare(b.codeArticle.valueOf()))];
            this.getAllFamille();
            this.getAllTypeArticle();
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
