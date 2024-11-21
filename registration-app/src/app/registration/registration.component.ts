import { Component } from '@angular/core';
import { SignupService } from './signup.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(protected crud: SignupService, private router: Router) { }

  Submit(data: any) {
    if (data.valid) {
      console.log('Form submitted:', data.value);
      
      // Call the register method from SignupService
      this.crud.register(data.value).subscribe(
        (res: any) => {
          console.log(res);  // You can handle the response as needed
          
          // Navigate to the login page after successful registration
          this.router.navigate(['/login']);
        },
        (error: any) => {
          // Handle error (optional)
          console.log('Registration failed:', error);
        }
      );
      
    } else {
      console.log('Form is invalid');
    }
  }
}

