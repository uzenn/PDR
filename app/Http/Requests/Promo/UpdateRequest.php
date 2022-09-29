<?php

namespace App\Http\Requests\Promo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use ProtoneMedia\LaravelMixins\Request\ConvertsBase64ToFiles;

class UpdateRequest extends FormRequest
{
    use ConvertsBase64ToFiles;
    public $validator = null;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    protected function base64FileKeys(): array
    {
        return [
            'foto' => 'fotoPromo.jpg',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nama' => 'required|max:100',
            'type' => 'required',
            'diskon' => 'nullable',
            'nominal' => 'nullable',
            'kadaluarsa' => 'required',
            'syarat_ketentuan' => 'required',
            'foto' => 'nullable|file|image', // Validasi untuk upload file image saja, jika tidak ada perubahan foto user, isi key foto dengan NULL
        ];
    }

    public function failedValidation(Validator $validator)
    {
       $this->validator = $validator;
    }
}
