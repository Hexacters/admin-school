import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UtilityServiceService } from 'src/app/utility-service.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    displayedColumns: string[] = ['index', 'name', 'emailId', 'phoneNo', 'update', 'delete'];
    dataSource: MatTableDataSource<any>;
    isSuperAdmin: boolean = false;

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
        this.isSuperAdmin = this._dataService.isSuperAdmin();
        this._dataService.getAdmin(req).subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
        });
    }

    deleteAdmin(id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteAdmin(id).subscribe(res => {
                    this.ngOnInit();
                });
            }
        });

    }

    updateAdmin(element) {
        this.router.navigate(['admin/edit'])
        sessionStorage.setItem('admin', JSON.stringify(element))
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
