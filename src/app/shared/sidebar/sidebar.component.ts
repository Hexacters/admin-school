import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {

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
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.dataSource.data = this.menuService.menus.filter(e => {
      let role = this.userDetails.role;
      if (e.role === 'all') {
        return true;
      }
      if (!role) {
        role = 'admin';
      }
      return e.role == role;
    });
  }

  hasChild = (_: number, node: IMenuFlatNode) => node.expandable;

}
