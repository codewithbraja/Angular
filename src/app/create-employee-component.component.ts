import { Component, OnInit } from '@angular/core';
import{FormGroup,FormBuilder,Validators, AbstractControl, FormArray } from '@angular/forms'
import {CustomValidators} from './Shared/custom.validators'
@Component({
  selector: 'app-create-employee-component',
  templateUrl: './create-employee-component.component.html',
  styleUrls: ['./create-employee-component.component.css']
})
export class CreateEmployeeComponentComponent implements OnInit {
employeeForm: FormGroup;
validationMessages={
  'fullName':{
    'required':'Full name is required',
    'minlength':'Full name must be graterthan 2 character',
    'maxlength':'Full name must be less than 5 character'
  },
  'email':{
  'required':'Email is required',
  'emailDomain':'Domain should be gmail.com '
  },
  'confirmEmail':{'required':'confirmEmail should match with email'},
  'emailGroup':{'emailMismatch':'Email and Confirm Email do not match'},
  'phone':{'required':'Phone is required'},
  'skillName':{'required':'Skill Name is required'},
  'experienceInYears':{'required':'ExperienceInYears  is required'},
  'proficency':{'required':'Proficency is required'}
};
formErrors={
  fullName:'',
  email:'',
  confirmEmail:'',
  emailGroup:'',
  phone:'',
  skillName:'',
  experienceInYears:'',
  proficency:''
};
formvalidity:boolean;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.employeeForm=this.fb.group(
      {
        fullName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(5)]],
        contactpreference:['email'],

        emailGroup:this.fb.group({
          email:['',[Validators.required,CustomValidators.emailDomain('gmail.com')]],
          confirmEmail:['',Validators.required]
        },{validator:matchEmail}),
        
        phone:[''],
        skills:this.fb.array([ 
          this.addSkillFormGroup()
        ])
      });
    this.employeeForm.valueChanges.subscribe((data)=>this.LogValidationErrors(this.employeeForm)
    
    );
    this.employeeForm.get('contactpreference').valueChanges.subscribe((data:string)=>{
      console.log(data);
      this.Oncontactpreference(data);
    }); 
  }
  addSkillFormGroup()
  {
    return this.fb.group(
      {
        skillName:['',Validators.required],
        experienceInYears:['',Validators.required],
        proficency:['',Validators.required]
      })
   
  }
  addSkillButtonClick():void
  {
(<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
  LogValidationErrors(group:FormGroup=this.employeeForm):void
  {
    Object.keys(group.controls).forEach( (key:string)=>
    {
      const abstractControl=group.get(key);
      this.formErrors[key]='';
      if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty))
      {
        const messages=this.validationMessages[key];
        //console.log(messages);
      
        for(const errorKey in abstractControl.errors)
        {
          if(errorKey)
          {
          //  console.log(key);
           // console.log(errorKey);
            this.formErrors[key]+=messages[errorKey]+' ';
          }
        }
      }

      if(abstractControl instanceof FormGroup)
      {
       this. LogValidationErrors(abstractControl);
      }
      if(abstractControl instanceof FormArray)
      {
       for(const control of abstractControl.controls)
       {
         if(control instanceof FormGroup)
         {
          this. LogValidationErrors(control);
         }
      
       }
      
       }


    });
    this.formvalidity= this.employeeForm.valid;
  }
  Oncontactpreference(contactprefSelectedValue:string)
    {
      const controlRefPhone= this.employeeForm.get('phone');
      const controlRefEmail= this.employeeForm.get('emailGroup').get('email');
      const controlRefConfirmEmail= this.employeeForm.get('emailGroup').get('confirmEmail');
      const controlRefemailGroup=this.employeeForm.get('emailGroup');
      if(contactprefSelectedValue ==='phone')
      {
        controlRefPhone.setValidators(Validators.required);
        controlRefEmail.clearValidators();
        controlRefConfirmEmail.clearValidators();
        controlRefemailGroup.clearValidators();
      }
      else{
        controlRefEmail.setValidators([Validators.required,CustomValidators.emailDomain('gmail.com')]);
        controlRefConfirmEmail.setValidators(Validators.required);
        controlRefemailGroup.setValidators(matchEmail);
        controlRefPhone.clearValidators();
      }
      
      controlRefPhone.updateValueAndValidity();
      controlRefEmail.updateValueAndValidity();
      controlRefConfirmEmail.updateValueAndValidity();
      controlRefemailGroup.updateValueAndValidity();
     
    }
}
function matchEmail(group:AbstractControl):{[key:string]:any} |null
{
const emilControl=group.get('email');
const confirmEmilControl=group.get('confirmEmail');
if(emilControl.value===confirmEmilControl.value || confirmEmilControl.pristine)
{
  return null;
}
else
{
return { 'emailMismatch' : true };
}
}
