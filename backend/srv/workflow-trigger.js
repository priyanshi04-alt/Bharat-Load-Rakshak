/**
 * BHARAT LOAD RAKSHAK - SAP Build Process Automation Trigger Adapter
 * Connects CAP alert engine to SAP Build Lobby workflows for manager approvals.
 */

const axios = require('axios');

class WorkflowTriggerAdapter {
  async triggerIncidentWorkflow(alertData) {
    const spaUrl = process.env.SAP_SPA_WORKFLOW_URL;
    const clientId = process.env.SAP_CLIENT_ID;
    const clientSecret = process.env.SAP_CLIENT_SECRET;

    if (!spaUrl || process.env.APP_MODE === 'LOCAL') {
      console.log(`[SAP Build Lobby Adapter] LOCAL Mode: Simulating workflow trigger for alert ${alertData.ID || alertData.truckId}...`);
      return { status: 'SIMULATED', workflowInstanceId: `wfl_${Math.random().toString(36).substring(2, 10)}` };
    }

    try {
      console.log(`[SAP Build Lobby Adapter] Triggering SAP SPA Workflow for ${alertData.type}...`);
      const payload = {
        definitionId: 'blr_alert_escalation_workflow',
        context: {
          alertId: alertData.ID,
          truckId: alertData.truckId,
          driverId: alertData.driverId,
          severity: alertData.severity,
          message: alertData.message,
          timestamp: alertData.timestamp
        }
      };

      const response = await axios.post(`${spaUrl}/v1/workflow-instances`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SAP_OAUTH_TOKEN || ''}`
        }
      });

      return { status: 'SUCCESS', workflowInstanceId: response.data.id };
    } catch (err) {
      console.error('[SAP Build Lobby Error]', err.message);
      return { status: 'FAILED', error: err.message };
    }
  }
}

module.exports = new WorkflowTriggerAdapter();
