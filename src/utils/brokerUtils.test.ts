import test from 'node:test';
import assert from 'node:assert/strict';
import {GALLERY_PHOTOS, BROKER_INFO} from '../data/brokerData';
import {
  buildMailtoLink,
  buildWhatsAppLink,
  getNextLightboxIndex,
  getPrevLightboxIndex,
  isLocalPublicImagePath,
  validateContactForm,
} from './brokerUtils';

test('validateContactForm rejects empty or invalid fields', () => {
  const result = validateContactForm({name: 'A', email: 'invalido', message: 'oi'});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('validateContactForm accepts valid contact payload', () => {
  const result = validateContactForm({
    name: 'Carlos Eduardo',
    email: 'carlos@exemplo.com.br',
    message: 'Gostaria de agendar uma visita para conhecer o imóvel.',
  });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('buildWhatsAppLink formats phone number and encoded message', () => {
  const url = buildWhatsAppLink({
    name: 'Mariana',
    email: 'mariana@exemplo.com',
    message: 'Tenho interesse no imóvel com piscina.',
  });
  assert.ok(url.startsWith(`https://wa.me/${BROKER_INFO.phoneRaw}?text=`));
  assert.ok(url.includes(encodeURIComponent('Mariana')));
  assert.ok(url.includes(encodeURIComponent('Tenho interesse no imóvel com piscina.')));
});

test('buildMailtoLink constructs valid subject and body', () => {
  const url = buildMailtoLink({
    name: 'Mariana',
    email: 'mariana@exemplo.com',
    message: 'Solicito mais informações sobre avaliação.',
  });
  assert.ok(url.startsWith(`mailto:${BROKER_INFO.email}?subject=`));
  assert.ok(url.includes('body='));
});

test('lightbox index helpers wrap around cleanly', () => {
  assert.equal(getNextLightboxIndex(0, 3), 1);
  assert.equal(getNextLightboxIndex(2, 3), 0);
  assert.equal(getPrevLightboxIndex(0, 3), 2);
  assert.equal(getPrevLightboxIndex(2, 3), 1);
});

test('all gallery photos resolve to /images/ static public paths', () => {
  assert.equal(GALLERY_PHOTOS.length, 3);
  for (const photo of GALLERY_PHOTOS) {
    assert.equal(isLocalPublicImagePath(photo.src), true);
  }
});
