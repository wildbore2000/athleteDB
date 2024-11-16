import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

const mainNav = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Athletes',
    href: '/athletes',
    icon: Users
  },
  {
    name: 'Assessments',
    href: '/assessments',
    icon: ClipboardList
  }
];

const NavLink = ({ item, isMobile, onClick }) => {
  const location = useLocation();
  const isActive = item.exact 
    ? location.pathname === item.href 
    : location.pathname.startsWith(item.href);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.name}
    </Link>
  );
};

const Sidebar = ({ className }) => {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-8">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              AthleteDB
            </h2>
            <p className="px-4 text-sm text-muted-foreground">
              Performance Assessment System
            </p>
          </div>
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {mainNav.map((item) => (
              <div key={item.href} className="px-2 py-1">
                <NavLink 
                  item={item} 
                  isMobile 
                  onClick={() => setIsOpen(false)}
                />
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Layout = ({ children, mobileButtons }) => {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background border-r">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex flex-col border-b bg-background px-4 py-2 md:hidden">
        <div className="flex items-center gap-4">
          <MobileNav />
          <h1 className="font-semibold">AthleteDB</h1>
        </div>
        {mobileButtons && (
          <div className="flex gap-2 mt-2 mb-1">
            {mobileButtons}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <main className="flex-1 p-4 md:p-8 mt-24 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;