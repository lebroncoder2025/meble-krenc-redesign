# Meble Krenc — nowa strona statyczna

Elegancka, responsywna strona multipage dla Meble Krenc s.c. Maria Krenc, Michał Krenc.

## Zakres

- osobne podstrony: główna, oferta, o nas, portfolio i kontakt,
- osobne podstrony: polityka prywatności, polityka cookies i ustawienia cookies,
- autorski znak wektorowy MK w `assets/logo.svg`,
- spokojna paleta: grafit, krem, piaskowy beż, taupe i glina,
- zaokrąglone komponenty, responsywna nawigacja mobilna i dopracowane kadrowanie zdjęć,
- portfolio z dużą siatką zdjęć i jasnym oznaczeniem jedynej publicznie potwierdzonej realizacji,
- banner cookies, modal ustawień i zapis preferencji w niezbędnym pliku `mk_cookie_consent`,
- formularz kontaktowy po stronie klienta,
- animacje wejścia z obsługą `prefers-reduced-motion`,
- semantyczny markup, skip link i opisy alternatywne obrazów.

## Dane firmy wykorzystane w projekcie

- Meble Krenc s.c. Maria Krenc, Michał Krenc
- Pałucka 5, 62-105 Łekno
- telefon: 663 378 388
- działalność od 2007 roku

Treści zostały przygotowane na bazie publicznie dostępnych informacji. W czasie przygotowania redesignu domena `meblekrenc.pl` zwracała błąd krytyczny WordPressa HTTP 500, dlatego projekt nie kopiuje niedostępnego layoutu i opiera się na potwierdzonych danych firmy oraz zwięzłej prezentacji zakresu usług.

Publiczny profil Facebook MebleKrenc udostępniał jedno zdjęcie produktu, które zostało pobrane do `assets/facebook-profile.jpg` i oznaczone w portfolio jako opublikowana realizacja. Pozostałe zdjęcia z Unsplash są podpisane jako inspiracje kierunków — nie są prezentowane jako wykonane przez Meble Krenc.

## Uruchomienie

Otwórz `index.html` w przeglądarce albo uruchom dowolny prosty serwer statyczny, np. `npx serve .`.

Formularz nie wysyła danych do backendu. Przed produkcyjnym wdrożeniem należy podpiąć docelową skrzynkę lub usługę formularzy.
