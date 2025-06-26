import { Component, OnInit } from '@angular/core';
import { NicService } from 'app/api/nic-info.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-geo-blocking',
  templateUrl: './geo-blocking.component.html'
})
export class GeoBlockingComponent implements OnInit {
  countries: string[] = [];
  countryCode: string = '';
  loading = false;

  constructor(private nicService: NicService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading = true;
    this.nicService.viewBlockedCountries().subscribe({
      next: (res) => {
        this.countries = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addCountry(): void {
    if (!this.countryCode.trim()) return;
    this.loading = true;
    this.nicService.addBlockedCountry(this.countryCode.trim()).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });
        this.loadCountries();
        this.countryCode = '';
      },
      error: () => this.loading = false
    });
  }

  deleteCountry(code: string): void {
    this.loading = true;
    this.nicService.deleteBlockedCountry(code).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });
        this.loadCountries();
      },
      error: () => this.loading = false
    });
  }
}
