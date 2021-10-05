import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Magasin } from '../models/gestion/definition/magasin.model';
import { User } from '../models/gestion/utilisateur/user';

export class SalTools {
    constructor() {
        
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

}