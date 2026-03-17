"""
Digi-Mikko Knowledge Base Builder
Taustaprosessi joka rakentaa tietokantaa vähitellen.
Lisää 3-5 uutta ohjetta joka ajokerralla.
Ajastetaan suoritettavaksi kerran päivässä.
"""

import json
import os
import random
from datetime import datetime

KNOWLEDGE_BASE_PATH = os.path.join(os.path.dirname(__file__), "knowledge_base.json")
BUILD_LOG_PATH = os.path.join(os.path.dirname(__file__), "data", "build_log.json")

# Laaja varasto uusia ohjeita joita lisätään vähitellen
NEW_GUIDES = {
    "tabletin_käyttö": {
        "otsikko": "Tabletin peruskäyttö",
        "taso": "helppo",
        "kategoria": "tabletti",
        "vaiheet": [
            "Käynnistä tabletti painamalla virtapainiketta pitkään (3 sekuntia).",
            "Avaa näytön lukitus pyyhkäisemällä ylöspäin tai syöttämällä PIN-koodi.",
            "Kotinäytöllä näet sovelluskuvakkeet. Napauta sovellusta avataksesi sen.",
            "Vaihda sovellusten välillä pyyhkäisemällä alhaalta ylös.",
            "Sulje tabletti painamalla virtapainiketta pitkään ja valitsemalla 'Sammuta'."
        ],
        "vinkki": "Pidä tablettia molemmin käsin vaakatasossa, niin se on helpointa käyttää."
    },
    "google_haku": {
        "otsikko": "Tiedon etsiminen Googlesta",
        "taso": "helppo",
        "kategoria": "internet",
        "vaiheet": [
            "Avaa selain (Chrome, Edge tai Safari).",
            "Kirjoita osoiteriville google.fi ja paina Enter.",
            "Kirjoita hakukenttään mitä etsit, esim. 'sää Helsinki'.",
            "Paina Enter tai napauta suurennuslasi-kuvaketta.",
            "Tulokset näkyvät listana. Napauta sinistä otsikkoa avataksesi sivun.",
            "Palaa takaisin hakutuloksiin painamalla selaimen nuoli-painiketta vasemmalla."
        ],
        "vinkki": "Käytä yksinkertaisia hakusanoja. Esim. 'resepti lohikeitto' toimii paremmin kuin 'miten tehdään lohikeittoa'."
    },
    "videopuhelu_whatsapp": {
        "otsikko": "WhatsApp-videopuhelu",
        "taso": "helppo",
        "kategoria": "puhelin",
        "vaiheet": [
            "Avaa WhatsApp.",
            "Napauta sen henkilön keskustelua, jolle haluat soittaa.",
            "Napauta oikeassa yläkulmassa olevaa videokamera-kuvaketta.",
            "Odota, että toinen henkilö vastaa.",
            "Puhelu käynnistyy! Näet toisen henkilön kuvassa.",
            "Lopeta puhelu napauttamalla punaista puhelinkuvaketta."
        ],
        "vinkki": "Varmista, että sinulla on hyvä WiFi-yhteys ennen videopuhelua. Se kuluttaa paljon dataa."
    },
    "apteekin_verkkopalvelu": {
        "otsikko": "Apteekin verkkopalvelun käyttö",
        "taso": "keskitaso",
        "kategoria": "terveys",
        "vaiheet": [
            "Avaa selain ja mene apteekki.fi tai oma-apteekkisi sivulle.",
            "Kirjaudu sisään pankkitunnuksilla tai mobiilivarmenteella.",
            "Näet reseptisi ja niiden uusimistiedot.",
            "Voit tilata reseptilääkkeitä noutoon tai kotiin toimitettuna.",
            "Valitse noutoapteekkisi listasta.",
            "Maksa tilaus verkossa tai noutohetkellä."
        ],
        "tärkeää": "Reseptilääkkeitä voi tilata vain kun lääkäri on kirjoittanut voimassa olevan reseptin."
    },
    "kanta_palvelu": {
        "otsikko": "Kanta.fi - Omat terveystiedot",
        "taso": "keskitaso",
        "kategoria": "terveys",
        "vaiheet": [
            "Mene osoitteeseen kanta.fi.",
            "Klikkaa 'Kirjaudu Omakantaan'.",
            "Tunnistaudu pankkitunnuksilla, mobiilivarmenteella tai henkilökortilla.",
            "Näet terveystietosi: lääkemääräykset, laboratoriotulokset, hoitokertomukset.",
            "Voit uusia reseptejä 'Reseptit' -osiossa.",
            "Muista kirjautua ulos, kun olet valmis."
        ],
        "vinkki": "Kanta.fi on turvallinen valtion palvelu. Kaikki terveystietosi ovat siellä yhdessä paikassa."
    },
    "valokuvien_siirto": {
        "otsikko": "Valokuvien siirto puhelimesta tietokoneelle",
        "taso": "keskitaso",
        "kategoria": "puhelin",
        "vaiheet": [
            "Yhdistä puhelin tietokoneeseen USB-johdolla.",
            "Puhelimen ruudulle voi tulla kysymys - valitse 'Tiedostonsiirto'.",
            "Avaa tietokoneella 'Tämä tietokone' (Windows) tai 'Finder' (Mac).",
            "Näet puhelimesi listassa. Klikkaa sitä.",
            "Etsi kansio nimeltä DCIM tai Camera.",
            "Kopioi haluamasi kuvat tietokoneen kansioon (esim. Kuvat-kansioon)."
        ],
        "vinkki": "Voit myös käyttää Google Kuvia - kuvat siirtyvät automaattisesti pilveen ja näet ne tietokoneella osoitteessa photos.google.com."
    },
    "sähköinen_allekirjoitus": {
        "otsikko": "Sähköinen allekirjoitus",
        "taso": "keskitaso",
        "kategoria": "viranomaiset",
        "vaiheet": [
            "Kun saat dokumentin allekirjoitettavaksi, avaa saamasi linkki.",
            "Tunnistaudu pankkitunnuksilla tai mobiilivarmenteella.",
            "Lue dokumentti huolellisesti.",
            "Klikkaa 'Allekirjoita' tai 'Hyväksy'.",
            "Vahvista allekirjoitus tunnistautumalla uudelleen.",
            "Saat vahvistuksen sähköpostiin kun allekirjoitus on tehty."
        ],
        "tärkeää": "Sähköinen allekirjoitus on laillisesti yhtä pätevä kuin käsin kirjoitettu."
    },
    "bluetooth_yhdistäminen": {
        "otsikko": "Bluetooth-laitteen yhdistäminen",
        "taso": "keskitaso",
        "kategoria": "laitteet",
        "vaiheet": [
            "Laita Bluetooth-laite (kuulokkeet, kaiutin tms.) paritustilaan. Yleensä pitkä painallus virtanäppäimeen.",
            "Avaa puhelimesta tai tietokoneesta Asetukset.",
            "Valitse 'Bluetooth' ja varmista, että se on päällä.",
            "Etsi laitteesi listasta ja napauta sen nimeä.",
            "Jos kysytään PIN-koodia, syötä 0000 tai 1234 (yleisin).",
            "Kun yhdistäminen onnistuu, laite näkyy 'Yhdistetty' tilassa."
        ],
        "vinkki": "Jos laite ei näy listassa, sammuta Bluetooth ja käynnistä uudelleen. Varmista myös, että laite on tarpeeksi lähellä (alle 10 metriä)."
    },
    "sähköpostin_liite": {
        "otsikko": "Liitetiedoston lisääminen sähköpostiin",
        "taso": "helppo",
        "kategoria": "email",
        "vaiheet": [
            "Avaa sähköpostiohjelma ja klikkaa 'Uusi viesti'.",
            "Kirjoita vastaanottaja ja aihe normaalisti.",
            "Etsi paperiliitti-kuvake (📎) viestin alareunasta tai yläosasta.",
            "Klikkaa sitä ja selaa tiedostosi.",
            "Valitse haluamasi tiedosto ja klikkaa 'Avaa'.",
            "Liite näkyy nyt viestin alaosassa. Voit lisätä useita liitteitä.",
            "Lähetä viesti normaalisti."
        ],
        "vinkki": "Useimmat sähköpostipalvelut rajoittavat liitteen koon 25 megatavuun. Suurille tiedostoille käytä Google Drivea tai OneDrivea."
    },
    "asetukset_näyttö": {
        "otsikko": "Näytön kirkkauden ja tekstikoon säätö",
        "taso": "helppo",
        "kategoria": "asetukset",
        "puhelin": [
            "Pyyhkäise ylhäältä alas nähdäksesi pika-asetukset.",
            "Vedä kirkkauden liukusäädintä vasemmalle (tummempi) tai oikealle (kirkkaampi).",
            "Tekstikokoa muutetaan: Asetukset → Näyttö → Fonttikoko."
        ],
        "tietokone": [
            "Klikkaa oikeassa alanurkassa olevaa ilmoitusaluetta.",
            "Vedä kirkkauden liukusäädintä.",
            "Tekstikokoa muutetaan: Asetukset → Helppokäyttöisyys → Näyttö → Tekstin koko."
        ],
        "vinkki": "Yötilassa (tumma tila) näyttö on miellyttävämpi silmille pimeässä. Löytyy yleensä pika-asetuksista."
    },
    "spotify_musiikki": {
        "otsikko": "Musiikin kuuntelu Spotifyssa",
        "taso": "helppo",
        "kategoria": "viihde",
        "vaiheet": [
            "Asenna Spotify-sovellus (vihreä kuvake) sovelluskaupasta.",
            "Avaa Spotify ja luo tili tai kirjaudu sisään.",
            "Napauta yläosan hakukenttää.",
            "Kirjoita artistin nimi tai kappaleen nimi.",
            "Napauta haluttua kappaletta aloittaaksesi kuuntelun.",
            "Alaosassa näet soittimen jolla voit pysäyttää, kelata ja säätää äänenvoimakkuutta."
        ],
        "vinkki": "Spotify Free on ilmainen mutta sisältää mainoksia. Spotify Premium (10,99€/kk) poistaa mainokset."
    },
    "digi_postilaatikko": {
        "otsikko": "Postin OmaPosti - Digitaalinen postilaatikko",
        "taso": "keskitaso",
        "kategoria": "viranomaiset",
        "vaiheet": [
            "Mene osoitteeseen omaposti.posti.fi.",
            "Kirjaudu pankkitunnuksilla.",
            "Näet digitaalisesti vastaanotetut kirjeet.",
            "Voit lukea kirjeet avataamalla ne.",
            "Virallinen posti (verottaja, Kela jne.) tulee tänne jos olet aktivoinut palvelun.",
            "Voit myös lähettää kirjeitä digitaalisesti."
        ],
        "vinkki": "Kun aktivoit OmaPostin, monet viranomaiskirjeet tulevat vain sähköisesti. Tarkista postilaatikkosi säännöllisesti."
    },
    "teams_kokous": {
        "otsikko": "Microsoft Teams -kokoukseen liittyminen",
        "taso": "keskitaso",
        "kategoria": "tietokone",
        "vaiheet": [
            "Saat kokouskutsun sähköpostiin. Klikkaa 'Liity Teams-kokoukseen' linkkiä.",
            "Selain avautuu. Valitse 'Käytä sen sijaan verkkosovellusta' tai avaa Teams-sovellus.",
            "Kirjoita nimesi jos kysytään.",
            "Tarkista, että kamera ja mikrofoni ovat päällä.",
            "Klikkaa 'Liity nyt' painiketta.",
            "Olet nyt kokouksessa! Voit mykistää mikrofonin painamalla mikrofoni-kuvaketta."
        ],
        "painikkeet": "Mikrofoni = mykistä/avaa. Kamera = sammuta/käynnistä. Käsi ylös = pyydä puheenvuoro. Puhelin-kuvake = poistu.",
        "vinkki": "Testaa ääni ja kuva etukäteen Teams-sovelluksen asetuksissa."
    },
    "hätänumero_112": {
        "otsikko": "112 Suomi -sovellus hätätilanteissa",
        "taso": "helppo",
        "kategoria": "turvallisuus",
        "vaiheet": [
            "Asenna '112 Suomi' -sovellus sovelluskaupasta (ilmainen).",
            "Avaa sovellus ja anna sille lupa käyttää sijaintiasi.",
            "Hätätilanteessa paina sovelluksen suurta punaista painiketta.",
            "Sovellus soittaa automaattisesti 112:een ja välittää sijaintisi.",
            "Kerro hätäkeskukselle mitä on tapahtunut."
        ],
        "tärkeää": "112 Suomi -sovellus on virallinen hätäkeskuslaitoksen sovellus. Se on ilmainen ja voi pelastaa henkiä."
    },
    "yle_areena": {
        "otsikko": "Yle Areena - TV-ohjelmien katselu",
        "taso": "helppo",
        "kategoria": "viihde",
        "vaiheet": [
            "Avaa selain ja mene osoitteeseen areena.yle.fi, tai asenna Yle Areena -sovellus.",
            "Luo Yle-tunnus tai kirjaudu sisään (ilmainen).",
            "Selaa ohjelmia kategorioittain tai käytä hakua.",
            "Klikkaa ohjelmaa aloittaaksesi katselun.",
            "Voit pysäyttää, kelata eteen ja taakse."
        ],
        "vinkki": "Yle Areena on täysin ilmainen! Sieltä löydät TV-ohjelmat, elokuvat, dokumentit ja radion."
    },
    "vahva_tunnistautuminen": {
        "otsikko": "Vahva tunnistautuminen (pankkitunnukset ja mobiili)",
        "taso": "keskitaso",
        "kategoria": "turvallisuus",
        "vaiheet": [
            "Kun palvelu pyytää tunnistautumista, valitse tunnistautumistapa.",
            "Pankkitunnukset: Syötä käyttäjätunnus ja salasana, sen jälkeen avainluku.",
            "Mobiiliauttaja: Syötä puhelinnumero, hyväksy pyyntö kännykässä.",
            "Mobiilivarmenne: Toimi mobiiliauttajan tapaan mutta vaatii SIM-kortin aktivoinnin.",
            "Henkilökortti: Laita kortti lukijaan ja syötä PIN-koodi."
        ],
        "tärkeää": "Älä koskaan anna tunnistautumistietojasi toiselle henkilölle. Aitot palvelut eivät koskaan kysy niitä puhelimitse."
    },
    "karttasovellus": {
        "otsikko": "Google Maps - Reitin hakeminen",
        "taso": "helppo",
        "kategoria": "puhelin",
        "vaiheet": [
            "Avaa Google Maps -sovellus (tai mene maps.google.fi).",
            "Napauta hakukenttää ja kirjoita määränpää (esim. 'Meilahden sairaala').",
            "Napauta 'Reittiohjeet' (nuoli-kuvake).",
            "Valitse kulkutapa: auto, julkinen liikenne, kävely.",
            "Napauta 'Aloita' niin saat reaaliaikaiset ohjeet.",
            "Sovellus opastaa sinua perille äänellä."
        ],
        "vinkki": "Julkisen liikenteen reiteissä näet myös bussien ja junien aikataulut."
    },
    "ilmoitukset_hallinta": {
        "otsikko": "Puhelimen ilmoitusten hallinta",
        "taso": "helppo",
        "kategoria": "puhelin",
        "vaiheet": [
            "Avaa Asetukset.",
            "Valitse 'Ilmoitukset' tai 'Sovellukset ja ilmoitukset'.",
            "Näet listan sovelluksista jotka lähettävät ilmoituksia.",
            "Napauta sovellusta, jonka ilmoitukset häiritsevät.",
            "Kytke ilmoitukset pois päältä liukukytkimellä.",
            "Voit myös valita 'Älä häiritse' -tilan pika-asetuksista."
        ],
        "vinkki": "Pidä tärkeät ilmoitukset päällä (puhelin, WhatsApp) mutta sammuta turhat (pelit, mainokset)."
    },
    "digipostiv_kela": {
        "otsikko": "Kelan asiointipalvelu verkossa",
        "taso": "keskitaso",
        "kategoria": "viranomaiset",
        "vaiheet": [
            "Mene osoitteeseen kela.fi ja klikkaa 'OmaKela'.",
            "Kirjaudu pankkitunnuksilla tai mobiilivarmenteella.",
            "Näet omat etuuspäätöksesi ja hakemuksesi.",
            "Voit hakea etuuksia ja lähettää liitteitä.",
            "Viestit-osiossa voit lähettää kysymyksiä Kelalle.",
            "Muista kirjautua ulos, kun olet valmis."
        ],
        "tärkeää": "Kelaan voi asioida myös puhelimitse numerossa 020 634 11 (ma-pe 9-16)."
    },
    "akun_säästö": {
        "otsikko": "Puhelimen akun säästäminen",
        "taso": "helppo",
        "kategoria": "puhelin",
        "vaiheet": [
            "Vähennä näytön kirkkautta pika-asetuksista.",
            "Kytke WiFi ja Bluetooth pois kun et käytä niitä.",
            "Sulje sovellukset joita et käytä (pyyhkäise pois viimeisimmät).",
            "Ota käyttöön virransäästötila: Asetukset → Akku → Virransäästö.",
            "Lyhennä näytön sammumisaikaa: Asetukset → Näyttö → Näytön aikakatkaisu."
        ],
        "vinkki": "Lataa puhelinta kun akku on 20-80%. Täysi lataus ja täysi tyhjennys kuluttavat akkua enemmän."
    },
    "rekisteröityminen_palveluun": {
        "otsikko": "Uuteen verkkopalveluun rekisteröityminen",
        "taso": "keskitaso",
        "kategoria": "internet",
        "vaiheet": [
            "Mene palvelun verkkosivulle.",
            "Etsi 'Rekisteröidy', 'Luo tili' tai 'Sign up' -painike.",
            "Syötä sähköpostiosoitteesi ja keksi vahva salasana.",
            "Täytä muut pyydetyt tiedot (nimi jne.).",
            "Hyväksy käyttöehdot (lue ne ensin!).",
            "Avaa sähköpostisi - löydät vahvistusviestin. Klikkaa vahvistuslinkkiä.",
            "Tilisi on nyt valmis käytettäväksi!"
        ],
        "tärkeää": "Käytä jokaiseen palveluun eri salasanaa. Jos yksi salasana vuotaa, muut tilisi pysyvät turvassa."
    },
    "verkkokaupoista_ostaminen": {
        "otsikko": "Turvallinen ostaminen verkosta",
        "taso": "keskitaso",
        "kategoria": "internet",
        "vaiheet": [
            "Käytä tunnettuja verkkokauppoja (verkkokauppa.com, prisma.fi, S-kaupat.fi).",
            "Tarkista, että osoite alkaa 'https://' ja näet lukkomerkin.",
            "Lisää tuotteet ostoskoriin.",
            "Mene kassalle ja täytä toimitustiedot.",
            "Valitse maksutapa: verkkopankki, kortti tai MobilePay.",
            "Tarkista tilausvahvistus sähköpostistasi."
        ],
        "turvallisuus": [
            "Älä osta sivuilta jotka näyttävät epäilyttäviltä.",
            "Vertaa hintoja useista kaupoista.",
            "Tarkista palautusehdot ennen ostoa.",
            "Verkkokaupalla on 14 päivän peruutusoikeus EU:ssa."
        ]
    },
    "pdf_avaaminen": {
        "otsikko": "PDF-tiedoston avaaminen ja tulostaminen",
        "taso": "helppo",
        "kategoria": "tietokone",
        "vaiheet": [
            "Kaksoisklikkaa PDF-tiedostoa avataksesi sen.",
            "Tiedosto aukeaa selaimessa tai Adobe Readerissa.",
            "Voit suurentaa tekstiä painamalla Ctrl ja + (plus).",
            "Tulostaaksesi paina Ctrl + P.",
            "Valitse tulostin ja klikkaa 'Tulosta'."
        ],
        "vinkki": "Jos PDF ei avaudu, asenna ilmainen Adobe Acrobat Reader osoitteesta get.adobe.com/fi/reader."
    },
    "suomi_fi_viestit": {
        "otsikko": "Suomi.fi-viestit - Viranomaispostia sähköisesti",
        "taso": "keskitaso",
        "kategoria": "viranomaiset",
        "vaiheet": [
            "Mene osoitteeseen viestit.suomi.fi.",
            "Kirjaudu pankkitunnuksilla.",
            "Aktivoi palvelu ensimmäisellä kerralla.",
            "Viranomaiset (verottaja, Kela, kunta) lähettävät kirjeensä tänne.",
            "Saat sähköposti-ilmoituksen uusista viesteistä.",
            "Vanhat viestit säilyvät palvelussa."
        ],
        "tärkeää": "Kun aktivoit Suomi.fi-viestit, osa viranomaisten kirjeistä ei enää tule paperisena. Tarkista palvelu säännöllisesti."
    },
    "puhelimen_uudelleenkäynnistys": {
        "otsikko": "Puhelimen uudelleenkäynnistys ongelmatilanteessa",
        "taso": "helppo",
        "kategoria": "puhelin",
        "vaiheet": [
            "Paina virtapainiketta pitkään (5-10 sekuntia).",
            "Ruudulle tulee valikko. Valitse 'Käynnistä uudelleen' tai 'Restart'.",
            "Jos ruutu ei reagoi, pidä virtapainiketta pohjassa 15-20 sekuntia.",
            "Puhelin sammuu ja käynnistyy uudelleen.",
            "Odota, kunnes puhelin on täysin käynnistynyt."
        ],
        "vinkki": "Uudelleenkäynnistys ratkaisee monia ongelmia! Kokeile aina ensin tätä jos jokin ei toimi."
    }
}


def load_knowledge_base():
    """Lataa nykyinen tietokanta."""
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_knowledge_base(data):
    """Tallenna tietokanta."""
    with open(KNOWLEDGE_BASE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_build_log():
    """Lataa rakennusloki."""
    os.makedirs(os.path.dirname(BUILD_LOG_PATH), exist_ok=True)
    if os.path.exists(BUILD_LOG_PATH):
        with open(BUILD_LOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"added_guides": [], "last_run": None, "total_added": 0}


def save_build_log(log):
    """Tallenna rakennusloki."""
    with open(BUILD_LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)


def get_new_guides(build_log, count=3):
    """Valitse uudet ohjeet jotka eivät ole vielä tietokannassa."""
    already_added = set(build_log.get("added_guides", []))
    available = {k: v for k, v in NEW_GUIDES.items() if k not in already_added}

    if not available:
        print("Kaikki ohjeet on jo lisätty tietokantaan!")
        return {}

    # Valitse satunnaisesti count kappaletta
    keys = list(available.keys())
    random.shuffle(keys)
    selected_keys = keys[:min(count, len(keys))]

    return {k: available[k] for k in selected_keys}


def update_knowledge_base():
    """Päivitä tietokanta uusilla ohjeilla."""
    print(f"\n{'='*50}")
    print(f"Digi-Mikko Knowledge Base Builder")
    print(f"Ajetaan: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*50}\n")

    # Lataa tietokanta ja loki
    kb = load_knowledge_base()
    build_log = load_build_log()

    existing_count = len(kb.get("ohjeet", {}))
    print(f"Nykyisiä ohjeita tietokannassa: {existing_count}")
    print(f"Aiemmin lisätty automaattisesti: {build_log.get('total_added', 0)}")

    # Hae uudet ohjeet
    new_guides = get_new_guides(build_log, count=3)

    if not new_guides:
        print("\nEi uusia ohjeita lisättäväksi.")
        build_log["last_run"] = datetime.now().isoformat()
        save_build_log(build_log)
        return

    # Lisää uudet ohjeet tietokantaan
    if "ohjeet" not in kb:
        kb["ohjeet"] = {}

    for key, guide in new_guides.items():
        kb["ohjeet"][key] = guide
        build_log["added_guides"].append(key)
        build_log["total_added"] = build_log.get("total_added", 0) + 1
        print(f"  ✅ Lisätty: {guide['otsikko']}")

    # Tallenna
    save_knowledge_base(kb)
    build_log["last_run"] = datetime.now().isoformat()
    save_build_log(build_log)

    new_total = len(kb.get("ohjeet", {}))
    print(f"\nOhjeita nyt tietokannassa: {new_total}")
    print(f"Uusia ohjeita lisätty: {len(new_guides)}")
    remaining = len(NEW_GUIDES) - len(build_log["added_guides"])
    print(f"Ohjeita jonossa: {remaining}")
    print(f"\nValmis! Seuraava ajo lisää taas uusia ohjeita.")


if __name__ == "__main__":
    update_knowledge_base()
