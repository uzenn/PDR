<?php

namespace App\Models\Master;

use App\Http\Traits\RecordSignature;
use App\Repository\ModelInterface;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromoModel extends Model implements ModelInterface
{
    use SoftDeletes, RecordSignature, HasRelationships, HasFactory;

    protected $table = 'm_promo';

    protected $primaryKey = 'id_promo';

    public $timestamps = true;

    protected $attributes = [];

    protected $fillable = [
        'nama',
        'type',
        'diskon',
        'nominal',
        'kadaluarsa',
        'syarat_ketentuan',
        'foto'
    ];

    public function fotoUrl()
    {
        if (empty($this->foto)) {
            return asset('assets/img/no-image.png');
        }

        return asset('storage/' . $this->foto);
    }
    
    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        $promo = $this->query();

        if (!empty($filter['nama'])) {
            $promo->where('nama', 'LIKE', '%'.$filter['nama'].'%');
        }

        if (!empty($filter['type'])) {
            $promo->where('type', 'LIKE', '%'.$filter['type'].'%');
        }

        $sort = $sort ?: 'id_promo DESC';
        $promo->orderByRaw($sort);
        $itemPerPage = ($itemPerPage > 0) ? $itemPerPage : false ;

        return $promo->paginate($itemPerPage)->appends('sort', $sort);
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
