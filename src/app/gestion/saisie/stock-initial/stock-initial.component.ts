import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { Stocker } from 'src/app/models/gestion/saisie/stocker.model';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { StockerService } from 'src/app/services/gestion/saisie/stocker.service';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { ExerciceService } from 'src/app/services/gestion/fichier/exercice.service';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { AuthService } from 'src/app/services/common/auth.service';

export interface modelLigneEtatStock{
  concernedStocker: Stocker;
}


@Component({
  selector: 'app-stock-initial',
  templateUrl: './stock-initial.component.html',
  styleUrls: ['./stock-initial.component.css']
})
export class StockInitialComponent implements OnInit {
  loading = false;
  loading2 = false;
  ligneShow : modelLigneEtatStock[] = [];
  magasinList : Magasin[] = [];
  stockerList : Stocker[] = [];
  searchControl: FormControl = new FormControl();
  ligneShowFiltered;
  articleInitial :Article[] = [];
  articleListOfMagSelected : Article[] = [];
  

  validateForm: FormGroup;

  constructor(
    private stockerService: StockerService,
    private magasinService: MagasinService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private exerciceService: ExerciceService,
    private articleService: ArticleService,
    public authService: AuthService
  ) {

    this.makeForm();

   }

  ngOnInit(): void {


    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

    this.getAllMagasin();
    this.getAllStocker();
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
      return this.ligneShowFiltered = [...this.ligneShow.sort((a, b) => a.concernedStocker.idStocker.toString().localeCompare(b.concernedStocker.idStocker.toString()))];
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

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez Choisir un Magasin.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      
      this.getAllArticleForOneMagasin(this.validateForm.value.magasin);
      //this.getLignShowOfSelectedMagasin();
        
    }

   
  }

  //Get all article for one Magasin
  getAllArticleForOneMagasin(numMag: number){
    this.articleListOfMagSelected = [];
    this.articleService.getAllArticleForMagasin(numMag).subscribe(
      (data: Article[]) => {
        this.loading = true;
        //this.magasinList = data;
        data.forEach(element => {
          element.exo = this.exerciceService.selectedExo

        });


        this.articleListOfMagSelected = data;
        console.log('Article for Magasin ==>');
        //console.log(data);
        console.log(this.articleListOfMagSelected);
        this.loading = false;
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
      }
    );
  }

  getLignShowOfSelectedMagasin(){
    let arti = null;
    this.articleInitial = [];
    this.ligneShow = [];
    this.loading = true;
    this.stockerService.getAllStocker().subscribe(
      (data) => {
        this.stockerList = data;
        let selectedMag : Magasin = null;

        const i = this.magasinList.findIndex(l => l.numMagasin == this.validateForm.value.magasin);

        if (i > -1) {
          selectedMag= this.magasinList[i];
          this.stockerList.forEach(element => {
            if(element.magasin.numMagasin == selectedMag.numMagasin){
              this.ligneShow.push({
                concernedStocker : element,
              })
   
              this.articleInitial.push(new Article(element.article.codeArticle,element.article.libArticle,false,false,false,
                false,null,'',0,element.cmup,new Date(),'','','','',0,0,null,element.cmup,element.stockMinimal,0,
                0,this.exerciceService.selectedExo,element.article.famille,null,null));

                 arti = new Article(element.article.codeArticle, element.article.libArticle, false, false, false,
                  false, null,'',0,element.cmup, new Date(),'','','','',0 ,0 ,null,element.cmup,element.stockMinimal,0,
                  0,this.exerciceService.selectedExo,element.article.famille,null,null);
                  arti.numArticle = element.article.numArticle;
                  this.articleInitial.push(arti);
                
            }
          });

          this.ligneShowFiltered = [...this.ligneShow];

          this.loading = false;

          console.log(this.ligneShowFiltered);
          console.log('initial', this.articleInitial);

        }
        else{
          this.loading = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading = false;
      }
    );
    

  }

  //Saved stock initial

  savedStockInitial(){
    
   console.log('exact value ==>', this.articleListOfMagSelected);
   
    this.articleService.addAListArticleForStockInit(this.articleListOfMagSelected).subscribe(
      (data) => {
        //this.loading2 =  true;
       console.log('objet', data);
       
          this.toastr.success('Stock Initial enregistré avec succès.', ' Success !', {progressBar: true});
     
        //Remettre le tableau d'affichage à vide
        this.articleListOfMagSelected = [];
        
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
        this.loading2 =  true;
        setTimeout(() => {
          this.loading2 =  false;
          this.toastr.success( error.statusText, ' Erreur !', {progressBar: true});
        }, 3000);
      }
    );

  }


}
