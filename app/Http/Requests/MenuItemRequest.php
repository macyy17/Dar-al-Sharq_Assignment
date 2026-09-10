<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'page_id' => ['nullable', 'exists:pages,id'],
            'parent_id' => ['nullable', 'exists:menu_items,id', Rule::notIn(array_filter([$this->route('menuItem')?->id]))],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
