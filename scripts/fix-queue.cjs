const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const newQueueAction = `  queueAction(actionInput) {
    const actionId = actionInput.actionId || \`ACT-\${Date.now()}\`;
    if (this.isActionSynced(actionId)) {
      console.warn(\`Duplicate action suppressed (already synced): \${actionId}\`);
      return { status: 'ALREADY_SYNCED' };
    }
    const existing = this.state.pendingOfflineChanges.find(a => a.actionId === actionId || a.id === actionId);
    if (existing) {
      console.warn(\`Duplicate action suppressed (already pending): \${actionId}\`);
      return existing;
    }

    const timestamp = new Date().toISOString();
    const actionItem = {
      ...actionInput,
      actionId,
      id: actionId,
      timestamp,
      userId: actionInput.userId || 'unknown',
      role: actionInput.role || 'unknown',
      'userId/role': \`\${actionInput.userId || 'unknown'}/\${actionInput.role || 'unknown'}\`,
      user: \`\${actionInput.userId || 'unknown'} (\${actionInput.role || 'unknown'})\`,
      status: 'PENDING',
      retryCount: 0,
      lastAttempt: timestamp,
      error: null,
      errorMessage: null
    };
    this.state.pendingOfflineChanges.push(actionItem);
    this.savePendingOfflineChanges();
    this.notify();
    return actionItem;
  }`;

code = code.replace(/  queueAction\(actionInput\) \{[\s\S]*?return actionItem;\n  \}/, newQueueAction);

fs.writeFileSync('src/state/store.js', code);
console.log('Fixed queueAction');
