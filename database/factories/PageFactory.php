<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Page> */
class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition(): array
    {
        return [
            'title' => fake()->unique()->sentence(3),
            'slug' => fake()->unique()->slug(3),
            'body' => '<p>'.fake()->paragraph().'</p>',
            'blocks' => [],
            'is_home' => false,
            'cover_image_path' => null,
            'status' => 'draft',
            'publish_at' => null,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'deleted_by' => null,
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn () => [
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'publish_at' => now(),
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'publish_at' => now()->addDay(),
        ]);
    }
}
