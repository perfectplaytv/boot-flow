import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/sidebars/AdminSidebar";
import AdminUsers from "../AdminUsers";
import AdminIPTV from "../AdminIPTV";
import AdminRadio from "../AdminRadio";
import AdminAI from "../AdminAI";
import AdminEcommerce from "../AdminEcommerce";
import AdminGames from "../AdminGames";
import AdminAnalytics from "../AdminAnalytics";
import Settings from "../Settings";

const pageComponents = {
  dashboard: (
    <div>
      <h1>Dashboard Administrador</h1>
      <p>Gerencie toda a plataforma SaaS Pro</p>
    </div>
  ),
  users: <AdminUsers />, 
  iptv: <AdminIPTV />, 
  radio: <AdminRadio />, 
  ai: <AdminAI />, 
  ecommerce: <AdminEcommerce />, 
  games: <AdminGames />, 
  analytics: <AdminAnalytics />, 
  settings: <Settings />
};

const menuKeys = [
  "dashboard",
  "users",
  "iptv",
  "radio",
  "ai",
  "ecommerce",
  "games",
  "analytics",
  "settings"
];

export default function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
        <main className="flex-1 p-6">
          {pageComponents[selectedPage]}
        </main>
      </div>
    </SidebarProvider>
  );
}