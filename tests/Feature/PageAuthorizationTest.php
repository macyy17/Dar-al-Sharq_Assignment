<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\Privilege;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_admin_can_create_publish_delete_restore_and_force_delete_page(): void
    {
        $admin = User::where('email', 'admin@example.com')->firstOrFail();
        Sanctum::actingAs($admin);

        $created = $this->postJson('/api/pages', [
            'title' => 'Scheduled Story',
            'slug' => 'scheduled-story',
            'status' => 'published',
            'publish_at' => now()->addDay()->toIso8601String(),
        ])->assertCreated();

        $id = $created->json('data.id');
        $this->assertSame('Scheduled', $created->json('data.publishing_state'));
        $this->assertDatabaseHas('pages', ['id' => $id, 'created_by' => $admin->id, 'updated_by' => $admin->id]);

        $this->deleteJson("/api/pages/{$id}")->assertNoContent();
        $this->getJson('/api/pages/trash')->assertOk()->assertJsonFragment(['id' => $id]);
        $this->postJson("/api/pages/{$id}/restore")->assertOk();
        $this->deleteJson("/api/pages/{$id}")->assertNoContent();
        $this->deleteJson("/api/pages/{$id}/force")->assertNoContent();
        $this->assertDatabaseMissing('pages', ['id' => $id]);
    }

    public function test_moderator_can_create_and_update_but_cannot_delete_or_access_trash(): void
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
        ])->assertOk()->assertJsonPath('data.publishing_state', 'Published');

        $this->deleteJson("/api/pages/{$id}")->assertForbidden();
        $this->getJson('/api/pages/trash')->assertForbidden();
    }

    public function test_page_listing_supports_search_and_derived_status_filters(): void
    {
        $admin = User::where('email', 'admin@example.com')->firstOrFail();
        Page::create(['title' => 'Alpha Draft', 'slug' => 'alpha-draft', 'status' => 'draft', 'created_by' => $admin->id, 'updated_by' => $admin->id]);
        Page::create(['title' => 'Alpha Future', 'slug' => 'alpha-future', 'status' => 'published', 'publish_at' => now()->addDay(), 'created_by' => $admin->id, 'updated_by' => $admin->id]);
        Page::create(['title' => 'Beta Live', 'slug' => 'beta-live', 'status' => 'published', 'created_by' => $admin->id, 'updated_by' => $admin->id]);
        Sanctum::actingAs($admin);

        $this->getJson('/api/pages?search=Alpha')->assertOk()->assertJsonCount(2, 'data');
        $this->getJson('/api/pages?status=scheduled')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Alpha Future');
        $this->getJson('/api/pages?status=published')->assertOk()->assertJsonFragment(['title' => 'Beta Live']);
    }

    public function test_authorized_editor_can_upload_inline_page_image(): void
    {
        Storage::fake('public');
        $admin = User::where('email', 'admin@example.com')->firstOrFail();
        Sanctum::actingAs($admin);

        $response = $this->post('/api/editor/images', [
            'upload' => UploadedFile::fake()->image('inline.jpg', 1200, 800),
        ], ['Accept' => 'application/json'])->assertCreated();

        $this->assertStringStartsWith('/storage/page-content/', $response->json('url'));
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $response->json('url')));
    }

    public function test_removing_privilege_immediately_revokes_access(): void
    {
        $admin = User::where('email', 'admin@example.com')->with('role')->firstOrFail();
        Sanctum::actingAs($admin);
        $this->getJson('/api/pages')->assertOk();

        $privilege = Privilege::where('name', 'pages.view')->firstOrFail();
        $admin->role->privileges()->detach($privilege);

        $this->getJson('/api/pages')->assertForbidden();
    }
}
