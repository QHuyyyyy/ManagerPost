import { useTheme } from "@/hooks/use-theme";
import { Dropdown } from 'antd';
import { UserAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";

import profileImg from "@/assets/profile-image.jpg";

import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const { user } = UserAuth();
    const { logOut } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            message.success('Log out successfully!');
            navigate('/login');
            localStorage.removeItem("token");
        } catch (error) {
            message.error('Log out failed: ' + error.message);
        }
    };

    const items = [
        {
            key: 'logout',
            label: 'Log Out',
            onClick: handleLogout,
        },
    ];

    return (
        <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-slate-300 bg-white px-6 transition-colors dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-x-4">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.displayName || 'User'}
                    </span>
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <button className="size-10 overflow-hidden rounded-full">
                            <img
                                src={user?.photoURL || profileImg}
                                alt="profile image"
                                className="size-full object-cover"
                            />
                        </button>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
