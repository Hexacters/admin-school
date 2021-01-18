import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {

  displayedColumns: string[] = ['index', 'typeName', 'scholarshipType', 'name', 'value', 'update', 'delete'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
      private _dataService: UtilityServiceService,
      private router: Router,
      public dialog: MatDialog
  ) { }

  ngOnInit() {
      this._dataService.getScholarship().subscribe(res => {
          this.dataSource = new MatTableDataSource(res.filter(e => e.id !== 1));
          this.dataSource.paginator = this.paginator;
      })
  }

  ngAfterViewInit() {
  }

  deleteScholarship(id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '300px',
          data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this._dataService.deleteScholarship(id).subscribe(res => {
                  this.ngOnInit();
              });
          }
      });
  }

  updateScholarship(element) {
      this.router.navigate(['scholarship/edit']);
      sessionStorage.setItem('scholarship', JSON.stringify(element));
  }

}