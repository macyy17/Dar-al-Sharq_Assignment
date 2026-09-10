<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPrivilegeTest extends TestCase
{
    use RefreshDatabase;

    public function test_privileges_are_resolved_through_role_data(): void
    {
        $this->seed();
        $admin = User::where('email', 'admin@example.com')->firstOrFail();
        $moderator = User::where('email', 'moderator@example.com')->firstOrFail();

        $this->assertTrue($admin->hasPrivilege('users.view'));
        $this->assertTrue($moderator->hasPrivilege('pages.update'));
        $this->assertFalse($moderator->hasPrivilege('pages.delete'));
    }
}
