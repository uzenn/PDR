<?php

namespace App\Helpers\Master;

use App\Models\Master\PromoModel;
use App\Repository\CrudInterface;

/**
 * Helper untuk manajemen promo
 * Mengambil data, menambah, mengubah, & menghapus ke tabel m_promo
 *
 * @author Wahyu Agung <wahyuagung26@gmail.com>
 */
class PromoHelper implements CrudInterface
{
    private $promoModel;

    public function __construct()
    {
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
    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        return $this->promoModel->getAll($filter, $itemPerPage, $sort);
    }

    /**
     * Mengambil 1 data item dari tabel m_item
     *
     * @param  integer $id id dari tabel m_item
     * @return object
     */
    public function getById(int $id): object
    {
        return $this->promoModel->getById($id);
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

            /**
             * Jika dalam payload terdapat base64 foto, maka Upload foto ke folder storage/app/upload/fotoItem
             */
            if (!empty($payload['foto'])) {
                /**
                 * Parameter kedua ("gcs") digunakan untuk upload ke Google Cloud Service
                 * jika mau upload di server local, maka tidak usah pakai parameter kedua
                 */
                // $foto = $payload['foto']->store('upload/fotoUser', 'gcs');
                $foto = $payload['foto']->store('upload/fotoPromo');
                $payload['foto'] = $foto;
            }
            if (!empty($payload['type'])) {
                if ($payload['type'] == 'diskon') {
                    $payload['diskon'] = $payload['diskon'] / 100;
                    $payload['nominal'] = null;
                } else {
                    $payload['diskon'] = null;
                }
            }

            $newPromo = $this->promoModel->store($payload);

            return [
                'status' => true,
                'data' => $newPromo
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

            /**
             * Jika dalam payload terdapat base64 foto, maka Upload foto ke folder storage/app/upload/fotoItem
             */
            if (!empty($payload['foto'])) {
                /**
                 * Parameter kedua ("gcs") digunakan untuk upload ke Google Cloud Service
                 * jika mau upload di server local, maka tidak usah pakai parameter kedua
                 */
                // $foto = $payload['foto']->store('upload/fotoUser', 'gcs');
                $foto = $payload['foto']->store('upload/fotoPromo');
                $payload['foto'] = $foto;
            } else {
                unset($payload['foto']); // Jika foto kosong, hapus dari array agar tidak diupdate
            }
            if (!empty($payload['type'])) {
                if ($payload['type'] == 'diskon') {
                    $payload['diskon'] = $payload['diskon'] / 100;
                    $payload['nominal'] = null;
                } else {
                    $payload['diskon'] = null;
                }
            }

            $this->promoModel->edit($payload, $id);

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
            $this->promoModel->drop($id);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
