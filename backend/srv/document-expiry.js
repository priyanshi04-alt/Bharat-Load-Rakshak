/**
 * BHARAT LOAD RAKSHAK - Document Expiry Engine
 * Checks vehicle and driver compliance documents for upcoming or active expirations.
 */

class DocumentExpiryEngine {
  async checkDocumentExpirations(db) {
    const documents = await db.run(SELECT.from('bharat.load.rakshak.VehicleDocuments'));
    const today = new Date();
    const results = { updated: 0, alertsCreated: 0 };

    for (const doc of documents) {
      if (!doc.expiryDate) continue;

      const expiry = new Date(doc.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStatus = 'VALID';
      let severity = null;
      let alertMessage = null;

      if (diffDays <= 0) {
        newStatus = 'EXPIRED';
        severity = 'CRITICAL';
        alertMessage = `CRITICAL: Vehicle document ${doc.documentType} (${doc.documentNumber}) for Truck ${doc.truckId} has EXPIRED!`;
      } else if (diffDays <= 7) {
        newStatus = 'WARNING_7';
        severity = 'HIGH';
        alertMessage = `WARNING: Vehicle document ${doc.documentType} (${doc.documentNumber}) expires in ${diffDays} days!`;
      } else if (diffDays <= 15) {
        newStatus = 'WARNING_15';
        severity = 'MEDIUM';
        alertMessage = `NOTICE: Vehicle document ${doc.documentType} (${doc.documentNumber}) expires in ${diffDays} days.`;
      } else if (diffDays <= 30) {
        newStatus = 'WARNING_30';
        severity = 'LOW';
        alertMessage = `ADVISORY: Vehicle document ${doc.documentType} (${doc.documentNumber}) expires in ${diffDays} days.`;
      }

      if (newStatus !== doc.status) {
        await db.run(
          UPDATE('bharat.load.rakshak.VehicleDocuments')
            .set({ status: newStatus })
            .where({ id: doc.id })
        );
        results.updated++;

        if (severity) {
          // Check if open alert already exists
          const existing = await db.run(
            SELECT.one.from('bharat.load.rakshak.Alerts')
              .where({ truckId: doc.truckId, type: 'DOCUMENT_EXPIRY', status: 'OPEN' })
          );

          if (!existing) {
            await db.run(
              INSERT.into('bharat.load.rakshak.Alerts').entries({
                type: 'DOCUMENT_EXPIRY',
                truckId: doc.truckId,
                timestamp: new Date().toISOString(),
                severity,
                message: alertMessage,
                status: 'OPEN'
              })
            );
            results.alertsCreated++;
          }
        }
      }
    }

    return results;
  }
}

module.exports = new DocumentExpiryEngine();
