import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { Utils } from 'src/app/utilitaires/utils';

@Component({
  selector: 'app-ecriture-comptable',
  templateUrl: './ecriture-comptable.component.html',
  styleUrls: ['./ecriture-comptable.component.css']
})
export class EcritureComptableComponent implements OnInit {

  validateForm: FormGroup;
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,) { 
      this.makeForm(null);
    }

  ngOnInit(): void {
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);
  }

  makeForm(donne): void {
    this.validateForm = this.fb.group({
      dateDebut: [ moment(Date.now()).format('yyyy-01-01'), [Validators.required]],
      dateFin: [ moment(Date.now()).format('yyyy-12-31'), [Validators.required]],
    });

  }

  submit(){
    this.loading = true;
    if (this.validateForm.valid == false) {

      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      //this.printJournalEngagementPdf();
    }

  }

}
