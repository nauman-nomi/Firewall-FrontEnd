import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vpn',
  templateUrl: './vpn.component.html',
  styleUrls: ['./vpn.component.scss']
})
export class VpnComponent implements OnInit {

    constructor(private apiService: NicService, private cdr: ChangeDetectorRef, public dialog: MatDialog) {
  
  
      // this.getBlockFileList();
  
    }

  ngOnInit(): void {
  }


}
