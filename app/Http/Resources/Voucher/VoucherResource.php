<?php

namespace App\Http\Resources\Voucher;

use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id_voucher' => $this->id_voucher,
            'voucher' => [
                'id_promo' => $this->promo->id_promo,
                'nama' => $this->promo->nama,
                'nominal' => $this->promo->nominal,
                'kadaluarsa' => $this->promo->kadaluarsa,
                'fotoUrl' => $this->promo->fotoUrl()
            ],
            'user' => [
                'id' => $this->user->id,
                'nama' => $this->user->nama
            ],  
            // 'nominal' => $this->nominal,
            'periode_mulai' => $this->periode_mulai,
            'periode_selesai' => $this->periode_selesai,
            // 'type' => $this->type,
            'status' => $this->status,
            'catatan' => $this->catatan,
            'jumlah' => $this->jumlah,
        ];
    }
}
