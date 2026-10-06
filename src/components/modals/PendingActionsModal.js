// Modal for Viewing & Managing Local Store-and-Forward Pending Actions
import { Icons } from '../../utils/icons.js';
import { store } from '../../state/store.js';

export function renderPendingActionsModal() {
  const state = store.getState();
  const queue = state.pendingOfflineChanges || [];
  const isOnline = state.networkStatus === 'online';

  const pendingCount = queue.filter(q => q.status === 'PENDING').length;
  const syncingCount = queue.filter(q => q.status === 'SYNCING').length;
  const failedCount = queue.filter(q => q.status === 'FAILED').length;

  const isSyncing = state.loadingStates?.sync;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'pending-actions-modal-overlay';

  overlay.innerHTML = `
    <div class="modal-card" style="max-width: 820px; width: 92%;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0F2747; display: flex; align-items: center; gap: 8px;">
            ${Icons.refreshCw(20, '#2563EB')} Local Store-and-Forward Queue
          </h3>
          <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: ${isOnline ? '#ECFDF5' : '#FEF2F2'}; color: ${isOnline ? '#059669' : '#DC2626'}; border: 1px solid ${isOnline ? '#A7F3D0' : '#FECACA'};">
            ${isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </span>
        </div>
        <button class="modal-close-btn" id="close-pending-modal-btn">&times;</button>
      </div>

      <div class="modal-body" style="padding: 18px 24px;">
        <p style="font-size: 0.85rem; color: #64748B; margin-top: 0; margin-bottom: 16px;">
          All dispatcher actions recorded during network disruptions are securely stored locally in browser storage and synchronized with central district servers upon connectivity restoration.
        </p>

        <!-- Status Summary Badges -->
        <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem;">
            Total Queued: <b style="color: #0F2747;">${queue.length}</b>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; color: #92400E;">
            Pending: <b>${pendingCount}</b>
          </div>
          ${syncingCount > 0 || isSyncing ? `
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; color: #1D4ED8;">
              Syncing: <b>${syncingCount || (isSyncing ? pendingCount : 0)}</b>
            </div>
          ` : ''}
          ${failedCount > 0 ? `
            <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; color: #DC2626;">
              Failed: <b>${failedCount}</b>
            </div>
          ` : ''}
        </div>

        ${state.lastSyncResult ? `
          <div style="margin-bottom: 14px; padding: 8px 12px; background: ${state.lastSyncResult.success ? '#ECFDF5' : '#FEF2F2'}; border: 1px solid ${state.lastSyncResult.success ? '#A7F3D0' : '#FECACA'}; border-radius: 6px; font-size: 0.78rem; color: ${state.lastSyncResult.success ? '#065F46' : '#991B1B'};">
            <b>Last Sync Result:</b> ${state.lastSyncResult.message} (${state.lastSyncResult.timestamp})
          </div>
        ` : ''}

        <!-- Pending Actions Table -->
        ${queue.length === 0 ? `
          <div style="text-align: center; padding: 30px; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 10px;">
            <div style="font-size: 2rem; margin-bottom: 8px;">✨</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: #0F2747;">No Pending Actions</div>
            <div style="font-size: 0.78rem; color: #64748B;">All dispatcher operational updates are synchronized with central servers.</div>
          </div>
        ` : `
          <div style="overflow-x: auto; max-height: 320px; overflow-y: auto; border: 1px solid #E2E8F0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; text-align: left;">
              <thead>
                <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; position: sticky; top: 0;">
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Action ID</th>
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Type & Details</th>
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569;">User</th>
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Timestamp</th>
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Status</th>
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Retries</th>
                  <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-align: center;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${queue.map(item => {
                  const statusColors = {
                    PENDING: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
                    SYNCING: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
                    SYNCED: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
                    FAILED: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }
                  }[item.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };

                  return `
                    <tr style="border-bottom: 1px solid #F1F5F9;">
                      <td style="padding: 8px 12px; font-family: monospace; font-weight: 700; color: #0F2747;">${item.actionId || item.id}</td>
                      <td style="padding: 8px 12px;">
                        <div style="font-weight: 700; color: #0F2747;">${item.actionType}</div>
                        <div style="font-size: 0.72rem; color: #64748B;">${item.description || JSON.stringify(item.payload || {})}</div>
                        ${item.error || item.errorMessage ? `<div style="font-size: 0.7rem; color: #DC2626; font-weight: 600; margin-top: 2px;">⚠️ ${item.error || item.errorMessage}</div>` : ''}
                        ${item.lastAttempt ? `<div style="font-size: 0.68rem; color: #94A3B8; margin-top: 2px;">Last attempt: ${item.lastAttempt}</div>` : ''}
                      </td>
                      <td style="padding: 8px 12px; color: #475569;">${item.userId ? `${item.userId} (${item.role || 'Dispatcher'})` : (item.role || item.user || 'Dispatcher')}</td>
                      <td style="padding: 8px 12px; color: #475569; white-space: nowrap;">${item.timestamp}</td>
                      <td style="padding: 8px 12px;">
                        <span style="background: ${statusColors.bg}; color: ${statusColors.color}; border: 1px solid ${statusColors.border}; padding: 2px 8px; border-radius: 9999px; font-weight: 700; font-size: 0.68rem;">
                          ${item.status}
                        </span>
                      </td>
                      <td style="padding: 8px 12px; color: #475569; font-weight: 600;">${item.retryCount || 0}</td>
                      <td style="padding: 8px 12px; text-align: center;">
                        ${item.status === 'FAILED' ? `
                          <button class="action-btn warning retry-single-action-btn" data-action-id="${item.actionId || item.id}" style="padding: 3px 8px; font-size: 0.7rem;" ${isSyncing ? 'disabled' : ''}>
                            Retry
                          </button>
                        ` : `<span style="color: #94A3B8;">—</span>`}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <div class="modal-footer" style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border-top: 1px solid #E2E8F0; border-radius: 0 0 12px 12px;">
        <div style="font-size: 0.75rem; color: #64748B;">
          ${queue.length > 0 ? `Last Sync Attempt: <b>${state.lastSyncTimestamp || 'None'}</b>` : ''}
        </div>
        <div style="display: flex; gap: 8px;">
          ${failedCount > 0 ? `
            <button class="action-btn warning" id="retry-failed-modal-btn" style="font-size: 0.82rem;" ${isSyncing ? 'disabled' : ''}>
              ${Icons.refreshCw(14, 'currentColor')} ${isSyncing ? 'Synchronizing offline actions...' : `Retry Failed Actions (${failedCount})`}
            </button>
          ` : ''}
          ${isOnline && queue.length > 0 ? `
            <button class="action-btn primary" id="sync-now-modal-btn" style="font-size: 0.82rem;" ${isSyncing ? 'disabled' : ''}>
              ${isSyncing ? 'Synchronizing offline actions...' : `⚡ Sync All Now (${queue.length})`}
            </button>
          ` : ''}
          <button class="action-btn secondary" id="close-modal-footer-btn" style="font-size: 0.82rem;">Close</button>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  const closeBtn = overlay.querySelector('#close-pending-modal-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => store.closeModal());

  const closeFooterBtn = overlay.querySelector('#close-modal-footer-btn');
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', () => store.closeModal());

  const syncNowBtn = overlay.querySelector('#sync-now-modal-btn');
  if (syncNowBtn) {
    syncNowBtn.addEventListener('click', () => {
      if (store.isOperationLoading('sync')) return;
      store.syncPendingOfflineChanges();
    });
  }

  const retryFailedBtn = overlay.querySelector('#retry-failed-modal-btn');
  if (retryFailedBtn) {
    retryFailedBtn.addEventListener('click', () => {
      if (store.isOperationLoading('sync')) return;
      store.retryFailedActions();
    });
  }

  const singleRetryBtns = overlay.querySelectorAll('.retry-single-action-btn');
  singleRetryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (store.isOperationLoading('sync')) return;
      const aId = e.currentTarget.getAttribute('data-action-id');
      if (aId) {
        store.retryAction(aId);
      }
    });
  });

  return overlay;
}
