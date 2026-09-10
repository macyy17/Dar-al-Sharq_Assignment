<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'body',
        'cover_image_path',
        'status',
        'publish_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return ['publish_at' => 'datetime'];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function scopePublishedAndDue(Builder $query): Builder
    {
        return $query
            ->where('status', 'published')
            ->where(fn (Builder $query) => $query
                ->whereNull('publish_at')
                ->orWhere('publish_at', '<=', now()));
    }

    public function getPublishingStateAttribute(): string
    {
        if ($this->status === 'draft') {
            return 'Draft';
        }

        if ($this->publish_at?->isFuture()) {
            return 'Scheduled';
        }

        return 'Published';
    }
}
