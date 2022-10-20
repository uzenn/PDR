<?php

namespace App\Http\Controllers\Api\Laporan;

use App\Helpers\Laporan\LaporanHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Diskon\CreateRequest;
use App\Http\Requests\Diskon\UpdateRequest;
use App\Http\Resources\Diskon\DiskonCollection;
use App\Http\Resources\Diskon\DiskonResource;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    private $laporan;

    public function __construct()
    {
        $this->laporan = new LaporanHelper();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function laporanMenu(Request $request)
    {
        // $filter = [
        //     'periode' => $request->periode ?? '',
        //     'type' => $request->type ?? '',
        // ];
        if (isset($request->filter)) {
            $filter = json_decode($request->filter, true);
        } else {
            $filter = [];
        }
        $laporan = $this->laporan->getPenjualanMenu($filter, 0, $request->sort ?? '');

        return response()->success($laporan);
    }

    public function laporanCustomer(Request $request)
    {
        if (isset($request->filter)) {
            $filter = json_decode($request->filter, true);
        } else {
            $filter = [];
        }
        // dd($request->filter);
        $laporan = $this->laporan->getPenjualanCustomer(
            $filter,
            $request->itemPerPage = 0,
            $request->sort ?? ''
        );
        return response()->success($laporan);
    }

    public function rekapPenjualan(Request $request)
    {
        if (isset($request->filter)) {
            $filter = json_decode($request->filter, true);
        } else {
            $filter = [];
        }

        $laporan = $this->laporan->getRekapPenjualan(
            $filter,
            $request->itemPerPage = 0,
            $request->sort ?? ''
        );
        return response()->success($laporan);
    }
    public function dashboard(Request $request)
    {
        if (isset($request->filter)) {
            $filter = json_decode($request->filter, true);
            $laporan = $this->laporan->getDashboardGraf($filter);
        } else {
            $laporan = $this->laporan->getDashboard();
        }
        return response()->success($laporan);
    }
}
