<?php

namespace App\Helpers\Master;

use App\Models\Master\DiskonModel;
use App\Models\Master\CustomerModel;
use App\Models\Master\PromoModel;
use App\Repository\CrudInterface;

/**
 * Helper untuk manajemen promo
 * Mengambil data, menambah, mengubah, & menghapus ke tabel m_promo
 *
 * @author Wahyu Agung <wahyuagung26@gmail.com>
 */
class DiskonHelper implements CrudInterface
{
    private $diskonModel;

    public function __construct()
    {
        $this->diskonModel = new DiskonModel();
        $this->customerModel = new CustomerModel();
        $this->promoModel = new PromoModel();
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

    public function getAll(array $filter, int $itemPerPage, string $sort): object 
    {
        $data = [];
        $dataDiskon = $this->diskonModel->getAll($filter, $itemPerPage, $sort);
        $dataCustomer = $this->customerModel->getAll([], 0, 'id DESC');
        $dataPromo = $this->promoModel->getAll(
            ['type' => 'diskon'],
            0,
            'id_promo DESC'
        );

        for ($i = 0; $i < count($dataCustomer); $i++) {
            $data[$i] = [
                'id' => $dataCustomer[$i]->id,
                'nama' => $dataCustomer[$i]->nama,
                'diskon' => [],
            ];
            for ($j = 0; $j < count($dataPromo); $j++) {
                $data[$i]['diskon'][$j] = [
                    'id_promo' => $dataPromo[$j]->id_promo,
                    'nama' => $dataPromo[$j]->nama,
                    'id_diskon' => 0,
                    'status' => 0,
                ];
                for ($k = 0; $k < count($dataDiskon); $k++) {
                    if (
                        $dataDiskon[$k]->id_promo == $dataPromo[$j]->id_promo &&
                        $dataDiskon[$k]->id_user == $dataCustomer[$i]->id
                    ) {
                        $data[$i]['diskon'][$j]['status'] =
                            $dataDiskon[$k]->status;
                        $data[$i]['diskon'][$j]['id_diskon'] =
                            $dataDiskon[$k]->id_diskon;
                    }
                }
            }
        }
        return (object) ['list' => $data];
    }


    /**
     * Mengambil 1 data item dari tabel m_item
     *
     * @param  integer $id id dari tabel m_item
     * @return object
     */
    public function getById(int $id): object
    {
        return $this->diskonModel->getById($id);
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
            $newDiskon = $this->diskonModel->store($payload);

            return [
                'status' => true,
                'data' => $newDiskon
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

            $this->diskonModel->edit($payload, $id);

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
            $this->diskonModel->drop($id);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
