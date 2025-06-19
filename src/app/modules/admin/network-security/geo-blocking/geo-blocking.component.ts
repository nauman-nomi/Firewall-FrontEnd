import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-geo-blocking',
    templateUrl: './geo-blocking.component.html',
    styleUrls: ['./geo-blocking.component.scss']
})
export class GeoBlockingComponent implements OnInit {

    loading: boolean = true;
    
    constructor() { }

    ngOnInit(): void {
    }

    addGeoIP()
    {

    }


}
