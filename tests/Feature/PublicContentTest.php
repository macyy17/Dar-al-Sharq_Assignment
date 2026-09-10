<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PublicContentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_public_page_visibility_respects_status_schedule_and_trash(): void
    {
        Carbon::setTestNow('2026-09-11 12:00:00');
        $user = User::firstOrFail();

        $draft = Page::create(['title' => 'Draft', 'slug' => 'draft', 'status' => 'draft', 'created_by' => $user->id, 'updated_by' => $user->id]);
        $future = Page::create(['title' => 'Future', 'slug' => 'future', 'status' => 'published', 'publish_at' => now()->addHour(), 'created_by' => $user->id, 'updated_by' => $user->id]);
        $live = Page::create(['title' => 'Live', 'slug' => 'live', 'status' => 'published', 'publish_at' => now(), 'created_by' => $user->id, 'updated_by' => $user->id]);

        $this->getJson('/api/public/pages/draft')->assertNotFound();
        $this->getJson('/api/public/pages/future')->assertNotFound();
        $this->getJson('/api/public/pages/live')->assertOk();

        Carbon::setTestNow('2026-09-11 13:00:00');
        $this->getJson('/api/public/pages/future')->assertOk();

        $live->delete();
        $this->getJson('/api/public/pages/live')->assertNotFound();
    }

    public function test_public_navigation_preserves_visible_nested_items(): void
    {
        $user = User::firstOrFail();
        $live = Page::create(['title' => 'Live', 'slug' => 'live', 'status' => 'published', 'created_by' => $user->id, 'updated_by' => $user->id]);
        $future = Page::create(['title' => 'Future', 'slug' => 'future', 'status' => 'published', 'publish_at' => now()->addDay(), 'created_by' => $user->id, 'updated_by' => $user->id]);
        $group = MenuItem::create(['label' => 'Company', 'position' => 0]);
        MenuItem::create(['label' => 'Live Page', 'page_id' => $live->id, 'parent_id' => $group->id, 'position' => 0]);
        MenuItem::create(['label' => 'Future Page', 'page_id' => $future->id, 'parent_id' => $group->id, 'position' => 1]);

        $response = $this->getJson('/api/public/navigation')->assertOk();
        $response->assertJsonPath('data.0.label', 'Company')->assertJsonPath('data.0.children.0.url', '/pages/live');
        $this->assertCount(1, $response->json('data.0.children'));
    }
}
