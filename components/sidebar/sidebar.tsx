"use client";

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    FileText,
    BarChart,
    Settings,
    LogOut,
    UsersIcon,
} from 'lucide-react';
import Image from 'next/image';
import {useAuth} from '@/components/auth/auth-provider';
import {UserRole} from "@/lib/utils";

interface SidebarLinkProps {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
    active: boolean;
}

function SidebarLink({href, icon: Icon, children, active}: SidebarLinkProps) {
    return (
        <Link href={href}>
            <div className={`flex items-center px-4 py-3 rounded-md ${
                active ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:bg-gray-100'
            }`}>
                <Icon className="h-5 w-5 mr-3"/>
                <span className="text-sm font-medium">{children}</span>
            </div>
        </Link>
    );
}

export default function Sidebar({closeMobileMenu}: { closeMobileMenu?: () => void }) {
    const {user, logout, loading} = useAuth();
    const pathname = usePathname();

    return (
        <aside
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30"
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Link href="/" className="flex items-center">
                    <Image alt='logo' src='/assets/logos/ejaar_logo_v2.png' width={150} height={40}/>
                </Link>
            </div>

            <div className="p-4">
                <div className="space-y-1">
                    <SidebarLink href="/dashboard" icon={BarChart} active={pathname === '/dashboard'}>
                        Dashboard
                    </SidebarLink>
                    <SidebarLink href="/quotations" icon={FileText} active={pathname.startsWith('/quotations')}>
                        Devis
                    </SidebarLink>
                    {user?.role.name === UserRole.SUPER_ADMIN ? (
                        <SidebarLink href="/users" icon={UsersIcon} active={pathname.startsWith('/users')}>
                            Utilisateurs
                        </SidebarLink>) :
                        (<SidebarLink href="/supplier-users" icon={UsersIcon}
                     active={pathname.startsWith('/supplier-users')}>
                    Utilisateurs
                </SidebarLink>
                ) }
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                    <LogOut className="h-5 w-5 mr-3"/>
                    Se déconnecter
                </button>
            </div>
        </div>
</aside>
)
    ;
}
