<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->foreignId('page_id')->nullable()->constrained('pages')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->index(['parent_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
