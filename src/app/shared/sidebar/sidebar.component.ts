import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SidebarMenuService, ISideMenu } from './sidebar-menu.service';

/** Flat node with expandable and level information */
interface IMenuFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

    public userDetails: any;
    private _transformer = (node: ISideMenu, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.title,
            level: level,
            ...node
        };
    }

    treeControl = new FlatTreeControl<IMenuFlatNode>(
        node => node.level, node => node.expandable
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


    constructor(
        private menuService: SidebarMenuService
    ) { }

    ngOnInit() {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        this.dataSource.data = this.filterDataBasedOnRole(this.menuService.menus);
    }

    ngAfterViewInit() {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        this.dataSource.data = this.filterDataBasedOnRole(this.menuService.menus);
    }

    public filterDataBasedOnRole(data: ISideMenu[]): any[] {
        const result = [];
        let role = this.userDetails.role;
        data.forEach(e => {
            const res = { ...e };
            if (e.children) {
                res.children = e.children.filter(e => {
                    return e.role.includes(role);
                });
            }

            if (e.role.includes(role)) {
                result.push(res);
            }
        });
        return result;
    }

    hasChild = (_: number, node: IMenuFlatNode) => node.expandable;

}
