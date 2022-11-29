import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
    ApexDataLabels,
    ApexLegend,
    ApexPlotOptions,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexFill,
    ChartComponent,
    ApexStates,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    states: ApexStates;
};

@Component({
    selector: "app-pdr",
    templateUrl: "./pdr.component.html",
    styleUrls: ["./pdr.component.scss"],
})
export class PDRComponent implements OnInit {
    selectedSemester: any;
    selectedTahun: any;
    chartOptions: Partial<ChartOptions>;
    listAtasan: [] = [];
    contentTab: any;
    isVisible: number;
    isActive: any;
    listDataDoing: any;
    defaultStatus: any;
    model: any;
    toggle: any;
    subTasks: any;
    selectedCompanies: any;
    subtaskModal: any;
    listSemester: any;
    listTahun: any;
    daterange: any;
    options: any;
    competencyTab: number;
    competencySubTab: number;
    growthChartOptions: Partial<ChartOptions>;

    constructor(private modalService: NgbModal) {
        this.pieChart();
        this.isVisible = 1;
        this.contentTab = 1;
        this.competencyTab = 1;
        this.competencySubTab = 1;
    }

    ngOnInit(): void {}

    activeTabs(params) {}
    formModal(modal) {
        this.modalService.open(modal, { backdrop: "static", centered: true });
    }
    formModalXL(modal) {
        this.modalService.open(modal, {
            size: "xl",
            backdrop: "static",
            centered: true,
        });
    }
    contentChanged(event) {
        this.contentTab = event;
    }
    tabChanged(event) {
        this.isVisible = event;
    }
    competencyTabChanged(event) {
        this.competencyTab += event;
        this.competencySubTab = 1;
    }
    competencySubTabChanged(event) {
        this.competencySubTab = event;
    }
    pieChart() {
        this.chartOptions = {
            series: [80],
            chart: {
                height: 130,
                type: "radialBar",
            },
            colors: ["#009AAD"],
            plotOptions: {
                radialBar: {
                    startAngle: -180,
                    endAngle: 180,
                    hollow: {
                        margin: 15,
                        size: "50%",
                    },
                    dataLabels: {
                        // showOn: "always",
                        name: {
                            show: false,
                        },
                        value: {
                            color: "#009AAD",
                            fontWeight: "bold",
                            offsetY: 6,
                            fontSize: "18px",
                            show: true,
                        },
                    },
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "horizontal",
                    gradientToColors: ["#E1F9BF"],
                    stops: [0, 100],
                },
            },
            labels: ["Competency"],
            states: {
                active: {
                    filter: {
                        type: "none" /* none, lighten, darken */,
                    },
                },
                hover: {
                    filter: {
                        type: 'none'
                    }
                },
            },
        };
        this.growthChartOptions = {
            series: [100],
            chart: {
                height: 130,
                type: "radialBar",
            },
            colors: ["#009AAD"],
            plotOptions: {
                radialBar: {
                    startAngle: -180,
                    endAngle: 180,
                    hollow: {
                        margin: 15,
                        size: "50%",
                        image: "../../../../build/assets/images/growth-chart.svg",
                        imageWidth: 45,
                        imageHeight: 45,
                        imageClipped: false,
                    },
                    dataLabels: {
                        // showOn: "always",
                        name: {
                            show: false,
                        },
                        value: {
                            color: "#009AAD",
                            fontWeight: "bold",
                            offsetY: 6,
                            fontSize: "18px",
                            show: false,
                        },
                    },
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "horizontal",
                    gradientToColors: ["#E1F9BF"],
                    stops: [0, 100],
                },
            },
            labels: ["Competency"],
            states: {
                active: {
                    filter: {
                        type: "none" /* none, lighten, darken */,
                    },
                },
                hover: {
                    filter: {
                        type: 'none'
                    }
                },
            },
        };
    }
}
