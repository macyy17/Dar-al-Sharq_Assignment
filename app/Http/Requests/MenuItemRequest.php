<?php

namespace App\Http\Requests;

use App\Models\MenuItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $routeItem = $this->route('menuItem');
        $currentId = $routeItem instanceof MenuItem ? $routeItem->id : (is_numeric($routeItem) ? (int) $routeItem : null);

        return [
            'label' => ['required', 'string', 'max:255'],
            'page_id' => ['nullable', 'exists:pages,id'],
            'parent_id' => ['nullable', 'exists:menu_items,id', Rule::notIn(array_filter([$currentId]))],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
