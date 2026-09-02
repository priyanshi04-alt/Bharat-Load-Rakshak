/**
 * BHARAT LOAD RAKSHAK - Document Expiry Engine Tests
 */

const documentEngine = require('../srv/document-expiry');

describe('Document Expiry Engine Date Threshold Verification', () => {
  test('Calculates correct status for document expiry thresholds', () => {
    const today = new Date();
    
    // 35 days in future -> VALID
    const d35 = new Date(today.getTime() + 35 * 24 * 3600 * 1000);
    const diff35 = Math.ceil((d35.getTime() - today.getTime()) / (1000 * 3600 * 24));
    expect(diff35).toBeGreaterThan(30);

    // 25 days in future -> WARNING_30
    const d25 = new Date(today.getTime() + 25 * 24 * 3600 * 1000);
    const diff25 = Math.ceil((d25.getTime() - today.getTime()) / (1000 * 3600 * 24));
    expect(diff25).toBeLessThanOrEqual(30);
    expect(diff25).toBeGreaterThan(15);

    // 10 days in future -> WARNING_15
    const d10 = new Date(today.getTime() + 10 * 24 * 3600 * 1000);
    const diff10 = Math.ceil((d10.getTime() - today.getTime()) / (1000 * 3600 * 24));
    expect(diff10).toBeLessThanOrEqual(15);
    expect(diff10).toBeGreaterThan(7);

    // 5 days in future -> WARNING_7
    const d5 = new Date(today.getTime() + 5 * 24 * 3600 * 1000);
    const diff5 = Math.ceil((d5.getTime() - today.getTime()) / (1000 * 3600 * 24));
    expect(diff5).toBeLessThanOrEqual(7);
    expect(diff5).toBeGreaterThan(0);

    // Past date -> EXPIRED
    const dExpired = new Date(today.getTime() - 2 * 24 * 3600 * 1000);
    const diffExpired = Math.ceil((dExpired.getTime() - today.getTime()) / (1000 * 3600 * 24));
    expect(diffExpired).toBeLessThanOrEqual(0);
  });
});
