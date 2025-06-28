
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, MessageCircle, Bookmark, Moon, Sun, User, LogOut, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchModal from './SearchModal';
import NotificationsPanel from './NotificationsPanel';
import ChatPanel from './ChatPanel';
import SavedPostsModal from './SavedPostsModal';
import UserProfileModal from './UserProfileModal';
import EditProfileModal from './EditProfileModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [savedPostsOpen, setSavedPostsOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Events', path: '/events' },
    { name: 'Members', path: '/members' },
    { name: 'Leaderboard', path: '/leaderboard' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-primary">CUSP</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                  </SheetHeader>
                  <NotificationsPanel />
                </SheetContent>
              </Sheet>

              {/* Chats */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Messages</SheetTitle>
                  </SheetHeader>
                  <ChatPanel />
                </SheetContent>
              </Sheet>

              {/* Saved Posts */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSavedPostsOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Bookmark className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setUserProfileOpen(true)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Modals */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <SavedPostsModal open={savedPostsOpen} onOpenChange={setSavedPostsOpen} />
      <UserProfileModal open={userProfileOpen} onOpenChange={setUserProfileOpen} />
      <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </div>
  );
};

export default Layout;
