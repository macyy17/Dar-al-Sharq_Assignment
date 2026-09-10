import { describe, expect, it } from 'vitest';
import { navigationForRole } from '../../resources/js/data/workspace';

describe('workspace navigation permissions', () => {
    it('shows administration sections to admins', () => {
        const labels = navigationForRole('admin').map((item) => item.label);
        expect(labels).toEqual(expect.arrayContaining(['Pages', 'Trash', 'Menus', 'Users', 'Roles', 'Privileges']));
    });

    it('keeps moderator navigation focused on page work', () => {
        const labels = navigationForRole('moderator').map((item) => item.label);
        expect(labels).toEqual(['Overview', 'Pages']);
        expect(labels).not.toContain('Users');
        expect(labels).not.toContain('Trash');
    });
});
