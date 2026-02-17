"use client";

import { LayoutDashboard, Database, Users, FileText } from "lucide-react";

export default function DashboardClient() {
  return (
    <>
      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-card-content">
          <div className="welcome-card-icon">
            <LayoutDashboard className="welcome-card-icon-svg" />
          </div>
          <div className="welcome-card-text">
            <h3 className="welcome-card-title">Selamat Datang di NextCMS</h3>
            <p className="welcome-card-desc">
              Kelola konten Anda dengan mudah menggunakan headless CMS yang
              powerful
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">
            <Database className="stat-card-icon-svg" />
          </div>
          <div className="stat-card-content">
            <h4 className="stat-card-title">Total Content</h4>
            <p className="stat-card-value">0</p>
            <p className="stat-card-desc">Articles published</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            <Users className="stat-card-icon-svg" />
          </div>
          <div className="stat-card-content">
            <h4 className="stat-card-title">Total Users</h4>
            <p className="stat-card-value">0</p>
            <p className="stat-card-desc">Registered users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            <FileText className="stat-card-icon-svg" />
          </div>
          <div className="stat-card-content">
            <h4 className="stat-card-title">Categories</h4>
            <p className="stat-card-value">0</p>
            <p className="stat-card-desc">Content categories</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <a href="/app/content/create" className="quick-action-card">
            <FileText className="quick-action-icon" />
            <span className="quick-action-text">Create Content</span>
          </a>
          <a href="/app/categories" className="quick-action-card">
            <Database className="quick-action-icon" />
            <span className="quick-action-text">Manage Categories</span>
          </a>
          <a href="/app/users" className="quick-action-card">
            <Users className="quick-action-icon" />
            <span className="quick-action-text">Manage Users</span>
          </a>
        </div>
      </div>
    </>
  );
}
