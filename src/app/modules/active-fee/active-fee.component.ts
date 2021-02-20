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
    displayedColumns: string[] = ['index', 'schoolName', 'departmentName', 'programName', 'typeName', 'penaltyName', 'activationDate', 'activateFee'];
    dataSource: MatTableDataSource<any>;
  
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) { }
  
    ngOnInit() {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req ={
                universityId: this._dataService.currentUniversity()
            }
        }
        this._dataService.getActiveFee(req).subscribe(res => {
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

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
