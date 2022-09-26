import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    SimpleChange
} from "@angular/core";

import { LandaService } from "src/app/core/services/landa.service";
import { UserService } from "../master/users/services/user-service.service";
import { AuthService } from "../auth/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
    @Output() afterSave  = new EventEmitter<boolean>();
    formModel: {
        id: number;
        nama: string;
        akses: {
            id: number;
            nama: string;
        };
        foto: string;
        fotoUrl: string;
        email: string;
        password: string;
        // confirm_password: string;
    };

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private landaService: LandaService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.getProfile();
    }

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    emptyForm() {
        this.formModel = {
            id: 0,
            nama: "",
            akses: {
                id: 0,
                nama: "",
            },
            foto: "",
            fotoUrl: "",
            email: "",
            password: "",
            // confirm_password: ""
        };
    }

    save() {
        this.userService.updateUser(this.formModel).subscribe(
            (res: any) => {
                if (this.formModel.password) {
                    this.authService.logout();
                    this.router.navigate(["/auth/login"]);
                    this.landaService.alertSuccess("Berhasil", res.message + ". Silakan login kembali");
                } else {
                    this.landaService.alertSuccess("Berhasil", res.message);
                }
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
        // $('#dataTable').DataTable().ajax.reload();
    }
    
    getProfile() {
        this.authService.getProfile().subscribe(
            (res: any) => {
                this.formModel = res;
                console.log(this.formModel);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    // getRole() {
    //     this.roleService.getRoles([]).subscribe((res: any) => {
    //         this.listAkses = res.data.list;
    //     }, err => {
    //         console.log(err);
    //     })
    // }

    onSelectedImage(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.formModel.foto = reader.result.toString();
                this.formModel.fotoUrl = event.target.result as string;
            };
        }
    }
}
