import { Component, Input, OnInit, Output, SimpleChange, EventEmitter } from '@angular/core';

import { LandaService } from 'src/app/core/services/landa.service';
import { RoleService } from '../../../roles/services/role-service.service';

@Component({
    selector: 'role-form',
    templateUrl: './form-roles.component.html',
    styleUrls: ['./form-roles.component.scss']
})
export class FormRolesComponent implements OnInit {
    @Input() roleId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    listAkses: [];
    formModel: {
        id: number,
        nama: string,
        akses: {
            user: {
                create: boolean,
                update: boolean,
                delete: boolean,
                view: boolean,
            },
            roles: {
                create: boolean,
                update: boolean,
                delete: boolean,
                view: boolean,
            },
            customer: {
                create: boolean,
                update: boolean,
                delete: boolean,
                view: boolean,
            },
            item: {
                create: boolean
                update: boolean
                delete: boolean
                view: boolean
            },
            promo: {
                create: boolean
                update: boolean
                delete: boolean
                view: boolean
            },
            diskon: {
                create: boolean
                update: boolean
                delete: boolean
                view: boolean
            },
            voucher: {
                create: boolean
                update: boolean
                delete: boolean
                view: boolean
            },
            laporan_menu: {
                view: boolean
            },
            laporan_customer: {
                view: boolean
            },
            laporan_penjualan: {
                view: boolean
            },
            laporan_dashboard: {
                view: boolean
            },
        },
    }

    constructor(
        private roleService: RoleService,
        private landaService: LandaService
    ) { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    emptyForm() {
        this.mode = 'add';
        this.formModel = {
            id: 0,
            nama: '',
            akses: {
                user: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                roles: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                customer: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                item: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                promo: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                diskon: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                voucher: {
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                },
                laporan_menu: {
                    view: false
                },
                laporan_customer: {
                    view: false
                },
                laporan_penjualan: {
                    view: false
                },
                laporan_dashboard: {
                    view: false
                },
            },
        }

        if (this.roleId > 0) {
            this.mode = 'edit';
            this.getRole(this.roleId);
        }
    }

    getRole(roleId) {
        this.roleService.getRoleById(roleId).subscribe((res: any) => {
            this.formModel.id = res.data.id;
            this.formModel.nama = res.data.nama;
            
            // Detail hak akses
            const akses = res.data.akses;
            for (const key in akses) {
                this.formModel.akses[key] = akses[key];
            }
        }, err => {
            console.log(err);
        });
    }

    save() {
        if (this.mode == 'add') {
            this.roleService.createRole(this.formModel).subscribe((res: any) => {
                this.landaService.alertSuccess('Berhasil', res.message);
                this.afterSave.emit();
            }, err => {
                this.landaService.alertError('Mohon Maaf', err.error.errors);
            });
        } else {
            this.roleService.updateRole(this.formModel).subscribe((res: any) => {
                this.landaService.alertSuccess('Berhasil', res.message);
                this.afterSave.emit();
            }, err => {
                this.landaService.alertError('Mohon Maaf', err.error.errors);
            });
        }
    }
}
