<?php

namespace App\Http\Requests\Voucher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class UpdateRequest extends FormRequest
{
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'voucher' => 'required',
            'user' => 'required',
            // 'nominal' => 'required',
            'periode_mulai' => 'required',
            'periode_selesai' => 'required',
            // 'type' => 'required',
            'status' => 'required',
            'catatan' => 'required',
            'jumlah' => 'required|min:0|not_in:0'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $this->validator = $validator;
    }
}
