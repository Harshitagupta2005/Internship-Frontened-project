import { Component } from '@angular/core';
@Component({ selector:'app-contact', templateUrl:'./contact.component.html', styleUrls:['./contact.component.css'] })
export class ContactComponent {
  name = ''; email = ''; message = ''; submitted = false;
  onSubmit() { if(this.name && this.email && this.message) this.submitted = true; }
  reset() { this.name=''; this.email=''; this.message=''; this.submitted=false; }
}