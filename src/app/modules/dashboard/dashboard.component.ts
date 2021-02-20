import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UtilityServiceService } from 'src/app/utility-service.service';
import * as moment from 'moment';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexXAxis,
    ApexPlotOptions,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
};

export type ChartOptions2 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
};

export type ChartOptions3 = {
    series: ApexNonAxisChartSeries;
    dataLabels: ApexDataLabels;
    chart: ApexChart;
    legend: ApexLegend;
    responsive: ApexResponsive[];
    labels: any;
};

export type ChartOptions4 = {
    series: ApexNonAxisChartSeries;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild("chart", { static: false }) chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    @ViewChild("chart2", { static: false }) chart2: ChartComponent;
    public chartOptions2: Partial<ChartOptions2>;

    @ViewChild("chart3", { static: false }) chart3: ChartComponent;
    public chartOptions3: Partial<ChartOptions3>;

    @ViewChild("chart4", { static: false }) chart4: ChartComponent;
    public chartOptions4: Partial<ChartOptions4>;

    chartHeads: Array<any> = [];
    chartHeadsValue: Array<any> = [];
    chartProgramme: Array<any> = [];
    chartProgrammeValue: Array<any> = [];
    chartYear: Array<any> = [];
    chartYearValue: Array<any> = [];
    chartPayment: Array<any> = [];
    chartPaymentValue: Array<any> = [];
    total_schools = 0;
    total_departments = 0;
    total_programme = 0;
    total_students = 0;
    colors: string[] = [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
    ]

    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private _dataService: UtilityServiceService,
        private router: Router,
        public dialog: MatDialog
    ) {
        this.chartOptions = {
            series: [
                {
                    name: "Fees",
                    data: this.chartHeadsValue
                }
            ],
            chart: {
                type: "bar",
                height: 350
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: false
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: this.chartHeads
            }
        };
        // bar chart2
        this.chartOptions2 = {
            series: [
                {
                    name: "Fees",
                    data: this.chartProgrammeValue
                }
            ],
            chart: {
                type: "bar",
                height: 350
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: false
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: this.chartProgramme
            }
        };
        // pie chart
        this.chartOptions3 = {
            series: this.chartYearValue,
            chart: {
                width: 300,
                type: "pie"
            },
            legend: {
                position: "bottom"
            },
            labels: this.chartYear,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
        // donut chart
        this.chartOptions4 = {
            series: this.chartPaymentValue,
            chart: {
                width: 300,
                type: "donut"
            },
            legend: {
                position: "bottom"
            },
            labels: this.chartPayment,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }

    ngOnInit() {
        const id = this._dataService.currentUniversity();
        let req;
        if (id) {
            req = {
                universityId: this._dataService.currentUniversity()
            }
        }
        // No of School
        this._dataService.getDashBoardCount(req).subscribe(res => {
            this.total_programme = res.programsCount;
            this.total_departments = res.departmentCount;
            this.total_schools = res.schoolsCount;
            this.total_students = res.studentsCount;
        })

        this._dataService.getDashBoardPaymentMode(req).subscribe(res => {
            console.log('paymentMode');
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                this.chartPaymentValue.push(Math.round(res[i].amountReceived));
                if (res[i].paymentMode == null) {
                    this.chartPayment.push('Others');
                }
                else {
                    this.chartPayment.push(res[i].paymentMode);
                }
            }
            this.chartOptions4 = {
                series: this.chartPaymentValue,
                chart: {
                    type: "donut"
                },
                legend: {
                    position: "bottom"
                },
                dataLabels: {
                    enabled: false
                },
                labels: this.chartPayment,
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                ]
            };
        })

        this._dataService.getDashBoardMonthly(req).subscribe(res => {
            console.log('Monthly');
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                this.chartYearValue.push(res[i].amountReceived);
                let d = moment(res[i].paymentReceivedOn).format('MMM YYYY');
                this.chartYear.push(d);
            }
            this.chartOptions3 = {
                series: this.chartYearValue,
                chart: {
                    type: "pie"
                },
                dataLabels: {
                    enabled: false
                },
                labels: this.chartYear,
                legend: {
                    position: "bottom"
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                ]
            };
        })

        this._dataService.getDashBoardPrograms(req).subscribe(res => {
            console.log('Program');
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                this.chartProgramme.push(res[i].programName);
                this.chartProgrammeValue.push(res[i].fee);
            }
            // bar chart2
            this.chartOptions2 = {
                series: [
                    {
                        name: "Fees",
                        data: this.chartProgrammeValue
                    }
                ],
                chart: {
                    type: "bar",
                    height: 300
                },
                plotOptions: {
                    bar: {
                        distributed: true,
                        horizontal: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: this.chartProgramme
                }
            };
        })

        this._dataService.getDashBoardTopTypes(req).subscribe(res => {
            console.log('Types');
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                this.chartHeads.push(res[i].type);
                this.chartHeadsValue.push(res[i].fee);
            }
            this.chartOptions = {
                series: [
                    {
                        name: "Fees",
                        data: this.chartHeadsValue
                    }
                ],
                chart: {
                    type: "bar",
                    height: 300
                },
                plotOptions: {
                    bar: {
                        distributed: true,
                        horizontal: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: this.chartHeads
                }
            };
        })
    }
    ngAfterViewInit() {
    }

}
