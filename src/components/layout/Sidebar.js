// Sidebar Navigation Component
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderSidebar() {
  const state = store.getState();
  const currentRole = state.currentRole;
  const isDispatcher = currentRole === 'dispatcher';
  const activeTab = state.activeTab;
  const activeDisruptionsCount = state.disruptions.filter(d => d.status === 'unresolved').length;

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const userPhoto = state.currentUser?.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80';
  const userName = state.currentUser?.name || (isDispatcher ? 'Sarah Jenkins' : 'Marcus Vance');
  const userTitle = state.currentUser?.title || (isDispatcher ? 'Lead Dispatcher' : 'Operations Director');

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <div class="sidebar-logo">
        ${Icons.bus(22, '#fff')}
      </div>
      <div class="sidebar-brand-text">
        <span class="sidebar-brand-title">School Transport</span>
        <span class="sidebar-brand-sub">Rapid Replanning AI</span>
      </div>
    </div>

    <!-- Active Role Indicator & Quick Switcher -->
    <div class="sidebar-role-indicator">
      <div class="sidebar-role-info">
        <span class="sidebar-role-label">Current Workspace</span>
        <span class="sidebar-role-val">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isDispatcher ? '#3B82F6' : '#10B981'};"></span>
          ${isDispatcher ? 'Dispatcher' : 'Ops Manager'}
        </span>
      </div>
      <button class="sidebar-role-switch-btn" id="sidebar-switch-role-btn" title="Toggle between Dispatcher and Operations Manager view">
        Switch
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Operations</div>
      
      <div class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
        <div class="nav-item-content">
          ${Icons.layoutDashboard(18, 'currentColor')}
          <span>Dashboard</span>
        </div>
      </div>

      <div class="nav-item ${activeTab === 'buses' ? 'active' : ''}" data-tab="buses">
        <div class="nav-item-content">
          ${Icons.bus(18, 'currentColor')}
          <span>Buses</span>
        </div>
        <span class="nav-badge blue">${state.buses.length}</span>
      </div>

      <div class="nav-item ${activeTab === 'routes' ? 'active' : ''}" data-tab="routes">
        <div class="nav-item-content">
          ${Icons.route(18, 'currentColor')}
          <span>Routes</span>
        </div>
        <span class="nav-badge blue">${state.routes.length}</span>
      </div>

      <div class="nav-item ${activeTab === 'students' ? 'active' : ''}" data-tab="students">
        <div class="nav-item-content">
          ${Icons.users(18, 'currentColor')}
          <span>Students</span>
        </div>
        <span class="nav-badge blue">${state.students.length}</span>
      </div>

      <div class="nav-section-label">Incident Management</div>

      <div class="nav-item ${activeTab === 'disruptions' ? 'active' : ''}" data-tab="disruptions">
        <div class="nav-item-content">
          ${Icons.alertTriangle(18, 'currentColor')}
          <span>Disruptions</span>
        </div>
        ${activeDisruptionsCount > 0 ? `<span class="nav-badge danger">${activeDisruptionsCount}</span>` : ''}
      </div>

      <div class="nav-item ${activeTab === 'replanning' ? 'active' : ''}" data-tab="replanning">
        <div class="nav-item-content">
          ${Icons.cpu(18, 'currentColor')}
          <span>Replanning</span>
        </div>
        <span class="nav-badge" style="background: #6366F1; color: #fff;">AI</span>
      </div>

      <div class="nav-section-label">Analytics & Config</div>

      <div class="nav-item ${activeTab === 'reports' ? 'active' : ''}" data-tab="reports">
        <div class="nav-item-content">
          ${Icons.fileText(18, 'currentColor')}
          <span>Reports</span>
        </div>
        ${!isDispatcher ? `<span class="nav-badge" style="background: #10B981; color: #fff;">Ops</span>` : ''}
      </div>

      <div class="nav-item ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
        <div class="nav-item-content">
          ${Icons.settings(18, 'currentColor')}
          <span>Settings</span>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <img src="${userPhoto}" alt="${userName}" class="sidebar-avatar" />
        <div class="sidebar-user-details">
          <span class="sidebar-user-name">${userName}</span>
          <span class="sidebar-user-sub">${userTitle}</span>
        </div>
      </div>
      <button class="logout-btn" id="sidebar-logout-btn" title="Sign Out">
        ${Icons.logOut(18, 'currentColor')}
      </button>
    </div>
  `;

  // Attach tab switching events
  const navItems = sidebar.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) {
        store.setActiveTab(tab);
      }
    });
  });

  // Switch role button
  const switchRoleBtn = sidebar.querySelector('#sidebar-switch-role-btn');
  if (switchRoleBtn) {
    switchRoleBtn.addEventListener('click', () => {
      const nextRole = currentRole === 'dispatcher' ? 'operations_manager' : 'dispatcher';
      store.switchRole(nextRole);
    });
  }

  // Logout button
  const logoutBtn = sidebar.querySelector('#sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }

  return sidebar;
}
