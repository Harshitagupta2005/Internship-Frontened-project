import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  userForm: FormGroup;

  submitted = false;
  isSubmitting = false;

  showNotification = false;

  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  roleOptions = [
  {label:'Admin', value:'admin'},
  {label:'User Agent', value:'agent'},
  {label:'Employee', value:'employee'},
  {label:'Manager', value:'manager'}
];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {


    this.userForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],


      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],


      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],


      role: [
        '',
        Validators.required
      ]

    });

  }


  get f() {
    return this.userForm.controls;
  }



  onSubmit() {

    this.submitted = true;


    if(this.userForm.invalid){

      this.notifType = 'error';
      this.notifMessage = 'Please fix the errors before submitting.';
      this.showNotification = true;

      return;
    }


    this.isSubmitting = true;
    this.showNotification = false;



    this.userService.addUser(this.userForm.value)
    .subscribe({

      next:()=>{

        this.isSubmitting = false;


        this.notifType='success';
        this.notifMessage='User added successfully!';
        this.showNotification=true;


        setTimeout(()=>{

          this.router.navigate(['/users']);

        },1200);


      },


      error:(err: any)=>{

        this.isSubmitting=false;

        this.handleBackendErrors(err);

      }

    });

  }



  handleBackendErrors(err:any){


    if(err.error?.errors){


      const backendErrors = err.error.errors;


      Object.keys(backendErrors)
      .forEach(field=>{


        const control=this.userForm.get(field);


        if(control){

          control.setErrors({

            backend:backendErrors[field][0]

          });

        }


      });



      this.notifType='error';
      this.notifMessage='Please fix the errors below.';


    }
    else{


      this.notifType='error';
      this.notifMessage='Failed to add user. Please try again.';


    }


    this.showNotification=true;

  }



  onCancel(){

    this.router.navigate(['/users']);

  }

}