import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: ActivatedRoute, private route: Router) { }

  username: string;
  password: string;

  ngOnInit() {
  }

  loginClick(event: any) {
    if(this.username === 'ctc' || this.username === 'jason' || this.username === 'solar')
    {
      if(this.password === '!!Warriors!!' || this.password === 'ctc45402'){
        this.route.navigate(['/main']);
      }
    }
  }
}
