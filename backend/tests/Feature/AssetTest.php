<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AssetTest extends TestCase
{
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'inventory_manager', 'guard_name' => 'web']);
        Role::create(['name' => 'asset_holder', 'guard_name' => 'web']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    // --- Auth ---

    public function test_listing_assets_requires_auth(): void
    {
        $this->getJson('/api/assets')
            ->assertUnauthorized();
    }

    // --- Create ---

    public function test_creating_an_asset_with_valid_data(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'name' => 'Servidor HP ProLiant',
                'category' => 'server',
                'brand' => 'HP',
                'model' => 'ProLiant DL380',
                'serial' => 'SRV-001-2024',
                'campus' => 'Bucaramanga',
                'status' => 'new',
            ]);

        $response->assertCreated()
            ->assertJsonPath('name', 'Servidor HP ProLiant')
            ->assertJsonPath('category', 'server')
            ->assertJsonPath('brand', 'HP')
            ->assertJsonPath('serial', 'SRV-001-2024');

        $this->assertDatabaseHas('assets', [
            'name' => 'Servidor HP ProLiant',
            'serial' => 'SRV-001-2024',
        ]);
    }

    public function test_creating_an_asset_generates_asset_code(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'name' => 'Laptop Dell XPS',
                'category' => 'laptop',
                'brand' => 'Dell',
                'status' => 'operational',
            ]);

        $response->assertCreated();

        $assetCode = $response->json('asset_code');
        $this->assertNotNull($assetCode);
        $this->assertStringStartsWith('UTS-', $assetCode);
    }

    public function test_creating_asset_requires_name(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'category' => 'laptop',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_creating_asset_requires_category(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'name' => 'Asset sin categoria',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('category');
    }

    public function test_creating_asset_validates_category_enum(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'name' => 'Asset invalido',
                'category' => 'invalid_category',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('category');
    }

    public function test_creating_asset_with_holder(): void
    {
        $holder = User::factory()->create();
        $holder->assignRole('asset_holder');

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'name' => 'Monitor LG',
                'category' => 'monitor',
                'holder_id' => $holder->id,
                'status' => 'operational',
            ]);

        $response->assertCreated()
            ->assertJsonPath('holder_id', $holder->id);

        // Verify holder relationship is loaded
        $this->assertNotNull($response->json('holder'));
        $this->assertEquals($holder->id, $response->json('holder.id'));
    }

    // --- Read ---

    public function test_listing_assets_returns_paginated_data(): void
    {
        Asset::create([
            'name' => 'Laptop Dell',
            'category' => 'laptop',
            'status' => 'operational',
        ]);

        Asset::create([
            'name' => 'Impresora HP',
            'category' => 'printer',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/assets');

        $response->assertOk()
            ->assertJsonStructure(['data', 'current_page', 'per_page', 'total']);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_show_asset_detail(): void
    {
        $asset = Asset::create([
            'name' => 'Servidor Principal',
            'category' => 'server',
            'brand' => 'Dell',
            'model' => 'PowerEdge R740',
            'serial' => 'SVR-2024-001',
            'campus' => 'Bucaramanga',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/assets/{$asset->id}");

        $response->assertOk()
            ->assertJsonPath('id', $asset->id)
            ->assertJsonPath('name', 'Servidor Principal')
            ->assertJsonPath('serial', 'SVR-2024-001')
            ->assertJsonStructure([
                'id', 'asset_code', 'name', 'category', 'brand',
                'model', 'serial', 'campus', 'status',
                'holder', 'comments', 'attachments',
            ]);
    }

    // --- Update ---

    public function test_updating_an_asset(): void
    {
        $asset = Asset::create([
            'name' => 'Laptop Original',
            'category' => 'laptop',
            'brand' => 'Lenovo',
            'status' => 'operational',
            'campus' => 'Piedecuesta',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/assets/{$asset->id}", [
                'name' => 'Laptop Actualizada',
                'brand' => 'Dell',
                'campus' => 'Bucaramanga',
            ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Laptop Actualizada')
            ->assertJsonPath('brand', 'Dell')
            ->assertJsonPath('campus', 'Bucaramanga');

        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'name' => 'Laptop Actualizada',
            'brand' => 'Dell',
        ]);
    }

    public function test_updating_asset_status(): void
    {
        $asset = Asset::create([
            'name' => 'Equipo a dar de baja',
            'category' => 'pc',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/assets/{$asset->id}", [
                'status' => 'damaged',
            ]);

        $response->assertOk()
            ->assertJsonPath('status', 'damaged');
    }

    // --- Delete (soft delete) ---

    public function test_deleting_an_asset_soft_deletes(): void
    {
        $asset = Asset::create([
            'name' => 'Asset para eliminar',
            'category' => 'monitor',
            'status' => 'retired',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/assets/{$asset->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Activo eliminado correctamente.');

        $this->assertSoftDeleted('assets', ['id' => $asset->id]);
        $this->assertNull(Asset::find($asset->id));
        $this->assertNotNull(Asset::withTrashed()->find($asset->id));
    }

    // --- Unique serial validation ---

    public function test_creating_asset_with_duplicate_serial_fails(): void
    {
        Asset::create([
            'name' => 'Asset existente',
            'category' => 'laptop',
            'serial' => 'SERIAL-UNICO-001',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/assets', [
                'name' => 'Nuevo asset',
                'category' => 'pc',
                'serial' => 'SERIAL-UNICO-001',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('serial');
    }

    public function test_updating_asset_serial_to_existing_one_fails(): void
    {
        Asset::create([
            'name' => 'Asset A',
            'category' => 'laptop',
            'serial' => 'SERIAL-A',
            'status' => 'operational',
        ]);

        $assetB = Asset::create([
            'name' => 'Asset B',
            'category' => 'pc',
            'serial' => 'SERIAL-B',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/assets/{$assetB->id}", [
                'serial' => 'SERIAL-A',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('serial');
    }

    public function test_updating_asset_serial_to_same_value_succeeds(): void
    {
        $asset = Asset::create([
            'name' => 'Mi Asset',
            'category' => 'laptop',
            'serial' => 'MY-SERIAL',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/assets/{$asset->id}", [
                'serial' => 'MY-SERIAL',
                'name' => 'Mi Asset Actualizado',
            ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Mi Asset Actualizado');
    }

    // --- Filters ---

    public function test_filtering_assets_by_category(): void
    {
        Asset::create([
            'name' => 'Laptop Lenovo',
            'category' => 'laptop',
            'status' => 'operational',
        ]);

        Asset::create([
            'name' => 'Impresora HP',
            'category' => 'printer',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/assets?category=laptop');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $asset) {
            $this->assertEquals('laptop', $asset['category']);
        }
    }

    public function test_filtering_assets_by_status(): void
    {
        Asset::create([
            'name' => 'Asset operativo',
            'category' => 'pc',
            'status' => 'operational',
        ]);

        Asset::create([
            'name' => 'Asset danado',
            'category' => 'pc',
            'status' => 'damaged',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/assets?status=damaged');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('damaged', $data[0]['status']);
    }
}
