import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class PromoService {

  constructor(private landaService: LandaService) { }

    getPromo(arrParameter) {
        return this.landaService.DataGet('/v1/promo', arrParameter);
    }

    getPromoVoucher(arrParameter) {
        return this.landaService.DataGet('/v1/promo/voucher', arrParameter);
    }

    getPromoDiskon(arrParameter) {
        return this.landaService.DataGet('/v1/promo/diskon', arrParameter);
    }

    getPromoById(promoId) {
        return this.landaService.DataGet('/v1/promo/' + promoId);
    }

    createPromo(payload) {
        return this.landaService.DataPost('/v1/promo', payload);
    }

    updatePromo(payload) {
        return this.landaService.DataPut('/v1/promo', payload);
    }

    deletePromo(promoId) {
        return this.landaService.DataDelete('/v1/promo/' + promoId);
    }
}
