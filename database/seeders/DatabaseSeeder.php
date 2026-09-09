<?php

namespace Database\Seeders;

use App\Models\Privilege;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $definitions = [
            ['pages.view', 'Pages', 'View page records and publishing state.'],
            ['pages.create', 'Pages', 'Create page records.'],
            ['pages.update', 'Pages', 'Update page records.'],
            ['pages.delete', 'Pages', 'Soft-delete page records.'],
            ['pages.restore', 'Pages', 'Restore soft-deleted pages.'],
            ['pages.force_delete', 'Pages', 'Permanently delete trashed pages.'],
            ['users.view', 'Administration', 'View CMS users.'],
            ['users.create', 'Administration', 'Create CMS users.'],
            ['users.update', 'Administration', 'Update CMS users.'],
            ['users.delete', 'Administration', 'Delete CMS users.'],
            ['roles.view', 'Administration', 'View roles.'],
            ['roles.create', 'Administration', 'Create roles.'],
            ['roles.update', 'Administration', 'Update roles.'],
            ['roles.delete', 'Administration', 'Delete roles.'],
            ['privileges.view', 'Administration', 'View privileges.'],
            ['privileges.create', 'Administration', 'Create privileges.'],
            ['privileges.update', 'Administration', 'Update privileges.'],
            ['privileges.delete', 'Administration', 'Delete privileges.'],
            ['menus.view', 'Navigation', 'View menu structure.'],
            ['menus.create', 'Navigation', 'Create menu items.'],
            ['menus.update', 'Navigation', 'Update and reorder menu items.'],
            ['menus.delete', 'Navigation', 'Delete menu items.'],
        ];

        $privileges = collect($definitions)->mapWithKeys(function (array $definition) {
            $privilege = Privilege::create(['name' => $definition[0], 'group' => $definition[1], 'description' => $definition[2]]);
            return [$privilege->name => $privilege];
        });

        $admin = Role::create(['name' => 'Admin', 'description' => 'Full CMS administration and publishing access.']);
        $moderator = Role::create(['name' => 'Moderator', 'description' => 'Can list, create and update pages without destructive administration.']);

        $admin->privileges()->sync($privileges->pluck('id'));
        $moderator->privileges()->sync($privileges->only(['pages.view', 'pages.create', 'pages.update'])->pluck('id'));

        User::create([
            'name' => 'CMS Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $admin->id,
            'is_active' => true,
        ]);

        User::create([
            'name' => 'CMS Moderator',
            'email' => 'moderator@example.com',
            'password' => Hash::make('password'),
            'role_id' => $moderator->id,
            'is_active' => true,
        ]);
    }
}
