import test from 'node:test';
import assert from 'node:assert/strict';
import { answerFor, defaultEvidence } from '../lib/evidence.ts';

test('questions use the supplied evidence revision', () => {
  const updated = structuredClone(defaultEvidence);
  const payments = updated.signals.find(s => s.id === 'payments')!;
  payments.metrics[0].value = 'synthetic updated count';
  assert.equal(answerFor('How are payments?', 'all', updated)?.metrics[0].value, 'synthetic updated count');
});

test('withheld signals never fall back to old snapshot answers', () => {
  const updated = structuredClone(defaultEvidence);
  updated.signals = updated.signals.filter(s => s.id !== 'payments');
  assert.equal(answerFor('How are payments?', 'all', updated), null);
});

test('a removed location refuses a previously supported question', () => {
  const updated = structuredClone(defaultEvidence);
  updated.coverage = [];
  assert.equal(answerFor('How are payments?', 'yaba-lagos', updated), null);
});

test('a partially published signal set still refuses multi-topic questions', () => {
  const updated = structuredClone(defaultEvidence);
  updated.signals = updated.signals.filter(s => s.id === 'payments');
  assert.equal(answerFor('Compare payments and credit', 'all', updated), null);
});
