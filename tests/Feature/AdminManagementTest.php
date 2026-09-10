<?php

namespace Tests\Feature;

use App\Models\Privilege;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_manage_users_roles_and_privileges(): void
    {
        $admin = User::where('email', 'admin@example.com')->firstOrFail();
        Sanctum::actingAs($admin);

        $privilege = $this->postJson('/api/privileges', ['name' => 'reports.view', 'group' => 'Reports', 'description' => 'View reports.'])
            ->assertCreated()->json('data');

        $role = $this->postJson('/api/roles', ['name' => 'Reporter', 'description' => 'Reporting role', 'privilege_ids' => [$privilege['id']]])
            ->assertCreated()->json('data');

        $user = $this->postJson('/api/users', [
            'name' => 'Report User', 'email' => 'report@example.com', 'password' => 'password123',
            'role_id' => $role['id'], 'is_active' => true,
        ])->assertCreated()->json('data');

        $this->patchJson('/api/users/'.$user['id'], [
            'name' => 'Updated Report User', 'email' => 'report@example.com', 'role_id' => $role['id'], 'is_active' => false,
        ])->assertOk()->assertJsonPath('data.status', 'Suspended');

        $this->deleteJson('/api/roles/'.$role['id'])->assertStatus(409);
        $this->deleteJson('/api/users/'.$user['id'])->assertNoContent();
        $this->deleteJson('/api/roles/'.$role['id'])->assertNoContent();
        $this->deleteJson('/api/privileges/'.$privilege['id'])->assertNoContent();
    }

    public function test_moderator_cannot_manage_administration_resources(): void
    {
        Sanctum::actingAs(User::where('email', 'moderator@example.com')->firstOrFail());

        $this->getJson('/api/users')->assertForbidden();
        $this->getJson('/api/roles')->assertForbidden();
        $this->getJson('/api/privileges')->assertForbidden();
    }
}
