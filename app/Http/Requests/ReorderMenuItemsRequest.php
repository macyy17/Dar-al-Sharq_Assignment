<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderMenuItemsRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:menu_items,id'],
            'items.*.position' => ['required', 'integer', 'min:0'],
        ];
    }
}
