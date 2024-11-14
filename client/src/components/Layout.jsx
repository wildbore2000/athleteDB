// src/components/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Menu,
  X,
  BarChart2,
  Settings
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
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart2
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <MobileNav />
        <h1 className="font-semibold">AthleteDB</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;