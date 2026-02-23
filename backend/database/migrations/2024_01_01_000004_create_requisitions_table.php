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
        Schema::create('requisitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('driver_id')->nullable()->constrained()->onDelete('set null');
            $table->string('requisition_number')->unique();
            $table->string('department');
            $table->text('purpose');
            $table->string('pickup_location');
            $table->string('destination');
            $table->date('travel_date');
            $table->date('return_date')->nullable();
            $table->integer('passengers');
            $table->enum('status', ['pending', 'department_head_approved', 'transport_admin_approved', 'approved', 'rejected', 'completed', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('department_head_approved_by')->nullable();
            $table->timestamp('department_head_approved_at')->nullable();
            $table->unsignedBigInteger('transport_admin_approved_by')->nullable();
            $table->timestamp('transport_admin_approved_at')->nullable();
            $table->unsignedBigInteger('rejected_by')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->integer('trip_start_mileage')->nullable();
            $table->integer('trip_end_mileage')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('department_head_approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('transport_admin_approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('rejected_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requisitions');
    }
};
