import { Injectable } from "@angular/core";



export interface ISideMenu {
    title: string;
    link?: string;
    icon?: string;
    options?: object;
    children?: ISideMenu[];
    role?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class SidebarMenuService {

    public menus: ISideMenu[] = [
        {
            title: 'dashboard',
            link: '/dashboard',
            icon: 'dashboard',
            role: ['admin', 'superAdmin']
        },
        {
            title: "Organization",
            role: ['admin', 'superAdmin'],
            children: [
                {
                    title: "University",
                    icon: "cast_for_education",
                    link: "/university",
                    role: ['superAdmin'],
                },
                {
                    title: "School",
                    icon: "business",
                    link: "/school",
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Department",
                    link: "/department",
                    icon: "account_balance",
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Programme",
                    link: "/programm",
                    icon: "assignment",
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Semester",
                    link: "/semester",
                    icon: 'content_paste',
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Division",
                    link: "/division",
                    icon: 'all_inbox',
                    role: ['admin', 'superAdmin'],
                },
                {
                    icon: 'supervisor_account',
                    title: 'Students',
                    link: '/students',
                    role: ['admin', 'superAdmin'],
                }
            ]
        },
        {
            title: "Fees",
            role: ['admin', 'superAdmin'],
            children: [
                {
                    title: "Fee Type",
                    link: "/feeType",
                    icon: 'table_chart',
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Fee",
                    link: "/fee",
                    icon: 'list_alt',
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Activate Fee",
                    link: "/active-fee",
                    icon: 'fact_check',
                    role: ['admin', 'superAdmin'],
                },
            ]
        },
        {
            title: "Scholarship",
            role: ['admin', 'superAdmin'],
            children: [
                {
                    icon: 'school',
                    title: "Scholarship",
                    link: "/scholarship",
                    role: ['admin', 'superAdmin'],
                },
                {
                    icon: 'assignment',
                    title: "Assign Scholarship",
                    link: "/assign",
                    role: ['admin', 'superAdmin'],
                }
            ]
        },
        {
            title: "Payment",
            role: ['admin', 'superAdmin'],
            children: [
                {
                    title: "Fee Calculation",
                    icon: 'money',
                    link: "/fee-calculation",
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Offline Payment",
                    icon: 'payment',
                    link: "/payment/offline",
                    role: ['admin', 'superAdmin'],
                },
                {
                    title: "Online Payment",
                    icon: 'payments',
                    link: "/payment/online",
                    role: ['others'],
                }
            ]
        },
        {
            title: "Penalty",
            link: "/penalty",
            role: ['admin', 'superAdmin'],
            icon: "account_balance_wallet",
        },
        {
            title: "Admin",
            link: "/admin",
            role: ['admin', 'superAdmin'],
            icon: "admin_panel_settings",
        },
        {
            title: "Profile",
            link: "/profile",
            role: ['student'],
            icon: "person",
        },
        {
            title: "Fee Details",
            link: "/students/payment",
            role: ['student'],
            icon: "money",
        },
        {
            title: "Reports",
            link: "/reports",
            role: ['admin', 'superAdmin'],
            icon: "list_alt",
        }
    ]

}