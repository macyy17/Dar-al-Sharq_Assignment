<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_login_and_read_privileges(): void
    {
        $response = $this->postJson('/api/auth/login', ['email' => 'admin@example.com', 'password' => 'password']);

        $response->assertOk()->assertJsonPath('data.email', 'admin@example.com');
        $this->getJson('/api/auth/me')->assertOk()->assertJsonPath('data.role.name', 'Admin');
        $this->assertContains('users.view', $this->getJson('/api/auth/me')->json('data.privileges'));
    }

    public function test_invalid_and_inactive_users_cannot_login(): void
    {
        $this->postJson('/api/auth/login', ['email' => 'admin@example.com', 'password' => 'wrong-password'])->assertUnprocessable();

        $user = User::where('email', 'moderator@example.com')->firstOrFail();
        $user->update(['is_active' => false]);

        $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'password'])->assertUnprocessable();
    }

    public function test_guest_cannot_read_authenticated_identity(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_logout_invalidates_session(): void
    {
        $this->postJson('/api/auth/login', ['email' => 'admin@example.com', 'password' => 'password'])->assertOk();
        $this->postJson('/api/auth/logout')->assertOk();
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_seeded_moderator_has_only_page_work_privileges(): void
    {
        $role = Role::where('name', 'Moderator')->with('privileges')->firstOrFail();
        $this->assertEqualsCanonicalizing(['pages.view', 'pages.create', 'pages.update'], $role->privileges->pluck('name')->all());
    }
}
