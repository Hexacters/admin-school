import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-active-fee',
    templateUrl: './active-fee.component.html',
    styleUrls: ['./active-fee.component.scss']
})
export class ActiveFeeComponent implements OnInit {
    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'firstName', 'lastName', 'emailId', 'phoneNo', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;
  
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }
  
    ngOnInit() {
        this._dataService.getStudent().subscribe(res => {
            this.dataSource = new MatTableDataSource(res.filter(e => e.id));
            this.dataSource.paginator = this.paginator;
        })
    }
  
    ngAfterViewInit() {
    }
  
    deleteStudent(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });
  
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteStudent(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });
    }
  
    updateStudent(element) {
        this.router.navigate(['students/edit']);
        sessionStorage.setItem('students', JSON.stringify(element));
    }
}
