<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AssetTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);

        $this->user = User::factory()->create();
        $this->user->assignRole('admin');
    }

    public function test_listing_assets(): void
    {
        Asset::create([
            'name' => 'Laptop Dell',
            'category' => 'laptop',
            'status' => 'operational',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/assets');

        $response->assertOk()
            ->assertJsonStructure(['data']);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_creating_an_asset_generates_asset_code(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
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
            ->assertJsonPath('category', 'server');

        // Verify asset_code was auto-generated (UTS-SER-XXXX pattern)
        $assetCode = $response->json('asset_code');
        $this->assertNotNull($assetCode);
        $this->assertStringStartsWith('UTS-', $assetCode);
    }

    public function test_filtering_assets_by_category_and_campus(): void
    {
        Asset::create([
            'name' => 'Laptop Lenovo',
            'category' => 'laptop',
            'campus' => 'Bucaramanga',
            'status' => 'operational',
        ]);

        Asset::create([
            'name' => 'Impresora HP',
            'category' => 'printer',
            'campus' => 'Piedecuesta',
            'status' => 'operational',
        ]);

        // Filter by category
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/assets?category=laptop');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $asset) {
            $this->assertEquals('laptop', $asset['category']);
        }

        // Filter by campus
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/assets?campus=Piedecuesta');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $asset) {
            $this->assertEquals('Piedecuesta', $asset['campus']);
        }
    }
}
