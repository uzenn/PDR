import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-goal-pdr",
    templateUrl: "./goal-pdr.component.html",
    styleUrls: ["./goal-pdr.component.scss"],
})
export class GoalPDRComponent implements OnInit {
    selectedSemester: any;
    selectedTahun: any;
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
    formApproval: any;
    filter: {
        tahun: string;
        semester: string;
    };

    constructor(private modalService: NgbModal) {
        this.isActive = 2;
        this.isVisible = 1;
        this.contentTab = 1;
        this.competencyTab = 1;
        this.competencySubTab = 1;
        this.listSemester = [
            { id: 1, name: "Semester 1" },
            { id: 2, name: "Semester 2" },
        ];
        this.listTahun = [
            { id: 1, name: "2021" },
            { id: 2, name: "2022" },
        ];
        this.filter = {
            tahun: "2022",
            semester: "Semester 1",
        };
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
    }
    competencySubTabChanged(event) {
        this.competencySubTab = event;
    }
}
