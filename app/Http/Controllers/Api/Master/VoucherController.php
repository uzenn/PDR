<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Helpers\Master\VoucherHelper;
use App\Http\Requests\Voucher\CreateRequest;
use App\Http\Requests\Voucher\UpdateRequest;
use App\Http\Resources\Voucher\VoucherCollection;
use App\Http\Resources\Voucher\VoucherResource;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    private $voucher;

    public function __construct()
    {
        $this->voucher = new VoucherHelper();
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
        $voucher = $this->voucher->getAll($filter, 5, $request->sort ?? '');

        return response()->success(new VoucherCollection($voucher));
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
        
        $dataInput = $request->only(['voucher', 'user', 'periode_mulai', 'periode_selesai', 'status', 'catatan', 'jumlah']);
        $dataVoucher = $this->voucher->create($dataInput);
        
        if (!$dataVoucher['status']) {
            return response()->failed($dataVoucher['error'], 422);
        }
        
        return response()->success([], 'Data voucher berhasil disimpan');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $dataVoucher = $this->voucher->getById($id);

        if (empty($dataVoucher)) {
            return response()->failed(['Data voucher tidak ditemukan']);
        }

        return response()->success(new VoucherResource($dataVoucher));
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

        $dataInput = $request->only(['id_voucher', 'voucher', 'user', 'periode_mulai', 'periode_selesai', 'status', 'catatan', 'jumlah']);
        $dataVoucher = $this->voucher->update($dataInput, $dataInput['id_voucher']);
        
        if (!$dataVoucher['status']) {
            return response()->failed($dataVoucher['error']);
        }

        return response()->success(new VoucherResource($dataVoucher['data']), 'Data voucher berhasil disimpan');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Promo  $promo
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $dataVoucher = $this->voucher->delete($id);

        if (!$dataVoucher) {
            return response()->failed(['Mohon maaf data voucher tidak ditemukan']);
        }

        return response()->success($dataVoucher);
    }
}
