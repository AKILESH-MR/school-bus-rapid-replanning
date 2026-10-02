import fs from 'fs';

const storePath = 'src/state/store.js';
let code = fs.readFileSync(storePath, 'utf8');

// Patch dispatchAction to ALWAYS queue the action and then sync if online
const oldDispatch = `
    if (this.state.networkStatus === 'online') {
      // 1. Online action processed normally
      const actionItem = {
        actionId,
        id: actionId,
        timestamp,
        userId,
        role,
        'userId/role': \`\${userId}/\${role}\`,
        user,
        actionType,
        payload,
        status: 'EXECUTED',
        retryCount: 0,
        lastAttempt: timestamp,
        error: null,
        errorMessage: null
      };

      this.recordActionSynced(actionId);

      this.state.metrics.recentAuditLogs.unshift({
        id: \`LOG-ONLINE-\${Date.now()}-\${Math.floor(Math.random() * 100)}\`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: \`\${userId} (\${role})\`,
        event: \`[ONLINE] \${actionType} (\${actionId})\`,
        status: 'EXECUTED'
      });

      this.showToast(\`Action \${actionType} executed online.\`, 'success');
      this.notify();
      return actionItem;
    } else {
      // 2. If network becomes unavailable, action is preserved locally
      return this.queueAction({
        actionId,
        userId,
        role,
        actionType,
        payload,
        description: actionInput.description
      });
    }
  }`;

const newDispatch = `
    // Always queue locally first to ensure store-and-forward consistency
    const actionItem = this.queueAction({
      actionId,
      userId,
      role,
      actionType,
      payload,
      description: actionInput.description || actionType
    });

    if (this.state.networkStatus === 'online') {
      // Attempt immediate sync
      this.syncPendingOfflineChanges().catch(e => {
         console.warn('Immediate sync failed, will retry later', e);
      });
    }
    return actionItem;
  `;

// Let's use a regex to replace the if (this.state.networkStatus === 'online') block in dispatchAction
code = code.replace(
  /if \(this\.state\.networkStatus === 'online'\) \{\s*\/\/\ 1\. Online action processed normally[\s\S]*?\}\s*\}\s*getPendingActions/g,
  newDispatch + '\n\n  getPendingActions'
);

fs.writeFileSync(storePath, code);
console.log('Patched dispatchAction in store.js');
