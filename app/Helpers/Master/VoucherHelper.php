<?php

namespace App\Helpers\Master;

use App\Models\Master\VoucherModel;
use App\Repository\CrudInterface;

/**
 * Helper untuk manajemen promo
 * Mengambil data, menambah, mengubah, & menghapus ke tabel m_promo
 *
 * @author Wahyu Agung <wahyuagung26@gmail.com>
 */
class VoucherHelper implements CrudInterface
{
    private $voucherModel;

    public function __construct()
    {
        $this->voucherModel = new VoucherModel();
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
    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        return $this->voucherModel->getAll($filter, $itemPerPage, $sort);
    }

    /**
     * Mengambil 1 data item dari tabel m_item
     *
     * @param  integer $id id dari tabel m_item
     * @return object
     */
    public function getById(int $id): object
    {
        return $this->voucherModel->getById($id);
    }

    /**
     * method untuk menginput data baru ke tabel m_item
     *
     * @author Wahyu Agung <wahyuagung26@email.com>
     *
     * @param array $payload
     * $payload['nama'] = string
     * $payload['email] = string
     * $payload['is_verified] = string
     *
     * @return void
     */
    public function create(array $payload): array
    {
        try {
            
            if (isset($payload['voucher']) && !empty($payload['voucher'])) {  
                $payload['id_promo'] = $payload['voucher']['id_promo'];
            } else {
                unset($payload['voucher']);
            }
            if (isset($payload['user']) && !empty($payload['user'])) {  
                $payload['id_user'] = $payload['user']['id'];
            } else {
                unset($payload['user']);
            }

            $newVoucher = $this->voucherModel->store($payload);

            return [
                'status' => true,
                'data' => $newVoucher
            ];
        } catch (\Throwable $th) {
            return [
                'status' => false,
                'error' => $th->getMessage()
            ];
        }
    }

    /**
     * method untuk mengubah item pada tabel m_item
     *
     * @author Wahyu Agung <wahyuagung26@email.com>
     *
     * @param array $payload
     * $payload['nama'] = string
     * $payload['email] = string
     * $payload['password] = string
     *
     * @return array
     */
    public function update(array $payload, int $id): array
    {
        try {

            if (isset($payload['voucher']) && !empty($payload['voucher'])) {  
                $payload['id_promo'] = $payload['voucher']['id_promo'];
            } else {
                unset($payload['voucher']);
            }
            if (isset($payload['user']) && !empty($payload['user'])) {  
                $payload['id_user'] = $payload['user']['id'];
            } else {
                unset($payload['user']);
            }

            $this->voucherModel->edit($payload, $id);

            return [
                'status' => true,
                'data' => $this->getById($id)
            ];
        } catch (\Throwable $th) {
            return [
                'status' => false,
                'error' => $th->getMessage()
            ];
        }
    }

    /**
     * Menghapus data item dengan sistem "Soft Delete"
     * yaitu mengisi kolom deleted_at agar data tsb tidak
     * keselect waktu menggunakan Query
     *
     * @param  integer $id id dari tabel m_item
     * 
     * @return bool
     */
    public function delete(int $id): bool
    {
        try {
            $this->voucherModel->drop($id);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
