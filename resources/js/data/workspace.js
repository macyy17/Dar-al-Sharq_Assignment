import { ArchiveRestore, FileText, KeyRound, LayoutDashboard, ListTree, ShieldCheck, Users } from 'lucide-react';

const definitions = [
    { label: 'Overview', icon: LayoutDashboard, suffix: '', end: true, privilege: 'pages.view' },
    { label: 'Pages', icon: FileText, suffix: '/pages', privilege: 'pages.view' },
    { label: 'Trash', icon: ArchiveRestore, suffix: '/trash', privilege: 'pages.restore' },
    { label: 'Menus', icon: ListTree, suffix: '/menus', privilege: 'menus.view' },
    { label: 'Users', icon: Users, suffix: '/users', privilege: 'users.view' },
    { label: 'Roles', icon: ShieldCheck, suffix: '/roles', privilege: 'roles.view' },
    { label: 'Privileges', icon: KeyRound, suffix: '/privileges', privilege: 'privileges.view' },
];

export function navigationForPrivileges(privileges = [], base = '/moderator') {
    return definitions.filter((item) => privileges.includes(item.privilege)).map((item) => ({ ...item, to: `${base}${item.suffix}` }));
}

export function navigationForRole(role) {
    const privileges = role === 'admin'
        ? ['pages.view', 'pages.restore', 'menus.view', 'users.view', 'roles.view', 'privileges.view']
        : ['pages.view'];
    return navigationForPrivileges(privileges, `/${role}`);
}
