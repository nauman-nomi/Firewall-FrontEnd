import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maintainance',
  templateUrl: './maintainance.component.html',
  styleUrls: ['./maintainance.component.scss']
})
export class MaintainanceComponent implements OnInit {

  value: string | null = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.value = params['value']; // Retrieve the "value" value from the URL
      console.log("value:", this.value);
    });
  }

}
