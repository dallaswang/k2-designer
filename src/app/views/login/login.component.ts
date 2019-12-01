import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/auth/index';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  remember: boolean = false;
  isLoading: boolean = false;
  validateForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
  submitForm(): void {
    // this.router.navigate(['designer/report/reportList']);
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    // }
    this.isLoading = true;
    const subObj = {
        email: this.validateForm.value.email,
        password: this.validateForm.value.password
    };
    this.authService.login(subObj).subscribe(() =>{
      this.router.navigate(['designer/report/reportList']);
    },()=> {
      this.isLoading = false;
    });
  }
}
