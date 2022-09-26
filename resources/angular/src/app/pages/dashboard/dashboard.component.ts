import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LandaService } from "src/app/core/services/landa.service";
import { AuthService } from "../auth/services/auth.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private landaService: LandaService,
        private router: Router
    ) {
        if (!this.authService.getToken()) {
            this.router.navigate(["/auth/login"]);
            landaService.alertError(
                "Mohon Maaf",
                "Anda harus login terlebih dahulu"
            );
        }
    }

    ngOnInit(): void {}
}
