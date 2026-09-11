import { describe, expect, it } from 'vitest';
import { navigationForPrivileges } from '../../resources/js/data/workspace';

describe('workspace navigation permissions', () => {
    it('shows only sections backed by granted privileges', () => {
        const labels = navigationForPrivileges([
            'pages.view',
            'pages.restore',
            'menus.view',
            'users.view',
            'roles.view',
            'privileges.view',
        ], '/admin').map((item) => item.label);

        expect(labels).toEqual(['Overview', 'Pages', 'Trash', 'Menus', 'Users', 'Roles', 'Privileges']);
    });

    it('keeps a moderator with page privileges focused on page work', () => {
        const items = navigationForPrivileges(['pages.view', 'pages.create', 'pages.update'], '/moderator');
        expect(items.map((item) => item.label)).toEqual(['Overview', 'Pages']);
        expect(items.map((item) => item.to)).toEqual(['/moderator', '/moderator/pages']);
    });
});
