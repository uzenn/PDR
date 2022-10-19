<?php

namespace App\Models\Laporan;

use App\Http\Traits\RecordSignature;
use App\Models\User\UserModel;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderModel extends Model
{
    use RecordSignature, HasRelationships, HasFactory;

    protected $table = 't_order';

    protected $primaryKey = 'id_order';

    public function getAll(
        array $filter,
        int $itemPerPage,
        string $sort
    ): object {
        $dataOrder = $this->query()->with(['orderDet.item', 'user']);

        $sort = $sort ?: 'id_order DESC';
        $dataOrder->orderByRaw($sort);
        $itemPerPage = $itemPerPage > 0 ? $itemPerPage : false;
        return $dataOrder->get();
    }

    public function user()
    {
        return $this->hasOne(UserModel::class, 'id', 'id_user');
    }

    /**
     * Relasi ke ItemModelDet / tabel m_item_det
     *
     * @return void
     */
    public function orderDet()
    {
        return $this->hasMany(OrderDetModel::class, 'id_order', 'id_order');
    }

    public function getLaporanCustomer(
        array $filter,
        int $itemPerPage,
        string $sort
    ) {
        if (!empty($filter['id_bulan']) && !empty($filter['id_tahun'])) {
            $dataTotal = DB::select(
                $this->queryTotalLaporanCustomer(
                    $filter['id_bulan'],
                    $filter['id_tahun'],
                    $filter['user']
                )
            );
            $dataCustomer = DB::select(
                $this->queryLaporanCustomer(
                    $filter['id_bulan'],
                    $filter['id_tahun'],
                    $filter['user']
                )
            );
        }
        $temp = [];
        array_push($temp, $dataTotal);
        array_push($temp, $dataCustomer);
        return $temp;
    }

    public function getPenjualanMenu(
        array $filter,
        int $itemPerPage,
        string $sort
    ) {
        $temp = [];
        if (!empty($filter['kategori'])) {
            switch ($filter['kategori']) {
                case 'food':
                    $menuTotal = DB::select(
                        $this->queryLaporanMenuTotalByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['food']
                        )
                    );
                    $menuFood = DB::select(
                        $this->queryLaporanMenuByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['food']
                        )
                    );
                    $temp = [$menuTotal, $menuFood];
                    break;
                case 'drink':
                    $menuTotal = DB::select(
                        $this->queryLaporanMenuTotalByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['drink']
                        )
                    );
                    $menuDrink = DB::select(
                        $this->queryLaporanMenuByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['drink']
                        )
                    );
                    $temp = [$menuTotal, $menuDrink];
                    break;
                case 'snack':
                    $menuTotal = DB::select(
                        $this->queryLaporanMenuTotalByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['snack']
                        )
                    );
                    $menuSnack = DB::select(
                        $this->queryLaporanMenuByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['snack']
                        )
                    );
                    $temp = [$menuTotal, $menuSnack];
                    break;
                default:
                    $menuTotal = DB::select(
                        $this->queryLaporanMenuTotalByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['food', 'snack', 'drink']
                        )
                    );
                    $menuFood = DB::select(
                        $this->queryLaporanMenuByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['food']
                        )
                    );
                    $menuSnack = DB::select(
                        $this->queryLaporanMenuByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['snack']
                        )
                    );
                    $menuDrink = DB::select(
                        $this->queryLaporanMenuByKategori(
                            $filter['id_bulan'],
                            $filter['id_tahun'],
                            ['drink']
                        )
                    );
                    $temp = [$menuTotal, $menuFood, $menuSnack, $menuDrink];
                    break;
            }
        }

        return $temp;
    }

    /**
     * Laporan Customer
     */
    public function queryTotalLaporanCustomer(
        $month = 6,
        $year = 2022,
        $user = []
    ) {
        $dateLength = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $query = "SELECT 'GRAND TOTAL' AS nama,
        ";
        $test = '';
        for ($i = 0; $i < $dateLength; $i++) {
            $test .=
                ' SUM(CASE WHEN DAY(tanggal)=' .
                ($i + 1) .
                ' AND MONTH(tanggal)=' . $month . ' AND YEAR(tanggal)=' . $year . ' THEN t_order.total_order ELSE 0 END) as tgl' .
                ($i + 1) .
                ',';
        }

        $userQuery = '';
        if (!empty($user)) {
            $userQuery .= 'AND (';
            for ($i = 0; $i < count($user); $i++) {
                $userQuery .=
                    'm_customer.id =' .
                    $user[$i] .
                    ($i + 1 == count($user) ? ' ' : ' OR ');
            }
            $userQuery .= ')';
        }

        $from =
            "
        sum(t_order.total_order) AS total FROM t_order
        JOIN m_customer on t_order.id_user = m_customer.id
        where MONTH(tanggal)= '" .
            $month .
            "' and YEAR(tanggal)= '" .
            $year .
            "' " . $userQuery . " ;";
        $query .= $test . $from;

        return $query;
    }

    /**
     * Laporan Customer
     */
    public function queryLaporanCustomer(
        $month = 6,
        $year = 2022,
        $user = []
    ) {
        $dateLength = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $query = "SELECT m_customer.nama,
        ";
        $test = '';
        for ($i = 0; $i < $dateLength; $i++) {
            $test .=
                ' SUM(CASE WHEN DAY(tanggal)=' .
                ($i + 1) .
                ' AND MONTH(tanggal)=' . $month . ' THEN t_order.total_order ELSE 0 END) as tgl' .
                ($i + 1) .
                ',';
        }
        $userQuery = '';
        if (!empty($user)) {
            $userQuery .= 'WHERE (';
            for ($i = 0; $i < count($user); $i++) {
                $userQuery .=
                    " m_customer.id =" .
                    $user[$i] . " " . ($i + 1 == count($user) ? " " : " OR ");
            }
            $userQuery .= ')';
        }
        $from =
            "
            SUM(CASE WHEN MONTH(tanggal)=" . $month . " AND YEAR(tanggal)=" . $year . " THEN t_order.total_order ELSE 0 END) AS total FROM m_customer
        LEFT JOIN t_order on t_order.id_user = m_customer.id
          " . $userQuery .
            " group by m_customer.nama;";
        $query .= $test . $from;

        return $query;
    }

    /**
     * Laporan Menu
     */
    public function queryLaporanMenuByKategori(
        $month = 6,
        $year = 2022,
        $kategori = ['snack', 'food', 'drink']
    ) {
        $dateLength = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $query = "SELECT IFNULL (m_item.nama,'TOTAL') as nama, m_item.kategori,
        ";
        $test = '';
        for ($i = 0; $i < $dateLength; $i++) {
            $test .=
                ' SUM(CASE WHEN DAY(tanggal)=' .
                ($i + 1) .
                ' AND MONTH(tanggal)= ' . $month . ' AND YEAR(tanggal)=' . $year . ' THEN t_detail_order.total ELSE 0 END) as tgl' .
                ($i + 1) .
                ',';
        }

        $queryKategori = 'where' . ' (';
        for ($i = 0; $i < count($kategori); $i++) {
            $queryKategori .=
                "
            kategori='" .
                $kategori[$i] .
                "'" .
                ($i + 1 == count($kategori) ? '' : 'OR') .
                "
            ";
        }

        $from =
            " 
        SUM(CASE WHEN MONTH(tanggal)=" . $month . " AND YEAR(tanggal)=" . $year . " THEN t_detail_order.total ELSE 0 END) AS total
         FROM m_item
         LEFT JOIN t_detail_order ON t_detail_order.id_item = m_item.id
         LEFT JOIN t_order ON t_detail_order.id_order = t_order.id_order
         " .
            $queryKategori .
            ') group by m_item.nama WITH ROLLUP;';
        $query .= $test . $from;

        return $query;
    }

    /**
     * Laporan Menu
     */
    public function queryLaporanMenuTotalByKategori(
        $month = 6,
        $year = 2022,
        $kategori = ['snack', 'food', 'drink']
    ) {
        $dateLength = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $query = "SELECT 'Grand Total' as nama,
        ";
        $test = '';
        for ($i = 0; $i < $dateLength; $i++) {
            $test .=
                ' SUM(CASE WHEN DAY(tanggal)=' .
                ($i + 1) .
                ' AND MONTH(tanggal)=' . $month . ' AND YEAR(tanggal)=' . $year . ' THEN t_detail_order.total ELSE 0 END) as tgl' .
                ($i + 1) .
                ',';
        }

        $queryKategori = 'and' . ' (';
        for ($i = 0; $i < count($kategori); $i++) {
            $queryKategori .=
                "
            kategori='" .
                $kategori[$i] .
                "'" .
                ($i + 1 == count($kategori) ? '' : 'OR') .
                "
            ";
        }

        $from =
            " 
            SUM(CASE WHEN MONTH(tanggal)= " . $month . " AND YEAR(tanggal)=" . $year . " THEN t_detail_order.total ELSE 0 END) AS total
         FROM t_detail_order
         JOIN m_item ON t_detail_order.id_item = m_item.id
         JOIN t_order ON t_detail_order.id_order = t_order.id_order
        where MONTH(tanggal)= '" .
            $month .
            "' and YEAR(tanggal)= '" .
            $year .
            "' " .
            $queryKategori .
            ')';
        $query .= $test . $from;

        return $query;
    }

    /**
     * Laporan Penjualan
     */
    public function queryRekapLaporan(
        array $filter,
        int $itemPerPage,
        string $sort
    ) {
        $userQuery = '';
        if (!empty($filter['id_user'])) {
            $userQuery =
                "AND t_o.id_user='" . (string) $filter['id_user'] . "'";
        }
        $bulanQuery = '';
        if (!empty($filter['id_bulan'])) {
            $bulanQuery =
                "AND MONTH(t_o.tanggal)='" . (string) $filter['id_bulan'] . "'";
        }
        $tahunQuery = '';
        if (!empty($filter['id_tahun'])) {
            $tahunQuery =
                "AND YEAR(t_o.tanggal)='" . (string) $filter['id_tahun'] . "'";
        }

        $query =
            "SELECT t_o.potongan,t_o.id_order, IFNULL(t_o.no_struk,'Grand Total') as no_struk,c.id as id_user, c.nama as nama_user, t_o.tanggal, (SELECT nominal FROM m_voucher WHERE id_voucher=t_o.id_voucher) voucher, t_o.diskon, t_o.total_bayar FROM t_order t_o, m_customer c, t_detail_order t_d, m_voucher v WHERE t_d.id_order = t_o.id_order and c.id=t_o.id_user " .
            $userQuery .
            ' ' .
            $bulanQuery .
            '' .
            $tahunQuery .
            ' GROUP BY t_o.id_order;';

        $query2 = "SELECT m_item.id,m_item.nama, m_item.harga, t_detail_order.jumlah, t_detail_order.total
        FROM m_item, t_detail_order
        WHERE m_item.id = t_detail_order.id_item  AND t_detail_order.id_order =";

        $dataOrder = DB::select($query);

        for ($i = 0; $i < count($dataOrder); $i++) {
            $dataOrder[$i]->menu = DB::select(
                $query2 . $dataOrder[$i]->id_order
            );
        }
        $tesQuery = DB::select("SELECT t_order.id_order ,t_order.no_struk as no_struk,m_customer.nama as nama_user,t_order.tanggal,m_item.nama as nama_item,t_detail_order.jumlah,m_item.harga,t_detail_order.total,t_order.diskon,t_order.potongan,t_order.total_bayar ,(SELECT nominal FROM m_voucher WHERE id_voucher=t_order.id_voucher) voucher
        from `t_detail_order`
           JOIN t_order ON t_order.id_order = t_detail_order.id_order 
           JOIN m_item ON m_item.id = t_detail_order.id_item 
           JOIN m_customer ON m_customer.id = t_order.id_user;");
        $hasil = collect($tesQuery)->groupBy('id_order');
        return $dataOrder;
    }
}
