<?php

namespace App\Models\Laporan;

use App\Models\Master\ItemModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetModel extends Model
{
    use HasFactory;

    protected $table = 't_detail_order';
    protected $id = 'id_detail';

    public function getAll(
        array $filter,
        int $itemPerPage,
        string $sort
    ): object {
        $dataOrder = $this->query()->with(['item', 'order']);

        $sort = $sort ?: 'id_order DESC';
        $dataOrder->orderByRaw($sort);
        $itemPerPage = $itemPerPage > 0 ? $itemPerPage : false;

        return $dataOrder->paginate($itemPerPage)->appends('sort', $sort);
    }

    public function item()
    {
        return $this->hasOne(ItemModel::class, 'id', 'id_item');
    }

    public function order()
    {
        return $this->hasOne(OrderModel::class, 'id_order', 'id_order');
    }
}