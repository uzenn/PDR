<?php

namespace App\Http\Resources\Diskon;

use Illuminate\Http\Resources\Json\JsonResource;

class DiskonResource extends JsonResource
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
            'id_diskon' => $this->id_diskon,
            'diskon' => [
                'id_promo' => $this->promo->id_promo,
                'nama' => $this->promo->nama,
                'diskon' => $this->promo->diskon,
                'kadaluarsa' => $this->promo->kadaluarsa,
                'fotoUrl' => $this->promo->fotoUrl()
            ],
            'user' => [
                'id' => $this->user->id,
                'nama' => $this->user->nama
            ],  
            'status' => $this->status,
        ];
    }
}
