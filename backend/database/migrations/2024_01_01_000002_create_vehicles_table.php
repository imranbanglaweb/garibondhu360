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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->string('vehicle_type');
            $table->string('brand');
            $table->string('model');
            $table->integer('year');
            $table->string('color')->nullable();
            $table->integer('capacity');
            $table->string('fuel_type');
            $table->date('purchase_date')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->date('tax_token_expiry')->nullable();
            $table->date('fitness_expiry')->nullable();
            $table->enum('status', ['available', 'in_use', 'maintenance', 'out_of_service'])->default('available');
            $table->integer('current_mileage')->default(0);
            $table->string('image')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
