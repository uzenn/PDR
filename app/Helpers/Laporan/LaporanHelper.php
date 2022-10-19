<?php

namespace App\Helpers\Laporan;

use App\Models\Master\DiskonModel;
use App\Models\Master\CustomerModel;
use App\Models\Master\PromoModel;
use App\Models\Laporan\OrderModel;
use App\Models\Laporan\OrderDetModel;
use App\Models\Master\ItemModel;

/**
 * Helper untuk manajemen promo
 * Mengambil data, menambah, mengubah, & menghapus ke tabel m_promo
 *
 * @author Wahyu Agung <wahyuagung26@gmail.com>
 */
class LaporanHelper
{
    protected $orderModel;
    protected $itemModel;
    protected $orderDetail;

    public function __construct()
    {
        $this->orderModel = new OrderModel();
        $this->itemModel = new ItemModel();
        $this->orderDetailModel = new OrderDetModel();
    }

    /**
     * Mengambil data item dari tabel m_item
     *
     * @author Wahyu Agung <wahyuagung26@gmail.com>
     *
     * @param  array $filter
     * $filter['nama'] = string
     * $filter['email'] = string
     * @param integer $itemPerPage jumlah data yang tampil dalam 1 halaman, kosongi jika ingin menampilkan semua data
     * @param string $sort nama kolom untuk melakukan sorting mysql beserta tipenya DESC / ASC
     *
     * @return object
     */
    // public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    // {
    //     return $this->diskonModel->getAll($filter, $itemPerPage, $sort);
    // }

    public function getPenjualanCustomer(
        array $filter,
        int $itemPerPage = 0,
        string $sort
    ) {
        return $this->orderModel->getLaporanCustomer(
            $filter,
            $itemPerPage,
            $sort
        );
    }

    public function getPenjualanMenu(
        array $filter,
        int $itemPerPage = 0,
        string $sort
    ) {
        cal_days_in_month(CAL_GREGORIAN, $filter['id_bulan'], $filter['id_tahun']);
        return $this->orderModel->getPenjualanMenu(
            $filter,
            $itemPerPage,
            $sort
        );
    }

    public function getRekapPenjualan(
        array $filter,
        int $itemPerPage = 0,
        string $sort
    ) {
        $temp = [];
        $dataDetOrder = $this->orderDetailModel->getAll(
            $filter,
            $itemPerPage,
            $sort
        );
        return $this->orderModel->queryRekapLaporan(
            $filter,
            $itemPerPage,
            $sort
        );
    }
}
