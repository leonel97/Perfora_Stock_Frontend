import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import { StockComptaSetting } from 'src/app/models/gestion/comptabilisation/stockComptaSetting.model';
import { StockComptaSettingService } from 'src/app/services/gestion/comptabilisation/stockComptaSetting.service';

@Component({
  selector: 'app-imputation-article',
  templateUrl: './imputation-article.component.html',
  styleUrls: ['./imputation-article.component.css']
})
export class ImputationArticleComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  stockComptaSettingFiltered;

  validateForm: FormGroup;
  stockComptaSettingList: StockComptaSetting[] = [];
  loading: boolean;
  stockComptaSetting: StockComptaSetting = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private stockComptaSettingService: StockComptaSettingService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.stockComptaSettingService.list().subscribe(
      (data: any) => {
        this.stockComptaSettingList = [...data];
        this.stockComptaSettingFiltered = this.stockComptaSettingList.sort((a, b) => a.numParamCompta.toString().localeCompare(b.numParamCompta.toString()));
        console.log(this.stockComptaSettingList);
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
      return this.stockComptaSettingFiltered = [...this.stockComptaSettingList.sort((a, b) => a.numParamCompta.toString().localeCompare(b.numParamCompta.toString()))];
    }

    const columns = Object.keys(this.stockComptaSettingList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.stockComptaSettingList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.stockComptaSettingFiltered = rows;
  }

  makeForm(stockComptaSetting: StockComptaSetting): void {
    this.validateForm = this.fb.group({
      numParamCompta: [stockComptaSetting != null ? stockComptaSetting.numParamCompta : null],
      achat: [stockComptaSetting != null ? stockComptaSetting.achat : null],
      tvaAchat: [stockComptaSetting != null ? stockComptaSetting.tvaAchat: null],
      compteStock: [stockComptaSetting != null ? stockComptaSetting.compteStock : null],
      compteVaStock: [stockComptaSetting != null ? stockComptaSetting.compteVaStock : null],
      tvaVente: [stockComptaSetting != null ? stockComptaSetting.tvaVente : null],
      exportable: [stockComptaSetting != null ? stockComptaSetting.exportable : false],
      famille: [stockComptaSetting != null ? stockComptaSetting.famille : null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (stockComptaSetting?.numParamCompta !=null){
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
      if (formData.numParamCompta == null) {
        console.log("data", formData);
        
        this.enregistrerstockComptaSetting(formData);
      } else {
        this.modifierstockComptaSetting(formData.numParamCompta,formData);
      }
    }
  }

  enregistrerstockComptaSetting(stockComptaSetting: StockComptaSetting): void {
    this.stockComptaSettingService.createStockComptaSetting(stockComptaSetting).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.stockComptaSettingList.unshift(data);
        this.stockComptaSettingFiltered = [...this.stockComptaSettingList.sort((a, b) => a.numParamCompta.toString().localeCompare(b.numParamCompta.toString()))];
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

  modifierstockComptaSetting(id: number, stockComptaSetting: StockComptaSetting): void {
    this.stockComptaSettingService.updateStockComptaSetting(id, stockComptaSetting).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.stockComptaSettingList.findIndex(l => l.numParamCompta== data.numParamCompta);
        if (i > -1) {
          this.stockComptaSettingList[i] = data;
          this.stockComptaSettingFiltered = [...this.stockComptaSettingList.sort((a, b) => a.numParamCompta.toString().localeCompare(b.numParamCompta.toString()))];
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

  confirm(content, stockComptaSetting) {
    this.stockComptaSetting = stockComptaSetting;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.stockComptaSettingService.deleteStockComptaSetting(stockComptaSetting?.numParamCompta).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.stockComptaSettingList.findIndex(l => l.numParamCompta == stockComptaSetting.numParamCompta);
          if (i > -1) {
            this.stockComptaSettingList.splice(i, 1);
            this.stockComptaSettingFiltered = [...this.stockComptaSettingList.sort((a, b) => a.numParamCompta.toString().localeCompare(b.numParamCompta.toString()))];
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
