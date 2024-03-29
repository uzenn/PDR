<?php

namespace App\Models\User;

use App\Http\Traits\RecordSignature;
use App\Repository\ModelInterface;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class Model untuk tabel user_auth
 * Dokumentasi Lengkap : https://laravel.com/docs/8.x/eloquent
 * 
 */
class UserModel extends Authenticatable implements JWTSubject, ModelInterface
{
    use SoftDeletes, RecordSignature, HasRelationships;

     /**
     * Menentukan nama tabel yang terhubung dengan Class ini
     *
     * @var string
     */
    protected $table = 'user_auth';

    /**
     * Menentukan primary key, jika nama kolom primary key adalah "id",
     * langkah deklarasi ini bisa dilewati
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Akan mengisi kolom "created_at" dan "updated_at" secara otomatis,
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Mendeklarasikan nilai default dari setiap kolom pada tabel user_auth
     * jika suatu kolom tidak membutuhkan nilai default atau sudah diatur ketika membuat tabel
     * maka deklarasi ini bisa dilewati
     *
     * @var array
     */
    protected $attributes = [
        'user_roles_id' => 1,
    ];

    protected $fillable = [
        'nama',
        'user_roles_id',
        'email',
        'password',
        'foto'
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Payload yang disimpan pada token JWT, jangan tampilkan informasi
     * yang bersifat rahasia pada payload ini untuk mengamankan akun pengguna
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'user' => [
                'id' => $this->id,
                'email' => $this->email,
                'updated_security' => $this->updated_security
            ]
        ];
    }

    /**
     * Relasi ke RoleModel / tabel user_roles
     *
     * @return void
     */
    public function role()
    {
        return $this->hasOne(RoleModel::class, 'id', 'user_roles_id');
    }

    /**
     * Method untuk mengecek apakah user memiliki permission
     *
     * @param  string  $permissionName contoh: user_create / user_update
     * 
     * @return boolean
     */
    public function isHasRole($permissionName) {
        $hakAkses = json_decode($this->role->akses ?? '{}', TRUE);
        $arrAkses = [];
        foreach($hakAkses as $fitur => $val) {
            foreach($val as $key => $akses){
                $arrAkses[$fitur.'_'. $key] = $akses;
            }
        }

        if(isset($arrAkses[$permissionName]) && $arrAkses[$permissionName] === true) {
            return true;
        }

        return false;
    }

    /**
     * Menampilkan foto user dalam bentuk URL
     *
     * @return string
     */
    public function fotoUrl() {
        if(empty($this->foto)) {
            return asset('assets/img/no-image.png');
        } 

        return asset('storage/'.$this->foto);
        // return $this->foto;
    }

    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        $user = $this->query()->with('role');

        if (!empty($filter['nama'])) {
            $user->where('nama', 'LIKE', '%'.$filter['nama'].'%');
        }

        if (!empty($filter['email'])) {
            $user->where('email', 'LIKE', '%'.$filter['email'].'%');
        }

        $sort = $sort ?: 'id DESC';
        $user->orderByRaw($sort);
        $itemPerPage = ($itemPerPage > 0) ? $itemPerPage : false ;

        return $user->paginate($itemPerPage)->appends('sort', $sort);
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
