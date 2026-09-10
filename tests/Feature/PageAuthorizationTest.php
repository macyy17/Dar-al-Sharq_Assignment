<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_create_delete_restore_and_force_delete_page(): void
    {
        $admin = User::where('email', 'admin@example.com')->firstOrFail();
        Sanctum::actingAs($admin);

        $created = $this->postJson('/api/pages', [
            'title' => 'Scheduled Story',
            'slug' => 'scheduled-story',
            'body' => '<p>Initial content</p>',
            'status' => 'published',
            'publish_at' => now()->addDay()->toIso8601String(),
        ])->assertCreated();

        $id = $created->json('data.id');
        $this->assertSame('Scheduled', $created->json('data.publishing_state'));

        $this->deleteJson("/api/pages/{$id}")->assertNoContent();
        $this->getJson('/api/pages/trash')->assertOk()->assertJsonFragment(['id' => $id]);
        $this->postJson("/api/pages/{$id}/restore")->assertOk();
        $this->deleteJson("/api/pages/{$id}")->assertNoContent();
        $this->deleteJson("/api/pages/{$id}/force")->assertNoContent();
    }

    public function test_moderator_can_create_and_update_but_cannot_delete(): void
    {
        $moderator = User::where('email', 'moderator@example.com')->firstOrFail();
        Sanctum::actingAs($moderator);

        $created = $this->postJson('/api/pages', [
            'title' => 'Moderator Draft',
            'slug' => 'moderator-draft',
            'status' => 'draft',
        ])->assertCreated();

        $id = $created->json('data.id');

        $this->patchJson("/api/pages/{$id}", [
            'title' => 'Moderator Updated',
            'slug' => 'moderator-draft',
            'status' => 'published',
        ])->assertOk();

        $this->deleteJson("/api/pages/{$id}")->assertForbidden();
    }
}
