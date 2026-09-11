<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MenuManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_create_update_nest_and_reorder_menu_items(): void
    {
        Sanctum::actingAs(User::where('email', 'admin@example.com')->firstOrFail());
        $a = $this->postJson('/api/menu-items', ['label' => 'A'])->assertCreated()->json('data');
        $b = $this->postJson('/api/menu-items', ['label' => 'B'])->assertCreated()->json('data');

        $this->patchJson('/api/menu-items/'.$b['id'], [
            'label' => 'B child',
            'parent_id' => $a['id'],
            'page_id' => null,
            'position' => 0,
        ])->assertOk()->assertJsonPath('data.parent_id', $a['id']);

        $this->patchJson('/api/menu-items/'.$a['id'], [
            'label' => 'A',
            'parent_id' => $a['id'],
            'page_id' => null,
            'position' => 0,
        ])->assertUnprocessable();

        $this->putJson('/api/menu-items/reorder', ['items' => [
            ['id' => $a['id'], 'parent_id' => null, 'position' => 1],
            ['id' => $b['id'], 'parent_id' => null, 'position' => 0],
        ]])->assertOk();

        $this->assertSame(1, MenuItem::findOrFail($a['id'])->position);
        $this->assertSame(0, MenuItem::findOrFail($b['id'])->position);
        $this->assertNull(MenuItem::findOrFail($b['id'])->parent_id);
    }

    public function test_moderator_cannot_manage_menu_items(): void
    {
        Sanctum::actingAs(User::where('email', 'moderator@example.com')->firstOrFail());
        $this->getJson('/api/menu-items')->assertForbidden();
    }
}
