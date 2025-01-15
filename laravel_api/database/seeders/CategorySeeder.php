<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            'Electronics',
            'Food & Beverages',
            'Fashion',
            'Home Appliance',
            'Healthcare & Fitness',
        ];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}
