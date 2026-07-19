(function () {
  const endpoint = 'https://script.google.com/macros/s/AKfycbyezQI9c6rX15R9PMnvf5gsSDFo8g_Yv81Yvc88zFiClzOI1iXvYmx1YwOVZMVNbGRbPA/exec';
  const consentKey = 'klinikguiden_analytics_consent';
  const sessionKey = 'klinikguiden_session_id';
  const visitorKey = 'klinikguiden_visitor_seen';

  function getConsent() {
    return localStorage.getItem(consentKey);
  }

  function hasConsent() {
    return getConsent() === 'accepted';
  }

  function createSessionId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'kg-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function getSessionId() {
    if (!hasConsent()) return '';
    const existing = localStorage.getItem(sessionKey);
    if (existing) return existing;

    const sessionId = createSessionId();
    localStorage.setItem(sessionKey, sessionId);
    return sessionId;
  }

  function getPageName() {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    return path || 'forside';
  }

  function getTrafficSource() {
    const referrer = document.referrer || '';
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');

    if (utmSource) return utmSource.toLowerCase();
    if (!referrer) return 'direkte';
    if (/google\./i.test(referrer)) return 'google';
    if (/bing\./i.test(referrer)) return 'bing';
    if (/facebook\.|instagram\.|t\.co|twitter\.|linkedin\.|pinterest\.|tiktok\./i.test(referrer)) return 'sociale medier';
    if (/klinikguiden\./i.test(referrer)) return 'intern';
    return 'henvisning';
  }

  function getVisitorType() {
    return localStorage.getItem(visitorKey) ? 'tilbagevendende' : 'ny';
  }

  function markVisitorSeen() {
    localStorage.setItem(visitorKey, '1');
  }

  function trackEvent(eventName, details = {}) {
    if (!hasConsent()) return;

    const visitorType = getVisitorType();

    const payload = new URLSearchParams({
      type: 'event',
      event: eventName,
      page: details.page || getPageName(),
      path: window.location.pathname,
      referrer: document.referrer || '',
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      name: '',
      email: '',
      guide: details.guide || eventName,
      product: details.product || '',
      price: details.price || '',
      value: details.value || '',
      trafficSource: details.trafficSource || getTrafficSource(),
      visitorType: details.visitorType || visitorType,
      isReturning: details.isReturning || (visitorType === 'tilbagevendende' ? 'TRUE' : 'FALSE'),
      screenSize: details.screenSize || `${window.innerWidth}x${window.innerHeight}`,
      errorMessage: details.errorMessage || '',
      details: JSON.stringify(details)
    });

    if (eventName === 'page_view') markVisitorSeen();

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, payload);
      return;
    }

    fetch(endpoint, { method: 'POST', mode: 'no-cors', body: payload }).catch(() => {});
  }

  function setConsent(value) {
    localStorage.setItem(consentKey, value);
    const banner = document.querySelector('[data-consent-banner]');
    if (banner) banner.remove();
    if (value === 'accepted') trackEvent('analytics_consent_accepted');
  }

  function clearConsent() {
    localStorage.removeItem(consentKey);
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(visitorKey);
  }

  function reopenConsentBanner() {
    clearConsent();
    injectConsentBanner();
  }

  function injectConsentBanner() {
    if (getConsent()) return;

    const banner = document.createElement('div');
    banner.setAttribute('data-consent-banner', 'true');
    banner.style.cssText = 'position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;max-width:760px;margin:0 auto;background:#FDFAF5;border:1px solid #E2DDD4;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.12);padding:1rem;display:flex;gap:1rem;align-items:center;justify-content:space-between;flex-wrap:wrap;font-family:Inter,system-ui,sans-serif;color:#2C2C2C;';
    banner.innerHTML = '<div style="max-width:560px;"><p style="margin:0 0 0.4rem;font-size:0.9rem;line-height:1.5;color:#4F4F49;">Vi bruger besøgsstatistik til at forstå, hvilke sider og funktioner der bliver brugt. Hvis du accepterer, behandler vi sessions-id/UUID, besøgte sider, referrer, tidspunkt, trafikkilde, skærmstørrelse, fejl og IP-adresse. Google Apps Script modtager dataene. Du kan stadig bruge formularer, hvis du siger nej.</p><p style="margin:0;font-size:0.85rem;line-height:1.45;color:#5E5A52;">Du kan senere ændre eller trække dit samtykke tilbage ved at bruge knappen herunder.</p></div><div style="display:flex;gap:0.6rem;flex-wrap:wrap;"><button type="button" data-consent-decline style="border:1px solid #E2DDD4;background:transparent;border-radius:999px;padding:0.65rem 1rem;cursor:pointer;">Nej tak</button><button type="button" data-consent-accept style="border:0;background:#4E7A62;color:white;border-radius:999px;padding:0.65rem 1rem;cursor:pointer;">Accepter statistik</button><button type="button" data-consent-manage style="border:1px solid #B8B0A3;background:transparent;border-radius:999px;padding:0.65rem 1rem;cursor:pointer;">Ændr eller træk tilbage senere</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-consent-accept]').addEventListener('click', () => setConsent('accepted'));
    banner.querySelector('[data-consent-decline]').addEventListener('click', () => setConsent('declined'));
    banner.querySelector('[data-consent-manage]').addEventListener('click', () => reopenConsentBanner());
  }

  function injectMedicalDisclaimer() {
    if (document.querySelector('[data-medical-disclaimer]')) return;

    const disclaimer = document.createElement('aside');
    disclaimer.setAttribute('data-medical-disclaimer', 'true');
    disclaimer.style.cssText = 'max-width:1100px;margin:1rem auto 0;padding:0 1.2rem;';
    disclaimer.innerHTML = '<div style="background:#F5F0E8;border:1px solid #E2DDD4;border-radius:12px;padding:0.9rem 1rem;color:#4F4F49;font-family:Inter,system-ui,sans-serif;font-size:0.88rem;line-height:1.55;">KlinikGuiden giver kun generel information og kan ikke erstatte undersøgelse, diagnose eller konkret vurdering hos en tandlæge eller anden sundhedsfaglig person. Tilskudsberegneren er vejledende, og akut information skal altid vurderes ud fra dine symptomer og den kliniske situation.</div>';

    const target = document.querySelector('main') || document.body.firstElementChild || document.body;
    target.parentNode.insertBefore(disclaimer, target);
  }

  function injectCompanyFooter() {
    if (document.querySelector('[data-kg-company-footer]')) return;

    let footer = document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.setAttribute('data-kg-site-footer', 'true');
      document.body.appendChild(footer);
    }

    const companyBlock = document.createElement('section');
    companyBlock.setAttribute('data-kg-company-footer', 'true');
    companyBlock.style.cssText = 'max-width:1100px;margin:0 auto 1.8rem;padding:1.1rem 1.2rem;border:1px solid rgba(255,255,255,0.12);border-radius:16px;background:rgba(255,255,255,0.04);text-align:left;';
    companyBlock.innerHTML = [
      '<h2 style="color:#fff;font-family:\'Playfair Display\',serif;font-size:1.1rem;margin:0 0 0.65rem;">Virksomhedsoplysninger</h2>',
      '<p style="margin:0;color:rgba(255,255,255,0.8);font-size:0.9rem;line-height:1.7;">KlinikGuiden v/Jonathan Pulandiran<br />E-mail: <a href="mailto:klinikguiden@gmail.com" style="color:#fff;text-decoration:none;">klinikguiden@gmail.com</a></p>',
      '<nav aria-label="Footer links" style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;">',
      '<a href="/privatlivspolitik.html">Privatlivspolitik</a>',
      '<a href="/cookiepolitik.html">Cookiepolitik</a>',
      '<a href="/handelsbetingelser.html">Handelsbetingelser</a>',
      '<a href="/kontakt.html">Kontakt</a>',
      '<a href="/om-os.html">Om os</a>',
      '</nav>'
    ].join('');

    if (footer.firstChild) {
      footer.insertBefore(companyBlock, footer.firstChild);
    } else {
      footer.appendChild(companyBlock);
    }
  }

  function initAutoTracking() {
    document.querySelectorAll('[data-track]').forEach((element) => {
      element.addEventListener('click', () => {
        trackEvent(element.dataset.track, {
          product: element.dataset.product || '',
          price: element.dataset.price || '',
          text: element.textContent.trim(),
          href: element.getAttribute('href') || ''
        });
      });
    });

    trackEvent('page_view');
  }

  window.KGAnalytics = {
    endpoint,
    getPageName,
    getSessionId,
    getTrafficSource,
    getVisitorType,
    hasConsent,
    trackEvent,
    initAutoTracking,
    injectConsentBanner,
    reopenConsentBanner
  };

  window.addEventListener('DOMContentLoaded', () => {
    injectConsentBanner();
    injectMedicalDisclaimer();
    injectCompanyFooter();
    initAutoTracking();
  });

  window.addEventListener('error', (event) => {
    trackEvent('site_error', {
      errorMessage: event.message || 'Ukendt fejl',
      source: event.filename || '',
      line: event.lineno ? String(event.lineno) : ''
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent('site_error', {
      errorMessage: event.reason && event.reason.message ? event.reason.message : 'Unhandled promise rejection'
    });
  });
})();
