<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Helpers\Master\PromoHelper;
use App\Http\Resources\Promo\PromoCollection;
use App\Http\Requests\Promo\CreateRequest;
use App\Http\Requests\Promo\UpdateRequest;
use App\Http\Resources\Promo\PromoResource;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    private $promo;

    public function __construct()
    {
        $this->promo = new PromoHelper();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = [
            'nama' => $request->nama ?? '',
            'type' => $request->type ?? '',
        ];
        $promo = $this->promo->getAll($filter, 5, $request->sort ?? '');

        return response()->success(new PromoCollection($promo));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StorePromoRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateRequest $request)
    {
         /**
        * Menampilkan pesan error ketika validasi gagal
        * pengaturan validasi bisa dilihat pada class app/Http/request/User/CreateRequest
        */
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors(), 422);
        }
        
        $dataInput = $request->only(['nama', 'type', 'diskon', 'nominal', 'kadaluarsa', 'syarat_ketentuan', 'foto']);
        $dataPromo = $this->promo->create($dataInput);
        
        if (!$dataPromo['status']) {
            return response()->failed($dataPromo['error'], 422);
        }
        
        return response()->success([], 'Data promo berhasil disimpan');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $dataPromo = $this->promo->getById($id);

        if (empty($dataPromo)) {
            return response()->failed(['Data promo tidak ditemukan']);
        }

        return response()->success(new PromoResource($dataPromo));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    // public function edit(Promo $promo)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdatePromoRequest  $request
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateRequest $request)
    {
        /**
         * Menampilkan pesan error ketika validasi gagal
         * pengaturan validasi bisa dilihat pada class app/Http/request/User/UpdateRequest
         */
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors());
        }

        $dataInput = $request->only(['id_promo', 'nama', 'type', 'diskon', 'nominal', 'kadaluarsa', 'syarat_ketentuan', 'foto']);
        $dataPromo = $this->promo->update($dataInput, $dataInput['id_promo']);
        
        if (!$dataPromo['status']) {
            return response()->failed($dataPromo['error']);
        }

        return response()->success(new PromoResource($dataPromo['data']), 'Data promo berhasil disimpan');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $dataPromo = $this->promo->delete($id);

        if (!$dataPromo) {
            return response()->failed(['Mohon maaf data promo tidak ditemukan']);
        }

        return response()->success($dataPromo);
    }
}
