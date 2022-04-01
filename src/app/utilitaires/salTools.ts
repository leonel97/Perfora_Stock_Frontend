import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/gestion/utilisateur/user';
import { NumberToLetter } from 'convertir-nombre-lettre';

@Injectable({
    providedIn: "root"
  })
export class SalTools {
    constructor() {
        
    }

    public formtNum (nbr : number): string{
        let nbrForm = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 4});
        //console.log(nbrForm.format(nbr), nbrForm.format(nbr).valueOf(), nbrForm.format(nbr).toString());
        return  nbrForm.format(nbr).toString();
        
    }

    public salRound(valeur: number, nbrChiffr: number = 4): number {
        return SalTools.salRound(valeur, nbrChiffr);
    }

    public salNumberToLetter(valeur: Number): String {
        return SalTools.salNumberToLetter(valeur);
    }

    public static salNumberToLetter(valeur: Number): String {
        let res: String = '';
        let valString = valeur.toString().split('.');
        if(valString.length == 1){
            res = NumberToLetter(Number.parseInt(valString[0]));
        }else if(valString.length == 2){
            res = NumberToLetter(Number.parseInt(valString[0]))+' virgule '+NumberToLetter(Number.parseInt(valString[1]));
        }
        //console.log('sall', valString, res);
        return res;
    }

    public static salRound(valeur: number, nbrChiffr: number = 4): number {
        
        return Math.round(valeur*Math.pow(10, nbrChiffr))/Math.pow(10, nbrChiffr);
    }

    public addDayToDate(date: Date, days: number): Date{
        
        return SalTools.addDayToDate(date, days);
    }

    public static addDayToDate(date: Date, days: number): Date{
        let nbr:number = 0;
        nbr = days*24*60*60*1000;
        return new Date(new Date(date).valueOf()+nbr);
    }
    
    public static validatorQteArticle(): ValidatorFn {
        return (controle: AbstractControl): ValidationErrors | null => {
            
            return (typeof(controle.value) != 'number' || controle.value <= 0) ? { qteArticleInvalid : {value : 'Quantité invalide'}} : null;
        }
    }

    
    /*
    public static validatorDateOrdre(dateRef:any, after : boolean = true): ValidatorFn{
        
        console.log(dateRef+' +++');
        return (controle:AbstractControl) : ValidationErrors | null => {
            
            let dateControle: Date = controle.value;
            console.log(dateControle+'....'+dateRef);
            if(dateControle && dateRef){
                console.log('Vérification....');
                return after ? 
                            (dateControle.valueOf() < dateRef.valueOf() ? { dateInvalid : {value : 'Date Relativement Invalide'}} : null)
                            : (dateControle.valueOf() > dateRef.valueOf() ? { dateInvalid : {value : 'Date Relativement Invalide'}} : null)
                        ;
            }
            
                return null;
           
           
        }

    }
    */

   public static validatorDateOrdre(date: string, dateRefStr:string, after : boolean = true): ValidatorFn{
        
        return (controle:FormGroup) : ValidationErrors | null => {
            
            let dateControle: Date = controle.get(date)?.value;
            let dateRef: Date = controle.get(dateRefStr)?.value;
            
            if(dateControle && dateRef){
                
                return after ? 
                            (dateControle.valueOf() < dateRef.valueOf() ? { dateInvalid : {value : 'Date Relativement Invalide'}} : null)
                            : (dateControle.valueOf() > dateRef.valueOf() ? { dateInvalid : {value : 'Date Relativement Invalide'}} : null)
                        ;
            }
            
            return null;
        
        }
    }

    public static getConnectedUser():User{
        let jwtSer: JwtHelperService = new JwtHelperService();
        
        return jwtSer.decodeToken(localStorage.getItem('token')).user;
    }

    public static deepSearcher(objet: any, superName:string, superProp:string, listBase:any[]):any[]{
        let tabRes:any[] = [objet];

        let fini: boolean = false;
        let tabToMerge: any[] [] = [];
        tabToMerge.push([objet]);
        while (fini == false) {
          let tab2: any[] = [];
          tabToMerge[tabToMerge.length-1].forEach(elementDeep => {
            tab2 = [...tab2,...listBase.filter((l) => (l[superName] && l[superName]?.[superProp] == elementDeep[superProp]))];
          });
          //console.log('tab', tab2, 'fini', fini);
          if(tab2.length == 0){
            fini = true;
          } else{
            tabToMerge.push(tab2);
            tabRes = [...tabRes,...tab2];
          }

        }

        return tabRes;
    }

    //Separateur de milliers 
  public format(nbre)
    {
        var str_nbre = "";
       
        //    Découpage de le fin vers le début, par longueur de 3
        for ( let  cpt = Math.trunc(nbre).toString().length - 3; cpt >= 0; cpt = cpt - 3 )
        {
             str_nbre = Math.trunc(nbre).toString().substr(cpt, 3) + " " + str_nbre;
        }
    
        //    S'il y a un reste on traite
        if ( (nbre.toString().length % 3) != 0 )
            str_nbre = Math.trunc(nbre).toString().substr(0, nbre.toString().length % 3) + " " + str_nbre;
       
        //    Suppression du dernier .
        str_nbre = str_nbre.substr(0, str_nbre.length - 1);
       
        //    Retour du résultat
        return (str_nbre);
    }
    

}