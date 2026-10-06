// Main Entry Point for School Bus Rapid Replanning & Responsible AI System
import './styles/index.css';
import { store } from './state/store.js';

// Auth Components
import { renderLoginView } from './components/auth/LoginView.js';

// Layout Components
import { renderHeader } from './components/layout/Header.js';
import { renderSidebar } from './components/layout/Sidebar.js';

// Views
import { renderDashboardView } from './components/views/DashboardView.js';
import { renderOpsManagerDashboardView } from './components/views/OpsManagerDashboardView.js';
import { renderBusesView } from './components/views/BusesView.js';
import { renderRoutesView } from './components/views/RoutesView.js';
import { renderStudentsView } from './components/views/StudentsView.js';
import { renderDisruptionsView } from './components/views/DisruptionsView.js';
import { renderReplanningView } from './components/views/ReplanningView.js';
import { renderReportsView } from './components/views/ReportsView.js';
import { renderSettingsView } from './components/views/SettingsView.js';

// Modals
import { renderCreateDisruptionModal } from './components/modals/CreateDisruptionModal.js';
import { renderAddStudentModal } from './components/modals/AddStudentModal.js';
import { renderBusDetailModal } from './components/modals/BusDetailModal.js';
import { renderManualLocationModal } from './components/modals/ManualLocationModal.js';
import { renderPendingActionsModal } from './components/modals/PendingActionsModal.js';

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const state = store.getState();
  root.innerHTML = '';

  // 1. Entry Flow: Welcome / Login Page
  if (state.activeScreen === 'auth') {
    root.appendChild(renderLoginView());
    renderToasts(root, state.toasts);
    return;
  }

  // 2. Entry Flow: Role Selection (Bypassed)
  if (state.activeScreen === 'role_selection') {
    return; // Wait for immediate state transition to 'app'
  }

  // 3. Authenticated App Layout (Control Center)
  const appLayout = document.createElement('div');
  appLayout.className = 'app-layout';

  // Sidebar
  const sidebar = renderSidebar();
  appLayout.appendChild(sidebar);

  // Main Content Container
  const mainContent = document.createElement('main');
  mainContent.className = 'main-content';

  // Header
  const header = renderHeader();
  mainContent.appendChild(header);

  // View Router
  let viewElement;
  switch (state.activeTab) {
    case 'dashboard':
      viewElement = state.currentRole === 'operations_manager'
        ? renderOpsManagerDashboardView()
        : renderDashboardView();
      break;
    case 'buses':
      viewElement = renderBusesView();
      break;
    case 'routes':
      viewElement = renderRoutesView();
      break;
    case 'students':
      viewElement = renderStudentsView();
      break;
    case 'disruptions':
      viewElement = renderDisruptionsView();
      break;
    case 'replanning':
      viewElement = renderReplanningView();
      break;
    case 'reports':
      viewElement = renderReportsView();
      break;
    case 'settings':
      viewElement = renderSettingsView();
      break;
    default:
      viewElement = renderDashboardView();
  }

  mainContent.appendChild(viewElement);
  appLayout.appendChild(mainContent);
  root.appendChild(appLayout);

  // 4. Modals Container
  if (state.activeModal) {
    let modalElement;
    if (state.activeModal === 'create_disruption') {
      modalElement = renderCreateDisruptionModal();
    } else if (state.activeModal === 'add_student') {
      modalElement = renderAddStudentModal();
    } else if (state.activeModal === 'bus_detail') {
      modalElement = renderBusDetailModal();
    } else if (state.activeModal === 'manual_location') {
      modalElement = renderManualLocationModal();
    } else if (state.activeModal === 'pending_actions') {
      modalElement = renderPendingActionsModal();
    }

    if (modalElement) {
      root.appendChild(modalElement);
    }
  }

  // 5. Toast Notifications
  renderToasts(root, state.toasts);
}

function renderToasts(container, toasts) {
  if (!toasts || toasts.length === 0) return;

  let toastContainer = container.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    container.appendChild(toastContainer);
  } else {
    toastContainer.innerHTML = '';
  }

  toasts.forEach(toast => {
    const el = document.createElement('div');
    el.className = `toast ${toast.type}`;
    el.innerHTML = `
      <span style="font-size: 1.1rem;">
        ${toast.type === 'success' ? '✅' : toast.type === 'danger' ? '⚠️' : 'ℹ️'}
      </span>
      <span style="font-size: 0.85rem; font-weight: 600; color: #0F172A;">${toast.message}</span>
    `;
    toastContainer.appendChild(el);
  });
}

// Initial mount & subscription
store.subscribe(renderApp);

store.fetchInitialData();
renderApp();

// Live clock tick
setInterval(() => {
  const clockEl = document.getElementById('live-header-clock');
  if (clockEl) {
    clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}, 1000);
