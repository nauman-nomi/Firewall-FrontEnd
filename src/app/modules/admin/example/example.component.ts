import { Component, ViewEncapsulation } from '@angular/core';
import { TestService } from 'app/api/test-api/test.service';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent 
{
    data: any;
    /**
     * Constructor
     */
    constructor(private testService: TestService)
    {
        this.test();
    }

    test(): void {
        this.testService.getApiData().subscribe(response => {
          this.data = response;
        });
      }
}
