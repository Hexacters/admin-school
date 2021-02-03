import { Injectable } from "@angular/core";



export interface ISideMenu {
    title: string;
    link?: string;
    icon?: string;
    options?: object;
    children?: ISideMenu[];
    role?: string;
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
            role: 'admin'
        },
        {
            title: "Organization",
            role: 'admin',
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
            role: 'admin',
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
                {
                    title: "Activate Fee",
                    link: "/active-fee",
                    icon: 'fact_check'
                },
            ]
        },
        {
            title: "Scholarship",
            role: 'admin',
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
            role: 'admin',
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
            role: 'admin',
            icon: "account_balance_wallet",
        },
        {
            title: "Admin",
            link: "/admin",
            role: 'admin',
            icon: "admin_panel_settings",
        },
        {
            title: "Profile",
            link: "/profile",
            role: 'student',
            icon: "person",
        },
        {
            title: "Fee Details",
            link: "/students/payment",
            role: 'student',
            icon: "money",
        }
    ]

}