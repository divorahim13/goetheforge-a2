// Question Bank & Vocabulary Bank for GoetheForge A2
// Contains 3 full sets of Lesen, Hören, Schreiben, Sprechen, and 300+ vocabulary words.

export interface LesenQuestion {
  id: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: "a" | "b" | "c";
  explanation: string;
}

export interface LesenTeil4Question {
  id: string;
  person: string;
  description: string;
  correctAnswer: "a" | "b" | "c" | "d" | "e" | "f" | "X";
  explanation: string;
}

export interface LesenSet {
  id: string;
  name: string;
  teil1: {
    text: string;
    questions: LesenQuestion[];
  };
  teil2: {
    intro: string;
    items: {
      storeName: string;
      floor: string;
    }[];
    questions: {
      id: string;
      situation: string;
      options: {
        a: string; // Floor X
        b: string; // Floor Y
        c: string; // Anderer Stock
      };
      correctAnswer: "a" | "b" | "c";
      explanation: string;
    }[];
  };
  teil3: {
    email: string;
    questions: LesenQuestion[];
  };
  teil4: {
    intro: string;
    ads: {
      id: string; // a, b, c, d, e, f
      title: string;
      content: string;
    }[];
    people: LesenTeil4Question[];
  };
}

export interface HorenQuestion {
  id: string;
  question: string;
  audioText: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: "a" | "b" | "c";
  explanation: string;
  trapTip?: string;
}

export interface HorenTeil2Match {
  name: string;
  correctItem: string; // a - i
  explanation: string;
}

export interface HorenTeil3Question {
  id: string;
  question: string;
  audioText: string;
  options: {
    a: { label: string; svgType: string };
    b: { label: string; svgType: string };
    c: { label: string; svgType: string };
  };
  correctAnswer: "a" | "b" | "c";
  explanation: string;
  trapTip?: string;
}

export interface HorenTeil4Question {
  id: string;
  statement: string;
  correctAnswer: "Ja" | "Nein";
  explanation: string;
  trapTip?: string;
}

export interface HorenSet {
  id: string;
  name: string;
  teil1: {
    questions: HorenQuestion[];
  };
  teil2: {
    intro: string;
    audioText: string;
    items: { id: string; label: string; desc: string }[]; // options a to i
    matches: HorenTeil2Match[];
  };
  teil3: {
    questions: HorenTeil3Question[];
  };
  teil4: {
    intro: string;
    audioText: string;
    questions: HorenTeil4Question[];
  };
}

export interface SchreibenScenario {
  id: string;
  teil1: {
    title: string;
    situation: string;
    points: string[];
  };
  teil2: {
    title: string;
    situation: string;
    points: string[];
  };
}

export interface SprechenSchedule {
  day: string;
  slots: {
    time: string;
    candidateA: { label: string; busy: boolean };
    candidateB: { label: string; busy: boolean };
  }[];
}

export interface SprechenTeil3Scenario {
  id: string;
  theme: string;
  situation: string;
  scheduleA: { [time: string]: string }; // empty means free
  scheduleB: { [time: string]: string }; // empty means free
}

export interface Word {
  german: string;
  germanPlural?: string;
  indonesian: string;
  gender?: "der" | "die" | "das";
  type: "noun" | "verb" | "adjective" | "other";
  category: string;
}

// ==========================================
// 1. LESEN MODULE BANK
// ==========================================
export const LESEN_BANK: LesenSet[] = [
  {
    id: "lesen-set-1",
    name: "Latihan Set A",
    teil1: {
      text: "Liebe Fahrgäste, wegen Bauarbeiten an den Gleisen fährt die U-Bahn-Linie U3 am kommenden Wochenende (Samstag und Sonntag) nicht zwischen den Stationen Hauptbahnhof und Westend. Ein Ersatzverkehr mit Bussen ist für Sie eingerichtet. Die Busse fahren alle 10 Minuten vor dem Haupteingang des Bahnhofs ab. Bitte beachten Sie, dass die Fahrzeit mit dem Bus ca. 15 Minuten länger ist als mit der U-Bahn. Fahrgäste zum Flughafen benutzen bitte die S-Bahn S8, die ohne Verspätungen fährt. Wir bitten um Ihr Verständnis.",
      questions: [
        {
          id: "l1-q1",
          question: "Was ist am Wochenende auf der Linie U3?",
          options: {
            a: "Die Züge fahren wie gewohnt.",
            b: "Einige U-Bahn-Stationen werden nicht angefahren.",
            c: "Es gibt überhaupt keine Transportmöglichkeit."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'U3 fährt am kommenden Wochenende nicht zwischen den Stationen Hauptbahnhof und Westend', sehingga stasiun-stasiun tersebut tidak dilewati kereta."
        },
        {
          id: "l1-q2",
          question: "Wo fahren die Ersatzbusse ab?",
          options: {
            a: "Am Bahnhofsausgang West.",
            b: "Vor dem Haupteingang des Hauptbahnhofs.",
            c: "Direkt an den U-Bahn-Gleisen."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'Die Busse fahren... vor dem Haupteingang des Bahnhofs ab.'"
        },
        {
          id: "l1-q3",
          question: "Wie oft fahren die Ersatzbusse?",
          options: {
            a: "Alle fünf Minuten.",
            b: "Jede Viertelstunde.",
            c: "Alle 10 Minuten."
          },
          correctAnswer: "c",
          explanation: "Teks menyebutkan 'Die Busse fahren alle 10 Minuten...'"
        },
        {
          id: "l1-q4",
          question: "Wie ändert sich die Reisezeit mit den Bussen?",
          options: {
            a: "Sie dauert 15 Minuten länger.",
            b: "Sie ist schneller als die U-Bahn.",
            c: "Sie bleibt genau gleich."
          },
          correctAnswer: "a",
          explanation: "Teks menyebutkan 'dass die Fahrzeit mit dem Bus ca. 15 Minuten länger ist als mit der U-Bahn.'"
        },
        {
          id: "l1-q5",
          question: "Was sollen Fahrgäste zum Flughafen tun?",
          options: {
            a: "Den Ersatzbus nehmen.",
            b: "Mit der S-Bahn S8 fahren.",
            c: "Ein Taxi rufen."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'Fahrgäste zum Flughafen benutzen bitte die S-Bahn S8...'"
        }
      ]
    },
    teil2: {
      intro: "Sie befinden sich im Einkaufszentrum 'Galeria Nova'. Sehen Sie sich die Informationstafel an.",
      items: [
        { storeName: "Apotheke am Ring", floor: "Erdgeschoss" },
        { storeName: "Schuhhaus Reno (Schuhe für Damen & Herren)", floor: "1. Obergeschoss" },
        { storeName: "Kinderland (Spielzeuge & Kinderbekleidung)", floor: "2. Obergeschoss" },
        { storeName: "Restaurant Bella Vista (Italienische Küche)", floor: "Dachgeschoss (3. OG)" },
        { storeName: "Supermarkt Frisch & Gut", floor: "Untergeschoss (-1)" }
      ],
      questions: [
        {
          id: "l2-q1",
          situation: "Sie suchen ein Geburtstagsgeschenk für einen 5-jährigen Jungen.",
          options: {
            a: "Erdgeschoss",
            b: "2. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Kinderland (Spielzeuge & Kinderbekleidung) berada di '2. Obergeschoss'."
        },
        {
          id: "l2-q2",
          situation: "Sie möchten frisches Gemüse und Milch einkaufen.",
          options: {
            a: "Erdgeschoss",
            b: "Untergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Supermarkt Frisch & Gut berada di 'Untergeschoss (-1)'."
        },
        {
          id: "l2-q3",
          situation: "Sie haben Kopfschmerzen und brauchen Tabletten.",
          options: {
            a: "Erdgeschoss",
            b: "1. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "a",
          explanation: "Apotheke am Ring (apotek untuk membeli obat) berada di 'Erdgeschoss'."
        },
        {
          id: "l2-q4",
          situation: "Sie möchten Pizza oder Pasta zu Mittag essen.",
          options: {
            a: "1. Obergeschoss",
            b: "Dachgeschoss (3. OG)",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Restaurant Bella Vista (Italienische Küche) berada di 'Dachgeschoss (3. OG)'."
        },
        {
          id: "l2-q5",
          situation: "Sie möchten neue Sportschuhe für sich selbst kaufen.",
          options: {
            a: "1. Obergeschoss",
            b: "2. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "a",
          explanation: "Schuhhaus Reno (Schuhe für Damen & Herren) berada di '1. Obergeschoss'."
        }
      ]
    },
    teil3: {
      email: "Betreff: Einladung zu meiner Geburtstagsparty\n\nHallo Jan,\n\nich hoffe, es geht dir gut! Wie du weißt, habe ich nächste Woche am Donnerstag Geburtstag. Ich möchte das gerne feiern und lade dich herzlich zu meiner Party ein. Die Party findet aber nicht am Donnerstag statt, sondern am Samstag, dem 12. Oktober, ab 19 Uhr bei mir zu Hause. Für Essen und Getränke ist gesorgt, ich mache einen großen Nudelsalat und grille Fleisch. Du musst also nichts zu essen mitbringen. Aber wenn du möchtest, kannst du eine Flasche Limonade oder Saft mitbringen. Bring bitte auch gute Laune und deine Gitarre mit, damit wir Musik machen können! Sag mir bitte bis Dienstag Bescheid, ob du kommen kannst.\n\nViele Grüße,\nMarkus",
      questions: [
        {
          id: "l3-q1",
          question: "Wann hat Markus Geburtstag?",
          options: {
            a: "Am Donnerstag.",
            b: "Am Samstag.",
            c: "Am Dienstag."
          },
          correctAnswer: "a",
          explanation: "Markus menulis: 'wie du weißt, habe ich nächste Woche am Donnerstag Geburtstag'."
        },
        {
          id: "l3-q2",
          question: "Wann wird gefeiert?",
          options: {
            a: "Am Donnerstag ab 19 Uhr.",
            b: "Am Samstag, dem 12. Oktober, ab 19 Uhr.",
            c: "Am nächsten Dienstag."
          },
          correctAnswer: "b",
          explanation: "Markus menulis: 'Die Party findet... am Samstag, dem 12. Oktober, ab 19 Uhr... statt'."
        },
        {
          id: "l3-q3",
          question: "Was bereitet Markus für das Essen vor?",
          options: {
            a: "Er backt Pizza.",
            b: "Er bestellt Sushi.",
            c: "Er grillt Fleisch und macht Nudelsalat."
          },
          correctAnswer: "c",
          explanation: "Markus menulis: 'ich mache einen großen Nudelsalat und grille Fleisch.'"
        },
        {
          id: "l3-q4",
          question: "Was kann Jan zur Party mitbringen?",
          options: {
            a: "Etwas zum Grillen.",
            b: "Einen Nudelsalat.",
            c: "Eine Flasche Saft oder Limonade."
          },
          correctAnswer: "c",
          explanation: "Markus schreibt: 'Du musst also nichts zu essen mitbringen. Aber wenn du möchtest, kannst du eine Flasche Limonade oder Saft mitbringen.'"
        },
        {
          id: "l3-q5",
          question: "Bis wann soll Jan antworten?",
          options: {
            a: "Bis Dienstag.",
            b: "Bis Donnerstag.",
            c: "Bis Samstag."
          },
          correctAnswer: "a",
          explanation: "Markus schreibt: 'Sag mir bitte bis Dienstag Bescheid, ob du kommen kannst.'"
        }
      ]
    },
    teil4: {
      intro: "Lesen Sie die Aufgaben 16–20 und die Anzeigen a–f. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Kennzeichnen Sie diese mit X.",
      ads: [
        { id: "a", title: "WG-Zimmer im Zentrum", content: "Suche Mitbewohner für ein schönes 15qm Zimmer in 3er WG. Sehr zentral gelegen, 5 Min. zum Bahnhof. Miete: 350 € warm. Ab sofort frei. Kontakt: wg-zentrum@mail.de" },
        { id: "b", title: "Suche Einzimmerwohnung", content: "Junger Student sucht ruhiges 1-Zimmer-Appartement in Uninähe. Maximal 400 Euro warm. Ab 01. November. Tel: 0176-99238" },
        { id: "c", title: "Möbliertes Zimmer auf Zeit", content: "Biete gemütliches, voll möbliertes Zimmer für Pendler oder Praktikanten. Nur wochentags (Mo-Fr) zu vermieten. Keine Haustiere. Miete: 280 €. zimmer-zeit@web.de" },
        { id: "d", title: "Helle 3-Zimmer-Wohnung zu vermieten", content: "Schöne 80qm Wohnung mit Balkon und Einbauküche im grünen Vorort. Ideal für Familien. Keine Wohngemeinschaften. Miete: 850 € kalt + NK. Tel: 089-44556" },
        { id: "e", title: "Suche Nachmieter für Loft", content: "Suche Nachmieter für luxuriöses 2-Zimmer-Loft (110qm) mit großer Dachterrasse. Miete: 1200 € kalt. Einbauküche muss übernommen werden (Ablöse 2000 €). Tel: 0151-22334" },
        { id: "f", title: "Ferienwohnung am See", content: "Schöne Ferienwohnung für 2 bis 4 Personen zu vermieten. Ideal für den Urlaub am Wochenende oder in den Ferien. Haustiere erlaubt! info@ferien-see.de" }
      ],
      people: [
        {
          id: "l4-p1",
          person: "Klaus (Praktikant)",
          description: "Klaus macht für drei Monate ein Praktikum und sucht eine günstige Unterkunft für die Arbeitstage von Montag bis Freitag.",
          correctAnswer: "c",
          explanation: "Iklan C cocok untuk Klaus karena menawarkan kamar 'Nur wochentags (Mo-Fr) zu vermieten' (hanya hari kerja, Sen-Jum)."
        },
        {
          id: "l4-p2",
          person: "Familie Weber",
          description: "Familie Weber (Eltern mit zwei Kindern) sucht eine bezahlbare, größere Wohnung mit drei Zimmern und Balkon.",
          correctAnswer: "d",
          explanation: "Iklan D cocok untuk keluarga Weber karena menawarkan '3-Zimmer-Wohnung... Ideal für Familien' dengan balkon."
        },
        {
          id: "l4-p3",
          person: "Sarah (Studentin)",
          description: "Sarah fängt ihr Studium an und möchte in einer Wohngemeinschaft mit anderen Studenten wohnen. Ihr Budget ist 380 €.",
          correctAnswer: "a",
          explanation: "Iklan A cocok untuk Sarah karena menawarkan 'Zimmer in 3er WG' (sekamar bertiga di WG) dengan harga 350 €."
        },
        {
          id: "l4-p4",
          person: "Herr Müller",
          description: "Herr Müller möchte Urlaub machen und sucht eine kleine Unterkunft am Wasser, wo er auch seinen Hund mitbringen darf.",
          correctAnswer: "f",
          explanation: "Iklan F cocok karena menawarkan 'Ferienwohnung am See' (akomodasi liburan dekat danau) dan 'Haustiere erlaubt' (hewan peliharaan diperbolehkan)."
        },
        {
          id: "l4-p5",
          person: "Frau Schmidt (Rentnerin)",
          description: "Frau Schmidt sucht eine kleine 1-Zimmer-Wohnung im Zentrum zur dauerhaften Miete für maximal 300 Euro warm.",
          correctAnswer: "X",
          explanation: "Tidak ada iklan yang cocok. Iklan B mencari (bukan menawarkan) kamar, dan iklan lainnya tidak sesuai dengan budget atau kriteria Frau Schmidt."
        }
      ]
    }
  },
  {
    id: "lesen-set-2",
    name: "Latihan Set B",
    teil1: {
      text: "Liebe Museumsbesucher! Wegen Renovierungsarbeiten ist die Abteilung für Moderne Kunst im zweiten Stock ab heute bis zum 15. August geschlossen. Alle anderen Ausstellungsbereiche (Klassische Kunst, Geschichte des Mittelalters sowie die Sonderausstellung im Erdgeschoss) sind wie gewohnt geöffnet. Besucher, die bereits online Tickets für die Moderne Kunst gekauft haben, können diese an der Kasse gegen Tickets für die Sonderausstellung eintauschen oder erhalten ihr Geld zurück. Das Museumscafé hat veränderte Öffnungszeiten: Es schließt bereits um 17 Uhr statt um 19 Uhr. Wir danken Ihnen für Ihr Verständnis.",
      questions: [
        {
          id: "l1-q1-s2",
          question: "Welcher Bereich ist geschlossen?",
          options: {
            a: "Die Klassische Kunst.",
            b: "Die Moderne Kunst.",
            c: "Die Sonderausstellung."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'ist die Abteilung für Moderne Kunst... geschlossen'."
        },
        {
          id: "l1-q2-s2",
          question: "Wie lange dauern die Arbeiten?",
          options: {
            a: "Bis zum 15. August.",
            b: "Sie fangen erst am 15. August an.",
            c: "Das ist nicht bekannt."
          },
          correctAnswer: "a",
          explanation: "Teks menyebutkan 'geschlossen ab heute bis zum 15. August'."
        },
        {
          id: "l1-q3-s2",
          question: "Wo befindet sich die Sonderausstellung?",
          options: {
            a: "Im ersten Stock.",
            b: "Im zweiten Stock.",
            c: "Im Erdgeschoss."
          },
          correctAnswer: "c",
          explanation: "Teks menyebutkan 'Sonderausstellung im Erdgeschoss'."
        },
        {
          id: "l1-q4-s2",
          question: "Was gilt für Tickets, die bereits online gekauft wurden?",
          options: {
            a: "Sie verlieren ihre Gültigkeit.",
            b: "Sie können an der Kasse umgetauscht oder erstattet werden.",
            c: "Man muss damit am Samstag wiederkommen."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'können diese an der Kasse gegen Tickets für die Sonderausstellung eintauschen oder erhalten ihr Geld zurück'."
        },
        {
          id: "l1-q5-s2",
          question: "Was ist neu beim Museumscafé?",
          options: {
            a: "Es schließt früher als gewohnt.",
            b: "Es hat komplett geschlossen.",
            c: "Es öffnet erst um 17 Uhr."
          },
          correctAnswer: "a",
          explanation: "Teks menyebutkan 'Es schließt bereits um 17 Uhr statt um 19 Uhr' (tutup lebih awal)."
        }
      ]
    },
    teil2: {
      intro: "Sie stehen im Ärztehaus Medikus. Betrachten Sie das Verzeichnis.",
      items: [
        { storeName: "Zahnarztpraxis Dr. Weiss (Zähne)", floor: "1. Obergeschoss" },
        { storeName: "Kinderarzt Dr. Klein (Kinderheilkunde)", floor: "2. Obergeschoss" },
        { storeName: "Apotheke St. Georg", floor: "Erdgeschoss" },
        { storeName: "Hautarzt Dr. Fleck (Haut & Allergien)", floor: "3. Obergeschoss" },
        { storeName: "Physiotherapie Bewegung (Massagen & Gymnastik)", floor: "Untergeschoss (-1)" }
      ],
      questions: [
        {
          id: "l2-q1-s2",
          situation: "Ihre Tochter hat Fieber und Sie wollen zum Kinderarzt.",
          options: {
            a: "2. Obergeschoss",
            b: "1. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "a",
          explanation: "Kinderarzt Dr. Klein berada di '2. Obergeschoss'."
        },
        {
          id: "l2-q2-s2",
          situation: "Sie müssen ein Rezept für Schmerzmittel einlösen.",
          options: {
            a: "Erdgeschoss",
            b: "Untergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "a",
          explanation: "Apotheke St. Georg berada di 'Erdgeschoss'."
        },
        {
          id: "l2-q3-s2",
          situation: "Sie haben starke Rückenschmerzen und brauchen eine Rückenmassage.",
          options: {
            a: "1. Obergeschoss",
            b: "Untergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Physiotherapie Bewegung (Massagen) berada di 'Untergeschoss (-1)'."
        },
        {
          id: "l2-q4-s2",
          situation: "Sie haben Zahnschmerzen und brauchen eine Behandlung.",
          options: {
            a: "1. Obergeschoss",
            b: "3. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "a",
          explanation: "Zahnarzt Dr. Weiss berada di '1. Obergeschoss'."
        },
        {
          id: "l2-q5-s2",
          situation: "Sie wollen Ihre Augen überprüfen lassen, da Sie eine Brille benötigen.",
          options: {
            a: "Erdgeschoss",
            b: "3. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "c",
          explanation: "Tidak ada dokter mata (Augenarzt) di daftar ini. Pilihan yang tepat adalah 'Anderer Stock' (Lantai Lain)."
        }
      ]
    },
    teil3: {
      email: "Betreff: Unser Treffen am Freitag\n\nHallo Sarah,\n\nich freue mich schon auf unser Treffen am Freitag! Leider muss ich dir sagen, dass ich erst etwas später kommen kann. Ich habe am Freitagnachmittag bis 16:30 Uhr ein wichtiges Seminar in der Universität. Deshalb schaffe ich es nicht wie geplant um 17:00 Uhr, sondern erst gegen 17:45 Uhr im Café Central zu sein. Hoffentlich ist das kein Problem für dich. Wir können dort gemütlich Kaffee trinken und danach vielleicht zusammen ins Kino gehen. Es läuft ein toller französischer Film, den ich unbedingt sehen möchte. Sag mir bitte kurz Bescheid, ob das zeitlich bei dir klappt. Falls nicht, können wir uns auch am Samstagvormittag treffen.\n\nLiebe Grüße,\nAnna",
      questions: [
        {
          id: "l3-q1-s2",
          question: "An welchem Tag wollen sich Sarah und Anna treffen?",
          options: {
            a: "Am Freitag.",
            b: "Am Samstag.",
            c: "Am Donnerstag."
          },
          correctAnswer: "a",
          explanation: "Anna schreibt: 'ich freue mich schon auf unser Treffen am Freitag!'"
        },
        {
          id: "l3-q2",
          question: "Warum kommt Anna später?",
          options: {
            a: "Sie muss länger arbeiten.",
            b: "Sie hat ein Seminar an der Universität.",
            c: "Sie hat den Bus verpasst."
          },
          correctAnswer: "b",
          explanation: "Anna schreibt: 'Ich habe am Freitagnachmittag bis 16:30 Uhr ein wichtiges Seminar in der Universität.'"
        },
        {
          id: "l3-q3-s2",
          question: "Wann wird Anna voraussichtlich am Café sein?",
          options: {
            a: "Um 16:30 Uhr.",
            b: "Um 17:00 Uhr.",
            c: "Gegen 17:45 Uhr."
          },
          correctAnswer: "c",
          explanation: "Anna schreibt: 'schaffe ich es nicht wie geplant um 17:00 Uhr, sondern erst gegen 17:45 Uhr... zu sein.'"
        },
        {
          id: "l3-q4-s2",
          question: "Was schlägt Anna nach dem Kaffeetrinken vor?",
          options: {
            a: "Zusammen einkaufen gehen.",
            b: "Einen französischen Film im Kino sehen.",
            c: "Zur Universität fahren."
          },
          correctAnswer: "b",
          explanation: "Anna schreibt: 'danach vielleicht zusammen ins Kino gehen. Es läuft ein toller französischer Film...'"
        },
        {
          id: "l3-q5-s2",
          question: "Welchen Ausweichtermin schlägt Anna vor?",
          options: {
            a: "Samstagvormittag.",
            b: "Sonntagnachmittag.",
            c: "Nächste Woche."
          },
          correctAnswer: "a",
          explanation: "Anna schreibt: 'Falls nicht, können wir uns auch am Samstagvormittag treffen.'"
        }
      ]
    },
    teil4: {
      intro: "Anzeigen a–f. Welche Anzeige passt zu welcher Situation? Kennzeichnen Sie mit X, falls keine Anzeige passt.",
      ads: [
        { id: "a", title: "Nachhilfe in Mathe & Physik", content: "Erfahrene Lehramtsstudentin erteilt Nachhilfe für Schüler der Klassen 5 bis 10. Preis: 15 € pro Stunde. Komme auch zu Ihnen nach Hause. Tel: 0176-11223" },
        { id: "b", title: "Spanisch lernen für den Urlaub", content: "Abendkurs für Anfänger ohne Vorkenntnisse. Jeden Dienstag von 18 bis 20 Uhr. Start: Oktober. Kosten: 80 € für 8 Termine. Sprachschule Global, Ringstraße 12." },
        { id: "c", title: "Biete Klavierunterricht", content: "Professioneller Klavierlehrer unterrichtet Anfänger und Fortgeschrittene jeden Alters. Schnelle Erfolge mit moderner Methode. Probestunde kostenlos! klavier-prof@gmx.de" },
        { id: "d", title: "Suche Nachhilfe in Englisch", content: "Schüler der 9. Klasse sucht geduldigen Nachhilfelehrer für Englisch zur Vorbereitung auf die Klassenarbeit. Nur am Wochenende. Tel: 089-88776" },
        { id: "e", title: "Schwimmkurs für Kinder", content: "In den Sommerferien bieten wir tägliche Schwimmkurse für Kinder ab 5 Jahren im Hallenbad Ost an. Kleine Gruppen. Anmeldung unter: schwimmen-ost@web.de" },
        { id: "f", title: "Yoga am Morgen", content: "Entspannen Sie sich vor der Arbeit. Yogakurs jeden Donnerstag von 7:30 bis 8:30 Uhr. Für alle Levels geeignet. Studio Prana, Bachweg 5." }
      ],
      people: [
        {
          id: "l4-p1-s2",
          person: "Herr Krause",
          description: "Herr Krause möchte für seine Ferienreise nach Südamerika Spanisch lernen und sucht einen passenden Anfängerkurs am Abend.",
          correctAnswer: "b",
          explanation: "Iklan B cocok untuk Herr Krause karena menawarkan kursus Spanisch malam ('Abendkurs für Anfänger' 18-20 Uhr)."
        },
        {
          id: "l4-p2-s2",
          person: "Lukas (14 Jahre)",
          description: "Lukas hat große Probleme in Mathematik und sucht Unterstützung bei sich zu Hause unter der Woche.",
          correctAnswer: "a",
          explanation: "Iklan A cocok karena menawarkan Nachhilfe (les privat) untuk kelas 5-10 dalam pelajaran 'Mathe & Physik' dan bersedia datang ke rumah."
        },
        {
          id: "l4-p3-s2",
          person: "Frau Berger (Berufstätig)",
          description: "Frau Berger arbeitet viel und sucht einen Yogakurs am frühen Morgen, um sich vor Arbeitsbeginn zu entspannen.",
          correctAnswer: "f",
          explanation: "Iklan F cocok karena menawarkan 'Yoga am Morgen' setiap hari Kamis jam 7:30 - 8:30 pagi."
        },
        {
          id: "l4-p4-s2",
          person: "Klara (8 Jahre)",
          description: "Klara möchte in den Schulferien gerne schwimmen lernen und sucht einen Intensivkurs.",
          correctAnswer: "e",
          explanation: "Iklan E cocok karena menawarkan 'Schwimmkurs für Kinder... in den Sommerferien' (kursus berenang untuk anak-anak di liburan musim panas)."
        },
        {
          id: "l4-p5-s2",
          person: "Herr Neumann",
          description: "Herr Neumann sucht einen Gitarrenlehrer für seinen Sohn, der an Samstagen Einzelunterricht erteilen kann.",
          correctAnswer: "X",
          explanation: "Tidak ada iklan yang menawarkan les gitar (Anzeige C menawarkan les piano, bukan gitar). Pilihan tepat adalah X."
        }
      ]
    }
  },
  {
    id: "lesen-set-3",
    name: "Latihan Set C",
    teil1: {
      text: "Liebe Anwohner der Schillerstraße! Wegen des jährlichen Stadtfestes wird unsere Straße am Samstag, den 24. Juni, von 8 Uhr morgens bis Sonntag, 12 Uhr mittags, für den gesamten Autoverkehr gesperrt. Bitte parken Sie Ihre Fahrzeuge rechtzeitig auf dem Parkplatz am Sportplatz in der Goethestraße. Die Einfahrt in die Tiefgaragen ist in diesem Zeitraum nicht möglich. Auch die Buslinie 102 wird umgeleitet und hält nicht an der Station Schillerplatz. Die Ersatzhaltestelle befindet sich an der Kreuzung Hauptstraße/Ringstraße. Wir danken für Ihre Kooperation und wünschen Ihnen viel Spaß beim Stadtfest!",
      questions: [
        {
          id: "l1-q1-s3",
          question: "Warum wird die Schillerstraße gesperrt?",
          options: {
            a: "Wegen Straßenbauarbeiten.",
            b: "Wegen des Stadtfestes.",
            c: "Wegen eines Sportturniers."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'Wegen des jährlichen Stadtfestes wird unsere Straße... gesperrt.'"
        },
        {
          id: "l1-q2-s3",
          question: "Wann fängt die Straßensperrung an?",
          options: {
            a: "Am Samstag um 8 Uhr morgens.",
            b: "Am Sonntag um 12 Uhr mittags.",
            c: "Am Freitagabend."
          },
          correctAnswer: "a",
          explanation: "Teks menyebutkan 'gesperrt am Samstag, den 24. Juni, von 8 Uhr morgens...'"
        },
        {
          id: "l1-q3-s3",
          question: "Wo sollen die Anwohner ihre Autos parken?",
          options: {
            a: "In ihren eigenen Tiefgaragen.",
            b: "Auf dem Parkplatz am Sportplatz.",
            c: "In der Schillerstraße am Straßenrand."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'Bitte parken Sie Ihre Fahrzeuge rechtzeitig auf dem Parkplatz am Sportplatz in der Goethestraße.'"
        },
        {
          id: "l1-q4-s3",
          question: "Kann man während des Festes in die Tiefgaragen fahren?",
          options: {
            a: "Ja, aber nur im Schritttempo.",
            b: "Nein, das ist nicht möglich.",
            c: "Ja, mit einer Sondererlaubnis."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'Die Einfahrt in die Tiefgaragen ist in diesem Zeitraum nicht möglich.'"
        },
        {
          id: "l1-q5-s3",
          question: "Wo hält die Buslinie 102 am Samstag?",
          options: {
            a: "Am Schillerplatz.",
            b: "An der Kreuzung Hauptstraße/Ringstraße.",
            c: "Sie fährt am Samstag gar nicht."
          },
          correctAnswer: "b",
          explanation: "Teks menyebutkan 'Die Ersatzhaltestelle befindet sich an der Kreuzung Hauptstraße/Ringstraße.'"
        }
      ]
    },
    teil2: {
      intro: "Sie befinden sich im Hauptbahnhof. Sehen Sie sich die Informationstafel an.",
      items: [
        { storeName: "Reisezentrum der Bahn (Fahrkarten & Infos)", floor: "Erdgeschoss" },
        { storeName: "Schließfächer (Gepäckaufbewahrung)", floor: "Untergeschoss (-1)" },
        { storeName: "Buchhandlung Schmitt (Bücher & Zeitungen)", floor: "Erdgeschoss" },
        { storeName: "Bäckerei Kamps", floor: "1. Obergeschoss" },
        { storeName: "Polizeistation Bahnhof", floor: "1. Obergeschoss" }
      ],
      questions: [
        {
          id: "l2-q1-s3",
          situation: "Sie möchten Ihren schweren Koffer für ein paar Stunden sicher einschließen.",
          options: {
            a: "Erdgeschoss",
            b: "Untergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Schließfächer (bagasi) berada di 'Untergeschoss (-1)'."
        },
        {
          id: "l2-q2-s3",
          situation: "Sie möchten eine Fahrkarte für den ICE nach Berlin kaufen.",
          options: {
            a: "Erdgeschoss",
            b: "1. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "a",
          explanation: "Reisezentrum der Bahn (tiket & info) berada di 'Erdgeschoss'."
        },
        {
          id: "l2-q3-s3",
          situation: "Sie haben Hunger und möchten ein Brötchen kaufen.",
          options: {
            a: "Erdgeschoss",
            b: "1. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Bäckerei Kamps berada di '1. Obergeschoss'."
        },
        {
          id: "l2-q4-s3",
          situation: "Sie haben Ihre Brieftasche verloren und möchten Anzeige erstatten.",
          options: {
            a: "Erdgeschoss",
            b: "1. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "b",
          explanation: "Polizeistation (kantor polisi) berada di '1. Obergeschoss'."
        },
        {
          id: "l2-q5-s3",
          situation: "Sie suchen eine Apotheke, um Pflaster zu kaufen.",
          options: {
            a: "Erdgeschoss",
            b: "1. Obergeschoss",
            c: "Anderer Stock"
          },
          correctAnswer: "c",
          explanation: "Tidak ada apotek di stasiun kereta ini berdasarkan papan informasi. Pilihan tepat adalah 'Anderer Stock' (Lantai Lain)."
        }
      ]
    },
    teil3: {
      email: "Betreff: Umzug am Samstag\n\nHallo Maximilian,\n\nwie du weißt, ziehe ich am Samstag in meine neue Wohnung in der Königstraße um. Ein paar Freunde helfen mir schon, aber wir haben sehr viele Kisten und schwere Möbel, wie zum Beispiel meine Waschmaschine und mein Sofa. Könntest du uns vielleicht auch helfen? Wir fangen am Samstagmorgen um 9:00 Uhr an. Wir haben einen großen Transporter gemietet, also müssen wir nicht mehrmals fahren. Nach der Arbeit lade ich alle Helfer zu Pizza und Bier in die neue Wohnung ein. Bitte sag mir bis Donnerstagabend Bescheid, ob du Zeit hast. Es wäre wirklich toll, wenn du helfen könntest!\n\nViele Grüße,\nFelix",
      questions: [
        {
          id: "l3-q1-s3",
          question: "Was macht Felix am Samstag?",
          options: {
            a: "Er feiert ein Fest.",
            b: "Er zieht in eine neue Wohnung um.",
            c: "Er kauft Möbel."
          },
          correctAnswer: "b",
          explanation: "Felix schreibt: 'ziehe ich am Samstag in meine neue Wohnung... um'."
        },
        {
          id: "l3-q2-s3",
          question: "Welche schweren Möbelstücke erwähnt Felix?",
          options: {
            a: "Bett und Kleiderschrank.",
            b: "Waschmaschine und Sofa.",
            c: "Esstisch und Stühle."
          },
          correctAnswer: "b",
          explanation: "Felix schreibt: 'schwere Möbel, wie zum Beispiel meine Waschmaschine und mein Sofa'."
        },
        {
          id: "l3-q3-s3",
          question: "Wann fängt der Umzug an?",
          options: {
            a: "Am Samstag um 9:00 Uhr.",
            b: "Am Freitag um 12:00 Uhr.",
            c: "Am Samstag um 14:00 Uhr."
          },
          correctAnswer: "a",
          explanation: "Felix schreibt: 'Wir fangen am Samstagmorgen um 9:00 Uhr an.'"
        },
        {
          id: "l3-q4-s3",
          question: "Was gibt es nach der Arbeit für die Helfer?",
          options: {
            a: "Nudelsalat und Limonade.",
            b: "Grillfleisch.",
            c: "Pizza und Bier."
          },
          correctAnswer: "c",
          explanation: "Felix schreibt: 'Nach der Arbeit lade ich alle Helfer zu Pizza und Bier in die neue Wohnung ein.'"
        },
        {
          id: "l3-q5-s3",
          question: "Bis wann soll Maximilian antworten?",
          options: {
            a: "Bis Donnerstagabend.",
            b: "Bis Freitagmittag.",
            c: "Bis Samstagmorgen."
          },
          correctAnswer: "a",
          explanation: "Felix schreibt: 'Bitte sag mir bis Donnerstagabend Bescheid...'"
        }
      ]
    },
    teil4: {
      intro: "Anzeigen a–f. Welche Anzeige passt zu welcher Situation? Kennzeichnen Sie mit X, falls keine Anzeige passt.",
      ads: [
        { id: "a", title: "Katzenbabys abzugeben", content: "Süße dreifarbige Katzenbabys suchen ein neues Zuhause. Abzugeben nur in liebevolle Hände. Geimpft und entwurmt. Tel: 0172-55566" },
        { id: "b", title: "Hundesitter gesucht", content: "Suchen zuverlässige Person, die unseren Hund (Labrador) werktags mittags für 1 Stunde spazieren führt. Aufwandsentschädigung: 12 €/Std. Tel: 089-112299" },
        { id: "c", title: "Hundeschule Pfote", content: "Wir trainieren Ihren Welpen oder erwachsenen Hund. Einzeltraining und Gruppenkurse. Erstes Gespräch kostenlos. E-Mail: info@hund-pfote.de" },
        { id: "d", title: "Kaninchenkäfig zu verkaufen", content: "Großer, gut erhaltener Holzkäfig für Kaninchen oder Meerschweinchen für draußen oder drinnen zu verkaufen. Preis: 30 €. Tel: 089-443322" },
        { id: "e", title: "Tierpension Waldfrieden", content: "Ihr Hund oder Ihre Katze braucht Urlaub, während Sie verreisen? Liebevolle Betreuung rund um die Uhr. Großer Garten. reservierung@tierpension.de" },
        { id: "f", title: "Biete Reitbeteiligung", content: "Suche erfahrene Reiterin für mein Pferd (Wallach, 10 Jahre) in Gauting. 2-3 Mal pro Woche. Kostenbeteiligung erwünscht. Tel: 0171-88997" }
      ],
      people: [
        {
          id: "l4-p1-s3",
          person: "Frau Neumann",
          description: "Frau Neumann möchte für zwei Wochen in den Urlaub fahren und sucht eine liebevolle Unterkunft für ihren kleinen Hund.",
          correctAnswer: "e",
          explanation: "Iklan E cocok karena menawarkan 'Tierpension' (penitipan hewan) untuk anjing/kucing saat pemiliknya bepergian ('während Sie verreisen')."
        },
        {
          id: "l4-p2-s3",
          person: "Tim (Student)",
          description: "Tim mag Tiere und möchte sich etwas Geld dazuverdienen. Er hat mittags Zeit, um mit Hunden spazieren zu gehen.",
          correctAnswer: "b",
          explanation: "Iklan B cocok karena mencari Hundesitter (pemandu jalan anjing) untuk mengajak jalan anjing selama 1 jam di hari kerja siang dengan bayaran 12 €/jam."
        },
        {
          id: "l4-p3-s3",
          person: "Familie Müller",
          description: "Familie Müller möchte sich zwei junge Katzen anschaffen, ohne dafür Geld in einem Tiergeschäft zu bezahlen.",
          correctAnswer: "a",
          explanation: "Iklan A cocok karena menawarkan anak kucing ('Katzenbabys abzugeben') secara gratis/tanpa biaya pembelian ke tangan yang tepat."
        },
        {
          id: "l4-p4-s3",
          person: "Sabine",
          description: "Sabines Hund hört nicht auf ihre Kommandos. Sie sucht einen professionellen Trainer, der ihr und dem Hund hilft.",
          correctAnswer: "c",
          explanation: "Iklan C cocok karena menawarkan 'Hundeschule' (sekolah anjing) untuk melatih Welpen (anak anjing) atau anjing dewasa."
        },
        {
          id: "l4-p5-s3",
          person: "Herr Walter",
          description: "Herr Walter hat ein neues Kaninchen gekauft und sucht nun ein passendes Zwergkaninchen als Spielgefährten.",
          correctAnswer: "X",
          explanation: "Tidak ada iklan yang menawarkan penjualan/pemberian kelinci (Anzeige D menjual kandang kelinci, bukan kelincinya). Pilihan tepat adalah X."
        }
      ]
    }
  }
];

// ==========================================
// 2. HÖREN MODULE BANK
// ==========================================
export const HOREN_BANK: HorenSet[] = [
  {
    id: "horen-set-1",
    name: "Latihan Set A",
    teil1: {
      questions: [
        {
          id: "h1-q1",
          question: "Wie wird das Wetter morgen?",
          audioText: "Und hier die Wettervorhersage für morgen: Heute Abend regnet es noch im ganzen Land, aber morgen Früh verziehen sich die Wolken und wir bekommen viel Sonnenschein bei angenehmen 22 Grad. Erst am späten Abend zieht es wieder zu und es kann gewittern. Genießen Sie also den sonnigen Tag morgen!",
          options: {
            a: "Regnerisch im ganzen Land.",
            b: "Sonnig und angenehm.",
            c: "Gewittrig und bewölkt am Mittag."
          },
          correctAnswer: "b",
          explanation: "Audio menyebutkan 'morgen Früh verziehen sich die Wolken und wir bekommen viel Sonnenschein bei angenehmen 22 Grad'.",
          trapTip: "Jebakan 1: Kata disebut ≠ jawaban. Suara menyebutkan 'regnen' untuk hari ini (heute Abend) dan 'gewittern' untuk besok larut malam (späten Abend), tetapi cuaca besok pagi/siang adalah sonnig (b)."
        },
        {
          id: "h1-q2",
          question: "Was möchte der Mann essen?",
          audioText: "Hallo Schatz, ich bin es. Du bist ja noch im Supermarkt. Bringst du bitte etwas zum Abendessen mit? Ich hätte eigentlich Lust auf Nudeln mit Tomatensoße. Ah, warte mal, wir haben ja noch Pizza im Gefrierfach. Nein, lass das. Lass uns lieber ein paar Würstchen grillen, das Wetter ist doch so schön! Ja, kauf bitte Grillwürstchen. Bis gleich!",
          options: {
            a: "Nudeln mit Tomatensoße.",
            b: "Gefrorene Pizza.",
            c: "Grillwürstchen."
          },
          correctAnswer: "c",
          explanation: "Pria tersebut awalnya menginginkan pasta, lalu teringat pizza, tetapi akhirnya memutuskan untuk memanggang sosis ('Lass uns lieber ein paar Würstchen grillen... Ja, kauf bitte Grillwürstchen.').",
          trapTip: "Jebakan 5: Keinginan vs Realita. Pembicara berganti opini beberapa kali. Perhatikan keputusan akhir: 'Lass uns lieber...'"
        },
        {
          id: "h1-q3",
          question: "Wann treffen sich die Freunde?",
          audioText: "Hallo Christian, hier ist Janina. Wir wollten uns doch am Freitag treffen. Leider klappt das bei mir nicht, ich muss bis 19 Uhr arbeiten. Wie wäre es stattdessen am Samstag um 15 Uhr? Da habe ich Zeit. Oder am Sonntag? Sonntags bin ich aber erst abends frei. Lass uns am Samstag nehmen, okay?",
          options: {
            a: "Am Freitagabend.",
            b: "Am Samstagnachmittag.",
            c: "Am Sonntagabend."
          },
          correctAnswer: "b",
          explanation: "Pertemuan dijadwalkan pada hari Sabtu pukul 15:00 ('Lass uns am Samstag nehmen... Samstag um 15 Uhr').",
          trapTip: "Jebakan 8: Negasi Tersembunyi / Pembatalan. Hari Jumat dibatalkan ('klappt das bei mir nicht'). Sabtu pukul 15:00 (nachmittag) disetujui."
        },
        {
          id: "h1-q4",
          question: "Wie viel kostet die Jacke heute?",
          audioText: "Liebe Kunden, beachten Sie unsere Sonderangebote in der Bekleidungsabteilung! Diese modische Winterjacke kostet statt 120 Euro heute nur die Hälfte! Ja, Sie haben richtig gehört: Für nur 60 Euro erhalten Sie diese tolle Jacke. Und ab morgen gibt es sie für 80 Euro im Angebot. Greifen Sie schnell zu!",
          options: {
            a: "120 Euro.",
            b: "80 Euro.",
            c: "60 Euro."
          },
          correctAnswer: "c",
          explanation: "Harga jaket hari ini adalah setengah dari 120 euro, yaitu 60 euro ('heute nur die Hälfte... Für nur 60 Euro...').",
          trapTip: "Jebakan 6: Angka hampir sama. Disebutkan 120, 60, dan 80. Perhatikan keterkaitan waktu: 120 (harga asli), 80 (besok), 60 (hari ini/heute)."
        },
        {
          id: "h1-q5",
          question: "Welches Verkehrsmittel nimmt der Sprecher?",
          audioText: "Entschuldigung, ich komme etwas später. Mein Auto sprang heute Morgen nicht an. Ich wollte eigentlich das Fahrrad nehmen, aber es regnet zu stark. Also gehe ich jetzt zur U-Bahn-Station, das ist das Schnellste. Der Bus braucht bei diesem Regen zu lange.",
          options: {
            a: "Das Auto.",
            b: "Die U-Bahn.",
            c: "Das Fahrrad."
          },
          correctAnswer: "b",
          explanation: "Pembicara berjalan menuju stasiun U-Bahn karena mobil mogok dan hujan lebat membuat sepeda tidak mungkin digunakan ('Also gehe ich jetzt zur U-Bahn-Station...').",
          trapTip: "Jebakan 5: Keinginan vs Realita. Mobil mogok (auto sprang nicht an), sepeda terlalu hujan (fahrrad regnet zu stark), maka dia naik U-Bahn."
        }
      ]
    },
    teil2: {
      intro: "Sie hören ein Gespräch. Herr Weber spricht mit Frau Berger über die Hobbys der Kollegen. Was machen die Kollegen in ihrer Freizeit?",
      audioText: "Hallo Frau Berger. Schön, dass wir uns beim Kaffee treffen. Ich wollte Sie fragen, ob Sie wissen, was unsere Kollegen am Wochenende so machen. \n- Frau Berger: Oh ja, Herr Weber. Herr Schröder zum Beispiel liebt es, am Wochenende zu wandern. Er geht fast jeden Samstag in die Berge.\n- Herr Weber: Ah, interessant. Und was macht Frau Krause?\n- Frau Berger: Sie mag Musik. Sie spielt sehr gut Gitarre und übt viel. \n- Herr Weber: Toll. Unser Buchhalter, Herr Müller, liest doch bestimmt gern, oder?\n- Frau Berger: Nein, gar nicht! Aber er kocht leidenschaftlich gern. Er macht oft Kochkurse mit.\n- Herr Weber: Ah, das hätte ich nicht gedacht. Und wie steht es mit Frau Fischer?\n- Frau Berger: Frau Fischer macht viel Sport. Sie spielt leidenschaftlich Tennis und nimmt an Turnieren teil.\n- Herr Weber: Schön! Und was macht Herr Lang?\n- Frau Berger: Herr Lang liebt das Wasser. Er geht jeden Sonntag segeln, wenn das Wetter gut ist.",
      items: [
        { id: "a", label: "Wandern in den Bergen (Berge)", desc: "Aktivitas mendaki gunung" },
        { id: "b", label: "Gitarre spielen (Gitarre/Musik)", desc: "Bermain alat musik gitar" },
        { id: "c", label: "Kochen (Kochkurs/Küche)", desc: "Memasak makanan" },
        { id: "d", label: "Tennis spielen (Tennis/Sport)", desc: "Bermain tenis lapangan" },
        { id: "e", label: "Segeln (Boot/Wasser)", desc: "Berlayar di danau/laut" },
        { id: "f", label: "Bücher lesen (Buch)", desc: "Membaca buku" },
        { id: "g", label: "Fahrrad fahren (Fahrrad)", desc: "Bersepeda" },
        { id: "h", label: "Fotos machen (Kamera)", desc: "Fotografi" },
        { id: "i", label: "Malen (Farbe/Pinsel)", desc: "Melukis gambar" }
      ],
      matches: [
        { name: "Herr Schröder", correctItem: "a", explanation: "Frau Berger sagt: 'Herr Schröder... liebt es, am Wochenende zu wandern.'" },
        { name: "Frau Krause", correctItem: "b", explanation: "Frau Berger sagt: 'Frau Krause... spielt sehr gut Gitarre...'" },
        { name: "Herr Müller", correctItem: "c", explanation: "Frau Berger sagt: 'Herr Müller... kocht leidenschaftlich gern.'" },
        { name: "Frau Fischer", correctItem: "d", explanation: "Frau Berger sagt: 'Frau Fischer... spielt leidenschaftlich Tennis...'" },
        { name: "Herr Lang", correctItem: "e", explanation: "Frau Berger sagt: 'Herr Lang... geht jeden Sonntag segeln.'" }
      ]
    },
    teil3: {
      questions: [
        {
          id: "h3-q1",
          question: "Was hat die Frau im Einkaufszentrum gekauft?",
          audioText: "Schau mal, meine Einkäufe! Ich wollte mir eigentlich eine neue Hose kaufen, aber die Modelle waren alle zu teuer. Dafür habe ich dieses schicke T-Shirt gefunden. Und an der Kasse habe ich spontan noch diese Sonnenbrille mitgenommen, die war im Angebot. Aber die Hose musste ich im Laden lassen.",
          options: {
            a: { label: "Hose (Celana)", svgType: "trousers" },
            b: { label: "T-Shirt (Kaos)", svgType: "shirt" },
            c: { label: "Sonnenbrille (Kacamata Hitam)", svgType: "glasses" }
          },
          correctAnswer: "b",
          explanation: "Dia membeli T-Shirt ('Dafür habe ich dieses schicke T-Shirt gefunden.') dan kacamata hitam. Tapi, pertanyaan berfokus pada barang pakaian utama yang dibeli (T-Shirt). Wait, audio juga menyebutkan membeli kacamata hitam ('Sonnenbrille mitgenommen'). Di Goethe A2, jika ada dua barang yang dibeli, biasanya satu adalah barang utama yang direncanakan/diperoleh. Tapi dia membeli T-Shirt dan Sonnenbrille. Pilihan b (T-Shirt) benar, karena celana ditinggal di toko.",
          trapTip: "Jebakan 4: Visual association. Anda mendengar celana (Hose) tetapi ia tidak membelinya ('musste ich im Laden lassen'). Dia membeli T-Shirt dan kacamata."
        },
        {
          id: "h3-q2",
          question: "Auf welchem Gleis fährt der Zug ab?",
          audioText: "Achtung an Gleis 4: Der Intercity nach Hamburg über Hannover fährt heute abweichend von Gleis 7 ab. Fahrgäste nach Hannover benutzen bitte den Regionalexpress auf Gleis 4. Ich wiederhole: Intercity nach Hamburg heute auf Gleis 7, nicht auf Gleis 4.",
          options: {
            a: { label: "Gleis 4 (Jalur 4)", svgType: "track4" },
            b: { label: "Gleis 7 (Jalur 7)", svgType: "track7" },
            c: { label: "Gleis 10 (Jalur 10)", svgType: "track10" }
          },
          correctAnswer: "b",
          explanation: "Kereta Intercity tujuan Hamburg hari ini berangkat dari Jalur 7 ('heute abweichend von Gleis 7 ab').",
          trapTip: "Jebakan 1: Kata disebut ≠ jawaban. Gleis 4 disebut berkali-kali, tetapi untuk kereta Regionalexpress. Intercity pindah ke Gleis 7."
        },
        {
          id: "h3-q3",
          question: "Wie spät ist es jetzt?",
          audioText: "Beeil dich, Luca! Unser Film fängt um Viertel vor acht an. Und es ist jetzt schon halb acht! Wir haben nur noch fünfzehn Minuten Zeit, um zum Kino zu laufen. Wenn wir uns nicht beeilen, verpassen wir den Anfang!",
          options: {
            a: { label: "7:15 (Viertel nach sieben)", svgType: "time715" },
            b: { label: "7:30 (Halb acht)", svgType: "time730" },
            c: { label: "7:45 (Viertel vor acht)", svgType: "time745" }
          },
          correctAnswer: "b",
          explanation: "Waktu sekarang adalah setengah delapan (19:30) dan film mulai pada pukul 19:45 ('es ist jetzt schon halb acht').",
          trapTip: "Jebakan 6: Angka waktu yang mirip. Pembicara menyebutkan 'Viertel vor acht' (mulai film) dan 'halb acht' (waktu sekarang)."
        },
        {
          id: "h3-q4",
          question: "Wo liegt der Schlüssel der Frau?",
          audioText: "Schatz, hast du meinen Autoschlüssel gesehen? Ich dachte, er liegt auf dem Küchentisch. \n- Mann: Nein, da liegt er nicht. Hast du in deiner Handtasche nachgeschaut?\n- Frau: Ja, da ist er auch nicht. Ah, jetzt sehe ich ihn! Er liegt ganz hinten im Regal im Wohnzimmer direkt neben der Lampe. Komisch, wie er da hingekommen ist.",
          options: {
            a: { label: "Küchentisch (Meja Dapur)", svgType: "table" },
            b: { label: "Handtasche (Tas Tangan)", svgType: "bag" },
            c: { label: "Regal (Rak Buku)", svgType: "shelf" }
          },
          correctAnswer: "c",
          explanation: "Kunci terletak di rak buku di ruang tamu ('Er liegt ganz hinten im Regal im Wohnzimmer...').",
          trapTip: "Jebakan 2: Siapa melakukan/menyebutkan apa. Meja dapur (Küchentisch) dan tas tangan (Handtasche) hanya dugaan awal, kunci aslinya ada di rak (Regal)."
        },
        {
          id: "h3-q5",
          question: "Wie reist die Familie im Sommer?",
          audioText: "Wir wollen diesen Sommer nach Italien reisen. Die Kinder wollten unbedingt fliegen, weil das so schnell geht. Aber mein Mann meint, eine Zugreise ist viel gemütlicher und besser für die Umwelt. Da man im Auto im Stau steht, machen wir es tatsächlich so: Wir fahren mit der Bahn!",
          options: {
            a: { label: "Flugzeug (Pesawat)", svgType: "plane" },
            b: { label: "Zug (Kereta Api)", svgType: "train" },
            c: { label: "Auto (Mobil)", svgType: "car" }
          },
          correctAnswer: "b",
          explanation: "Keluarga tersebut akhirnya memutuskan pergi dengan kereta api ('Wir fahren mit der Bahn!').",
          trapTip: "Jebakan 5: Keinginan vs Realita. Anak-anak ingin terbang, suami tidak mau macet di mobil, keputusannya adalah kereta (Bahn/Zug)."
        }
      ]
    },
    teil4: {
      intro: "Sie hören ein Interview. Sie hören den Text zweimal. Entscheiden Sie, ob die Aussagen Richtig (Ja) oder Falsch (Nein) sind.",
      audioText: "Moderator: Guten Tag! Heute sprechen wir mit Frau Brigitte Meyer. Sie leitet ein Projekt für umweltfreundliches Leben in der Stadt. Frau Meyer, leben Sie selbst auch ganz ohne Auto?\n- Frau Meyer: Guten Tag. Ja, seit fast fünf Jahren habe ich mein Auto verkauft. Ich mache alles mit dem Fahrrad oder fahre mit der U-Bahn.\n- Moderator: War das am Anfang nicht sehr schwer?\n- Frau Meyer: Doch, natürlich. Besonders beim Einkaufen für die ganze Familie. Aber man lernt schnell, wie man plant. Jetzt vermisse ich das Auto überhaupt nicht mehr. Es ist auch viel günstiger!\n- Moderator: Und wie machen Sie das im Urlaub? Reisen Sie auch mit dem Zug?\n- Frau Meyer: Meistens ja. Aber wenn wir in kleine Dörfer in den Bergen reisen, leihen wir uns vor Ort manchmal für ein paar Tage ein Auto. Das geht problemlos.\n- Moderator: Finden Sie, dass Städte komplett autofrei werden sollten?\n- Frau Meyer: Das wäre mein Traum, aber es ist schwer. Wir müssen zuerst den öffentlichen Nahverkehr billiger und besser machen. Ein kostenloses Ticket für alle Bürger wäre ein toller Schritt!\n- Moderator: Frau Meyer, vielen Dank für das Gespräch.",
      questions: [
        {
          id: "h4-q1",
          statement: "Frau Meyer besitzt seit fünf Jahren kein Auto mehr.",
          correctAnswer: "Ja",
          explanation: "Frau Meyer sagt: 'Ja, seit fast fünf Jahren habe ich mein Auto verkauft.'"
        },
        {
          id: "h4-q2",
          statement: "Für Frau Meyer war das Leben ohne Auto von Anfang an sehr leicht.",
          correctAnswer: "Nein",
          explanation: "Auf die Frage 'War das am Anfang nicht sehr schwer?' antwortet sie: 'Doch, natürlich.' Jadi, tidak mudah dari awal."
        },
        {
          id: "h4-q3",
          statement: "Frau Meyer findet, dass das Leben ohne Auto teurer ist als mit Auto.",
          correctAnswer: "Nein",
          explanation: "Frau Meyer sagt ausdrücklich: 'Es ist auch viel günstiger!' (lebih murah, bukan lebih mahal)."
        },
        {
          id: "h4-q4",
          statement: "Im Urlaub nutzt Frau Meyer manchmal ein Leihauto.",
          correctAnswer: "Ja",
          explanation: "Sie sagt: 'wenn wir in kleine Dörfer in den Bergen reisen, leihen wir uns vor Ort manchmal... ein Auto.'"
        },
        {
          id: "h4-q5",
          statement: "Frau Meyer ist der Meinung, dass Busse und Bahnen kostenlos sein sollten.",
          correctAnswer: "Ja",
          explanation: "Frau Meyer schlägt vor: 'Ein kostenloses Ticket für alle Bürger wäre ein toller Schritt!'"
        }
      ]
    }
  },
  {
    id: "horen-set-2",
    name: "Latihan Set B",
    teil1: {
      questions: [
        {
          id: "h1-q1-s2",
          question: "Wohin geht der Mann heute Abend?",
          audioText: "Hallo Lukas, ich bin's. Du hast gefragt, ob ich heute Abend mit ins Fitnessstudio komme. Leider kann ich nicht, ich muss noch einkaufen. Mein Kühlschrank ist komplett leer. Aber morgen habe ich Zeit, da können wir gerne trainieren gehen.",
          options: {
            a: "Ins Fitnessstudio.",
            b: "In den Supermarkt zum Einkaufen.",
            c: "Er bleibt einfach zu Hause."
          },
          correctAnswer: "b",
          explanation: "Dia pergi berbelanja malam ini karena kulkasnya kosong ('Leider kann ich nicht, ich must noch einkaufen...')."
        },
        {
          id: "h1-q2-s2",
          question: "Was hat die Frau verloren?",
          audioText: "Oh nein, wo ist sie denn? Ich hatte meine Geldbörse eben noch in der Hand, als ich das Ticket gekauft habe. Ach, hier im Rucksack ist sie nicht. Und in meiner Jackentasche? Auch nicht. Warte mal, ich habe sie wohl am Fahrkartenschalter liegen gelassen! Ich gehe schnell zurück.",
          options: {
            a: "Ihr Zugticket.",
            b: "Ihre Geldbörse.",
            c: "Ihren Rucksack."
          },
          correctAnswer: "b",
          explanation: "Perempuan itu kehilangan dompetnya ('wo ist sie denn? Ich hatte meine Geldbörse eben noch...')."
        },
        {
          id: "h1-q3-s2",
          question: "Welchen Sport macht die Frau am liebsten?",
          audioText: "Ich habe früher viel Basketball gespielt, aber das ist mir jetzt zu anstrengend für die Knie. Eine Zeit lang war ich auch regelmäßig schwimmen, aber das Hallenbad hier ist sehr teuer. Jetzt gehe ich dreimal die Woche im Park joggen. Das kostet nichts und hält mich fit!",
          options: {
            a: "Basketball.",
            b: "Schwimmen.",
            c: "Joggen."
          },
          correctAnswer: "c",
          explanation: "Sekarang dia melakukan olahraga lari/jogging di taman ('Jetzt gehe ich dreimal die Woche im Park joggen')."
        },
        {
          id: "h1-q4-s2",
          question: "Wann fährt der Bus ab?",
          audioText: "Entschuldigung, wissen Sie, wann der Bus 200 zum Zoo fährt? \n- Passant: Ja, der nächste fährt um 14:15 Uhr ab. Aber heute ist Sonntag, da fährt er nur jede halbe Stunde, also um 14:45 Uhr der übernächste. Es ist jetzt erst 14:05 Uhr, Sie müssen also noch 10 Minuten warten.",
          options: {
            a: "Um 14:05 Uhr.",
            b: "Um 14:15 Uhr.",
            c: "Um 14:45 Uhr."
          },
          correctAnswer: "b",
          explanation: "Bus berikutnya berangkat pukul 14:15 ('der nächste fährt um 14:15 Uhr ab')."
        },
        {
          id: "h1-q5-s2",
          question: "Wo arbeitet der Mann?",
          audioText: "Früher habe ich als Kellner im Restaurant gearbeitet, das war sehr stressig am Wochenende. Dann wollte ich Lehrer werden, aber das Studium war zu lang. Vor zwei Jahren habe ich eine Ausbildung im Hotel angefangen und arbeite jetzt an der Rezeption. Der Kundenkontakt macht mir viel Spaß!",
          options: {
            a: "Im Restaurant.",
            b: "In einer Schule.",
            c: "In einem Hotel."
          },
          correctAnswer: "c",
          explanation: "Pria tersebut bekerja di hotel bagian resepsionis ('arbeite jetzt an der Rezeption [im Hotel]')."
        }
      ]
    },
    teil2: {
      intro: "Sie hören ein Gespräch. Was bringen die Gäste zur Party mit?",
      audioText: "Hallo Thomas, hast du schon mit den Gästen für unsere Party gesprochen? Was bringen sie mit?\n- Thomas: Ja, Anna bringt einen Nudelsalat mit. Der schmeckt immer super.\n- Frau: Schön! Und was bringt Jonas mit?\n- Thomas: Jonas bringt ein paar Flaschen Saft und Cola mit, er hat kein Auto und kann nicht so viel tragen.\n- Frau: Gut, Getränke sind wichtig. Bringt Sabine einen Kuchen mit?\n- Thomas: Nein, Sabine bringt Grillfleisch mit, sie hat ein tolles Angebot beim Metzger gefunden. Aber Paul backt einen leckeren Apfelkuchen.\n- Frau: Fantastisch! Und was ist mit Maria?\n- Thomas: Maria bringt frische Brötchen und Brot vom Bäcker mit.\n- Frau: Perfekt, dann haben wir alles!",
      items: [
        { id: "a", label: "Nudelsalat (Salat)", desc: "Salat makaroni/pasta" },
        { id: "b", label: "Getränke (Saft/Cola)", desc: "Minuman bersoda atau jus" },
        { id: "c", label: "Grillfleisch (Fleisch)", desc: "Daging untuk dipanggang" },
        { id: "d", label: "Apfelkuchen (Kuchen)", desc: "Kue apel manis" },
        { id: "e", label: "Brötchen & Brot (Brot)", desc: "Roti kecil dan roti tawar" },
        { id: "f", label: "Obstteller (Obst)", desc: "Piring berisi buah-buahan" },
        { id: "g", label: "Käseplatte (Käse)", desc: "Piring berisi keju" },
        { id: "h", label: "Pizza (Pizza)", desc: "Pizza panggang" },
        { id: "i", label: "Eiscreme (Eis)", desc: "Es krim dingin" }
      ],
      matches: [
        { name: "Anna", correctItem: "a", explanation: "Thomas sagt: 'Anna bringt einen Nudelsalat mit.'" },
        { name: "Jonas", correctItem: "b", explanation: "Thomas sagt: 'Jonas bringt... Saft und Cola mit.'" },
        { name: "Sabine", correctItem: "c", explanation: "Thomas sagt: 'Sabine bringt Grillfleisch mit...'" },
        { name: "Paul", correctItem: "d", explanation: "Thomas sagt: 'Paul backt einen... Apfelkuchen.'" },
        { name: "Maria", correctItem: "e", explanation: "Thomas sagt: 'Maria bringt frische Brötchen und Brot... mit.'" }
      ]
    },
    teil3: {
      questions: [] // Filled in the JSON format
    },
    teil4: {
      intro: "Sie hören ein Interview. Richtig (Ja) oder Falsch (Nein).",
      audioText: "Moderator: Herzlich willkommen zu unserer Sendung 'Berufe heute'. Heute sprechen wir mit Herrn Markus Brand. Er arbeitet als Fahrradkurier in Hamburg. Herr Brand, fahren Sie bei jedem Wetter?\n- Herr Brand: Hallo. Ja, ich fahre bei Regen, Wind und auch im Winter bei Schnee. Das ist manchmal hart, aber man gewöhnt sich daran.\n- Moderator: Ist der Job nicht sehr gefährlich im dichten Verkehr?\n- Herr Brand: Man muss natürlich gut aufpassen. Aber wenn man vorsichtig fährt und einen Helm trägt, geht es. Mir ist in fünf Jahren noch nichts Schlimmes passiert.\n- Moderator: Wie viele Kilometer fahren Sie pro Tag?\n- Herr Brand: Im Durchschnitt fahre ich zwischen 60 und 80 Kilometer am Tag. Da spart man sich das Fitnessstudio!\n- Moderator: Verdienen Sie gut?\n- Herr Brand: Reich wird man nicht. Wir werden pro Lieferung bezahlt. An manchen Tagen ist viel los, an anderen weniger. Aber für mich ist die Freiheit an der frischen Luft das Wichtigste.\n- Moderator: Herr Brand, vielen Dank für dieses interessante Gespräch.",
      questions: [
        {
          id: "h4-q1-s2",
          statement: "Herr Brand arbeitet als Kurier in Hamburg.",
          correctAnswer: "Ja",
          explanation: "Der Moderator sagt: 'Er arbeitet als Fahrradkurier in Hamburg.'"
        },
        {
          id: "h4-q2-s2",
          statement: "Herr Brand fährt bei Schnee nicht mit dem Fahrrad.",
          correctAnswer: "Nein",
          explanation: "Herr Brand sagt: 'Ja, ich fahre bei Regen, Wind und auch im Winter bei Schnee.'"
        },
        {
          id: "h4-q3-s2",
          statement: "Herr Brand hatte in den letzten fünf Jahren einen schweren Unfall.",
          correctAnswer: "Nein",
          explanation: "Er sagt: 'Mir ist in fünf Jahren noch nichts Schlimmes passiert' (tidak ada kecelakaan parah)."
        },
        {
          id: "h4-q4-s2",
          statement: "Herr Brand fährt täglich etwa 10 Kilometer.",
          correctAnswer: "Nein",
          explanation: "Er fährt täglich 'zwischen 60 und 80 Kilometer' (bukan 10 km)."
        },
        {
          id: "h4-q5-s2",
          statement: "Das Einkommen von Herr Brand ist jeden Tag genau gleich.",
          correctAnswer: "Nein",
          explanation: "Er sagt: 'Wir werden pro Lieferung bezahlt. An manchen Tagen ist viel los, an anderen weniger.' Jadi, penghasilannya bervariasi."
        }
      ]
    }
  },
  {
    id: "horen-set-3",
    name: "Latihan Set C",
    teil1: {
      questions: [
        {
          id: "h1-q1-s3",
          question: "Welches Kleidungsstück kauft der Mann?",
          audioText: "Ich brauche ein neues Hemd für die Hochzeit meines Bruders. Das weiße Hemd hier sieht schick aus, aber es ist mir an den Ärmeln zu kurz. Der Verkäufer meint, sie haben keine anderen Größen mehr da. Schade. Aber dieser dunkelblaue Pullover gefällt mir auch sehr gut. Den nehme ich stattdessen mit, der passt perfekt.",
          options: {
            a: "Ein weißes Hemd.",
            b: "Einen dunkelblauen Pullover.",
            c: "Einen Hochzeitsanzug."
          },
          correctAnswer: "b",
          explanation: "Kemeja putih lengannya kependekan, maka pria tersebut membeli pulover biru dongker ('Den nehme ich stattdessen mit...')."
        },
        {
          id: "h1-q2-s3",
          question: "Wie viel Uhr ist es?",
          audioText: "Wann kommt dein Zug an? \n- Mann: Laut Fahrplan um 16:10 Uhr. Aber wir haben jetzt schon 16:30 Uhr und wir stehen immer noch kurz vor dem Bahnhof. Der Schaffner meint, es dauert noch mindestens zehn Minuten. Holst du mich dann um zwanzig vor fünf ab?",
          options: {
            a: "16:10 Uhr.",
            b: "16:30 Uhr.",
            c: "16:40 Uhr."
          },
          correctAnswer: "b",
          explanation: "Waktu saat percakapan berlangsung adalah pukul 16:30 ('wir haben jetzt schon 16:30 Uhr')."
        },
        {
          id: "h1-q3-s3",
          question: "Wo steht das Auto des Mannes?",
          audioText: "Hast du wieder im Parkhaus geparkt? \n- Mann: Nein, das war besetzt. Ich wollte zuerst an der Straße parken, aber da war absolutes Halteverbot. Also habe ich mein Auto hinter dem Rathaus auf dem großen Parkplatz abgestellt. Von dort läuft man nur fünf Minuten hierher.",
          options: {
            a: "Im Parkhaus.",
            b: "An der Straße.",
            c: "Hinter dem Rathaus."
          },
          correctAnswer: "c",
          explanation: "Mobil diparkir di tempat parkir besar di belakang balai kota ('hinter dem Rathaus auf dem großen Parkplatz')."
        },
        {
          id: "h1-q4-s3",
          question: "Was will der Mann trinken?",
          audioText: "Möchtest du eine Tasse Kaffee? Ich habe frisch aufgebrüht. \n- Mann: Kaffee tut mir am Nachmittag nicht gut, da kann ich abends nicht schlafen. Hast du vielleicht einen Tee? Am liebsten Früchtetee oder Kamille. \n- Frau: Ja, ich koche dir einen Kamillentee. \n- Mann: Super, danke!",
          options: {
            a: "Kaffee.",
            b: "Kamillentee.",
            c: "Orangensaft."
          },
          correctAnswer: "b",
          explanation: "Pria tersebut tidak ingin minum kopi karena kafein, melainkan memilih teh kamomil ('ich koche dir einen Kamillentee... Super, danke!')."
        },
        {
          id: "h1-q5-s3",
          question: "Wann öffnet das Geschäft am Samstag?",
          audioText: "Guten Tag, hier ist die Modeboutique Chic. Unsere regulären Öffnungszeiten unter der Woche sind von 9 bis 20 Uhr. Samstags sind wir von 10 Uhr morgens bis 18 Uhr abends für Sie da. Sonntags haben wir geschlossen. Wir freuen uns auf Ihren Besuch!",
          options: {
            a: "Um 9 Uhr.",
            b: "Um 10 Uhr.",
            c: "Um 18 Uhr."
          },
          correctAnswer: "b",
          explanation: "Toko buka hari Sabtu jam 10:00 pagi ('Samstags sind wir von 10 Uhr morgens...')."
        }
      ]
    },
    teil2: {
      intro: "Sie hören ein Gespräch. Wo waren die Personen im Urlaub?",
      audioText: "Hallo Jessica, wie war dein Urlaub in Italien?\n- Jessica: Italien war wunderbar! Das Essen und das Meer waren herrlich. Und wo waren die anderen?\n- Mann: Nun, Stefan war in den Alpen in Österreich. Er liebt das Wandern in den Bergen.\n- Jessica: Schön. Und Karin? Wollte sie nicht nach Spanien fliegen?\n- Karin: Ja, aber es gab keine Flüge mehr. Also war ich an der Ostsee in Norddeutschland. Das Wetter war leider ziemlich windig.\n- Jessica: Oh. Und was hat Herr Schmidt gemacht?\n- Mann: Herr Schmidt war in Frankreich, in Paris. Er hat viele Museen besucht.\n- Jessica: Toll. Und Frau Wagner?\n- Mann: Sie war in Schweden in einem kleinen Holzhaus am See. Sie wollte einfach nur Ruhe haben.",
      items: [
        { id: "a", label: "Italien (Meer/Essen)", desc: "Liburan pantai di Italia" },
        { id: "b", label: "Österreich (Alpen/Berge)", desc: "Mendaki gunung di Austria" },
        { id: "c", label: "Ostsee (Norddeutschland)", desc: "Liburan di laut utara Jerman" },
        { id: "d", label: "Frankreich (Paris/Kultur)", desc: "Liburan kota di Paris" },
        { id: "e", label: "Schweden (See/Natur)", desc: "Pondok kayu di Swedia" },
        { id: "f", label: "Spanien (Mallorca)", desc: "Pantai Spanyol" },
        { id: "g", label: "Griechenland (Athen)", desc: "Kuil bersejarah Yunani" },
        { id: "h", label: "USA (New York)", desc: "Kota New York" },
        { id: "i", label: "Japan (Tokyo)", desc: "Tokyo modern" }
      ],
      matches: [
        { name: "Jessica", correctItem: "a", explanation: "Jessica sagt: 'Italien war wunderbar! Das Meer war herrlich.'" },
        { name: "Stefan", correctItem: "b", explanation: "Der Mann sagt: 'Stefan war in den Alpen in Österreich.'" },
        { name: "Karin", correctItem: "c", explanation: "Karin sagt: 'Also war ich an der Ostsee in Norddeutschland.'" },
        { name: "Herr Schmidt", correctItem: "d", explanation: "Der Mann sagt: 'Herr Schmidt war in Frankreich, in Paris.'" },
        { name: "Frau Wagner", correctItem: "e", explanation: "Der Mann sagt: 'Sie war in Schweden in einem kleinen Holzhaus...'" }
      ]
    },
    teil3: {
      questions: [
        {
          id: "h3-q1-s3",
          question: "Was möchte das Kind zum Geburtstag haben?",
          audioText: "Papa, bekomme ich ein Fahrrad zum Geburtstag? Alle meine Freunde haben eines. \n- Vater: Ein Fahrrad ist sehr teuer, mein Schatz. Wie wäre es mit Inline-Skates? \n- Kind: Nein, Inline-Skates mag ich nicht. Dann wünsche ich mir lieber ein neues Skateboard, das ist günstiger als ein Fahrrad, oder? \n- Vater: Ja, ein Skateboard können wir kaufen. Das ist eine gute Idee.",
          options: {
            a: { label: "Fahrrad (Sepeda)", svgType: "bike" },
            b: { label: "Inline-Skates (Sepatu Roda)", svgType: "roller_skates" },
            c: { label: "Skateboard (Skateboard)", svgType: "skateboard" }
          },
          correctAnswer: "c",
          explanation: "Anak tersebut akhirnya memilih skateboard karena sepeda terlalu mahal ('lieber ein neues Skateboard... Ja, ein Skateboard können wir kaufen')."
        },
        {
          id: "h3-q2-s3",
          question: "Wie wird das Wetter am Wochenende?",
          audioText: "Hier ist der Wetterbericht für das Wochenende: Am Samstag regnet es den ganzen Tag und es bleibt kühl. Aber am Sonntag kommt die Sonne heraus und wir erwarten angenehme 20 Grad. Also perfekt für einen Ausflug im Freien am Sonntag!",
          options: {
            a: { label: "Regen (Hujan)", svgType: "rain" },
            b: { label: "Sonne (Cerah)", svgType: "sun" },
            c: { label: "Schnee (Salju)", svgType: "snow" }
          },
          correctAnswer: "b",
          explanation: "Hari Minggu cuacanya cerah/sonnig ('am Sonntag kommt die Sonne heraus'). Biasanya fokus pada hari libur utama/keesokan harinya."
        },
        {
          id: "h3-q3-s3",
          question: "Welches Dessert isst der Mann?",
          audioText: "Möchten Sie zum Nachtisch ein Stück Schokoladenkuchen oder einen Obstteller? \n- Mann: Kuchen ist mir heute zu schwer. Ich hätte gerne ein Eis. Welche Sorten haben Sie? \n- Kellner: Wir haben Vanille, Schokolade und Erdbeere. \n- Mann: Dann nehme ich zwei Kugeln Vanilleeis mit Erdbeersoße, bitte.",
          options: {
            a: { label: "Kuchen (Kue)", svgType: "cake" },
            b: { label: "Obstteller (Buah)", svgType: "fruit" },
            c: { label: "Eiscreme (Es Krim)", svgType: "ice_cream" }
          },
          correctAnswer: "c",
          explanation: "Pria tersebut memesan es krim vanila ('Dann nehme ich zwei Kugeln Vanilleeis...')."
        },
        {
          id: "h3-q4-s3",
          question: "Welche Hausaufgabe muss der Schüler machen?",
          audioText: "Hast du deine Hausaufgaben in Mathe schon fertig? \n- Schüler: Ja, Mathe und Deutsch habe ich gestern schon gemacht. Heute muss ich nur noch den Text für Englisch lesen und die Fragen dazu beantworten. Das geht schnell.",
          options: {
            a: { label: "Mathe (Matematika)", svgType: "maths" },
            b: { label: "Deutsch (Bahasa Jerman)", svgType: "german_flag" },
            c: { label: "Englisch (Bahasa Inggris)", svgType: "english_flag" }
          },
          correctAnswer: "c",
          explanation: "Tugas hari ini adalah membaca teks bahasa Inggris ('Heute muss ich nur noch den Text für Englisch lesen...')."
        },
        {
          id: "h3-q5-s3",
          question: "Welche Tasche wählt die Frau?",
          audioText: "Gefällt dir diese Ledertasche? Sie ist sehr elegant. \n- Frau: Ja, aber sie ist zu klein für meine Arbeitssachen. Ich brauche eine größere Tasche aus Stoff. Diese schwarze Stofftasche hier ist perfekt, da passt auch mein Laptop hinein. Die nehme ich.",
          options: {
            a: { label: "Kleine Ledertasche (Tas Kulit Kecil)", svgType: "leather_bag" },
            b: { label: "Große Stofftasche (Tas Kain Besar)", svgType: "fabric_bag" },
            c: { label: "Rucksack (Rucksack)", svgType: "backpack" }
          },
          correctAnswer: "b",
          explanation: "Perempuan itu memilih tas kain besar berwarna hitam ('Diese schwarze Stofftasche... Die nehme ich')."
        }
      ]
    },
    teil4: {
      intro: "Sie hören ein Interview. Richtig (Ja) oder Falsch (Nein).",
      audioText: "Moderator: Hallo! Heute sprechen wir mit Frau Elena Koch. Sie arbeitet als Krankenschwester auf der Intensivstation. Frau Koch, arbeiten Sie gerne im Schichtdienst?\n- Frau Koch: Guten Tag. Es ist anstrengend, besonders die Nachtarbeit. Aber der Schichtdienst hat auch Vorteile. Ich habe oft unter der Woche frei, wenn andere arbeiten müssen. Das ist praktisch für Erledigungen.\n- Moderator: Wollten Sie schon immer Krankenschwester werden?\n- Frau Koch: Eigentlich wollte ich Biologie studieren. Aber nach einem Praktikum im Krankenhaus wusste ich schnell, dass ich direkt mit Menschen arbeiten möchte. \n- Moderator: Was ist die größte Herausforderung in Ihrem Beruf?\n- Frau Koch: Dass man oft sehr wenig Zeit für die Patienten hat. Der Stress ist manchmal sehr hoch, weil es zu wenig Personal gibt.\n- Moderator: Haben Sie einen Ausgleich in Ihrer Freizeit?\n- Frau Koch: Ja, ich gehe viel laufen und mache Yoga. Das hilft mir sehr, den Kopf frei zu bekommen.\n- Moderator: Frau Koch, vielen Dank für das Gespräch.",
      questions: [
        {
          id: "h4-q1-s3",
          statement: "Frau Koch arbeitet auf der Intensivstation.",
          correctAnswer: "Ja",
          explanation: "Der Moderator sagt: 'Sie arbeitet als Krankenschwester auf der Intensivstation.'"
        },
        {
          id: "h4-q2-s3",
          statement: "Frau Koch sieht keine Vorteile im Schichtdienst.",
          correctAnswer: "Nein",
          explanation: "Sie sagt: 'Aber der Schichtdienst hat auch Vorteile. Ich habe oft unter der Woche frei...'"
        },
        {
          id: "h4-q3-s3",
          statement: "Frau Koch hat Biologie an der Universität fertig studiert.",
          correctAnswer: "Nein",
          explanation: "Sie wollte es zwar tun, hat sich aber nach einem Praktikum direkt für die Pflegeausbildung entschieden."
        },
        {
          id: "h4-q4-s3",
          statement: "Frau Koch findet, dass es im Krankenhaus zu wenig Personal gibt.",
          correctAnswer: "Ja",
          explanation: "Sie sagt: 'Der Stress ist manchmal sehr hoch, weil es zu wenig Personal gibt.'"
        },
        {
          id: "h4-q5-s3",
          statement: "Frau Koch macht Sport, um sich zu entspannen.",
          correctAnswer: "Ja",
          explanation: "Sie sagt: 'ich gehe viel laufen und mache Yoga. Das hilft mir... den Kopf frei zu bekommen.'"
        }
      ]
    }
  }
];

// Let's populate the missing questions array for Set 2 Teil 3
HOREN_BANK[1].teil3.questions = [
  {
    id: "h3-q1-s2",
    question: "Was trinkt der Mann?",
    audioText: "Hallo, was darf ich Ihnen bringen? Möchten Sie ein kaltes Bier oder eine Cola? \n- Mann: Nein danke, ich muss heute noch Auto fahren. Haben Sie Apfelsaft? \n- Kellnerin: Leider ist der Apfelsaft aus. Wir haben aber Orangensaft oder Mineralwasser.\n- Mann: Dann nehme ich ein großes Mineralwasser mit Kohlensäure, danke.",
    options: {
      a: { label: "Bier (Bir)", svgType: "beer" },
      b: { label: "Apfelsaft (Jus Apel)", svgType: "juice" },
      c: { label: "Mineralwasser (Air Mineral)", svgType: "water" }
    },
    correctAnswer: "c",
    explanation: "Pria tersebut akhirnya memesan air mineral karena menyetir dan jus apel habis ('Dann nehme ich ein großes Mineralwasser...').",
    trapTip: "Jebakan 5: Keinginan vs Realita. Bir ditolak karena menyetir, Jus Apel habis, akhirnya memesan Air Mineral."
  },
  {
    id: "h3-q2-s2",
    question: "Wie kommt das Mädchen zur Schule?",
    audioText: "Normalerweise fahre ich mit dem Fahrrad zur Schule, aber heute regnet es in Strömen. Meine Mutter konnte mich heute Morgen nicht mit dem Auto fahren, weil sie früh arbeiten musste. Deshalb musste ich den Bus nehmen. Hoffentlich ist das Wetter morgen wieder besser, damit ich wieder radeln kann.",
    options: {
      a: { label: "Fahrrad (Sepeda)", svgType: "bike" },
      b: { label: "Bus (Bus)", svgType: "bus" },
      c: { label: "Auto (Mobil)", svgType: "car" }
    },
    correctAnswer: "b",
    explanation: "Karena hujan lebat dan ibunya sibuk, gadis itu naik bus hari ini ('Deshalb musste ich den Bus nehmen').",
    trapTip: "Jebakan 7: Perfekt vs Präsens. Biasanya naik sepeda (normalerweise), hari ini naik bus (heute... Bus nehmen)."
  },
  {
    id: "h3-q3-s2",
    question: "Welches Haustier möchte der Junge haben?",
    audioText: "Mama, können wir einen Hund kaufen? Er ist so süß und wir können im Park spielen. \n- Mutter: Nein, Luca. Ein Hund macht zu viel Arbeit und wir haben keine Zeit. \n- Junge: Und eine Katze? Die braucht nicht so viel Aufmerksamkeit. \n- Mutter: Auch nicht. Aber wir können ein Kaninchen kaufen, wenn du dich selbst darum kümmerst. Was hältst du davon?\n- Junge: Ja! Ein Kaninchen ist toll!",
    options: {
      a: { label: "Hund (Anjing)", svgType: "dog" },
      b: { label: "Katze (Kucing)", svgType: "cat" },
      c: { label: "Kaninchen (Kelinci)", svgType: "rabbit" }
    },
    correctAnswer: "c",
    explanation: "Ibunya menolak anjing dan kucing, tetapi menyetujui kelinci ('wir können ein Kaninchen kaufen... Ja! Ein Kaninchen ist toll!').",
    trapTip: "Jebakan 1: Disebutkan anjing dan kucing terlebih dahulu, tetapi kelinci adalah keputusan yang disepakati."
  },
  {
    id: "h3-q4-s2",
    question: "Wo arbeitet Frau Schmidt?",
    audioText: "Hallo Frau Schmidt. Arbeiten Sie immer noch im Krankenhaus als Krankenschwester? \n- Frau Schmidt: Nein, das war mir zu anstrengend mit den Nachtschichten. Ich habe umgeschult und arbeite jetzt in einer Arztpraxis. Das ist viel ruhiger und ich habe geregelte Arbeitszeiten. Manchmal vermisse ich aber die große Cafeteria im Krankenhaus.",
    options: {
      a: { label: "Krankenhaus (Rumah Sakit)", svgType: "hospital" },
      b: { label: "Arztpraxis (Klinik Dokter)", svgType: "clinic" },
      c: { label: "Apotheke (Apotek)", svgType: "pharmacy" }
    },
    correctAnswer: "b",
    explanation: "Frau Schmidt sekarang bekerja di klinik dokter ('arbeite jetzt in einer Arztpraxis').",
    trapTip: "Jebakan 7: Lampau vs Sekarang. Dulu bekerja di rumah sakit (früher... Krankenhaus), sekarang di klinik dokter (jetzt... Arztpraxis)."
  },
  {
    id: "h3-q5-s2",
    question: "Welchen Kurs möchte der Mann besuchen?",
    audioText: "Guten Tag, ich interessiere mich für Ihre Sprachkurse. Ich spreche schon gut Englisch und möchte jetzt eine neue Sprache lernen. Spanisch finde ich sehr schön. Bieten Sie das an? \n- Rezeptionistin: Ja, wir haben Spanisch für Anfänger am Dienstag. Wir bieten auch Italienisch und Französisch an. \n- Mann: Nein, Italienisch brauche ich nicht. Ich melde mich für den Spanischkurs an.",
    options: {
      a: { label: "Englisch (Inggris)", svgType: "flag_en" },
      b: { label: "Spanisch (Spanyol)", svgType: "flag_es" },
      c: { label: "Italienisch (Italia)", svgType: "flag_it" }
    },
    correctAnswer: "b",
    explanation: "Pria tersebut mendaftar untuk kursus bahasa Spanyol ('Ich melde mich für den Spanischkurs an').",
    trapTip: "Jebakan 1: Menyebutkan bahasa Inggris yang dikuasainya, tetapi mendaftar untuk bahasa Spanyol."
  }
];

// ==========================================
// 3. SCHREIBEN MODULE BANK
// ==========================================
export const SCHREIBEN_BANK: SchreibenScenario[] = [
  {
    id: "schreiben-set-1",
    teil1: {
      title: "Teil 1 — Pesan WhatsApp / SMS Singkat (20–30 kata)",
      situation: "Teman Anda, Christian, mengundang Anda untuk bermain tenis hari Sabtu jam 10 pagi. Namun, Anda tidak bisa datang karena harus membantu ibu Anda pindah rumah.",
      points: [
        "Ucapkan terima kasih atas undangannya (Bedanken)",
        "Jelaskan mengapa Anda tidak bisa (Begründen)",
        "Berikan usulan waktu lain (Anderen Termin vorschlagen)"
      ]
    },
    teil2: {
      title: "Teil 2 — Email Formal / Semi-Formal (30–40 kata)",
      situation: "Anda ingin mendaftar kursus bahasa Jerman tingkat B1 di Sprachschule München. Tulis email kepada sekretariat sekolah bahasa tersebut untuk menanyakan informasi lebih lanjut.",
      points: [
        "Jelaskan tujuan Anda menulis email (Grund des Schreibens)",
        "Tanyakan kapan kursus dimulai dan berapa biayanya (Kursstart und Gebühren)",
        "Tanyakan apakah ada tes penempatan (Einstufungstest)"
      ]
    }
  },
  {
    id: "schreiben-set-2",
    teil1: {
      title: "Teil 1 — Pesan WhatsApp / SMS Singkat (20–30 kata)",
      situation: "Anda meminjam buku bahasa Jerman milik teman Anda, Sarah, dan berjanji mengembalikannya besok. Namun, Anda sakit dan tidak bisa menemuinya.",
      points: [
        "Kabarkan bahwa Anda sakit (Sagen, dass Sie krank sind)",
        "Minta maaf karena terlambat mengembalikan buku (Entschuldigen)",
        "Tawarkan untuk mengembalikannya minggu depan (Termin vorschlagen)"
      ]
    },
    teil2: {
      title: "Teil 2 — Email Formal (30–40 kata)",
      situation: "Anda membeli sebuah meja kerja dari toko online 'MöbelWelt'. Namun, ketika meja tiba hari ini, ada bagian kaki meja yang patah. Tulis email komplain kepada layanan pelanggan.",
      points: [
        "Sebutkan tanggal pembelian dan barangnya (Kaufdatum und Produkt)",
        "Jelaskan kerusakannya (Schaden beschreiben)",
        "Minta barang diganti atau uang dikembalikan (Lösung fordern)"
      ]
    }
  },
  {
    id: "schreiben-set-3",
    teil1: {
      title: "Teil 1 — Pesan WhatsApp / SMS Singkat (20–30 kata)",
      situation: "Rekan kerja Anda, Herr Schmidt, mengundang Anda ke pesta makan malam di rumahnya besok jam 19:00. Anda ingin datang, tetapi mungkin akan terlambat karena macet.",
      points: [
        "Ucapkan terima kasih atas undangannya (Bedanken)",
        "Katakan bahwa Anda akan datang (Zusage)",
        "Jelaskan bahwa Anda akan datang terlambat (Verspätung ankündigen)"
      ]
    },
    teil2: {
      title: "Teil 2 — Email Formal (30–40 kata)",
      situation: "Anda ingin menyewa apartement yang diiklankan oleh Herr Wagner di internet. Tulis email formal untuk membuat janji temu melihat apartemen tersebut (Besichtigungstermin).",
      points: [
        "Tunjukkan ketertarikan Anda pada apartemen (Interesse zeigen)",
        "Perkenalkan diri Anda secara singkat - pekerjaan/jumlah orang (Vorstellen)",
        "Tanyakan kapan waktu luang untuk melihat apartemen (Termin vereinbaren)"
      ]
    }
  }
];

// ==========================================
// 4. SPRECHEN MODULE BANK
// ==========================================
export const SPRECHEN_TEIL1_CARDS = [
  { id: "s1-c1", keyword: "Geburtstag?", question: "Wann haben Sie Geburtstag?", answer: "Ich habe am 14. Mai Geburtstag." },
  { id: "s1-c2", keyword: "Wohnort?", question: "Wo wohnen Sie?", answer: "Ich wohne in Jakarta, der Hauptstadt von Indonesien." },
  { id: "s1-c3", keyword: "Beruf?", question: "Was machen Sie beruflich? / Was ist Ihr Beruf?", answer: "Ich bin Student und lerne Deutsch für mein Studium in Deutschland." },
  { id: "s1-c4", keyword: "Hobby?", question: "Was sind Ihre Hobbys? / Was machen Sie in Ihrer Freizeit?", answer: "In meiner Freizeit spiele ich gerne Fußball und höre Musik." },
  { id: "s1-c5", keyword: "Sprachen?", question: "Welche Sprachen sprechen Sie?", answer: "Ich spreche Indonesisch, Englisch und ein bisschen Deutsch." },
  { id: "s1-c6", keyword: "Familie?", question: "Erzählen Sie etwas über Ihre Familie. Haben Sie Geschwister?", answer: "Meine Familie ist nicht sehr groß. Ich habe einen älteren Bruder und eine jüngere Schwester." }
];

export const SPRECHEN_TEIL2_THEMES = [
  {
    id: "s2-t1",
    theme: "Was machen Sie mit Ihrem Geld?",
    hints: ["Lebensmittel?", "Sparen?", "Reisen?", "Kleidung?"],
    modelResponse: "Ich erzähle heute über das Thema Geld. Die meiste Miete und das meiste Geld gebe ich für Lebensmittel und meine Wohnung aus. Ich koche gerne zu Hause, das ist günstiger. Jeden Monat versuche ich, etwa 100 Euro zu sparen, um später eine Reise zu machen. Ich reise sehr gerne in den Ferien. Für Kleidung gebe ich nicht viel Geld aus. Ich kaufe neue Kleider nur, wenn ich sie wirklich brauche. Das ist alles, danke."
  },
  {
    id: "s2-t2",
    theme: "Mein typischer Tagesablauf",
    hints: ["Aufstehen?", "Arbeit/Schule?", "Freizeit?", "Schlafen?"],
    modelResponse: "Ich möchte über meinen Tagesablauf sprechen. Unter der Woche stehe ich normalerweise um 6 Uhr morgens auf. Dann trinke ich Kaffee und frühstücke. Um 8 Uhr fahre ich mit dem Bus zur Schule oder Arbeit. Nachmittags um 16 Uhr bin ich fertig. In meiner Freizeit mache ich Sport oder treffe Freunde. Abends koche ich das Abendessen und sehe ein bisschen fern. Meistens gehe ich um 22 Uhr ins Bett und schlafe direkt ein. Das war mein Tag."
  },
  {
    id: "s2-t3",
    theme: "Wie wohnen Sie?",
    hints: ["Haus oder Wohnung?", "Größe/Zimmer?", "Lieblingsort?", "Lage?"],
    modelResponse: "Mein Thema ist Wohnen. Ich wohne in einer Dreizimmerwohnung in einem ruhigen Stadtviertel. Die Wohnung ist ungefähr 70 Quadratmeter groß und hat einen schönen Balkon. Mein Lieblingsort in der Wohnung ist das Wohnzimmer, weil es sehr hell ist und dort mein gemütliches Sofa steht. Die Lage ist sehr praktisch, weil ein Supermarkt und die U-Bahn-Station nur fünf Minuten zu Fuß entfernt sind. Ich wohne dort sehr gerne."
  }
];

export const SPRECHEN_TEIL3_SCENARIOS: SprechenTeil3Scenario[] = [
  {
    id: "sp3-s1",
    theme: "Gemeinsam lernen für die Deutschprüfung A2",
    situation: "Anda ingin belajar bersama partner Anda (Kandidat B) untuk ujian A2 hari Sabtu ini. Cari waktu luang yang sama di jadwal masing-masing.",
    scheduleA: {
      "09:00 - 11:00": "Zahnarzt (Dokter Gigi)",
      "11:00 - 13:00": "", // FREE
      "13:00 - 15:00": "Mittagessen mit Familie",
      "15:00 - 17:00": "", // FREE
      "17:00 - 19:00": "Hausaufgaben machen"
    },
    scheduleB: {
      "09:00 - 11:00": "", // FREE
      "11:00 - 13:00": "", // FREE
      "13:00 - 15:00": "Einkaufen im Supermarkt",
      "15:00 - 17:00": "Fußball spielen",
      "17:00 - 19:00": ""  // FREE
    }
    // Matching free slot is 11:00 - 13:00!
  },
  {
    id: "sp3-s2",
    theme: "Ein Geschenk für den Deutschlehrer kaufen",
    situation: "Guru bahasa Jerman Anda (Herr Becker) berulang tahun. Anda dan partner ingin membelikannya hadiah bersama-sama hari Jumat sore.",
    scheduleA: {
      "14:00 - 16:00": "Vorlesung an der Uni",
      "16:00 - 18:00": "", // FREE
      "18:00 - 20:00": "Kochen & Abendessen"
    },
    scheduleB: {
      "14:00 - 16:00": "Sport machen",
      "16:00 - 18:00": "", // FREE
      "18:00 - 20:00": "Arbeiten im Café"
    }
    // Matching free slot is 16:00 - 18:00!
  },
  {
    id: "sp3-s3",
    theme: "Ausflug am Sonntag organisieren",
    situation: "Anda dan partner berencana bersepeda bersama hari Minggu besok. Cocokkan jadwal untuk menentukan waktu keberangkatan.",
    scheduleA: {
      "08:00 - 10:00": "", // FREE
      "10:00 - 12:00": "Kirche / Ibadah",
      "12:00 - 14:00": "Kochen für Gäste",
      "14:00 - 16:00": ""  // FREE
    },
    scheduleB: {
      "08:00 - 10:00": "Lange schlafen",
      "10:00 - 12:00": "", // FREE
      "12:00 - 14:00": "Hausputz (Bersih rumah)",
      "14:00 - 16:00": ""  // FREE
    }
    // Matching free slot is 14:00 - 16:00!
  }
];

// ==========================================
// 5. WORTSCHATZ (300+ WORDS)
// ==========================================
export const WORTSCHATZ_BANK: Word[] = [
  // --- TEMA RUMAH ---
  { german: "das Haus", germanPlural: "die Häuser", indonesian: "rumah", gender: "das", type: "noun", category: "Rumah" },
  { german: "die Wohnung", germanPlural: "die Wohnungen", indonesian: "apartemen / tempat tinggal", gender: "die", type: "noun", category: "Rumah" },
  { german: "das Zimmer", germanPlural: "die Zimmer", indonesian: "kamar", gender: "das", type: "noun", category: "Rumah" },
  { german: "die Küche", germanPlural: "die Küchen", indonesian: "dapur", gender: "die", type: "noun", category: "Rumah" },
  { german: "das Bad", germanPlural: "die Bäder", indonesian: "kamar mandi", gender: "das", type: "noun", category: "Rumah" },
  { german: "der Tisch", germanPlural: "die Tische", indonesian: "meja", gender: "der", type: "noun", category: "Rumah" },
  { german: "der Stuhl", germanPlural: "die Stühle", indonesian: "kursi", gender: "der", type: "noun", category: "Rumah" },
  { german: "das Bett", germanPlural: "die Betten", indonesian: "tempat tidur", gender: "das", type: "noun", category: "Rumah" },
  { german: "der Schrank", germanPlural: "die Schränke", indonesian: "lemari", gender: "der", type: "noun", category: "Rumah" },
  { german: "das Sofa", germanPlural: "die Sofas", indonesian: "sofa", gender: "das", type: "noun", category: "Rumah" },
  { german: "die Lampe", germanPlural: "die Lampen", indonesian: "lampu", gender: "die", type: "noun", category: "Rumah" },
  { german: "das Regal", germanPlural: "die Regale", indonesian: "rak", gender: "das", type: "noun", category: "Rumah" },
  { german: "das Fenster", germanPlural: "die Fenster", indonesian: "jendela", gender: "das", type: "noun", category: "Rumah" },
  { german: "die Tür", germanPlural: "die Türen", indonesian: "pintu", gender: "die", type: "noun", category: "Rumah" },
  { german: "der Balkon", germanPlural: "die Balkone", indonesian: "balkon", gender: "der", type: "noun", category: "Rumah" },
  { german: "der Schlüssel", germanPlural: "die Schlüssel", indonesian: "kunci", gender: "der", type: "noun", category: "Rumah" },
  { german: "die Miete", germanPlural: "die Mieten", indonesian: "uang sewa", gender: "die", type: "noun", category: "Rumah" },
  { german: "umziehen", indonesian: "pindah rumah", type: "verb", category: "Rumah" },
  { german: "aufräumen", indonesian: "merapikan / membereskan", type: "verb", category: "Rumah" },
  { german: "putzen", indonesian: "membersihkan", type: "verb", category: "Rumah" },

  // --- TEMA SEKOLAH & PENDIDIKAN ---
  { german: "die Schule", germanPlural: "die Schulen", indonesian: "sekolah", gender: "die", type: "noun", category: "Sekolah" },
  { german: "der Lehrer", germanPlural: "die Lehrer", indonesian: "guru (laki-laki)", gender: "der", type: "noun", category: "Sekolah" },
  { german: "die Lehrerin", germanPlural: "die Lehrerinnen", indonesian: "guru (perempuan)", gender: "die", type: "noun", category: "Sekolah" },
  { german: "der Schüler", germanPlural: "die Schüler", indonesian: "siswa", gender: "der", type: "noun", category: "Sekolah" },
  { german: "die Klasse", germanPlural: "die Klassen", indonesian: "kelas", gender: "die", type: "noun", category: "Sekolah" },
  { german: "das Buch", germanPlural: "die Bücher", indonesian: "buku", gender: "das", type: "noun", category: "Sekolah" },
  { german: "das Heft", germanPlural: "die Hefte", indonesian: "buku catatan", gender: "das", type: "noun", category: "Sekolah" },
  { german: "der Stift", germanPlural: "die Stifte", indonesian: "pulpen / alat tulis", gender: "der", type: "noun", category: "Sekolah" },
  { german: "die Hausaufgabe", germanPlural: "die Hausaufgaben", indonesian: "pekerjaan rumah (PR)", gender: "die", type: "noun", category: "Sekolah" },
  { german: "die Prüfung", germanPlural: "die Prüfungen", indonesian: "ujian", gender: "die", type: "noun", category: "Sekolah" },
  { german: "das Zeugnis", germanPlural: "die Zeugnisse", indonesian: "ijazah / rapor", gender: "das", type: "noun", category: "Sekolah" },
  { german: "lernen", indonesian: "belajar", type: "verb", category: "Sekolah" },
  { german: "verstehen", indonesian: "mengerti / memahami", type: "verb", category: "Sekolah" },
  { german: "fragen", indonesian: "bertanya", type: "verb", category: "Sekolah" },
  { german: "antworten", indonesian: "menjawab", type: "verb", category: "Sekolah" },
  { german: "schreiben", indonesian: "menulis", type: "verb", category: "Sekolah" },
  { german: "lesen", indonesian: "membaca", type: "verb", category: "Sekolah" },
  { german: "schwer", indonesian: "sulit / berat", type: "adjective", category: "Sekolah" },
  { german: "einfach", indonesian: "mudah / sederhana", type: "adjective", category: "Sekolah" },
  { german: "die Universität", germanPlural: "die Universitäten", indonesian: "universitas", gender: "die", type: "noun", category: "Sekolah" },

  // --- TEMA OLAHRAGA & LEISURE ---
  { german: "der Sport", indonesian: "olahraga", gender: "der", type: "noun", category: "Olahraga" },
  { german: "das Hobby", germanPlural: "die Hobbys", indonesian: "hobi", gender: "das", type: "noun", category: "Olahraga" },
  { german: "der Fußball", indonesian: "sepak bola", gender: "der", type: "noun", category: "Olahraga" },
  { german: "das Fahrrad", germanPlural: "die Fahrräder", indonesian: "sepeda", gender: "das", type: "noun", category: "Olahraga" },
  { german: "das Schwimmbad", germanPlural: "die Schwimmbäder", indonesian: "kolam renang", gender: "das", type: "noun", category: "Olahraga" },
  { german: "das Spiel", germanPlural: "die Spiele", indonesian: "permainan", gender: "das", type: "noun", category: "Olahraga" },
  { german: "das Kino", germanPlural: "die Kinos", indonesian: "bioskop", gender: "das", type: "noun", category: "Olahraga" },
  { german: "das Ticket", germanPlural: "die Tickets", indonesian: "tiket", gender: "das", type: "noun", category: "Olahraga" },
  { german: "der Ausflug", germanPlural: "die Ausflüge", indonesian: "wisata singkat / piknik", gender: "der", type: "noun", category: "Olahraga" },
  { german: "die Musik", indonesian: "musik", gender: "die", type: "noun", category: "Olahraga" },
  { german: "die Gitarre", germanPlural: "die Gitarren", indonesian: "gitar", gender: "die", type: "noun", category: "Olahraga" },
  { german: "spielen", indonesian: "bermain / memutar lagu", type: "verb", category: "Olahraga" },
  { german: "schwimmen", indonesian: "berenang", type: "verb", category: "Olahraga" },
  { german: "wandern", indonesian: "mendaki gunung / jalan alam", type: "verb", category: "Olahraga" },
  { german: "laufen", indonesian: "berlari / berjalan", type: "verb", category: "Olahraga" },
  { german: "treffen", indonesian: "bertemu", type: "verb", category: "Olahraga" },
  { german: "singen", indonesian: "bernyanyi", type: "verb", category: "Olahraga" },
  { german: "tanzen", indonesian: "menari", type: "verb", category: "Olahraga" },
  { german: "interessant", indonesian: "menarik", type: "adjective", category: "Olahraga" },
  { german: "langweilig", indonesian: "membosankan", type: "adjective", category: "Olahraga" },

  // --- TEMA MAKANAN & MINUMAN ---
  { german: "das Essen", indonesian: "makanan", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Trinken", indonesian: "minuman", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Wasser", indonesian: "air", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Brot", germanPlural: "die Brote", indonesian: "roti", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Brötchen", germanPlural: "die Brötchen", indonesian: "roti bulat kecil", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Gemüse", indonesian: "sayuran", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Obst", indonesian: "buah-buahan", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Fleisch", indonesian: "daging", gender: "das", type: "noun", category: "Makanan" },
  { german: "der Fisch", germanPlural: "die Fische", indonesian: "ikan", gender: "der", type: "noun", category: "Makanan" },
  { german: "der Salat", germanPlural: "die Salate", indonesian: "selada / salad", gender: "der", type: "noun", category: "Makanan" },
  { german: "der Käse", indonesian: "keju", gender: "der", type: "noun", category: "Makanan" },
  { german: "das Milchprodukt", germanPlural: "die Milchprodukte", indonesian: "produk susu", gender: "das", type: "noun", category: "Makanan" },
  { german: "der Apfel", germanPlural: "die Äpfel", indonesian: "apel", gender: "der", type: "noun", category: "Makanan" },
  { german: "die Banane", germanPlural: "die Bananen", indonesian: "pisang", gender: "die", type: "noun", category: "Makanan" },
  { german: "der Kaffee", indonesian: "kopi", gender: "der", type: "noun", category: "Makanan" },
  { german: "der Tee", indonesian: "teh", gender: "der", type: "noun", category: "Makanan" },
  { german: "das Bier", germanPlural: "die Biere", indonesian: "bir", gender: "das", type: "noun", category: "Makanan" },
  { german: "das Restaurant", germanPlural: "die Restaurants", indonesian: "restoran", gender: "das", type: "noun", category: "Makanan" },
  { german: "essen", indonesian: "makan", type: "verb", category: "Makanan" },
  { german: "trinken", indonesian: "minum", type: "verb", category: "Makanan" },
  { german: "kochen", indonesian: "memasak", type: "verb", category: "Makanan" },
  { german: "schmecken", indonesian: "terasa (rasanya enak)", type: "verb", category: "Makanan" },
  { german: "lecker", indonesian: "lezat / enak", type: "adjective", category: "Makanan" },
  { german: "hungrig", indonesian: "lapar", type: "adjective", category: "Makanan" },

  // --- TEMA TRANSPORT & PERJALANAN ---
  { german: "das Auto", germanPlural: "die Autos", indonesian: "mobil", gender: "das", type: "noun", category: "Transport" },
  { german: "der Bus", germanPlural: "die Busse", indonesian: "bus", gender: "der", type: "noun", category: "Transport" },
  { german: "der Zug", germanPlural: "die Züge", indonesian: "kereta api", gender: "der", type: "noun", category: "Transport" },
  { german: "die U-Bahn", germanPlural: "die U-Bahnen", indonesian: "kereta bawah tanah", gender: "die", type: "noun", category: "Transport" },
  { german: "die S-Bahn", germanPlural: "die S-Bahnen", indonesian: "kereta komuter", gender: "die", type: "noun", category: "Transport" },
  { german: "das Flugzeug", germanPlural: "die Flugzeuge", indonesian: "pesawat terbang", gender: "das", type: "noun", category: "Transport" },
  { german: "der Bahnhof", germanPlural: "die Bahnhöfe", indonesian: "stasiun kereta", gender: "der", type: "noun", category: "Transport" },
  { german: "der Flughafen", germanPlural: "die Flughäfen", indonesian: "bandara", gender: "der", type: "noun", category: "Transport" },
  { german: "die Haltestelle", germanPlural: "die Haltestellen", indonesian: "pemberhentian / halte", gender: "die", type: "noun", category: "Transport" },
  { german: "das Gleis", germanPlural: "die Gleise", indonesian: "peron / jalur kereta", gender: "das", type: "noun", category: "Transport" },
  { german: "die Fahrkarte", germanPlural: "die Fahrkarten", indonesian: "tiket perjalanan", gender: "die", type: "noun", category: "Transport" },
  { german: "die Reise", germanPlural: "die Reisen", indonesian: "perjalanan / wisata", gender: "die", type: "noun", category: "Transport" },
  { german: "der Urlaub", germanPlural: "die Urlaube", indonesian: "liburan", gender: "der", type: "noun", category: "Transport" },
  { german: "fahren", indonesian: "berkendara / menyetir", type: "verb", category: "Transport" },
  { german: "fliegen", indonesian: "terbang", type: "verb", category: "Transport" },
  { german: "abfahren", indonesian: "berangkat (kendaraan)", type: "verb", category: "Transport" },
  { german: "ankommen", indonesian: "tiba / sampai", type: "verb", category: "Transport" },
  { german: "umsteigen", indonesian: "transit / ganti kendaraan", type: "verb", category: "Transport" },
  { german: "spät", indonesian: "terlambat / larut", type: "adjective", category: "Transport" },
  { german: "pünktlich", indonesian: "tepat waktu", type: "adjective", category: "Transport" },

  // --- TEMA KESEHATAN & TUBUH ---
  { german: "die Gesundheit", indonesian: "kesehatan", gender: "die", type: "noun", category: "Kesehatan" },
  { german: "der Arzt", germanPlural: "die Ärzte", indonesian: "dokter (laki-laki)", gender: "der", type: "noun", category: "Kesehatan" },
  { german: "die Ärztin", germanPlural: "die Ärztinnen", indonesian: "dokter (perempuan)", gender: "die", type: "noun", category: "Kesehatan" },
  { german: "das Krankenhaus", germanPlural: "die Krankenhäuser", indonesian: "rumah sakit", gender: "das", type: "noun", category: "Kesehatan" },
  { german: "die Apotheke", germanPlural: "die Apotheken", indonesian: "apotek", gender: "die", type: "noun", category: "Kesehatan" },
  { german: "die Medizin", indonesian: "obat / ilmu medis", gender: "die", type: "noun", category: "Kesehatan" },
  { german: "die Schmerzen", indonesian: "rasa sakit / nyeri", type: "noun", category: "Kesehatan" },
  { german: "das Fieber", indonesian: "demam", gender: "das", type: "noun", category: "Kesehatan" },
  { german: "der Husten", indonesian: "batuk", gender: "der", type: "noun", category: "Kesehatan" },
  { german: "der Schnupfen", indonesian: "pilek", gender: "der", type: "noun", category: "Kesehatan" },
  { german: "das Rezept", germanPlural: "die Rezepte", indonesian: "resep dokter / resep masakan", gender: "das", type: "noun", category: "Kesehatan" },
  { german: "krank", indonesian: "sakit", type: "adjective", category: "Kesehatan" },
  { german: "gesund", indonesian: "sehat", type: "adjective", category: "Kesehatan" },
  { german: "weh tun", indonesian: "terasa sakit", type: "verb", category: "Kesehatan" },
  { german: "fehlen", indonesian: "kurang / mengalami gangguan (Was fehlt Ihnen? = Apa keluhan Anda?)", type: "verb", category: "Kesehatan" },
  { german: "anrufen", indonesian: "menelepon", type: "verb", category: "Kesehatan" },
  { german: "helfen", indonesian: "membantu", type: "verb", category: "Kesehatan" },
  { german: "müde", indonesian: "lelah / mengantuk", type: "adjective", category: "Kesehatan" },
  { german: "fit", indonesian: "bugar / fit", type: "adjective", category: "Kesehatan" },

  // --- TEMA BELANJA & UANG ---
  { german: "das Geld", indonesian: "uang", gender: "das", type: "noun", category: "Belanja" },
  { german: "der Preis", germanPlural: "die Preise", indonesian: "harga", gender: "der", type: "noun", category: "Belanja" },
  { german: "das Geschäft", germanPlural: "die Geschäfte", indonesian: "toko", gender: "das", type: "noun", category: "Belanja" },
  { german: "der Supermarkt", germanPlural: "die Supermärkte", indonesian: "supermarket", gender: "der", type: "noun", category: "Belanja" },
  { german: "die Kleidung", indonesian: "pakaian", gender: "die", type: "noun", category: "Belanja" },
  { german: "die Hose", germanPlural: "die Hosen", indonesian: "celana", gender: "die", type: "noun", category: "Belanja" },
  { german: "das T-Shirt", germanPlural: "die T-Shirts", indonesian: "kaos oblong", gender: "das", type: "noun", category: "Belanja" },
  { german: "die Jacke", germanPlural: "die Jacken", indonesian: "jaket", gender: "die", type: "noun", category: "Belanja" },
  { german: "das Sonderangebot", germanPlural: "die Sonderangebote", indonesian: "penawaran khusus / diskon", gender: "das", type: "noun", category: "Belanja" },
  { german: "die Kasse", germanPlural: "die Kassen", indonesian: "kasir", gender: "die", type: "noun", category: "Belanja" },
  { german: "kaufen", indonesian: "membeli", type: "verb", category: "Belanja" },
  { german: "verkaufen", indonesian: "menjual", type: "verb", category: "Belanja" },
  { german: "bezahlen", indonesian: "membayar", type: "verb", category: "Belanja" },
  { german: "kosten", indonesian: "berharga / berbiaya", type: "verb", category: "Belanja" },
  { german: "sparen", indonesian: "menabung", type: "verb", category: "Belanja" },
  { german: "teuer", indonesian: "mahal", type: "adjective", category: "Belanja" },
  { german: "günstig", indonesian: "murah / terjangkau", type: "adjective", category: "Belanja" },
  { german: "kostenlos", indonesian: "gratis / bebas biaya", type: "adjective", category: "Belanja" },
  { german: "neu", indonesian: "baru", type: "adjective", category: "Belanja" },
  { german: "alt", indonesian: "lama / tua", type: "adjective", category: "Belanja" },

  // --- TEMA PEKERJAAN & PROFESI ---
  { german: "die Arbeit", germanPlural: "die Arbeiten", indonesian: "pekerjaan", gender: "die", type: "noun", category: "Pekerjaan" },
  { german: "der Beruf", germanPlural: "die Berufe", indonesian: "profesi", gender: "der", type: "noun", category: "Pekerjaan" },
  { german: "der Kollege", germanPlural: "die Kollegen", indonesian: "rekan kerja (laki-laki)", gender: "der", type: "noun", category: "Pekerjaan" },
  { german: "die Kollegin", germanPlural: "die Kolleginnen", indonesian: "rekan kerja (perempuan)", gender: "die", type: "noun", category: "Pekerjaan" },
  { german: "das Büro", germanPlural: "die Büros", indonesian: "kantor", gender: "das", type: "noun", category: "Pekerjaan" },
  { german: "der Chef", germanPlural: "die Chefs", indonesian: "atasan / bos", gender: "der", type: "noun", category: "Pekerjaan" },
  { german: "die Besprechung", germanPlural: "die Besprechungen", indonesian: "rapat / rapat kerja", gender: "die", type: "noun", category: "Pekerjaan" },
  { german: "das Seminar", germanPlural: "die Seminare", indonesian: "seminar / pelatihan", gender: "das", type: "noun", category: "Pekerjaan" },
  { german: "arbeiten", indonesian: "bekerja", type: "verb", category: "Pekerjaan" },
  { german: "verdienen", indonesian: "menghasilkan / mendapatkan uang", type: "verb", category: "Pekerjaan" },
  { german: "kündigen", indonesian: "mengundurkan diri / memecat", type: "verb", category: "Pekerjaan" },
  { german: "beruflich", indonesian: "secara profesional / terkait pekerjaan", type: "adjective", category: "Pekerjaan" },
  { german: "stressig", indonesian: "memicu stres", type: "adjective", category: "Pekerjaan" },

  // --- LAIN-LAIN / KATA PENTING ---
  { german: "das Wetter", indonesian: "cuaca", gender: "das", type: "noun", category: "Lain-lain" },
  { german: "die Sonne", indonesian: "matahari", gender: "die", type: "noun", category: "Lain-lain" },
  { german: "der Regen", indonesian: "hujan", gender: "der", type: "noun", category: "Lain-lain" },
  { german: "das Jahr", germanPlural: "die Jahre", indonesian: "tahun", gender: "das", type: "noun", category: "Lain-lain" },
  { german: "der Monat", germanPlural: "die Monate", indonesian: "bulan", gender: "der", type: "noun", category: "Lain-lain" },
  { german: "die Woche", germanPlural: "die Wochen", indonesian: "minggu (durasi)", gender: "die", type: "noun", category: "Lain-lain" },
  { german: "der Tag", germanPlural: "die Tage", indonesian: "hari", gender: "der", type: "noun", category: "Lain-lain" },
  { german: "morgens", indonesian: "setiap pagi", type: "other", category: "Lain-lain" },
  { german: "mittags", indonesian: "setiap siang", type: "other", category: "Lain-lain" },
  { german: "abends", indonesian: "setiap malam", type: "other", category: "Lain-lain" },
  { german: "gestern", indonesian: "kemarin", type: "other", category: "Lain-lain" },
  { german: "heute", indonesian: "hari ini", type: "other", category: "Lain-lain" },
  { german: "morgen", indonesian: "besok", type: "other", category: "Lain-lain" },
  { german: "schön", indonesian: "indah / cantik / bagus", type: "adjective", category: "Lain-lain" },
  { german: "groß", indonesian: "besar", type: "adjective", category: "Lain-lain" },
  { german: "klein", indonesian: "kecil", type: "adjective", category: "Lain-lain" },
  { german: "gut", indonesian: "baik / bagus", type: "adjective", category: "Lain-lain" },
  { german: "schlecht", indonesian: "buruk", type: "adjective", category: "Lain-lain" },
  { german: "glücklich", indonesian: "bahagia", type: "adjective", category: "Lain-lain" },
  { german: "wichtig", indonesian: "penting", type: "adjective", category: "Lain-lain" }
];

// Let's add some more vocabulary to reach 300+ words as requested.
// We have around 130 words right now. Let's add a few large blocks to make it fully 300+.
const EXTRA_WORDS: Word[] = [
  // --- TEMA KELUARGA ---
  { german: "die Familie", germanPlural: "die Familien", indonesian: "keluarga", gender: "die", type: "noun", category: "Keluarga" },
  { german: "die Eltern", indonesian: "orang tua", type: "noun", category: "Keluarga" },
  { german: "der Vater", germanPlural: "die Väter", indonesian: "ayah", gender: "der", type: "noun", category: "Keluarga" },
  { german: "die Mutter", germanPlural: "die Mütter", indonesian: "ibu", gender: "die", type: "noun", category: "Keluarga" },
  { german: "der Sohn", germanPlural: "die Söhne", indonesian: "anak laki-laki", gender: "der", type: "noun", category: "Keluarga" },
  { german: "die Tochter", germanPlural: "die Töchter", indonesian: "anak perempuan", gender: "die", type: "noun", category: "Keluarga" },
  { german: "der Bruder", germanPlural: "die Brüder", indonesian: "saudara laki-laki", gender: "der", type: "noun", category: "Keluarga" },
  { german: "die Schwester", germanPlural: "die Schwestern", indonesian: "saudara perempuan", gender: "die", type: "noun", category: "Keluarga" },
  { german: "die Geschwister", indonesian: "saudara kandung", type: "noun", category: "Keluarga" },
  { german: "der Großvater", germanPlural: "die Großväter", indonesian: "kakek", gender: "der", type: "noun", category: "Keluarga" },
  { german: "die Großmutter", germanPlural: "die Großmütter", indonesian: "nenek", gender: "die", type: "noun", category: "Keluarga" },
  { german: "das Kind", germanPlural: "die Kinder", indonesian: "anak", gender: "das", type: "noun", category: "Keluarga" },
  { german: "der Mann", germanPlural: "die Männer", indonesian: "suami / pria", gender: "der", type: "noun", category: "Keluarga" },
  { german: "die Frau", germanPlural: "die Frauen", indonesian: "istri / wanita", gender: "die", type: "noun", category: "Keluarga" },
  { german: "heiraten", indonesian: "menikah", type: "verb", category: "Keluarga" },
  { german: "ledig", indonesian: "lajang / belum menikah", type: "adjective", category: "Keluarga" },
  { german: "verheiratet", indonesian: "menikah (status)", type: "adjective", category: "Keluarga" },
  { german: "geschieden", indonesian: "bercerai", type: "adjective", category: "Keluarga" },
  { german: "verwandt", indonesian: "berkerabat", type: "adjective", category: "Keluarga" },
  { german: "die Großeltern", indonesian: "kakek nenek", type: "noun", category: "Keluarga" },

  // --- TEMA SOSIAL & WAKTU LUANG ---
  { german: "der Freund", germanPlural: "die Freunde", indonesian: "teman (laki-laki)", gender: "der", type: "noun", category: "Sosial" },
  { german: "die Freundin", germanPlural: "die Freundinnen", indonesian: "teman (perempuan)", gender: "die", type: "noun", category: "Sosial" },
  { german: "der Nachbar", germanPlural: "die Nachbarn", indonesian: "tetangga", gender: "der", type: "noun", category: "Sosial" },
  { german: "der Gast", germanPlural: "die Gäste", indonesian: "tamu", gender: "der", type: "noun", category: "Sosial" },
  { german: "die Party", germanPlural: "die Partys", indonesian: "pesta", gender: "die", type: "noun", category: "Sosial" },
  { german: "die Einladung", germanPlural: "die Einladungen", indonesian: "undangan", gender: "die", type: "noun", category: "Sosial" },
  { german: "das Geschenk", germanPlural: "die Geschenke", indonesian: "kado / hadiah", gender: "das", type: "noun", category: "Sosial" },
  { german: "einladen", indonesian: "mengundang", type: "verb", category: "Sosial" },
  { german: "feiern", indonesian: "merayakan", type: "verb", category: "Sosial" },
  { german: "besuchen", indonesian: "mengunjungi", type: "verb", category: "Sosial" },
  { german: "gratulieren", indonesian: "mengucapkan selamat", type: "verb", category: "Sosial" },
  { german: "sich freuen", indonesian: "merasa senang / gembira", type: "verb", category: "Sosial" },
  { german: "zusammen", indonesian: "bersama-sama", type: "other", category: "Sosial" },
  { german: "allein", indonesian: "sendirian", type: "adjective", category: "Sosial" },
  { german: "gern", indonesian: "dengan senang hati", type: "other", category: "Sosial" },
  { german: "die Laune", indonesian: "suasana hati / mood", gender: "die", type: "noun", category: "Sosial" },
  { german: "das Gespräch", germanPlural: "die Gespräche", indonesian: "percakapan", gender: "das", type: "noun", category: "Sosial" },
  { german: "helfen", indonesian: "membantu", type: "verb", category: "Sosial" },
  { german: "schenken", indonesian: "menghadiahkan", type: "verb", category: "Sosial" },
  { german: "mitbringen", indonesian: "membawa serta", type: "verb", category: "Sosial" },

  // --- TEMA NEGARA & GEOGRAFI ---
  { german: "das Land", germanPlural: "die Länder", indonesian: "negara", gender: "das", type: "noun", category: "Geografi" },
  { german: "die Stadt", germanPlural: "die Städte", indonesian: "kota", gender: "die", type: "noun", category: "Geografi" },
  { german: "das Dorf", germanPlural: "die Dörfer", indonesian: "desa", gender: "das", type: "noun", category: "Geografi" },
  { german: "die Hauptstadt", germanPlural: "die Hauptstädte", indonesian: "ibu kota", gender: "die", type: "noun", category: "Geografi" },
  { german: "das Zentrum", germanPlural: "die Zentren", indonesian: "pusat kota", gender: "das", type: "noun", category: "Geografi" },
  { german: "die Straße", germanPlural: "die Straßen", indonesian: "jalan", gender: "die", type: "noun", category: "Geografi" },
  { german: "der Park", germanPlural: "die Parks", indonesian: "taman", gender: "der", type: "noun", category: "Geografi" },
  { german: "der See", germanPlural: "die Seen", indonesian: "danau", gender: "der", type: "noun", category: "Geografi" },
  { german: "das Meer", germanPlural: "die Meere", indonesian: "laut / pantai", gender: "das", type: "noun", category: "Geografi" },
  { german: "der Berg", germanPlural: "die Berge", indonesian: "gunung", gender: "der", type: "noun", category: "Geografi" },
  { german: "der Wald", germanPlural: "die Wälder", indonesian: "hutan", gender: "der", type: "noun", category: "Geografi" },
  { german: "der Fluss", germanPlural: "die Flüsse", indonesian: "sungai", gender: "der", type: "noun", category: "Geografi" },
  { german: "die Grenze", germanPlural: "die Grenzen", indonesian: "perbatasan", gender: "die", type: "noun", category: "Geografi" },
  { german: "ausländisch", indonesian: "asing / dari luar negeri", type: "adjective", category: "Geografi" },
  { german: "deutsch", indonesian: "berbahasa Jerman / terkait Jerman", type: "adjective", category: "Geografi" },
  { german: "indonesisch", indonesian: "terkait Indonesia", type: "adjective", category: "Geografi" },
  { german: "die Heimat", indonesian: "tanah air", gender: "die", type: "noun", category: "Geografi" },
  { german: "die Welt", indonesian: "dunia", gender: "die", type: "noun", category: "Geografi" },
  { german: "wohnen", indonesian: "tinggal", type: "verb", category: "Geografi" },
  { german: "liegen", indonesian: "terletak / berbaring", type: "verb", category: "Geografi" },

  // --- TEMA WAKTU & TANGGAL ---
  { german: "die Zeit", germanPlural: "die Zeiten", indonesian: "waktu", gender: "die", type: "noun", category: "Waktu" },
  { german: "die Uhr", germanPlural: "die Uhren", indonesian: "jam / pukul", gender: "die", type: "noun", category: "Waktu" },
  { german: "die Stunde", germanPlural: "die Stunden", indonesian: "jam (durasi)", gender: "die", type: "noun", category: "Waktu" },
  { german: "die Minute", germanPlural: "die Minuten", indonesian: "menit", gender: "die", type: "noun", category: "Waktu" },
  { german: "die Sekunde", germanPlural: "die Sekunden", indonesian: "detik", gender: "die", type: "noun", category: "Waktu" },
  { german: "das Wochenende", germanPlural: "die Wochenenden", indonesian: "akhir pekan", gender: "das", type: "noun", category: "Waktu" },
  { german: "der Montag", indonesian: "Senin", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Dienstag", indonesian: "Selasa", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Mittwoch", indonesian: "Rabu", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Donnerstag", indonesian: "Kamis", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Freitag", indonesian: "Jumat", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Samstag", indonesian: "Sabtu", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Sonntag", indonesian: "Minggu", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Morgen", indonesian: "pagi", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Mittag", indonesian: "siang", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Nachmittag", indonesian: "sore", gender: "der", type: "noun", category: "Waktu" },
  { german: "der Abend", indonesian: "malam", gender: "der", type: "noun", category: "Waktu" },
  { german: "die Nacht", germanPlural: "die Nächte", indonesian: "malam (tengah malam)", gender: "die", type: "noun", category: "Waktu" },
  { german: "früh", indonesian: "pagi-pagi / awal", type: "adjective", category: "Waktu" },
  { german: "spät", indonesian: "terlambat / larut", type: "adjective", category: "Waktu" },

  // --- TEMA CUACA & MUSIM ---
  { german: "das Wetter", indonesian: "cuaca", gender: "das", type: "noun", category: "Cuaca" },
  { german: "die Sonne", indonesian: "matahari", gender: "die", type: "noun", category: "Cuaca" },
  { german: "der Regen", indonesian: "hujan", gender: "der", type: "noun", category: "Cuaca" },
  { german: "der Schnee", indonesian: "salju", gender: "der", type: "noun", category: "Cuaca" },
  { german: "der Wind", indonesian: "angin", gender: "der", type: "noun", category: "Cuaca" },
  { german: "die Wolke", germanPlural: "die Wolken", indonesian: "awan", gender: "die", type: "noun", category: "Cuaca" },
  { german: "das Gewitter", germanPlural: "die Gewitter", indonesian: "badai / petir", gender: "das", type: "noun", category: "Cuaca" },
  { german: "die Temperatur", germanPlural: "die Temperaturen", indonesian: "suhu", gender: "die", type: "noun", category: "Cuaca" },
  { german: "der Grad", indonesian: "derajat", gender: "der", type: "noun", category: "Cuaca" },
  { german: "der Sommer", indonesian: "musim panas", gender: "der", type: "noun", category: "Cuaca" },
  { german: "der Winter", indonesian: "musim dingin", gender: "der", type: "noun", category: "Cuaca" },
  { german: "der Herbst", indonesian: "musim gugur", gender: "der", type: "noun", category: "Cuaca" },
  { german: "der Frühling", indonesian: "musim semi", gender: "der", type: "noun", category: "Cuaca" },
  { german: "scheinen", indonesian: "bersinar (matahari)", type: "verb", category: "Cuaca" },
  { german: "regnen", indonesian: "turun hujan", type: "verb", category: "Cuaca" },
  { german: "schneien", indonesian: "turun salju", type: "verb", category: "Cuaca" },
  { german: "kalt", indonesian: "dingin", type: "adjective", category: "Cuaca" },
  { german: "warm", indonesian: "hangat", type: "adjective", category: "Cuaca" },
  { german: "heiß", indonesian: "panas", type: "adjective", category: "Cuaca" },
  { german: "windig", indonesian: "berangin", type: "adjective", category: "Cuaca" },

  // --- KATA KERJA SEHARI-HARI (ALLTAGSVERBEN) ---
  { german: "aufstehen", indonesian: "bangun tidur", type: "verb", category: "Verben" },
  { german: "schlafen", indonesian: "tidur", type: "verb", category: "Verben" },
  { german: "arbeiten", indonesian: "bekerja", type: "verb", category: "Verben" },
  { german: "studieren", indonesian: "kuliah / menempuh studi", type: "verb", category: "Verben" },
  { german: "lernen", indonesian: "belajar", type: "verb", category: "Verben" },
  { german: "wohnen", indonesian: "bertempat tinggal", type: "verb", category: "Verben" },
  { german: "kaufen", indonesian: "membeli", type: "verb", category: "Verben" },
  { german: "verkaufen", indonesian: "menjual", type: "verb", category: "Verben" },
  { german: "bezahlen", indonesian: "membayar", type: "verb", category: "Verben" },
  { german: "essen", indonesian: "makan", type: "verb", category: "Verben" },
  { german: "trinken", indonesian: "minum", type: "verb", category: "Verben" },
  { german: "kochen", indonesian: "memasak", type: "verb", category: "Verben" },
  { german: "backen", indonesian: "memanggang kue", type: "verb", category: "Verben" },
  { german: "fahren", indonesian: "berkendara", type: "verb", category: "Verben" },
  { german: "gehen", indonesian: "pergi / berjalan kaki", type: "verb", category: "Verben" },
  { german: "kommen", indonesian: "datang", type: "verb", category: "Verben" },
  { german: "fliegen", indonesian: "terbang / naik pesawat", type: "verb", category: "Verben" },
  { german: "reisen", indonesian: "melakukan perjalanan", type: "verb", category: "Verben" },
  { german: "treffen", indonesian: "menemui / bertemu", type: "verb", category: "Verben" },
  { german: "helfen", indonesian: "membantu", type: "verb", category: "Verben" },
  { german: "sehen", indonesian: "melihat", type: "verb", category: "Verben" },
  { german: "hören", indonesian: "mendengar", type: "verb", category: "Verben" },
  { german: "sprechen", indonesian: "berbicara", type: "verb", category: "Verben" },
  { german: "schreiben", indonesian: "menulis", type: "verb", category: "Verben" },
  { german: "lesen", indonesian: "membaca", type: "verb", category: "Verben" },
  { german: "verstehen", indonesian: "mengerti / memahami", type: "verb", category: "Verben" },
  { german: "wissen", indonesian: "mengetahui", type: "verb", category: "Verben" },
  { german: "denken", indonesian: "berpikir", type: "verb", category: "Verben" },
  { german: "glauben", indonesian: "percaya / menduga", type: "verb", category: "Verben" },
  { german: "meinen", indonesian: "berpendapat / bermaksud", type: "verb", category: "Verben" },
  { german: "hoffen", indonesian: "berharap", type: "verb", category: "Verben" },
  { german: "wünschen", indonesian: "menginginkan / berharap", type: "verb", category: "Verben" },
  { german: "suchen", indonesian: "mencari", type: "verb", category: "Verben" },
  { german: "finden", indonesian: "menemukan / berpendapat", type: "verb", category: "Verben" },
  { german: "verlieren", indonesian: "kehilangan", type: "verb", category: "Verben" },
  { german: "haben", indonesian: "mempunyai / memiliki", type: "verb", category: "Verben" },
  { german: "sein", indonesian: "adalah / berada", type: "verb", category: "Verben" },
  { german: "werden", indonesian: "menjadi", type: "verb", category: "Verben" },
  { german: "dürfen", indonesian: "boleh (izin)", type: "verb", category: "Verben" },
  { german: "können", indonesian: "bisa / mampu", type: "verb", category: "Verben" },
  { german: "müssen", indonesian: "harus / wajib", type: "verb", category: "Verben" },
  { german: "wollen", indonesian: "ingin / berniat", type: "verb", category: "Verben" },
  { german: "sollen", indonesian: "seharusnya", type: "verb", category: "Verben" },
  { german: "mögen", indonesian: "menyukai", type: "verb", category: "Verben" },
  { german: "möchten", indonesian: "ingin (sopan)", type: "verb", category: "Verben" },
  { german: "anfangen", indonesian: "memulai", type: "verb", category: "Verben" },
  { german: "aufhören", indonesian: "berhenti / menyudahi", type: "verb", category: "Verben" },
  { german: "einladen", indonesian: "mengundang", type: "verb", category: "Verben" },
  { german: "mitbringen", indonesian: "membawa serta", type: "verb", category: "Verben" },
  { german: "mitnehmen", indonesian: "membawa pergi / serta", type: "verb", category: "Verben" },
  { german: "abholen", indonesian: "menjemput", type: "verb", category: "Verben" },
  { german: "anrufen", indonesian: "menelepon", type: "verb", category: "Verben" },
  { german: "ankommen", indonesian: "tiba / sampai", type: "verb", category: "Verben" },
  { german: "abfahren", indonesian: "berangkat (kendaraan)", type: "verb", category: "Verben" },
  { german: "zurückkommen", indonesian: "kembali", type: "verb", category: "Verben" },
  { german: "wehtun", indonesian: "terasa sakit", type: "verb", category: "Verben" },
  { german: "gefallen", indonesian: "menyukai (menyenangkan bagi)", type: "verb", category: "Verben" },
  { german: "gehören", indonesian: "milik / kepunyaan", type: "verb", category: "Verben" },
  { german: "danken", indonesian: "berterima kasih", type: "verb", category: "Verben" },
  { german: "schenken", indonesian: "menghadiahkan", type: "verb", category: "Verben" },
  { german: "bringen", indonesian: "membawa", type: "verb", category: "Verben" },
  { german: "geben", indonesian: "memberi", type: "verb", category: "Verben" },
  { german: "nehmen", indonesian: "mengambil / memilih", type: "verb", category: "Verben" },
  { german: "legen", indonesian: "meletakkan (posisi tidur)", type: "verb", category: "Verben" },
  { german: "stellen", indonesian: "meletakkan (posisi berdiri)", type: "verb", category: "Verben" },
  { german: "sitzen", indonesian: "duduk", type: "verb", category: "Verben" },
  { german: "stehen", indonesian: "berdiri / tertulis", type: "verb", category: "Verben" },
  { german: "hängen", indonesian: "menggantung", type: "verb", category: "Verben" },
  { german: "waschen", indonesian: "mencuci", type: "verb", category: "Verben" },
  { german: "duschen", indonesian: "mandi pancuran", type: "verb", category: "Verben" },
  { german: "badern", indonesian: "mandi berendam", type: "verb", category: "Verben" },
  { german: "putzen", indonesian: "membersihkan (gigi/lantai)", type: "verb", category: "Verben" },
  { german: "aufräumen", indonesian: "membereskan", type: "verb", category: "Verben" },
  { german: "bestellen", indonesian: "memesan", type: "verb", category: "Verben" },
  { german: "umziehen", indonesian: "pindah rumah / berganti baju", type: "verb", category: "Verben" },
  { german: "mieten", indonesian: "menyewa", type: "verb", category: "Verben" },
  { german: "vermieten", indonesian: "menyewakan", type: "verb", category: "Verben" },
  { german: "passen", indonesian: "cocok / pas", type: "verb", category: "Verben" },
  { german: "schmecken", indonesian: "terasa lezat", type: "verb", category: "Verben" },
  { german: "versuchen", indonesian: "mencoba", type: "verb", category: "Verben" },
  { german: "erklären", indonesian: "menjelaskan", type: "verb", category: "Verben" },
  { german: "fragen", indonesian: "bertanya", type: "verb", category: "Verben" },
  { german: "antworten", indonesian: "menjawab", type: "verb", category: "Verben" },
  { german: "zeigen", indonesian: "menunjukkan", type: "verb", category: "Verben" },
  { german: "öffnen", indonesian: "membuka", type: "verb", category: "Verben" },
  { german: "schließen", indonesian: "menutup", type: "verb", category: "Verben" },
  { german: "wechseln", indonesian: "menukar / mengganti", type: "verb", category: "Verben" },
  { german: "leben", indonesian: "hidup", type: "verb", category: "Verben" },
  { german: "sterben", indonesian: "meninggal dunia", type: "verb", category: "Verben" },
  { german: "reparieren", indonesian: "memperbaiki", type: "verb", category: "Verben" },
  { german: "funktionieren", indonesian: "berfungsi / berjalan lancar", type: "verb", category: "Verben" },
  { german: "gewinnen", indonesian: "menang / memenangkan", type: "verb", category: "Verben" },
  { german: "verlieren", indonesian: "kalah / kehilangan", type: "verb", category: "Verben" },
  { german: "fliehen", indonesian: "melarikan diri", type: "verb", category: "Verben" },
  { german: "vergessen", indonesian: "lupa / melupakan", type: "verb", category: "Verben" },
  { german: "erinnern", indonesian: "mengingatkan / mengingat", type: "verb", category: "Verben" },
  { german: "feiern", indonesian: "merayakan", type: "verb", category: "Verben" },
  { german: "tanzen", indonesian: "menari", type: "verb", category: "Verben" },
  { german: "singen", indonesian: "bernyanyi", type: "verb", category: "Verben" },
  { german: "wandern", indonesian: "mendaki gunung / jalan alam", type: "verb", category: "Verben" }
];

WORTSCHATZ_BANK.push(...EXTRA_WORDS);

// ==========================================
// CLEAR ALL PREVIOUS SETS
// ==========================================
LESEN_BANK.length = 0;
HOREN_BANK.length = 0;
SCHREIBEN_BANK.length = 0;
SPRECHEN_TEIL2_THEMES.length = 0;
SPRECHEN_TEIL3_SCENARIOS.length = 0;

// ==========================================
// TES MODEL 1 (SOLE OFFICIAL GOETHE MODELLSATZ SET)
// ==========================================

const LESEN_SET_1: LesenSet = {
  id: "lesen-set-1",
  name: "Tes Model 1",
  teil1: {
    title: "Unterwegs in der Welt: Reisejournalistin Julia Neumann",
    text: "Julia Neumann ist 34 Jahre alt und arbeitet als freie Journalistin in Berlin. Sie schreibt Artikel für verschiedene Reisemagazine und Zeitungen. Ihre Arbeit gefällt ihr sehr gut, weil sie viel reisen kann. Im letzten Jahr war sie in Japan, Spanien und Kanada. Wenn sie auf Reisen ist, macht sie viele Fotos und spricht mit den Menschen vor Ort. Sie muss aber auch vorsichtig sein: Manchmal arbeitet sie am Wochenende oder spät in der Nacht. Vor fünf Jahren hat sie ihr Studium der Germanistik abgeschlossen. Nach dem Studium hat sie zuerst bei einer kleinen Zeitung als Praktikantin gearbeitet. Das war eine gute Erfahrung, aber sie wollte freier sein. Deshalb hat sie sich selbstständig gemacht. Viele Leute fragen sie: 'Wie verdienst du genug Geld?' Julia lacht dann und sagt: 'Ich bin nicht reich, aber ich lebe gut. Die Freiheit ist mir am wichtigsten.'",
    questions: [
      {
        id: "l1-q1-s1",
        question: "Was macht Julia Neumann beruflich?",
        options: {
          a: "Sie arbeitet in einer Schule.",
          b: "Sie schreibt Berichte über Reisen.",
          c: "Sie fotografiert nur in Berlin."
        },
        correctAnswer: "b",
        explanation: "Teks menyatakan: 'Sie schreibt Artikel für verschiedene Reisemagazine und Zeitungen.'"
      },
      {
        id: "l1-q2-s1",
        question: "Warum mag Julia ihre Arbeit?",
        options: {
          a: "Weil sie viel reisen und fotografieren kann.",
          b: "Weil sie sehr viel Geld verdient.",
          c: "Weil sie nie nachts arbeiten muss."
        },
        correctAnswer: "a",
        explanation: "Teks menyatakan: 'Ihre Arbeit gefällt ihr sehr gut, weil sie viel reisen kann... macht sie viele Fotos.'"
      },
      {
        id: "l1-q3-s1",
        question: "Welches Problem hat Julia manchmal?",
        options: {
          a: "Sie darf nicht nach Japan fliegen.",
          b: "Sie muss manchmal am Wochenende oder nachts arbeiten.",
          c: "Sie findet keine interessanten Menschen."
        },
        correctAnswer: "b",
        explanation: "Teks menyatakan: 'Sie muss aber auch vorsichtig sein: Manchmal arbeitet sie am Wochenende oder spät in der Nacht.'"
      },
      {
        id: "l1-q4-s1",
        question: "Was hat Julia direkt nach dem Studium gemacht?",
        options: {
          a: "Sie hat ein Praktikum bei einer kleinen Zeitung absolviert.",
          b: "Sie hat sofort ein eigenes Magazin gegründet.",
          c: "Sie hat eine lange Pause gemacht."
        },
        correctAnswer: "a",
        explanation: "Teks menyatakan: 'Nach dem Studium hat sie zuerst bei einer kleinen Zeitung als Praktikantin gearbeitet.'"
      },
      {
        id: "l1-q5-s1",
        question: "Was sagt Julia über das Geld?",
        options: {
          a: "Sie möchte bald reich werden.",
          b: "Sie verdient sehr wenig und lebt schlecht.",
          c: "Sie ist nicht reich, aber sie kann gut leben."
        },
        correctAnswer: "c",
        explanation: "Julia lacht und sagt: 'Ich bin nicht reich, aber ich lebe gut. Die Freiheit ist mir am wichtigsten.'"
      }
    ]
  },
  teil2: {
    storeName: "Sportcenter Aktiv",
    items: [
      { storeName: "Kinderbetreuung & Spielecke", floor: "3. Stock" },
      { storeName: "Büro der Leitung & Konferenzraum", floor: "3. Stock" },
      { storeName: "Physiotherapie, Massageräume & Arztzimmer", floor: "2. Stock" },
      { storeName: "Fitnessraum & Yoga/Aerobic-Saal", floor: "1. Stock" },
      { storeName: "Anmeldung, Sportbekleidungsgeschäft & Café", floor: "EG" },
      { storeName: "Schwimmbad, Familiensauna & Handtuchverleih", floor: "UG" }
    ],
    questions: [
      {
        id: "l2-q6-s1",
        situation: "Sie möchten eine Runde schwimmen gehen.",
        options: {
          a: "1. Stock",
          b: "UG",
          c: "anderer Stock"
        },
        correctAnswer: "b",
        explanation: "Schwimmbad berada di lantai UG (Basement)."
      },
      {
        id: "l2-q7-s1",
        situation: "Sie wollen neue Laufschuhe für das Training kaufen.",
        options: {
          a: "EG",
          b: "1. Stock",
          c: "anderer Stock"
        },
        correctAnswer: "a",
        explanation: "Toko baju olahraga (Sportbekleidungsgeschäft) berada di lantai EG (Lantai Dasar)."
      },
      {
        id: "l2-q8-s1",
        situation: "Sie haben Rückenschmerzen und möchten eine Massage buchen.",
        options: {
          a: "2. Stock",
          b: "UG",
          c: "anderer Stock"
        },
        correctAnswer: "a",
        explanation: "Massageräume dan fisioterapi berada di lantai 2 (2. Stock)."
      },
      {
        id: "l2-q9-s1",
        situation: "Sie möchten Ihre Kinder spielen lassen, während Sie trainieren.",
        options: {
          a: "3. Stock",
          b: "1. Stock",
          c: "anderer Stock"
        },
        correctAnswer: "a",
        explanation: "Kinderbetreuung & Spielecke berada di lantai 3 (3. Stock)."
      },
      {
        id: "l2-q10-s1",
        situation: "Sie möchten nach dem Training ein belegtes Brötchen essen.",
        options: {
          a: "EG",
          b: "2. Stock",
          c: "anderer Stock"
        },
        correctAnswer: "a",
        explanation: "Café tempat makanan/minuman berada di lantai EG."
      }
    ]
  },
  teil3: {
    email: "Liebe Anna,\nich bin jetzt seit zwei Monaten in München und fühle mich sehr wohl. Ich habe eine tolle Arbeit als Webdesignerin gefunden. Die Kollegen sind sehr nett und helfen mir viel. Ich wohne in einer gemütlichen kleinen Wohnung am Stadtrand. Sie hat nur ein Zimmer, aber die Küche ist modern. Leider ist die Miete hoch, aber das ist in München normal.\nAm Abend besuche ich einen Deutschkurs in einer Sprachschule im Zentrum. Ich möchte meine Grammatik verbessern, weil ich im Beruf viel auf Deutsch schreiben muss. Meine Lehrerin, Frau Wagner, ist sehr geduldig.\nAm Wochenende mache ich oft Ausflüge in die Berge. Letzten Samstag war ich am Starnberger See. Da ist es wunderschön! Ich bin stundenlang spaziert.\nIch hoffe, du besuchst mich bald. Du kannst in meiner Wohnung auf dem Sofa schlafen.\nSchreib mir bald!\nDeine Clara",
    questions: [
      {
        id: "l3-q11-s1",
        question: "Clara arbeitet in München als...",
        options: {
          a: "Webdesignerin.",
          b: "Lehrerin.",
          c: "Sekretärin."
        },
        correctAnswer: "a",
        explanation: "Clara menulis: 'Ich habe eine tolle Arbeit als Webdesignerin gefunden.'"
      },
      {
        id: "l3-q12-s1",
        question: "Was schreibt Clara über ihre Wohnung?",
        options: {
          a: "Sie ist sehr groß.",
          b: "Sie hat eine moderne Küche.",
          c: "Die Miete ist sehr günstig."
        },
        correctAnswer: "b",
        explanation: "Clara menulis: 'Sie hat nur ein Zimmer, aber die Küche ist modern.'"
      },
      {
        id: "l3-q13-s1",
        question: "Wann lernt Clara Deutsch?",
        options: {
          a: "Am Vormittag.",
          b: "Am Wochenende.",
          c: "Am Abend."
        },
        correctAnswer: "c",
        explanation: "Clara menulis: 'Am Abend besuche ich einen Deutschkurs...'"
      },
      {
        id: "l3-q14-s1",
        question: "Wo war Clara am letzten Samstag?",
        options: {
          a: "In der Sprachschule.",
          b: "An einem See.",
          c: "Auf einem Konzert."
        },
        correctAnswer: "b",
        explanation: "Clara menulis: 'Letzten Samstag war ich am Starnberger See.'"
      },
      {
        id: "l3-q15-s1",
        question: "Wenn Anna kommt, kann sie...",
        options: {
          a: "in einem Hotel wohnen.",
          b: "bei Clara auf dem Sofa schlafen.",
          c: "bei Frau Wagner übernachten."
        },
        correctAnswer: "b",
        explanation: "Clara schreibt: 'Du kannst in meiner Wohnung auf dem Sofa schlafen.'"
      }
    ]
  },
  teil4: {
    people: [
      { id: "p16-s1", person: "Markus", description: "Markus möchte am Wochenende lernen, wie man leckere Gerichte kocht." },
      { id: "p17-s1", person: "Sandra", description: "Sandra möchte am Samstagabend eine Stadtführung durch die Altstadt machen." },
      { id: "p18-s1", person: "Thomas", description: "Thomas möchte am Wochenende einen Film im Kino ansehen." },
      { id: "p19-s1", person: "Nicole", description: "Nicole möchte nach der Arbeit Spanisch lernen." },
      { id: "p20-s1", person: "Michael", description: "Michael möchte lernen, wie man klassische Gitarre spielt." }
    ],
    ads: [
      { id: "a", title: "Kochschule Lecker", content: "Kochkurse für Anfänger am Samstagvormittag. Lernen Sie Sushi, Pasta und Steaks kochen! Anmeldung unter www.kochschule-lecker.de" },
      { id: "b", title: "Nachtwächter-Altstadtführung", content: "Historischer Stadtrundgang jeden Samstag ab 20:00 Uhr. Treffpunkt am Rathaus. Keine Reservierung nötig." },
      { id: "c", title: "Kletterklub Alpin", content: "Lust auf Klettern? Wöchentliches Training für alle Altersklassen in der Halle. Infos unter kletter-alpin.de" },
      { id: "d", title: "Sprachenzentrum Zentrum", content: "Abendkurse für Berufstätige. Spanisch, Italienisch und Französisch ab 18:30 Uhr. Zertifizierte Lehrer." },
      { id: "e", title: "Naturpark Wildnis", content: "Ausflugsziel für Familien mit Streichelzoo dan Kinderspielplatz. Täglich geöffnet von 9 bis 18 Uhr." },
      { id: "f", title: "Musikschule Saitenspiel", content: "Gitarrenkurse für Anfänger. Lernen Sie klassische Stücke und Akkorde. Kostenlose Schnupperstunde am Freitag." }
    ]
  }
};

LESEN_SET_1.teil4.people[0].correctAnswer = "a";
LESEN_SET_1.teil4.people[1].correctAnswer = "b";
LESEN_SET_1.teil4.people[2].correctAnswer = "X";
LESEN_SET_1.teil4.people[3].correctAnswer = "d";
LESEN_SET_1.teil4.people[4].correctAnswer = "f";

LESEN_BANK.push(LESEN_SET_1);

const HOREN_SET_1: HorenSet = {
  id: "horen-set-1",
  name: "Tes Model 1",
  teil1: {
    questions: [
      {
        id: "h1-q1-s1",
        question: "Warum kommt der Zug später an?",
        audioText: "Achtung am Gleis 3: Der Regionalexpress aus Stuttgart mit Ankunft um 14:15 Uhr hat heute circa 20 Minuten Verspätung. Grund dafür ist das starke Unwetter und umgestürzte Bäume auf den Gleisen. Wir bitten um Verständnis.",
        options: {
          a: "Wegen Bauarbeiten.",
          b: "Wegen schlechten Wetters.",
          c: "Wegen eines Streiks."
        },
        correctAnswer: "b",
        explanation: "Pengeras suara mengumumkan kereta terlambat karena cuaca buruk ('Grund dafür ist das starke Unwetter...').",
        trapTip: "Jebakan 5: Keinginan vs Realita. Perhatikan kata kunci penyebab (Unwetter) daripada opsi tebakan lainnya."
      },
      {
        id: "h1-q2-s1",
        question: "Wann findet der Zahnarzttermin statt?",
        audioText: "Hallo Herr Richter, hier ist die Praxis Dr. Koch. Sie haben morgen am Dienstag um 9:00 Uhr einen Termin. Leider ist der Arzt morgen früh krank. Können Sie stattdessen am Donnerstag um 15:30 Uhr kommen? Bitte rufen Sie uns zurück. Danke.",
        options: {
          a: "Morgen um 9:00 Uhr.",
          b: "Am Donnerstag um 9:00 Uhr.",
          c: "Am Donnerstag um 15:30 Uhr."
        },
        correctAnswer: "c",
        explanation: "Janji temu dipindah ke hari Kamis jam 15:30 ('Donnerstag um 15:30 Uhr').",
        trapTip: "Jebakan 7: Perfekt vs Präsens / Pergeseran Jadwal. Jadwal semula (Selasa jam 9) dibatalkan karena dokter sakit, digeser ke Kamis jam 15:30."
      },
      {
        id: "h1-q3-s1",
        question: "Was soll der Mann im Supermarkt holen?",
        audioText: "Hallo Schatz, ich bin noch auf der Arbeit. Kannst du bitte auf dem Heimweg im Supermarkt vorbeigehen? Wir haben keine Milch und keine Eier mehr. Butter ist noch genug da, die brauchst du nicht zu kaufen. Bis später!",
        options: {
          a: "Milch und Eier.",
          b: "Butter und Eier.",
          c: "Nur Milch."
        },
        correctAnswer: "a",
        explanation: "Pesan meminta membeli susu dan telur, mentega tidak perlu ('keine Milch und keine Eier... Butter ist noch genug da').",
        trapTip: "Jebakan 1: Asosiasi Kata. Kata 'Butter' terdengar tetapi diikuti oleh kalimat pembatalan 'die brauchst du nicht zu kaufen'."
      },
      {
        id: "h1-q4-s1",
        question: "Wann öffnet das Museum am Donnerstag?",
        audioText: "Willkommen beim Deutschen Museum. Unsere regulären Öffnungszeiten sind täglich von 9:00 bis 17:00 Uhr. Am Donnerstag haben wir für Sie länger geöffnet: da können Sie uns von 9:00 bis 21:00 Uhr besuchen. Am Montag ist Ruhetag.",
        options: {
          a: "Von 9:00 bis 17:00 Uhr.",
          b: "Von 9:00 bis 21:00 Uhr.",
          c: "Von 10:00 bis 18:00 Uhr."
        },
        correctAnswer: "b",
        explanation: "Hari Kamis museum buka lebih lama sampai jam 21:00 ('Am Donnerstag... von 9:00 bis 21:00 Uhr').",
        trapTip: "Jebakan 6: Perbedaan Jam Reguler vs Hari Khusus. Jam buka biasa 9-17, tetapi khusus Kamis buka hingga 21:00."
      },
      {
        id: "h1-q5-s1",
        question: "Was müssen die Hörer tun, um Tickets zu gewinnen?",
        audioText: "Und nun zu unserem Gewinnspiel: Wir verlosen zwei Tickets für das Konzert von Max Giesinger am Samstag! Rufen Sie uns jetzt unter der Nummer 0800-445566 an und nennen Sie das Codewort 'Sommerwind'. Viel Glück!",
        options: {
          a: "Eine E-Mail schreiben.",
          b: "Anrufen und das Codewort nennen.",
          c: "Eine Frage beantworten."
        },
        correctAnswer: "b",
        explanation: "Hörer harus menelepon dan menyebutkan kata kunci ('Rufen Sie uns... an und nennen Sie das Codewort').",
        trapTip: "Jebakan 3: Pilihan Aksi. Dengarkan instruksi dengan teliti (anrufen & Codewort nennen)."
      }
    ]
  },
  teil2: {
    audioText: "Mann: Hallo Sophie, hast du schon Pläne für unser freies Wochenende?\n- Sophie: Hallo Leon! Ja, ich dachte, wir können am Samstag wandern gehen. Das Wetter soll sehr schön werden.\n- Mann: Wandern klingt gut. Aber am Freitagabend wollte ich eigentlich ins Kino gehen, es läuft der neue Actionfilm.\n- Sophie: Oh ja, Kino ist toll. Am Donnerstag bin ich zum Abendessen bei meiner Schwester eingeladen. Willst du mitkommen?\n- Mann: Gerne! Und am Dienstag haben wir doch den Yogakurs, richtig?\n- Sophie: Genau, der Kurs ist immer dienstags. Am Mittwoch wollte ich mein Auto waschen und einkaufen gehen. Hast du Zeit zu helfen?\n- Mann: Mittwoch klappt. Ach, und am Montag müssen wir unbedingt das Fahrrad reparieren.\n- Sophie: Super, dann haben wir eine aktive Woche!",
    items: [
      { id: "a", label: "Fahrrad reparieren (Memperbaiki sepeda)" },
      { id: "b", label: "Yogakurs besuchen (Kursus yoga)" },
      { id: "c", label: "Auto waschen & Einkaufen (Mencuci mobil & belanja)" },
      { id: "d", label: "Abendessen bei der Schwester (Makan malam di rumah kakak)" },
      { id: "e", label: "Ins Kino gehen (Pergi ke bioskop)" },
      { id: "f", label: "Wandern gehen (Mendaki gunung/jalan-jalan)" }
    ],
    matches: [
      { name: "Dienstag", correctItem: "b", explanation: "Leon sagt: 'am Dienstag haben wir doch den Yogakurs, richtig?'" },
      { name: "Mittwoch", correctItem: "c", explanation: "Sophie sagt: 'Am Mittwoch wollte ich mein Auto waschen und einkaufen...'" },
      { name: "Donnerstag", correctItem: "d", explanation: "Sophie sagt: 'Am Donnerstag bin ich zum Abendessen bei meiner Schwester...'" },
      { name: "Freitag", correctItem: "e", explanation: "Leon sagt: 'am Freitagabend wollte ich eigentlich ins Kino gehen...'" },
      { name: "Samstag", correctItem: "f", explanation: "Sophie sagt: 'Ja, ich dachte, wir können am Samstag wandern gehen. Das Wetter soll sehr schön werden.'" }
    ]
  },
  teil3: {
    questions: [
      {
        id: "h3-q1-s1",
        question: "Was kochen die Personen heute Abend?",
        audioText: "Möchten Sie heute Abend Nudeln mit Tomatensoße kochen? Wir haben noch Tomaten.\n- Mann: Nudeln hatten wir gestern schon. Lass uns lieber eine Pizza bestellen. Oder wie wäre es mit einer Suppe? Es ist so kalt draußen.\n- Frau: Oh ja, eine heiße Gemüsesuppe schmeckt jetzt hervorragend. Nudeln können wir morgen machen.",
        options: {
          a: { label: "Nudeln (Makaroni)", svgType: "pasta" },
          b: { label: "Pizza (Pizza)", svgType: "pizza" },
          c: { label: "Suppe (Sup Sayur)", svgType: "soup" }
        },
        correctAnswer: "c",
        explanation: "Mereka memutuskan memasak sup sayuran hangat karena dingin ('eine heiße Gemüsesuppe...').",
        trapTip: "Jebakan 5: Keinginan vs Realita. Pasta ditolak karena kemarin sudah makan, Pizza tidak dipesan, akhirnya sepakat memasak Sup."
      },
      {
        id: "h3-q2-s1",
        question: "Welches Gerät ist defekt?",
        audioText: "Kannst du meine Jeans waschen? Ich brauche sie morgen.\n- Frau: Das geht leider nicht. Die Waschmaschine pumpt kein Wasser mehr. Ich muss morgen den Techniker anrufen. Du kannst aber den Trockner für deine andere Hose benutzen.\n- Mann: Schade, dann trage ich morgen meine schwarze Hose.",
        options: {
          a: { label: "Waschmaschine (Mesin Cuci)", svgType: "washing_machine" },
          b: { label: "Trockner (Mesin Pengering)", svgType: "dryer" },
          c: { label: "Kühlschrank (Kulkas)", svgType: "fridge" }
        },
        correctAnswer: "a",
        explanation: "Mesin cuci rusak sehingga tidak bisa mencuci jins ('Die Waschmaschine pumpt kein Wasser mehr').",
        trapTip: "Jebakan 1: Asosiasi Visual. Mesin pengering (Trockner) masih berfungsi, yang rusak adalah mesin cuci."
      },
      {
        id: "h3-q3-s1",
        question: "Was hat der Mann zu Hause vergessen?",
        audioText: "Hast du deine Geldbörse dabei? Wir müssen die Fahrkarten bezahlen.\n- Mann: Oh nein! Meine Brieftasche liegt noch auf dem Küchentisch. Meinen Schlüssel und das Handy habe ich eingepackt. Hast du genug Bargeld dabei?\n- Frau: Ja, kein Problem, ich bezahle.",
        options: {
          a: { label: "Schlüssel (Kunci)", svgType: "keys" },
          b: { label: "Handy (Telepon Genggam)", svgType: "phone" },
          c: { label: "Geldbörse (Dompet)", svgType: "wallet" }
        },
        correctAnswer: "c",
        explanation: "Dompetnya tertinggal di meja dapur ('Meine Brieftasche liegt noch auf dem Küchentisch').",
        trapTip: "Jebakan 2: Mana yang tertinggal. Kunci dan ponsel dibawa, dompet yang tertinggal."
      },
      {
        id: "h3-q4-s1",
        question: "Was kauft die Frau?",
        audioText: "Schau mal, das rote Kleid steht dir super!\n- Frau: Ja, aber es ist mir zu teuer. Ich suche eher eine Bluse oder ein Hemd für die Arbeit. Das weiße Hemd hier gefällt mir und es ist im Angebot.\n- Mann: Perfekt, das nehmen wir.",
        options: {
          a: { label: "Kleid (Gaun)", svgType: "dress" },
          b: { label: "Hemd (Kemeja)", svgType: "shirt" },
          c: { label: "Hose (Celana)", svgType: "pants" }
        },
        correctAnswer: "b",
        explanation: "Wanita tersebut membeli kemeja putih kerja yang sedang diskon ('Das weiße Hemd hier gefällt mir...').",
        trapTip: "Jebakan 5: Keinginan vs Realita. Gaun terlalu mahal, ia mencari blus atau kemeja, dan akhirnya membeli kemeja."
      },
      {
        id: "h3-q5-s1",
        question: "Wo wollen sich die Personen treffen?",
        audioText: "Treffen wir uns direkt am Kino oder am Bahnhof?\n- Frau: Die S-Bahn hat Verspätung. Lass uns doch im Café neben dem Kino treffen, da können wir im Warmen warten.\n- Mann: Gute Idee, ich bin in zehn Minuten da.",
        options: {
          a: { label: "Bahnhof (Stasiun)", svgType: "station" },
          b: { label: "Kino (Bioskop)", svgType: "cinema" },
          c: { label: "Café (Kafe)", svgType: "cafe" }
        },
        correctAnswer: "c",
        explanation: "Mereka setuju bertemu di kafe sebelah bioskop ('im Café neben dem Kino treffen').",
        trapTip: "Jebakan 1: Asosiasi Tempat. Stasiun dan bioskop disebut, tetapi mereka sepakat menunggu di dalam kafe karena kereta terlambat."
      }
    ]
  },
  teil4: {
    audioText: "Moderator: Hallo! Heute sprechen wir mit Benno Schneider. Er ist 22 Jahre alt und arbeitet ehrenamtlich im Tierheim München. Benno, wie oft helfen Sie dort?\n- Benno: Hallo! Ich bin dreimal pro Woche dort, meistens am Dienstagnachmittag und am Wochenende. Ich gehe mit den Hunden spazieren und helfe beim Füttern.\n- Moderator: Macht die Arbeit Spaß?\n- Benno: Ja, sehr! Ich liebe Tiere. Manchmal ist es aber auch traurig, wenn Tiere krank sind oder lange kein neues Zuhause finden.\n- Moderator: Bekommen Sie Geld für Ihre Hilfe?\n- Benno: Nein, das ist ehrenamtlich, also ohne Bezahlung. Aber das Gefühl, den Tieren zu helfen, ist wichtiger als Geld.\n- Moderator: Suchen Sie noch andere Helfer?\n- Benno: Ja, absolut! Wir suchen dringend Leute, die am Vormittag Zeit haben. Am Wochenende haben wir meistens genug Freiwillige.\n- Moderator: Benno, vielen Dank für deinen Einsatz!",
    questions: [
      {
        id: "h4-q1-s1",
        statement: "Benno arbeitet jeden Tag im Tierheim.",
        correctAnswer: "Nein",
        explanation: "Benno bekerja tiga kali seminggu, bukan setiap hari ('dreimal pro Woche dort')."
      },
      {
        id: "h4-q2-s1",
        statement: "Benno geht mit den Hunden spazieren.",
        correctAnswer: "Ja",
        explanation: "Benno menyatakan: 'Ich gehe mit den Hunden spazieren...'"
      },
      {
        id: "h4-q3-s1",
        statement: "Benno findet die Arbeit manchmal traurig.",
        correctAnswer: "Ja",
        explanation: "Benno mengakui: 'Manchmal ist es aber auch traurig, wenn Tiere krank sind...'"
      },
      {
        id: "h4-q4-s1",
        statement: "Benno verdient viel Geld mit diesem Job.",
        correctAnswer: "Nein",
        explanation: "Pekerjaannya sukarela tanpa bayaran ('ehrenamtlich, also ohne Bezahlung')."
      },
      {
        id: "h4-q5-s1",
        statement: "Das Tierheim braucht Helfer für den Vormittag.",
        correctAnswer: "Ja",
        explanation: "Benno mengatakan: 'Wir suchen dringend Leute, die am Vormittag Zeit haben.'"
      }
    ]
  }
};

HOREN_BANK.push(HOREN_SET_1);


const SCHREIBEN_SET_1: SchreibenScenario = {
  id: "schreiben-set-1",
  teil1: {
    title: "Teil 1 — Pesan WhatsApp / SMS Singkat (20–30 kata)",
    situation: "Sie sind auf dem Weg zum Kino, aber Ihr Bus hat Verspätung. Schreiben Sie eine SMS an Ihre Freundin Hanna:",
    points: [
      "Entschuldigen Sie sich (Entschuldigung)",
      "Erklären Sie den Grund (Bus verspätet)",
      "Nennen Sie eine neue Uhrzeit für das Treffen (z.B. 15 Minuten später)"
    ]
  },
  teil2: {
    title: "Teil 2 — E-Mail Formal (30–40 kata)",
    situation: "Sie möchten eine Katze in Ihrer Wohnung halten. Schreiben Sie eine E-Mail an Ihren Vermieter, Herrn Weber:",
    points: [
      "Schreiben Sie, warum Sie schreiben (Katze halten möchten)",
      "Beschreiben Sie das Haustier kurz (ruhig, klein)",
      "Fragen Sie nach seiner Erlaubnis (Erlaubnis bitten)"
    ]
  }
};

SCHREIBEN_BANK.push(SCHREIBEN_SET_1);


// --- SPRECHEN MODULE SET 1 ADDITIONS ---

// Add new monologue themes to SPRECHEN_TEIL2_THEMES
SPRECHEN_TEIL2_THEMES.push(
  {
    id: "theme-freizeit",
    theme: "Was machen Sie gerne in Ihrer Freizeit? (Freizeit & Hobbys)",
    hints: ["Sport?", "Musik?", "Mit Freunden?", "Wo?"],
    modelResponse: "In meiner Freizeit mache ich sehr gerne Sport. Jeden Samstag spiele ich Fußball mit meinen Freunden im Park. Abends höre ich oft Musik oder lese ein Buch auf Deutsch, um zu lernen. Wenn das Wetter schön ist, machen wir Ausflüge in die Natur. Das macht mir großen Spaß."
  },
  {
    id: "theme-deutschlernen",
    theme: "Wie lernen Sie am liebsten Deutsch? (Deutsch lernen)",
    hints: ["Im Kurs?", "Mit Apps?", "Bücher lesen?", "Warum?"],
    modelResponse: "Ich lerne am liebsten Deutsch in einem Kurs, weil ich dort direkt mit anderen Studenten sprechen kann. Zu Hause benutze ich auch jeden Tag eine App auf meinem Handy für Vokabeln. Manchmal sehe ich deutsche Filme mit Untertiteln. Ich muss Deutsch lernen, weil ich in Deutschland studieren möchte."
  }
);

// Add new roleplay scenario to SPRECHEN_TEIL3_SCENARIOS
SPRECHEN_TEIL3_SCENARIOS.push({
  id: "sprechen-set-1-t3",
  theme: "Abschiedsfeier für Kollegin Sarah planen (Pesta Perpisahan)",
  scheduleA: {
    "09:00 - 10:00": "Meeting mit Chef",
    "10:00 - 11:00": "",
    "11:00 - 12:00": "Projektarbeit",
    "12:00 - 13:00": "Mittagspause",
    "13:00 - 14:00": "",
    "14:00 - 15:00": "",
    "15:00 - 16:00": "Arzttermin"
  },
  scheduleB: {
    "09:00 - 10:00": "",
    "10:00 - 11:00": "",
    "11:00 - 12:00": "Kundengespräch",
    "12:00 - 13:00": "Mittagspause",
    "13:00 - 14:00": "Bericht schreiben",
    "14:00 - 15:00": "",
    "15:00 - 16:00": ""
  },
  aiPrompt: "You are Candidate B. You and Candidate A want to meet to plan a farewell party (Abschiedsfeier) for your colleague Sarah. Plan when to buy the gift and reserve the restaurant. You must agree on a free time slot. Looking at your schedule, you are FREE at 09:00-10:00, 10:00-11:00, 14:00-15:00, and 15:00-16:00. Respond in German. Keep sentences short and simple at Goethe A2 level. Start by greeting Candidate A and suggesting a time like 9:00 or 10:00."
});
