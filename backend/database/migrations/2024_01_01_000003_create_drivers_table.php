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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable()->unique();
            $table->string('license_number')->unique();
            $table->date('license_expiry');
            $table->string('nid_number')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->date('join_date')->nullable();
            $table->enum('status', ['available', 'on_trip', 'off_duty'])->default('available');
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->string('avatar')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
