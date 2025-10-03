<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Check if columns exist before adding them
            if (!Schema::hasColumn('settings', 'type')) {
                $table->string('type')->default('string');
            }
            if (!Schema::hasColumn('settings', 'group')) {
                $table->string('group')->default('general');
            }
            if (!Schema::hasColumn('settings', 'description')) {
                $table->text('description')->nullable();
            }
            
            // Add indexes if they don't exist
            if (!Schema::hasIndex('settings', ['group'])) {
                $table->index(['group']);
            }
            if (!Schema::hasIndex('settings', ['key', 'group'])) {
                $table->index(['key', 'group']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['type', 'group', 'description']);
            $table->dropIndex(['group']);
            $table->dropIndex(['key', 'group']);
        });
    }
};