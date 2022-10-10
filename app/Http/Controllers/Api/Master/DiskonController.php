<?php

namespace App\Http\Controllers\Api\Master;

use App\Helpers\Master\DiskonHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Diskon\CreateRequest;
use App\Http\Requests\Diskon\UpdateRequest;
use App\Http\Resources\Diskon\DiskonCollection;
use App\Http\Resources\Diskon\DiskonResource;
use Illuminate\Http\Request;

class DiskonController extends Controller
{
    private $diskon;

    public function __construct()
    {
        $this->diskon = new DiskonHelper();
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
        $diskon = $this->diskon->getAll($filter, 0, $request->sort ?? '');

        return response()->success($diskon);
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
        
        $dataInput = $request->only(['id_user', 'id_promo', 'status']);
        $dataVoucher = $this->diskon->create($dataInput);
        
        if (!$dataVoucher['status']) {
            return response()->failed($dataVoucher['error'], 422);
        }
        
        return response()->success([], 'Data diskon berhasil disimpan');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $dataVoucher = $this->diskon->getById($id);

        if (empty($dataVoucher)) {
            return response()->failed(['Data diskon tidak ditemukan']);
        }

        return response()->success(new DiskonResource($dataVoucher));
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

        $dataInput = $request->only(['id_diskon', 'id_user', 'id_promo', 'status']);
        $dataVoucher = $this->diskon->update($dataInput, $dataInput['id_diskon']);
        
        if (!$dataVoucher['status']) {
            return response()->failed($dataVoucher['error']);
        }

        return response()->success(new DiskonResource($dataVoucher['data']), 'Data diskon berhasil disimpan');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $dataVoucher = $this->diskon->delete($id);

        if (!$dataVoucher) {
            return response()->failed(['Mohon maaf data diskon tidak ditemukan']);
        }

        return response()->success($dataVoucher);
    }
}
