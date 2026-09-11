<?php

namespace Tests\Unit;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PagePublishingTest extends TestCase
{
    use RefreshDatabase;

    public function test_publishing_state_and_due_scope(): void
    {
        $this->seed();
        Carbon::setTestNow('2026-09-11 12:00:00');
        $user = User::firstOrFail();
        $draft = Page::create(['title' => 'Draft', 'slug' => 'draft', 'status' => 'draft', 'created_by' => $user->id, 'updated_by' => $user->id]);
        $future = Page::create(['title' => 'Future', 'slug' => 'future', 'status' => 'published', 'publish_at' => now()->addMinute(), 'created_by' => $user->id, 'updated_by' => $user->id]);
        $live = Page::create(['title' => 'Live', 'slug' => 'live', 'status' => 'published', 'publish_at' => now(), 'created_by' => $user->id, 'updated_by' => $user->id]);

        $this->assertSame('Draft', $draft->publishing_state);
        $this->assertSame('Scheduled', $future->publishing_state);
        $this->assertSame('Published', $live->publishing_state);
        $home = Page::where('is_home', true)->firstOrFail();
        $this->assertEqualsCanonicalizing([$home->id, $live->id], Page::publishedAndDue()->pluck('id')->all());
    }
}
