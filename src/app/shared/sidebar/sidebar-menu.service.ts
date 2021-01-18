import { Injectable } from "@angular/core";



export interface ISideMenu {
    title: string;
    link?: string;
    icon?: string;
    options?: object;
    children?: ISideMenu[];
}

@Injectable({
    providedIn: 'root'
})
export class SidebarMenuService {

    public menus: ISideMenu[] = [
        {
            title: 'dashboard',
            link: '/dashboard',
            icon: 'dashboard'
        },
        {
            title: "Organization",
            children: [
                {
                    title: "School",
                    icon: "business",
                    link: "/school"
                },
                {
                    title: "Department",
                    link: "/department",
                    icon: "account_balance"
                },
                {
                    title: "Programme",
                    link: "/programm",
                    icon: "assignment"
                },
                {
                    title: "Semester",
                    link: "/semester",
                    icon: 'content_paste',
                },
                {
                    title: "Division",
                    link: "/division",
                    icon: 'all_inbox',
                },
                {
                    icon: 'supervisor_account',
                    title: 'Students',
                    link: '/students'
                }
            ]
        },
        {
            title: "Fees",
            children: [
                {
                    title: "Fee Type",
                    link: "/feeType",
                    icon: 'table_chart',
                },
                {
                    title: "Fee",
                    link: "/fee",
                    icon: 'list_alt'
                },
                // {
                //     title: "Activie Fee",
                //     link: "/active-fee",
                //     icon: 'fact_check'
                // },
            ]
        },
        {
            title: "Scholarship",
            children: [
                {
                    icon: 'school',
                    title: "Scholarship",
                    link: "/scholarship"
                },
                {
                    icon: 'assignment',
                    title: "Assign Scholarship",
                    link: "/assign"
                }
            ]
        },
        {
            title: "Payment",
            children: [
                {
                    title: "Fee Calculation",
                    icon: 'money',
                    link: "/fee-calculation"
                },
                {
                    title: "Offline Payment",
                    icon: 'payment',
                    link: "/payment/offline"
                },
                {
                    title: "Online Payment",
                    icon: 'payments',
                    link: "/payment/online"
                }
            ]
        },
        {
            title: "Penalty",
            link: "/penalty",
            icon: "account_balance_wallet",
        },
        {
            title: "Admin",
            link: "/admin",
            icon: "admin_panel_settings",
        }
    ]

}