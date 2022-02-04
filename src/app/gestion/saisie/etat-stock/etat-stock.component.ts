import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { debounceTime } from 'rxjs/operators';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';
import { SalTools } from 'src/app/utilitaires/salTools';

export interface modelLigneEtatStock{
  concernedStocker: Stocker;
}

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.css']
})
export class EtatStockComponent implements OnInit {

  loading = false;
  ligneShow : modelLigneEtatStock[] = [];
  magasinList : Magasin[] = [];
  stockerList : Stocker[] = [];
  searchControl: FormControl = new FormControl();
  ligneShowFiltered;

  validateForm: FormGroup;

  constructor(
    private stockerService: StockerService,
    private magasinService: MagasinService,
    private articleService: ArticleService,
    public salToolsService: SalTools,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {

    this.makeForm();

   }

  ngOnInit(): void {

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

      this.submit();

  }

  makeForm(): void {
    this.validateForm = this.fb.group({
      magasin: [null, [Validators.required]]
    });
    
  }

  getAllMagasin(){
    this.magasinService.getAllMagasin().subscribe(
      (data) => {
        this.magasinList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getAllStocker(){
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );

  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.ligneShowFiltered = [...this.ligneShow.sort((a, b) => a.concernedStocker.article.codeArticle.toString().localeCompare(b.concernedStocker.article.codeArticle.toString()))];
    }

    const columns = Object.keys(this.ligneShow[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.ligneShow.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.ligneShowFiltered = rows;
  }

  submit(){
    this.loading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.getLignShowOfSelectedMagasin();

  }

  getLignShowOfSelectedMagasin(){
    this.ligneShow = [];
    
    this.articleService.getAllArticle0().subscribe(
      (data2) => {

        this.stockerService.getAllStocker().subscribe(
          (data) => {
            this.stockerList = data;
            let selectedMag : Magasin = null;

            let autorisedArticle: Article[] = [];

            SalTools.getConnectedUser().magasins.forEach(elementMag => {
              autorisedArticle = [...autorisedArticle, ...data2.filter(l => (l.famille.magasin && l.famille.magasin.numMagasin == elementMag.numMagasin))];
            });

            autorisedArticle.sort((a, b) => a.codeArticle >= b.codeArticle ? 1:-1);

            let tab:modelLigneEtatStock[] = [];

            autorisedArticle.forEach(elementAut => {
              const indeStock = data.findIndex(l => l.article.numArticle == elementAut.numArticle);
              if(indeStock > -1){
                tab.push({concernedStocker:data[indeStock]});
              }
              else{
                tab.push({concernedStocker : new Stocker(0, 0, 0, 0, elementAut, null)});
              }
            });

            this.ligneShow = tab;
            //this.ligneShowFiltered = tab;
            //console.log(tab);
            this.filerData('');
            this.loading = false;
            
          },
          (error: HttpErrorResponse) => {
            console.log('Echec status ==> ' + error.status);
            this.loading = false;
          }
        );
    
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading = false;
      }
    );


  }


}
