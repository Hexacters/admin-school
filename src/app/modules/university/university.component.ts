import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.scss']
})
export class UniversityComponent implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'update', 'delete'];
  dataSource: MatTableDataSource<any>;
  public loading: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
      private _dataService: UtilityServiceService,
      private router: Router,
      public dialog: MatDialog
  ) { }

  ngOnInit() {
      // this._localCommunication.universityFlag.ne
      this.loading = true;
      this._dataService.getUniversityList().subscribe(res => {
          this.loading = false;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
      })
  }

  ngAfterViewInit() {
  }

  deleteuniversity(id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '300px',
          data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this._dataService.deleteUniversity(id).subscribe(res => {
                  this.ngOnInit();
              });
          }
      });
  }

  goToSchool(element) {
      sessionStorage.setItem('by-university', JSON.stringify(element));
      this.router.navigate(['school/byuniversity']);
  }

  updateuniversity(element) {
      console.log(element)
      // this._localCommunication.universityData.next(element);
      sessionStorage.setItem('university', JSON.stringify(element));
      setTimeout(() => {
          this.router.navigate(['university/edit'])
      }, 1000);

  }

  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log(this.dataSource.filter);
      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

}
