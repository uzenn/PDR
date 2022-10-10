<?php

namespace App\Models\Master;

use App\Http\Traits\RecordSignature;
use App\Repository\ModelInterface;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiskonModel extends Model implements ModelInterface
{
    use SoftDeletes, RecordSignature, HasRelationships, HasFactory;

    protected $table = 'm_diskon';

    protected $primaryKey = 'id_diskon';

    public $timestamps = true;

    protected $attributes = [
        'status' => 0
    ];

    protected $fillable = [
        'id_promo',
        'id_user',
        'status'
    ];

    public function promo()
    {
        return $this->hasOne(PromoModel::class, 'id_promo', 'id_promo');
    }
    public function user()
    {
        return $this->hasOne(CustomerModel::class, 'id', 'id_user');
    }

    public function fotoUrl()
    {
        if (empty($this->foto)) {
            return asset('assets/img/no-image.png');
        }

        return asset('storage/' . $this->foto);
    }
    
    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        $diskon = $this->query();

        if (!empty($filter['nama'])) {
            $diskon->where('nama', 'LIKE', '%'.$filter['nama'].'%');
        }

        $sort = $sort ?: 'id_diskon DESC';
        $diskon->orderByRaw($sort);
        $itemPerPage = ($itemPerPage > 0) ? $itemPerPage : false ;

        return $diskon->paginate($itemPerPage)->appends('sort', $sort);
    }

    public function getById(int $id): object
    {
        return $this->find($id);
    }

    public function store(array $payload){
        return $this->create($payload);
    }

    public function edit(array $payload, int $id){
        return $this->find($id)->update($payload);
    }

    public function drop(int $id) {
        return $this->find($id)->delete();
    }
}
