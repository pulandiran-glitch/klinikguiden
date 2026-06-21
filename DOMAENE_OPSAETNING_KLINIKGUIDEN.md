# Domæneopsætning - klinikguiden.com

Mål:

- `https://klinikguiden.com` skal være hovedadressen.
- `https://www.klinikguiden.com` skal viderestille til `https://klinikguiden.com`.
- Netlify skal udstede HTTPS/SSL-certifikat.
- Google skal indeksere `klinikguiden.com`, ikke den gamle Netlify-adresse.

## Status lige nu

DNS-tjek viser:

- Navneservere: Simply.com (`ns1.simply.com`, `ns2.simply.com`, `ns3.simply.com`)
- `klinikguiden.com`: ingen A-record endnu
- `www.klinikguiden.com`: ingen CNAME endnu

Det betyder, at domænet ikke peger korrekt på Netlify endnu.

## 1. Netlify - tilføj domænet

1. Log ind på Netlify.
2. Åbn projektet `klinikguiden`.
3. Gå til `Domain management`.
4. Vælg `Add a domain`.
5. Indtast:
   `klinikguiden.com`
6. Bekræft at domænet skal bruges til dette projekt.
7. Tilføj også:
   `www.klinikguiden.com`
8. Sæt `klinikguiden.com` som `Primary domain`.

Når `klinikguiden.com` er primary domain, bør `www.klinikguiden.com` viderestille til hoveddomænet.
Projektet har også en ekstra redirect-regel i `_redirects` og `netlify.toml`.

## 2. Simply.com - opret DNS-records

1. Log ind på Simply.com.
2. Gå til dit domæne `klinikguiden.com`.
3. Find `DNS` eller `DNS administration`.
4. Opret eller ret disse records:

| Host/navn | Type | Værdi |
|---|---|---|
| `@` eller tomt felt | `A` | `75.2.60.5` |
| `www` | `CNAME` | `klinikguiden.netlify.app` |

Vigtigt:

- Skriv ikke `https://` foran værdierne.
- CNAME-værdien skal være `klinikguiden.netlify.app`, ikke hele URL'en.
- Hvis Simply ikke accepterer `@`, så lad host/navn-feltet være tomt for roddomænet.
- Slet eller ret gamle A/AAAA/CNAME-records for `@` og `www`, hvis de peger andre steder hen.
- Behold mail-records som MX, SPF, DKIM og DMARC, hvis du bruger email på domænet.

## 3. Vent på DNS

DNS kan virke hurtigt, men kan også tage 24-48 timer.
Netlify nævner, at DNS i nogle tilfælde kan tage op til 72 timer globalt.

## 4. Netlify - tjek HTTPS/SSL

Når DNS peger korrekt:

1. Gå til Netlify -> `Domain management`.
2. Find `HTTPS` eller `SSL/TLS certificate`.
3. Vælg `Verify DNS configuration`, hvis knappen findes.
4. Vælg `Provision certificate` eller `Renew certificate`, hvis Netlify ikke gør det automatisk.
5. Vent til Netlify viser, at certifikatet er aktivt.

## 5. Test efter opsætning

Åbn:

- `https://klinikguiden.com`
- `https://www.klinikguiden.com`
- `http://klinikguiden.com`
- `http://www.klinikguiden.com`

Det rigtige slutresultat:

- Alle ender på `https://klinikguiden.com`
- Browseren viser lås/HTTPS
- Ingen sikkerhedsadvarsler

## 6. Google-indeksering

Projektfilerne er opdateret, så:

- Canonical tags peger på `https://klinikguiden.com`
- `robots.txt` peger på `https://klinikguiden.com/sitemap.xml`
- `sitemap.xml` bruger `https://klinikguiden.com`
- `www` redirect er tilføjet

Når siden er live:

1. Opret Google Search Console property for `https://klinikguiden.com`.
2. Verificer domænet.
3. Indsend sitemap:
   `https://klinikguiden.com/sitemap.xml`

## DNS-records kort version

Brug disse i Simply.com:

```txt
@     A      75.2.60.5
www   CNAME  klinikguiden.netlify.app
```
