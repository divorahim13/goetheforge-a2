// Question Bank for Goethe B1 (Set 1)
// Structured according to official Goethe-Zertifikat B1 guidelines.

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

export interface LesenTeil1Question {
  id: string;
  statement: string;
  correctAnswer: "Richtig" | "Falsch";
  explanation: string;
}

export interface LesenTeil3Person {
  id: string;
  person: string;
  description: string;
}

export interface LesenTeil3Ad {
  id: string; // a - j
  title: string;
  content: string;
}

export interface LesenTeil4Comment {
  id: string;
  name: string;
  statement: string;
  correctAnswer: "Ja" | "Nein";
  explanation: string;
}

export interface LesenSetB1 {
  id: string;
  name: string;
  teil1: {
    title: string;
    text: string;
    questions: LesenTeil1Question[];
  };
  teil2: {
    text1: {
      title: string;
      text: string;
      questions: LesenQuestion[];
    };
    text2: {
      title: string;
      text: string;
      questions: LesenQuestion[];
    };
  };
  teil3: {
    people: LesenTeil3Person[];
    ads: LesenTeil3Ad[];
    correctAnswers: { [personId: string]: string }; // matches personId to ad id (a-j) or "X"
    explanation: { [personId: string]: string };
  };
  teil4: {
    topic: string;
    intro: string;
    comments: LesenTeil4Comment[];
  };
  teil5: {
    title: string;
    text: string;
    questions: LesenQuestion[];
  };
}

export interface HorenTeil1Item {
  id: string;
  audioText: string;
  tfQuestion: string;
  tfCorrectAnswer: "Richtig" | "Falsch";
  mcQuestion: string;
  mcOptions: {
    a: string;
    b: string;
    c: string;
  };
  mcCorrectAnswer: "a" | "b" | "c";
  explanation: string;
}

export interface HorenTeil4Question {
  id: string;
  statement: string;
  correctAnswer: "a" | "b" | "c"; // a = Moderator, b = Guest 1, c = Guest 2
  explanation: string;
}

export interface HorenSetB1 {
  id: string;
  name: string;
  teil1: {
    questions: HorenTeil1Item[];
  };
  teil2: {
    audioText: string;
    questions: LesenQuestion[];
  };
  teil3: {
    audioText: string;
    questions: {
      id: string;
      statement: string;
      correctAnswer: "Richtig" | "Falsch";
      explanation: string;
    }[];
  };
  teil4: {
    audioText: string;
    moderatorName: string;
    guest1Name: string; // e.g. Herr Richter
    guest2Name: string; // e.g. Frau Weber
    questions: HorenTeil4Question[];
  };
}

export interface SchreibenScenarioB1 {
  id: string;
  name: string;
  teil1: {
    title: string;
    situation: string;
    points: string[];
    sampleSolution: string;
  };
  teil2: {
    title: string;
    situation: string;
    points: string[];
    sampleSolution: string;
  };
  teil3: {
    title: string;
    situation: string;
    points: string[];
    sampleSolution: string;
  };
}

export interface SprechenSetB1 {
  id: string;
  name: string;
  teil1: {
    theme: string;
    situation: string;
    guidelines: string[];
    redemittel: string[];
  };
  teil2: {
    topics: {
      title: string;
      points: string[];
      sampleIntro: string;
      samplePoints: { label: string; text: string }[];
      sampleOutro: string;
    }[];
    redemittel: string[];
  };
  teil3: {
    guidelines: string[];
    redemittel: string[];
  };
}

// ==========================================
// 1. LESEN BANK (B1 SET 1)
// ==========================================
export const LESEN_BANK_B1: LesenSetB1[] = [
  {
    id: "lesen-b1-set-1",
    name: "Modellsatz 1",
    teil1: {
      title: "Susannes Alltags-Blog: Die verlorene Brieftasche",
      text: "Was mir heute passiert ist, das glaubt mir keiner: Als ich zu Mittag nichts ahnend in der Küche beim Kochen stand, läutete mein Handy. Eine Frauenstimme erklärte mir, dass meine Brieftasche in der Bankfiliale abgegeben worden war und ich sie dort abholen könnte. Mir wurde ganz heiß – mir war noch gar nicht aufgefallen, dass sie fehlte. Und ich hatte ja auch noch relativ viel Bargeld eingesteckt! Schnell holte ich meine Handtasche hervor und suchte nach der Brieftasche. Es stimmte! Auch nach längerem Kramen in der Tasche konnte ich sie nicht finden. Ich zog also meine Jacke an und machte mich auf den Weg zur Bank. Unterwegs überlegte ich, wo ich meine Brieftasche liegen gelassen hatte: Sicherlich im Supermarkt an der Kasse beim Bezahlen, dachte ich. Als ich bei der Bank ankam und meine Brieftasche zurückbekam, erzählte mir die Angestellte, wie sie dorthin gelangt war. Ein junger Mann hatte sie auf dem Parkplatz vor dem Supermarkt auf dem Boden gefunden. Der Weg zum städtischen Fundbüro war für ihn jedoch zu weit, und er suchte nach einer einfacheren Möglichkeit. Auf meiner Bankomatkarte fand er das Logo unserer Bank. Da eine Filiale direkt in der Nähe war, brachte er die Brieftasche dorthin. Die Bankmitarbeiter suchten daraufhin in ihrem Computer-System nach meinen Daten und riefen mich an. Ich war überglücklich! Zum Glück war alles noch da: Kreditkarten, Ausweis und jeder einzelne Euro Bargeld. Nun weiß ich leider gar nicht, wie ich dem ehrlichen Finder danken kann, da er seinen Namen nicht hinterlassen hat. Aber vielleicht liest er ja diesen Blog-Beitrag! Vielen Dank!",
      questions: [
        {
          id: "b1-l1-q1",
          statement: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.",
          correctAnswer: "Richtig",
          explanation: "Teks menyatakan: 'Mir wurde ganz heiß – mir war noch gar nicht aufgefallen, dass sie fehlte.'"
        },
        {
          id: "b1-l1-q2",
          statement: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.",
          correctAnswer: "Richtig",
          explanation: "Teks menyatakan: 'Unterwegs überlegte ich, wo ich meine Brieftasche liegen gelassen hatte: Sicherlich im Supermarkt an der Kasse beim Bezahlen...'"
        },
        {
          id: "b1-l1-q3",
          statement: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.",
          correctAnswer: "Falsch",
          explanation: "Teks menyatakan: 'Der Weg zum städtischen Fundbüro war für ihn jedoch zu weit... brachte er die Brieftasche dorthin [zur Bankfiliale].'"
        },
        {
          id: "b1-l1-q4",
          statement: "Die Telefonnummer der Bank war in der Brieftasche.",
          correctAnswer: "Falsch",
          explanation: "Finder menemukan nama bank pada kartu debit (Bankomatkarte), lalu pihak bank mencari nomor telepon Susanne di sistem komputer mereka."
        },
        {
          id: "b1-l1-q5",
          statement: "In Susannes Brieftasche fehlte nichts.",
          correctAnswer: "Richtig",
          explanation: "Teks menyatakan: 'Zum Glück war alles noch da: Kreditkarten, Ausweis und jeder einzelne Euro Bargeld.'"
        },
        {
          id: "b1-l1-q6",
          statement: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.",
          correctAnswer: "Falsch",
          explanation: "Teks menyatakan: 'Nun weiß ich leider gar nicht, wie ich dem ehrlichen Finder danken kann, da er seinen Namen nicht hinterlassen hat.'"
        }
      ]
    },
    teil2: {
      text1: {
        title: "Teilen statt Besitzen – Die Share Economy",
        text: "Die Zeiten ändern sich, und mit ihnen auch die Konsumgewohnheiten der Menschen. Früher war es für fast jeden Erwachsenen selbstverständlich, ein eigenes Auto, eine eigene Waschmaschine oder eine eigene Bohrmaschine zu besitzen. Doch heute erobert der Trend des Teilens, bekannt als 'Share Economy', vor allem die jüngere Generation in den europäischen Großstädten. Anstatt Gegenstände zu kaufen, die man nur selten benutzt, teilt man sie mit anderen oder leiht sie bei Bedarf über Online-Plattformen aus. Das schont nicht nur den eigenen Geldbeutel, sondern ist auch ein wichtiger Beitrag zum Umweltschutz. Denn für die Herstellung von Autos oder Elektronikgeräten werden wertvolle Ressourcen benötigt. Wer teilt, sorgt dafür, dass weniger produziert werden muss. Allerdings gibt es auch Kritiker: Sie bemängeln, dass viele Sharing-Plattformen mittlerweile rein kommerziell arbeiten und die ursprüngliche Idee der nachbarschaftlichen Hilfe in den Hintergrund gedrängt wird. Trotzdem wächst die Zahl der Nutzer stetig an, und Experten glauben, dass das Teilen in Zukunft das Kaufen in vielen Lebensbereichen ersetzen wird.",
        questions: [
          {
            id: "b1-l2-q7",
            question: "Was ist das Hauptthema des Textes?",
            options: {
              a: "Die Entwicklung neuer Online-Plattformen in Europa.",
              b: "Ein moderner Konsumtrend, bei dem Leihen wichtiger als Besitzen ist.",
              c: "Die Bedeutung von Waschmaschinen für den Umweltschutz."
            },
            correctAnswer: "b",
            explanation: "Teks membahas tren 'Share Economy' di mana orang lebih memilih meminjam/membagi barang (Teilen/Ausleihen) daripada memilikinya (Besitzen)."
          },
          {
            id: "b1-l2-q8",
            question: "Warum ist die Share Economy gut für die Umwelt?",
            options: {
              a: "Weil geteilte Geräte seltener kaputtgehen.",
              b: "Weil Menschen durch das Leihen viel Geld sparen können.",
              c: "Weil weniger neue Produkte hergestellt werden müssen."
            },
            correctAnswer: "c",
            explanation: "Teks menyatakan: 'Wer teilt, sorgt dafür, dass weniger produziert werden muss', yang menghemat sumber daya alam."
          },
          {
            id: "b1-l2-q9",
            question: "Was kritisieren manche Menschen an der Share Economy?",
            options: {
              a: "Dass viele Plattformen nur finanzielle Interessen verfolgen.",
              b: "Dass die Qualität der geteilten Geräte oft mangelhaft ist.",
              c: "Dass junge Leute in Großstädten kein Geld mehr ausgeben."
            },
            correctAnswer: "a",
            explanation: "Kritikus mengeluhkan: 'dass viele Sharing-Plattformen mittlerweile rein kommerziell arbeiten und die ursprüngliche Idee der nachbarschaftlichen Hilfe in den Hintergrund gedrängt wird.'"
          }
        ]
      },
      text2: {
        title: "E-Scooter in Städten: Segen oder Gefahr?",
        text: "Seit einigen Jahren gehören sie zum festen Straßenbild in deutschen Großstädten: E-Scooter. Die elektrischen Tretroller können per App gemietet und überall in der Stadt abgestellt werden. Für viele Pendler sind sie eine praktische Möglichkeit, schnell vom Bahnhof zum Arbeitsplatz zu gelangen, ohne im Stau zu stehen. Zudem verursachen sie während der Fahrt keine umweltschädlichen Abgase. Doch die Begeisterung teilt nicht jeder. Fußgänger beschweren sich regelmäßig über achtlos abgestellte Roller auf Gehwegen, die zu gefährlichen Stolperfallen werden. Zudem kommt es immer wieder zu schweren Unfällen, weil Fahrer die Verkehrsregeln missachten oder betrunken fahren. Einige Städte reagieren nun mit strengeren Regeln: Sie richten feste Parkzonen ein und verbieten das Fahren in Fußgängerzonen. Trotz der Kritik verteidigen die Anbieter ihre Roller: Sie seien ein wichtiger Baustein für eine autofreie Zukunft in unseren Städten. Die Debatte zeigt, dass Städte neue Wege finden müssen, um die Mobilität für alle sicher zu gestalten.",
        questions: [
          {
            id: "b1-l2-q10",
            question: "Welchen Vorteil bieten E-Scooter laut Text für Pendler?",
            options: {
              a: "Sie sind vollkommen kostenlos nutzbar.",
              b: "Man kann mit ihnen Staus im Straßenverkehr vermeiden.",
              c: "Sie können in jedem Zug kostenlos mitgenommen werden."
            },
            correctAnswer: "b",
            explanation: "Teks menyatakan: 'praktische Möglichkeit, schnell vom Bahnhof zum Arbeitsplatz zu gelangen, ohne im Stau zu stehen.'"
          },
          {
            id: "b1-l2-q11",
            question: "Warum beschweren sich Fußgänger über E-Scooter?",
            options: {
              a: "Weil die Roller beim Fahren zu viel Lärm machen.",
              b: "Weil Roller im Weg stehen und Gefahren darstellen.",
              c: "Weil die Miete über Apps zu kompliziert ist."
            },
            correctAnswer: "b",
            explanation: "Teks menyatakan: 'Fußgänger beschweren sich regelmäßig über achtlos abgestellte Roller auf Gehwegen, die zu gefährlichen Stolperfallen werden.'"
          },
          {
            id: "b1-l2-q12",
            question: "Wie reagieren einige Städte auf die Probleme mit E-Scootern?",
            options: {
              a: "Sie verbieten elektrische Roller komplett im Stadtgebiet.",
              b: "Sie bauen spezielle Straßen nur für E-Scooter.",
              c: "Sie verbieten das Nutzen von Rollern in Fußgängerbereichen."
            },
            correctAnswer: "c",
            explanation: "Teks menyatakan: 'Sie richten feste Parkzonen ein und verbieten das Fahren in Fußgängerzonen.'"
          }
        ]
      }
    },
    teil3: {
      people: [
        { id: "p1", person: "Sarah", description: "Sarah möchte eine Ferienwohnung in den Bergen buchen, in die sie ihren Hund mitnehmen darf." },
        { id: "p2", person: "Max", description: "Max möchte in seinem Urlaub Segeln auf einem See lernen." },
        { id: "p3", person: "Felix", description: "Felix sucht eine günstige Unterkunft in Berlin für eine Klassenreise." },
        { id: "p4", person: "Lisa", description: "Lisa möchte in München ein gebrauchtes Fahrrad kaufen." },
        { id: "p5", person: "Herr & Frau Schmidt", description: "Die Schmidts möchten ein luxuriöses Wellness-Wochenende in einem 5-Sterne-Hotel am Meer verbringen." },
        { id: "p6", person: "Tom", description: "Tom möchte flexibel von zu Hause aus online Deutsch lernen." },
        { id: "p7", person: "Anna", description: "Anna sucht eine Sprachschule in Wien, die Deutsch-Intensivkurse anbietet und bei der Wohnungssuche hilft." }
      ],
      ads: [
        { id: "a", title: "Ferienwohnung Almrausch", content: "Gemütliche Ferienwohnung in den Alpen, ideal für Wanderungen. Bis zu 4 Personen. Haustiere sind bei uns herzlich willkommen! Buchung unter alpen-urlaub.de" },
        { id: "b", title: "Segelschule Chiemsee", content: "Lernen Sie Segeln und Surfen in den Sommerferien! Kurse für alle Altersklassen. Unterkunft direkt am See buchbar. Infos: segeln-chiemsee.de" },
        { id: "c", title: "Jugendherberge Berlin-Mitte", content: "Zentrale Lage, günstige Mehrbettzimmer, ideal für Schulklassen, jugendgruppen und Backpacker. Frühstück inklusive. info@jh-berlin.de" },
        { id: "d", title: "Zweirad-Börse München", content: "Große Auswahl an gebrauchten und geprüften Fahrrädern aller Marken. Günstige Preise. Besuchen Sie uns samstags von 9-16 Uhr in der Hauptstraße 22." },
        { id: "e", title: "Kanu-Abenteuer Mecklenburg", content: "Kanuverleih und geführte Touren durch die Mecklenburger Seenplatte. Perfekt für Naturliebhaber und sportliche Wochenendausflüge." },
        { id: "f", title: "Deutsch-Online Direkt", content: "Lernen Sie Deutsch wann und wo Sie wollen! Flexible Online-Kurse mit muttersprachlichen Lehrern per Video. Kostenlose Probestunde." },
        { id: "g", title: "Sprachakademie Wien", content: "Intensivkurse Deutsch als Fremdsprache. Alle Niveaustufen. Wir vermitteln gerne Zimmer in Gastfamilien oder in Studentenheimen in Wien." },
        { id: "h", title: "Hotel Ostseetraum", content: "Exklusives Wellness-Wochenende an der Ostsee. Entspannen Sie in unserem großen Spa-Bereich. Gemütliches 4-Sterne-Haus. Direkt am Sandstrand." },
        { id: "i", title: "Tierpension Pfotenparadies", content: "Wir betreuen Ihren Hund oder Ihre Katze liebevoll, während Sie im Urlaub sind. Großer Auslauf im Grünen, erfahrene Tierpfleger." },
        { id: "j", title: "Wanderreisen Schwarzwald", content: "Geführte Wanderungen im Schwarzwald für aktive Senioren. Inklusive Halbpension im traditionsreichen Gasthof." }
      ],
      correctAnswers: {
        "p1": "a",
        "p2": "b",
        "p3": "c",
        "p4": "d",
        "p5": "X",
        "p6": "f",
        "p7": "g"
      },
      explanation: {
        "p1": "Sarah cocok dengan Iklan a (Ferienwohnung Almrausch) karena mengizinkan hewan peliharaan ('Haustiere herzlich willkommen') di pegunungan ('Alpen').",
        "p2": "Max cocok dengan Iklan b (Segelschule Chiemsee) karena ingin belajar berlayar ('Lernen Sie Segeln') di danau ('Chiemsee').",
        "p3": "Felix cocok dengan Iklan c (Jugendherberge Berlin-Mitte) karena mencari penginapan murah di Berlin untuk rombongan sekolah ('günstige Mehrbettzimmer, ideal für Schulklassen').",
        "p4": "Lisa cocok dengan Iklan d (Zweirad-Börse München) karena ingin membeli sepeda bekas di Munchen ('gebrauchte Fahrräder... München').",
        "p5": "Tidak ada iklan yang cocok (X). Keluarga Schmidt menginginkan hotel bintang 5 ('5-Sterne-Hotel'), sedangkan Iklan h (Hotel Ostseetraum) hanya hotel bintang 4 ('4-Sterne-Haus').",
        "p6": "Tom cocok dengan Iklan f (Deutsch-Online Direkt) karena ingin belajar bahasa Jerman secara online dan fleksibel ('Deutsch online... flexible Online-Kurse').",
        "p7": "Anna cocok dengan Iklan g (Sprachakademie Wien) karena mencari sekolah bahasa di Wina ('Wien') yang menawarkan kursus intensif dan membantu mencari tempat tinggal ('vermitteln gerne Zimmer')."
      }
    },
    teil4: {
      topic: "Sollte das Autofahren in deutschen Innenstädten komplett verboten werden?",
      intro: "In einer Umfrage äußern sich Leser einer Auto- und Umweltzeitschrift zu der Frage, ob Autos aus den Innenstädten verbannt werden sollten.",
      comments: [
        {
          id: "b1-l4-c1",
          name: "Julia (28)",
          statement: "Ich finde die Idee super! Endlich saubere Luft und weniger Lärm. Ich fahre ohnehin fast alles mit dem Fahrrad und vermisse das Auto in der Stadt überhaupt nicht.",
          correctAnswer: "Ja",
          explanation: "Julia setuju karena menginginkan udara bersih dan tidak bising ('super! Endlich saubere Luft...')."
        },
        {
          id: "b1-l4-c2",
          name: "Michael (45)",
          statement: "Völlig unrealistisch! Ich wohne auf dem Land und muss jeden Tag zur Arbeit in die Stadt pendeln. Die Züge sind unzuverlässig und bereits jetzt völlig überfüllt.",
          correctAnswer: "Nein",
          explanation: "Michael tidak setuju karena ia tinggal di desa dan harus komuter ke kota, sementara kereta tidak bisa diandalkan."
        },
        {
          id: "b1-l4-c3",
          name: "Sabina (34)",
          statement: "Für Familien mit kleinen Kindern ist ein Auto einfach unverzichtbar. Wie soll ich ohne Auto den Wocheneinkauf nach Hause bringen? Die Busse sind dafür unpraktisch.",
          correctAnswer: "Nein",
          explanation: "Sabina tidak setuju karena mobil penting bagi keluarga dengan anak kecil untuk berbelanja."
        },
        {
          id: "b1-l4-c4",
          name: "Jonas (22)",
          statement: "Es gibt heute keinen Grund mehr für Autos in der City. Carsharing und E-Bikes sind überall verfügbar. Innenstädte sollten für Menschen da sein, nicht für parkende Blechkisten.",
          correctAnswer: "Ja",
          explanation: "Jonas setuju karena alternatif transportasi sudah banyak dan kota harus ramah manusia."
        },
        {
          id: "b1-l4-c5",
          name: "Dr. Arndt (52)",
          statement: "Als Arzt im Bereitschaftsdienst muss ich schnell zu Notfällen in der ganzen Stadt gelangen können. Ein generelles Verbot halte ich für gefährlich und unüberlegt.",
          correctAnswer: "Nein",
          explanation: "Dr. Arndt tidak setuju karena ia perlu merespons keadaan darurat medis secara cepat."
        },
        {
          id: "b1-l4-c6",
          name: "Clara (19)",
          statement: "Ohne Autos wäre das Einkaufen in der City viel entspannter. Man könnte gemütlich draußen in den Cafés sitzen. Ich unterstütze das Verbot voll und ganz.",
          correctAnswer: "Ja",
          explanation: "Clara setuju karena area perbelanjaan akan menjadi lebih santai dan nyaman."
        },
        {
          id: "b1-l4-c7",
          name: "Thomas (38)",
          statement: "Die Einzelhändler in den Innenstädten sterben aus, wenn die Kunden nicht mehr bequem mit dem Auto anreisen können. Sie werden dann nur noch im Internet bestellen.",
          correctAnswer: "Nein",
          explanation: "Thomas tidak setuju karena larangan mobil dapat merusak bisnis ritel fisik di pusat kota."
        }
      ]
    },
    teil5: {
      title: "Hausordnung der Stadtbibliothek Neustadt",
      text: "Herzlich willkommen in der Stadtbibliothek Neustadt! Damit alle Besucher in Ruhe arbeiten können, bitten wir Sie, folgende Regeln zu beachten:\n1. Ausleihfristen: Die reguläre Leihfrist für Bücher beträgt 4 Wochen, für DVDs und Zeitschriften 2 Wochen. Eine Verlängerung ist vor Ablauf der Frist online oder telefonisch möglich, sofern keine Reservierung vorliegt.\n2. Verhalten in der Bibliothek: Im gesamten Lesebereich ist Ruhe zu bewahren. Mobiltelefone müssen stummgeschaltet werden. Telefonieren ist nur im Eingangsbereich gestattet.\n3. Essen und Trinken: Das Mitbringen von offenen Getränken und Speisen in die Bibliotheksräume ist untersagt. Erlaubt sind lediglich verschließbare Wasserflaschen.\n4. Bibliotheksausweis: Die Nutzung der Bibliothek ist nur mit einem gültigen Ausweis gestattet. Der Verlust des Ausweises muss der Bibliothek unverzüglich gemeldet werden, um Missbrauch zu verhindern. Für die Erstellung eines Ersatzausweises wird eine Gebühr von 5 Euro erhoben.\n5. Mahngebühren: Bei Überschreitung der Leihfrist werden automatisch Mahngebühren berechnet. Diese betragen 1 Euro pro Medium und angefangene Woche.",
      questions: [
        {
          id: "b1-l5-q27",
          question: "Wie lange darf man eine DVD ausleihen?",
          options: {
            a: "Vier Wochen.",
            b: "Zwei Wochen.",
            c: "Bis man sie online verlängert."
          },
          correctAnswer: "b",
          explanation: "Teks menyatakan: 'für DVDs und Zeitschriften 2 Wochen.'"
        },
        {
          id: "b1-l5-q28",
          question: "Wo darf man in der Bibliothek mit dem Handy telefonieren?",
          options: {
            a: "Überall, solange man leise spricht.",
            b: "Ausschließlich im Eingangsbereich.",
            c: "Nur im Lesebereich."
          },
          correctAnswer: "b",
          explanation: "Teks menyatakan: 'Telefonieren ist nur im Eingangsbereich gestattet.'"
        },
        {
          id: "b1-l5-q29",
          question: "Welche Getränke darf man in die Räume mitnehmen?",
          options: {
            a: "Kaffee und Tee in Bechern.",
            b: "Gar keine Getränke.",
            c: "Wasser in Flaschen mit Verschluss."
          },
          correctAnswer: "c",
          explanation: "Teks menyatakan: 'Erlaubt sind lediglich verschließbare Wasserflaschen.'"
        },
        {
          id: "b1-l5-q30",
          question: "Was kostet es, wenn man seinen verlorenen Ausweis ersetzen möchte?",
          options: {
            a: "Nichts, das ist kostenlos.",
            b: "Eine Gebühr von 5 Euro.",
            c: "1 Euro pro Woche."
          },
          correctAnswer: "b",
          explanation: "Teks menyatakan: 'Für die Erstellung eines Ersatzausweises wird eine Gebühr von 5 Euro erhoben.'"
        }
      ]
    }
  }
];

// ==========================================
// 2. HÖREN BANK (B1 SET 1)
// ==========================================
export const HOREN_BANK_B1: HorenSetB1[] = [
  {
    id: "horen-b1-set-1",
    name: "Modellsatz 1",
    teil1: {
      questions: [
        {
          id: "b1-h1-q1",
          audioText: "Guten Tag, Herr Richter, hier spricht die Kfz-Werkstatt Müller. Ihr Auto ist fertig und kann abgeholt werden. Wir haben die Bremsen repariert und die Hauptuntersuchung durchgeführt. Die Reifen waren entgegen unserer ersten Vermutung noch völlig in Ordnung, die mussten wir also nicht wechseln. Die Gesamtkosten belaufen sich auf 280 Euro. Bitte holen Sie Ihr Fahrzeug bis spätestens Donnerstag um 18 Uhr ab, da wir am Freitag wegen eines Feiertags geschlossen haben. Vielen Dank und auf Wiederhören.",
          tfQuestion: "Herr Richters Auto benötigt keine neuen Reifen.",
          tfCorrectAnswer: "Richtig",
          mcQuestion: "Bis wann muss Herr Richter sein Auto abholen?",
          mcOptions: {
            a: "Bis Donnerstag um 18:00 Uhr.",
            b: "Bis Freitagabend.",
            c: "Morgen früh."
          },
          mcCorrectAnswer: "a",
          explanation: "Reifen tidak perlu diganti ('Die Reifen waren... in Ordnung, die mussten wir also nicht wechseln'). Mobil harus diambil sebelum Kamis pukul 18:00 karena Jumat libur."
        },
        {
          id: "b1-h1-q2",
          audioText: "Liebe Fahrgäste auf Gleis 4: Der Intercity-Express ICE 582 nach Hamburg-Altona über Hannover, planmäßige Abfahrt um 10:14 Uhr, fährt heute wegen einer technischen Störung an der Lokomotive nicht ab. Fahrgäste nach Hamburg benutzen bitte den ICE 924 auf Gleis 7, Abfahrt um 10:30 Uhr. Dieser Zug macht einen zusätzlichen Halt in Hannover. Wir bitten alle Fahrgäste um Entschuldigung für die Verzögerung.",
          tfQuestion: "Der ICE nach Hamburg fällt heute aus.",
          tfCorrectAnswer: "Richtig",
          mcQuestion: "Welche Alternative haben Fahrgäste nach Hamburg?",
          mcOptions: {
            a: "Sie müssen bis morgen warten.",
            b: "Sie nehmen den Zug um 10:30 Uhr von Gleis 7.",
            c: "Sie fahren mit dem Bus."
          },
          mcCorrectAnswer: "b",
          explanation: "Kereta ICE 582 dibatalkan ('fährt heute... nicht ab'). Penumpang diarahkan naik kereta alternatif ICE 924 di peron 7 pukul 10:30."
        },
        {
          id: "b1-h1-q3",
          audioText: "Hallo Schatz, ich bin es, Karin. Du, ich stecke gerade im Stau auf der A8 fest. Hier geht seit einer halben Stunde gar nichts mehr. Ich werde es also leider nicht rechtzeitig schaffen, die Kinder von der Musikschule abzuholen. Kannst du das bitte übernehmen? Die Musikschule schließt um 16 Uhr. Danach kannst du vielleicht gleich noch einkaufen gehen. Milch haben wir zwar noch genug, aber uns fehlt Brot und Aufschnitt für das Abendessen. Danke dir, bis später!",
          tfQuestion: "Karin kann die Kinder heute nicht abholen.",
          tfCorrectAnswer: "Richtig",
          mcQuestion: "Was soll der Ehemann einkaufen?",
          mcOptions: {
            a: "Milch und Brot.",
            b: "Brot und Aufschnitt.",
            c: "Nur Milch."
          },
          mcCorrectAnswer: "b",
          explanation: "Karin terjebak macet sehingga tidak bisa menjemput anak-anak. Ia meminta suaminya membeli roti dan daging iris ('Brot und Aufschnitt'), susu masih cukup."
        },
        {
          id: "b1-h1-q4",
          audioText: "Und hier die Wetteraussichten für das kommende Wochenende: Nach den heftigen Regenfällen der letzten Tage beruhigt sich das Wetter im Süden Deutschlands ab Freitagmittag. Am Samstag und Sonntag erwartet uns strahlender Sonnenschein bei spätsommerlichen Temperaturen von bis zu 24 Grad. Im Norden bleibt es dagegen wechselhaft mit Schauern und kühlem Wind. Packen Sie dort also auf jeden Fall die Regenjacke ein.",
          tfQuestion: "Am Wochenende regnet es in ganz Deutschland.",
          tfCorrectAnswer: "Falsch",
          mcQuestion: "Wie wird das Wetter im Süden Deutschlands am Wochenende?",
          mcOptions: {
            a: "Sonnig und trocken.",
            b: "Kalt und regnerisch.",
            c: "Stürmisch."
          },
          mcCorrectAnswer: "a",
          explanation: "Wetter tidak hujan di seluruh Jerman (hanya di Utara). Di Selatan cuaca akan sangat cerah dan hangat ('strahlender Sonnenschein bei bis zu 24 Grad')."
        },
        {
          id: "b1-h1-q5",
          audioText: "Hallo Paul, hier ist Lisa. Du, ich freue mich schon riesig auf unser Konzert morgen Abend. Ich habe gerade gelesen, dass das Parken direkt an der Konzerthalle sehr teuer ist und es nur wenige Plätze gibt. Lass uns doch lieber mit der U-Bahn hinfahren. Die Linie U3 fährt direkt vom Hauptbahnhof bis zur Halle. Treffen wir uns einfach um 19 Uhr am Gleis der U3? Das Konzert beginnt um 20 Uhr, so haben wir genug Zeit. Ruf mich kurz zurück!",
          tfQuestion: "Lisa schlägt vor, mit dem Auto zum Konzert zu fahren.",
          tfCorrectAnswer: "Falsch",
          mcQuestion: "Wo wollen sich Lisa und Paul treffen?",
          mcOptions: {
            a: "Direkt vor der Konzerthalle.",
            b: "Am Hauptbahnhof am Gleis der U-Bahn U3.",
            c: "Auf dem Parkplatz."
          },
          mcCorrectAnswer: "b",
          explanation: "Lisa menyarankan naik U-Bahn karena parkir mobil mahal. Mereka berencana bertemu di peron U3 stasiun kereta pusat (Hauptbahnhof) pukul 19:00."
        }
      ]
    },
    teil2: {
      audioText: "Guten Tag, liebe Besucherinnen und Besucher! Herzlich willkommen auf Schloss Albrechtsburg. Mein Name ist Johannes und ich werde Sie heute durch die historischen Gemächer unseres wunderschönen Schlosses führen. Bevor wir beginnen, einige wichtige Hinweise: Das Fotografieren ohne Blitz ist für den privaten Gebrauch gestattet. Die Mitnahme von Speisen und Getränken in die Ausstellungsräume ist aus Sicherheitsgründen nicht erlaubt. Bitte nutzen Sie dafür unsere Schließfächer im Foyer. Schloss Albrechtsburg wurde im Jahr 1471 von den Herzögen Ernst und Albrecht von Sachsen erbaut. Es gilt als der erste Schlossbau der deutschen Architekturgeschichte. Wir besichtigen gleich im ersten Stock die prachtvollen Festsäle, danach werfen wir einen Blick in die alte Schlosskapelle. Der Rundgang dauert ungefähr 45 Minuten. Am Ende unseres Weges gelangen Sie direkt in unseren Schlossgarten, von wo aus Sie einen fantastischen Blick über das Elbtal haben. Dort befindet sich auch unser gemütliches Schlosscafé. Folgen Sie mir bitte!",
      questions: [
        {
          id: "b1-h2-q11",
          question: "Wer spricht zu den Besuchern?",
          options: {
            a: "Der Schlossbesitzer.",
            b: "Ein Schlossführer namens Johannes.",
            c: "Ein lokaler Politiker."
          },
          correctAnswer: "b",
          explanation: "Pembicara memperkenalkan diri: 'Mein Name ist Johannes und ich werde Sie heute durch die historischen Gemächer... führen' (Schlossführer)."
        },
        {
          id: "b1-h2-q12",
          question: "Welche Regel gilt für das Fotografieren im Schloss?",
          options: {
            a: "Fotografieren ist komplett verboten.",
            b: "Das Fotografieren ist ohne Blitz für private Zwecke erlaubt.",
            c: "Man darf überall mit Blitz fotografieren."
          },
          correctAnswer: "b",
          explanation: "Teks menyatakan: 'Das Fotografieren ohne Blitz ist für den privaten Gebrauch gestattet.'"
        },
        {
          id: "b1-h2-q13",
          question: "Wann wurde Schloss Albrechtsburg erbaut?",
          options: {
            a: "Im Jahr 1471.",
            b: "Im Jahr 1741.",
            c: "Im 19. Jahrhundert."
          },
          correctAnswer: "a",
          explanation: "Teks menyatakan: 'Schloss Albrechtsburg wurde im Jahr 1471... erbaut.'"
        },
        {
          id: "b1-h2-q14",
          question: "Wie lange dauert der Rundgang?",
          options: {
            a: "Eine Stunde.",
            b: "Ungefähr 45 Minuten.",
            c: "Zwei Stunden."
          },
          correctAnswer: "b",
          explanation: "Teks menyatakan: 'Der Rundgang dauert ungefähr 45 Minuten.'"
        },
        {
          id: "b1-h2-q15",
          question: "Wo endet die Führung durch das Schloss?",
          options: {
            a: "Direkt im Foyer bei den Schließfächern.",
            b: "In der alten Schlosskapelle.",
            c: "Im Schlossgarten mit Blick über das Elbtal."
          },
          correctAnswer: "c",
          explanation: "Teks menyatakan: 'Am Ende unseres Weges gelangen Sie direkt in unseren Schlossgarten...'"
        }
      ]
    },
    teil3: {
      audioText: "Hallo Ben! Schön dich zu sehen. Wie läuft dein Studium? Hallo Frau Jung! Eigentlich ganz gut, danke. Aber ich habe eine wichtige Frage: Ich würde gerne im nächsten Frühjahr für ein Semester im Ausland studieren, am liebsten in Spanien. Ich weiß aber nicht genau, wie ich mich bewerben soll. Da sind Sie bei mir im International Office genau richtig, Ben. Ein Auslandssemester ist eine tolle Erfahrung. Haben Sie sich schon für eine Partneruniversität entschieden? Ja, ich würde gerne an die Universität Valencia gehen. Die bieten Kurse in meinem Fach Wirtschaftswissenschaften an. Das ist eine sehr gute Wahl. Um sich zu bewerben, benötigen Sie zuerst einen aktuellen Notenspiegel und ein Motivationsschreiben auf Englisch. Ganz wichtig: Die Bewerbungsfrist für das Frühjahrssemester endet bereits am 15. Oktober. Sie müssen sich also beeilen! Oh, das ist ja schon in einem Monat. Benötige ich auch einen Spanisch-Sprachnachweis? Ja, für Valencia müssen Sie Spanischkenntnisse auf dem Niveau B1 nachweisen, da die meisten Vorlesungen auf Spanisch gehalten werden. Reicht auch mein Abiturzeugnis? Nein, das reicht leider nicht. Sie müssen einen offiziellen Test machen, den wir hier an der Uni kostenlos anbieten. Den nächsten Termin gibt es in zwei Wochen. Super, dafür melde ich mich sofort an. Vielen Dank für die Hilfe, Frau Jung! Sehr gerne, Ben. Kommen Sie einfach wieder vorbei, wenn Sie die Unterlagen fertig haben.",
      questions: [
        {
          id: "b1-h3-q16",
          statement: "Ben möchte ein Semester im Ausland verbringen.",
          correctAnswer: "Richtig",
          explanation: "Ben menyatakan ingin kuliah satu semester di luar negeri ('für ein Semester im Ausland studieren')."
        },
        {
          id: "b1-h3-q17",
          statement: "Ben studiert Medizin in Deutschland.",
          correctAnswer: "Falsch",
          explanation: "Ben mengambil jurusan Ekonomi/Wirtschaftswissenschaften ('Fach Wirtschaftswissenschaften')."
        },
        {
          id: "b1-h3-q18",
          statement: "Die Bewerbungsfrist für das Semester ist der 15. November.",
          correctAnswer: "Falsch",
          explanation: "Frau Jung mengatakan batas waktu pendaftaran adalah 15 Oktober ('endet bereits am 15. Oktober')."
        },
        {
          id: "b1-h3-q19",
          statement: "Ben muss für Valencia Spanischkenntnisse nachweisen.",
          correctAnswer: "Richtig",
          explanation: "Ben harus menunjukkan bukti kemampuan bahasa Spanyol tingkat B1 ('Spanischkenntnisse auf dem Niveau B1 nachweisen')."
        },
        {
          id: "b1-h3-q20",
          statement: "Bens Abiturzeugnis reicht als Sprachnachweis aus.",
          correctAnswer: "Falsch",
          explanation: "Frau Jung mengatakan ijazah SMA tidak cukup ('Nein, das reicht leider nicht')."
        },
        {
          id: "b1-h3-q21",
          statement: "Die Universität bietet einen kostenlosen Spanischtest an.",
          correctAnswer: "Richtig",
          explanation: "Kampus menawarkan ujian bahasa Spanyol gratis ('offiziellen Test machen, den wir hier an der Uni kostenlos anbieten')."
        },
        {
          id: "b1-h3-q22",
          statement: "Der nächste Sprachtest findet in einem Monat statt.",
          correctAnswer: "Falsch",
          explanation: "Ujian bahasa Spanyol diadakan dalam dua minggu ('in zwei Wochen')."
        }
      ]
    },
    teil4: {
      moderatorName: "Frau Berger",
      guest1Name: "Herr Dr. Becker",
      guest2Name: "Frau Neumann",
      audioText: "Moderatorin (Frau Berger): Hallo und herzlich willkommen zu unserer Diskussionsrunde am Nachmittag. Unser heutiges Thema betrifft fast alle Familien: Sollen Hausaufgaben an Schulen abgeschafft werden? Dazu begrüße ich im Studio Herrn Dr. Becker, Schulleiter eines Gymnasiums, und Frau Neumann, Mutter von drei schulpflichtigen Kindern. Herr Dr. Becker, Sie fordern die Abschaffung klassischer Hausaufgaben. Warum?\nDr. Becker: Nun, Frau Berger, Studien zeigen deutlich, dass klassische Hausaufgaben keinen messbaren Lerneffekt haben. Am Nachmittag sind Kinder müde und unkonzentriert. Zudem führt das Thema oft zu großem Stress und Streit in den Familien. Sinnvoller ist es, Übungsphasen direkt in den Schultag zu integrieren, wo Lehrer den Schülern direkt helfen können.\nFrau Neumann: Da muss ich Ihnen aber widersprechen, Herr Dr. Becker. Hausaufgaben sind wichtig, damit Kinder lernen, selbstständig zu arbeiten und sich ihre Zeit einzuteilen. Ohne Hausaufgaben würden meine Kinder am Nachmittag nur noch vor dem Fernseher oder am Handy sitzen. Außerdem sehe ich durch die Hausaufgaben genau, was meine Kinder in der Schule lernen und wo sie noch Probleme haben.\nModeratorin: Ein interessanter Punkt. Aber führt das nicht dazu, dass Kinder aus Familien, in denen die Eltern nicht helfen können, benachteiligt werden?\nDr. Becker: Genau das ist das Hauptproblem, Frau Berger. Die soziale Ungerechtigkeit wird durch Hausaufgaben massiv verstärkt. Kinder, deren Eltern keine Nachhilfe bezahlen oder selbst nicht helfen können, haben schlechtere Chancen. Das dürfen wir nicht akzeptieren.\nFrau Neumann: Das verstehe ich. Aber die Lösung kann doch nicht sein, die Hausaufgaben einfach abzuschaffen! Stattdessen sollten Schulen eine kostenlose Hausaufgabenbetreuung am Nachmittag anbieten, wo alle Kinder Unterstützung bekommen.\nDr. Becker: Eine Hausaufgabenbetreuung am Nachmittag ist zwar gut gemeint, löst aber nicht das Kernproblem der Überlastung. Kinder brauchen nach einem langen Schultag dringend Freizeit zum Spielen und für Sport. Das ist für ihre Entwicklung genauso wichtig wie das Lernen.\nModeratorin: Unsere Zeit ist leider fast um. Wir sehen, die Meinungen gehen stark auseinander. Ich bedanke mich bei meinen Gästen für das Gespräch und verabschiede mich von unseren Zuhörern. Auf Wiederhören!",
      questions: [
        {
          id: "b1-h4-q23",
          statement: "Begrüßt die Gäste und führt durch das Thema Hausaufgaben.",
          correctAnswer: "a",
          explanation: "Teks menyatakan pembuka oleh Frau Berger (Moderatorin)."
        },
        {
          id: "b1-h4-q24",
          statement: "Meint, dass Hausaufgaben zu Streit in den Familien führen.",
          correctAnswer: "b",
          explanation: "Dr. Becker menyatakan: 'Zudem führt das Thema oft zu großem Stress und Streit in den Familien.'"
        },
        {
          id: "b1-h4-q25",
          statement: "Glaubt, dass Kinder durch Hausaufgaben lernen, selbstständig zu arbeiten.",
          correctAnswer: "c",
          explanation: "Frau Neumann sagt: 'Hausaufgaben sind wichtig, damit Kinder lernen, selbstständig zu arbeiten...'"
        },
        {
          id: "b1-h4-q26",
          statement: "Sieht Hausaufgaben als Möglichkeit, den Lernstand der eigenen Kinder zu kontrollieren.",
          correctAnswer: "c",
          explanation: "Frau Neumann sagt: 'Außerdem sehe ich durch die Hausaufgaben genau, was meine Kinder in der Schule lernen...'"
        },
        {
          id: "b1-h4-q27",
          statement: "Fragt nach der Benachteiligung von Kindern aus bildungsfernen Familien.",
          correctAnswer: "a",
          explanation: "Die Moderatorin fragt: 'Aber führt das nicht dazu, dass Kinder aus Familien, in denen die Eltern nicht helfen können, benachteiligt werden?'"
        },
        {
          id: "b1-h4-q28",
          statement: "Ist der Meinung, dass Hausaufgaben die soziale Ungerechtigkeit vergrößern.",
          correctAnswer: "b",
          explanation: "Dr. Becker sagt: 'Die soziale Ungerechtigkeit wird durch Hausaufgaben massiv verstärkt.'"
        },
        {
          id: "b1-h4-q29",
          statement: "Schlägt eine kostenlose Hausaufgabenbetreuung am Nachmittag als Kompromiss vor.",
          correctAnswer: "c",
          explanation: "Frau Neumann schlägt vor: 'Stattdessen sollten Schulen eine kostenlose Hausaufgabenbetreuung am Nachmittag anbieten...'"
        },
        {
          id: "b1-h4-q30",
          statement: "Betont, dass Kinder am Nachmittag Freizeit für Sport und Spiel benötigen.",
          correctAnswer: "b",
          explanation: "Dr. Becker sagt: 'Kinder brauchen nach einem langen Schultag dringend Freizeit zum Spielen und für Sport.'"
        }
      ]
    }
  }
];

// ==========================================
// 3. SCHREIBEN BANK (B1 SET 1)
// ==========================================
export const SCHREIBEN_BANK_B1: SchreibenScenarioB1[] = [
  {
    id: "schreiben-b1-set-1",
    name: "Modellsatz 1",
    teil1: {
      title: "Aufgabe 1: Persönliche E-Mail",
      situation: "Sie haben vor einer Woche Ihren Geburtstag gefeiert. Ihr Freund / Ihre Freundin Christian konnte leider nicht kommen, weil er/sie krank war. Schreiben Sie eine E-Mail an Christian.",
      points: [
        "Beschreiben Sie die Feier.",
        "Erklären Sie, welches Geschenk Sie am besten fanden und warum.",
        "Schlagen Sie ein Treffen vor."
      ],
      sampleSolution: "Lieber Christian,\nich habe mich sehr gefreut, wieder von dir zu hören, und hoffe, dass es dir inzwischen besser geht. Schade, dass du bei meinem Geburtstag nicht dabei sein konntest. Die Feier war wirklich toll! Wir haben im Garten gegrillt und bis spät in die Nacht Musik gehört. Fast alle unsere Freunde waren da. Am besten hat mir das Geschenk von meinen Eltern gefallen: Sie haben mir ein neues Fahrrad geschenkt, das ich mir schon lange gewünscht habe. Wir müssen uns unbedingt bald treffen, damit ich dir alles erzählen kann. Hast du nächste Woche am Samstagnachmittag Zeit? Da könnten wir eine Radtour machen.\nViele Grüße\nDein Thomas"
    },
    teil2: {
      title: "Aufgabe 2: Forumsbeitrag",
      situation: "Sie haben im Fernsehen eine Diskussionssendung zum Thema 'Einkaufen im Internet oder im Geschäft vor Ort' gesehen. Im Online-Gästebuch der Sendung finden Sie folgenden Kommentar von Jonas:\n'Ich kaufe fast nur noch im Internet ein. Es geht schnell, ist super bequem und meistens auch viel günstiger als im Laden. Im Geschäft vor Ort findet man oft nicht das, was man sucht.'\nSchreiben Sie Ihre Meinung zu diesem Kommentar (ca. 80 Wörter).",
      points: [
        "Äußern Sie Ihre Meinung zur Position von Jonas.",
        "Begründen Sie, warum Sie für oder gegen das Einkaufen im Internet sind.",
        "Nennen Sie Vor- und Nachteile beider Einkaufsmöglichkeiten."
      ],
      sampleSolution: "Ich finde die Meinung von Jonas interessant, stimme ihr aber nur teilweise zu. Es stimmt natürlich, dass das Einkaufen im Internet sehr bequem ist und man eine riesige Auswahl hat. Man spart viel Zeit. Trotzdem kaufe ich auch sehr gerne in Geschäften vor Ort ein. Der größte Vorteil ist dort, dass man die Produkte direkt anfassen und ausprobieren kann. Außerdem bekommt man eine persönliche Beratung durch die Verkäufer. Wenn wir nur noch online kaufen, sterben unsere Innenstädte aus, und das finde ich sehr schade. Ein gesunder Mix aus beidem ist meiner Meinung nach am besten."
    },
    teil3: {
      title: "Aufgabe 3: Formelle E-Mail",
      situation: "Sie besuchen einen Deutschkurs. Am nächsten Freitag können Sie leider nicht am Unterricht teilnehmen, weil Sie einen wichtigen Termin beim Arzt haben. Schreiben Sie eine Entschuldigung an Ihre Lehrerin, Frau Dr. Müller (ca. 40 Wörter).",
      points: [
        "Schreiben Sie den Grund für Ihr Fehlen.",
        "Entschuldigen Sie sich höflich für die Abwesenheit.",
        "Fragen Sie nach den Hausaufgaben für den nächsten Kurstag."
      ],
      sampleSolution: "Sehr geehrte Frau Dr. Müller,\nleider kann ich am nächsten Freitag nicht am Deutschkurs teilnehmen, da ich einen wichtigen Arzttermin habe. Ich bitte Sie höflich, meine Abwesenheit zu entschuldigen. Könnten Sie mir bitte mitteilen, welche Hausaufgaben wir für das nächste Mal vorbereiten sollen?\nVielen Dank für Ihr Verständnis.\nMit freundlichen Grüßen\nThomas Schwab"
    }
  }
];

// ==========================================
// 4. SPRECHEN BANK (B1 SET 1)
// ==========================================
export const SPRECHEN_BANK_B1: SprechenSetB1[] = [
  {
    id: "sprechen-b1-set-1",
    name: "Modellsatz 1",
    teil1: {
      theme: "Planung einer Abschiedsfeier für eine Kollegin",
      situation: "Eine Kollegin aus Ihrem Deutschkurs, Sarah, verlässt den Kurs nächste Woche, weil sie in eine andere Stadt zieht. Sie möchten gemeinsam mit Ihrem Partner / Ihrer Partnerin eine kleine Abschiedsfeier organisieren.",
      guidelines: [
        "Wann und wo soll die Feier stattfinden?",
        "Was wollen Sie Sarah schenken (Geld sammeln, Gutschein)?",
        "Essen und Trinken (Wer bringt was mit)?",
        "Wie überraschen wir Sarah?"
      ],
      redemittel: [
        "Was hältst du davon, wenn wir...",
        "Ich schlage vor, dass wir am Freitag...",
        "Wir könnten auch...",
        "Das finde ich eine gute Idee, aber...",
        "Wer kümmert sich um...",
        "Ich kann das Essen organisieren, und du..."
      ]
    },
    teil2: {
      topics: [
        {
          title: "Thema A: Brauchen wir Noten in der Schule?",
          points: [
            "Erklären Sie das Thema und führen Sie ein.",
            "Berichten Sie von Ihrer persönlichen Erfahrung.",
            "Nennen Sie die Rolle von Schulnoten in Ihrem Heimatland.",
            "Diskutieren Sie Vor- und Nachteile von Schulnoten.",
            "Fassen Sie Ihre Meinung zusammen und schließen Sie."
          ],
          sampleIntro: "Mein heutiges Thema lautet 'Brauchen wir Noten in der Schule?'. Dieses Thema wird oft diskutiert, da es alle Schüler und Eltern betrifft.",
          samplePoints: [
            { label: "Persönliche Erfahrung", text: "Ich persönlich hatte in der Schule immer Angst vor schlechten Noten, besonders in Mathematik. Manchmal haben Noten mich motiviert, aber oft haben sie nur Druck erzeugt." },
            { label: "Situation im Heimatland", text: "In meinem Heimatland Indonesien spielen Noten eine sehr große Rolle. Sie entscheiden am Ende des Jahres darüber, ob man in die nächste Klasse aufsteigen darf." },
            { label: "Vor- und Nachteile", text: "Ein Vorteil von Noten ist, dass sie eine klare Rückmeldung über die Leistung geben. Ein großer Nachteil ist jedoch, dass sie zu starkem Konkurrenzkampf und Stress unter den Schülern führen." }
          ],
          sampleOutro: "Zusammenfassend denke ich, dass Noten zwar nützlich sind, aber man sollte auch andere Bewertungsformen nutzen. Vielen Dank für Ihre Aufmerksamkeit. Haben Sie noch Fragen?"
        },
        {
          title: "Thema B: Sollten Jugendliche ein Auslandsjahr machen?",
          points: [
            "Erklären Sie das Thema und führen Sie ein.",
            "Berichten Sie von Ihrer persönlichen Erfahrung.",
            "Nennen Sie die Rolle von Auslandsjahren in Ihrem Heimatland.",
            "Diskutieren Sie Vor- und Nachteile eines Auslandsjahres.",
            "Fassen Sie Ihre Meinung zusammen und schließen Sie."
          ],
          sampleIntro: "Ich möchte Ihnen heute das Thema 'Sollten Jugendliche ein Auslandsjahr machen?' präsentieren. In einer globalisierten Welt wird diese Frage für viele Jugendliche immer wichtiger.",
          samplePoints: [
            { label: "Persönliche Erfahrung", text: "Ich habe selbst noch kein komplettes Auslandsjahr gemacht, aber ich lerne jetzt intensiv Deutsch, um bald in Deutschland eine Ausbildung zu beginnen." },
            { label: "Situation im Heimatland", text: "In Indonesien machen bisher nur wenige Jugendliche ein Auslandsjahr, da es sehr teuer ist. Aber das Interesse an Austauschprogrammen wächst stetig." },
            { label: "Vor- und Nachteile", text: "Der größte Vorteil ist, dass man eine neue Sprache lernt, selbstständig wird und neue Kulturen kennenlernt. Ein Nachteil sind die hohen Kosten und das Heimweh." }
          ],
          sampleOutro: "Meiner Meinung nach ist ein Auslandsjahr eine unbezahlbare Erfahrung für das ganze Leben. Ich bedanke mich herzlich für Ihr Interesse. Ich bin bereit für Ihre Fragen."
        }
      ],
      redemittel: [
        "Ich möchte Ihnen heute das Thema ... vorstellen.",
        "Meine Präsentation besteht aus folgenden Teilen: ...",
        "Ich persönlich habe die Erfahrung gemacht, dass...",
        "In meinem Heimatland ist die Situation so, dass...",
        "Ein Argument für ... ist, dass...",
        "Andererseits darf man nicht vergessen, dass...",
        "Ich komme nun zum Schluss. Zusammenfassend lässt sich sagen, dass...",
        "Ich bedanke mich für Ihre Aufmerksamkeit. Haben Sie Fragen?"
      ]
    },
    teil3: {
      guidelines: [
        "Geben Sie Ihrem Partner / Ihrer Partnerin Feedback zu seiner/ihrer Präsentation (z. B. loben, was gut war).",
        "Stellen Sie Ihrem Partner / Ihrer Partnerin eine Frage zu seiner/ihrer Präsentation.",
        "Reagieren Sie auf das Feedback und beantworten Sie die Frage Ihres Partners / Ihrer Partnerin."
      ],
      redemittel: [
        "Deine Präsentation war wirklich sehr interessant.",
        "Besonders gut hat mir gefallen, dass du...",
        "Ich habe eine Frage zu deiner Präsentation: ...",
        "Könntest du mir bitte erklären, wie...",
        "Vielen Dank für das nette Feedback.",
        "Das ist eine gute Frage. Ich denke, dass..."
      ]
    }
  }
];
