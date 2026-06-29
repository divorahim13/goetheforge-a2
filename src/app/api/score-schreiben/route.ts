import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { teil, text, situation, points, level = "A2" } = await req.json();

    if (!text || text.length < 5) {
      return NextResponse.json({ error: "Text too short" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return robust Mock Response when ANTHROPIC_API_KEY is not configured
      const mockResult = generateMockEvaluation(level, teil, text, situation, points);
      return NextResponse.json(mockResult);
    }

    // Call Anthropic Claude API
    const systemPrompt = level === "B1" 
      ? `Anda adalah penguji bahasa Jerman resmi dari Goethe-Institut untuk ujian Goethe-Zertifikat B1. Tugas Anda adalah menilai tulisan kandidat dengan kriteria penilaian resmi B1.
Ujian menulis B1 terdiri dari 3 Teil:
Teil 1: E-Mail pribadi (sekitar 80 kata). Kriteria penilaian: Aufgabenerfüllung (menjawab 3 poin) dan Sprachliche Angemessenheit.
Teil 2: Komentar/opini forum (sekitar 80 kata). Kriteria penilaian: Aufgabenerfüllung (menyatakan pendapat, alasan, pro/kontra) dan Sprachliche Angemessenheit.
Teil 3: E-Mail formel pendek (sekitar 40 kata). Kriteria penilaian: Aufgabenerfüllung (alasan, maaf, minta waktu) dan Sprachliche Angemessenheit.

Format keluaran Anda HARUS berupa JSON murni dengan struktur berikut:
{
  "aufgabe": "A | B | C | D | E",
  "sprache": "A | B | C | D | E",
  "feedback": "Kritik terperinci dalam Bahasa Indonesia tentang tata bahasa, kosakata, ejaan, dan cara menjawab poin wajib B1.",
  "beispiel": "Contoh tulisan versi model yang sempurna dan alami untuk tingkat B1 dalam bahasa Jerman."
}
PENTING: Jangan sertakan teks lain sebelum atau sesudah JSON.`
      : `Anda adalah penguji bahasa Jerman resmi dari Goethe-Institut untuk ujian Goethe-Zertifikat A2. Tugas Anda adalah menilai tulisan kandidat dengan kriteria penilaian resmi A2.
Ujian menulis A2 dinilai berdasarkan dua kriteria:
1. Aufgabenerfüllung (Pemenuhan Tugas): Apakah kandidat menjawab 3 poin wajib yang diminta? (Skor A, B, C, D, atau E)
2. Sprache (Bahasa): Apakah tata bahasa, ejaan, struktur kalimat, dan kosakata sesuai untuk tingkat A2? (Skor A, B, C, D, atau E)

Format keluaran Anda HARUS berupa JSON murni dengan struktur berikut:
{
  "aufgabe": "A | B | C | D | E",
  "sprache": "A | B | C | D | E",
  "feedback": "Kritik terperinci dalam Bahasa Indonesia tentang tata bahasa, kosakata, ejaan, dan cara menjawab poin wajib.",
  "beispiel": "Contoh tulisan versi model yang sempurna dan alami untuk tingkat A2 dalam bahasa Jerman."
}
PENTING: Jangan sertakan teks lain sebelum atau sesudah JSON.`;

    const userPrompt = `Nilailah tulisan berikut:
Tingkat Ujian (Level): ${level}
Bagian Ujian (Teil): ${teil}
Skenario Soal: ${situation}
Poin Wajib: ${points.join(" | ")}
Tulisan Kandidat: "${text}"`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      console.warn("Anthropic API error, falling back to mock");
      return NextResponse.json(generateMockEvaluation(level, teil, text, situation, points));
    }

    const resData = await response.json();
    const contentText = resData.content[0]?.text || "";
    
    // Parse JSON safely
    try {
      const jsonStart = contentText.indexOf("{");
      const jsonEnd = contentText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanedJson = contentText.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleanedJson);
        return NextResponse.json(parsed);
      }
      throw new Error("No JSON block found");
    } catch (e) {
      console.error("Failed to parse Claude JSON response: ", contentText);
      return NextResponse.json(generateMockEvaluation(level, teil, text, situation, points));
    }

  } catch (error) {
    console.error("Schreiben scoring endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Robust Mock Evaluator when API Key is missing or Anthropic is offline
function generateMockEvaluation(level: string, teil: number, text: string, situation: string, points: string[]) {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Basic heuristic scoring
  let aufgabeGrade = "B";
  let spracheGrade = "B";
  let feedback = "";
  let beispiel = "";

  const textLower = text.toLowerCase();

  if (level === "B1") {
    if (teil === 1) {
      // B1 Teil 1: Personal email (~80 words)
      const hasFeier = textLower.includes("feier") || textLower.includes("geburtstag") || textLower.includes("party");
      const hasGift = textLower.includes("geschenk") || textLower.includes("fahrrad") || textLower.includes("bekommen");
      const hasProposal = textLower.includes("treffen") || textLower.includes("zeit") || textLower.includes("nächste woche");

      let missed = [];
      if (!hasFeier) missed.push("Menceritakan jalannya pesta");
      if (!hasGift) missed.push("Menjelaskan kado terbaik");
      if (!hasProposal) missed.push("Mengajak bertemu");

      if (wordCount < 60) {
        aufgabeGrade = "C";
        spracheGrade = "C";
        feedback += `• Jumlah kata (${wordCount}) terlalu sedikit. Target untuk B1 Teil 1 adalah sekitar 80 kata.\n`;
      } else if (wordCount > 110) {
        feedback += `• Jumlah kata (${wordCount}) agak banyak. Usahakan menulis dengan ringkas (~80 kata).\n`;
      }

      if (missed.length > 0) {
        aufgabeGrade = missed.length === 1 ? "C" : "D";
        feedback += `• Poin wajib berikut belum teridentifikasi: ${missed.join(", ")}.\n`;
      } else {
        feedback += "• Luar biasa! Seluruh poin wajib B1 Teil 1 telah terjawab dengan memuaskan.\n";
      }

      feedback += "\n[Evaluasi Simulasi B1]: Struktur paragraf dan pembuka/penutup email pribadi sudah tepat.";
      beispiel = "Lieber Christian,\nich habe mich sehr gefreut, wieder von dir zu hören, und hoffe, dass es dir besser geht. Die Feier letzte Woche war toll! Wir haben im Garten gegrillt und getanzt. Am besten fand ich das Geschenk von meinen Eltern: ein neues Fahrrad! Wir müssen uns unbedingt bald treffen, um alles zu besprechen. Hast du nächste Woche Zeit?\nViele Grüße\nDein Thomas";
    } else if (teil === 2) {
      // B1 Teil 2: Forum post (~80 words)
      const hasOpinion = textLower.includes("meinung") || textLower.includes("denke") || textLower.includes("glaube");
      const hasInternet = textLower.includes("internet") || textLower.includes("online") || textLower.includes("kaufen");

      if (wordCount < 60) {
        aufgabeGrade = "C";
        spracheGrade = "C";
        feedback += `• Jumlah kata (${wordCount}) di bawah batas minimum B1 (~80 kata).\n`;
      }

      if (!hasOpinion) {
        aufgabeGrade = "C";
        feedback += "• Pastikan Anda mengemukakan opini/pendapat pribadi Anda dengan jelas terhadap pernyataan Jonas.\n";
      }

      feedback += "\n[Evaluasi Simulasi B1]: Argumen yang diajukan sudah logis dan terstruktur dengan baik.";
      beispiel = "Ich finde die Meinung von Jonas interessant, stimme ihr aber nur teilweise zu. Es stimmt natürlich, dass das Einkaufen im Internet bequem ist. Trotzdem kaufe ich auch sehr gerne in Geschäften vor Ort ein, da man dort eine persönliche Beratung bekommt und die Produkte direkt testen kann.";
    } else {
      // B1 Teil 3: Formal email (~40 words)
      const hasFormalGreeting = textLower.includes("sehr geehrte");
      const hasReason = textLower.includes("arzt") || textLower.includes("termin") || textLower.includes("krank");
      const hasExcuse = textLower.includes("entschuldigen") || textLower.includes("bitten um verständnis");

      if (wordCount < 30) {
        aufgabeGrade = "C";
        feedback += `• Tulisan Anda (${wordCount} kata) agak terlalu singkat untuk B1 Teil 3 (~40 kata).\n`;
      }

      if (!hasFormalGreeting) {
        spracheGrade = "C";
        feedback += "• Gunakan format surat menyurat resmi (Sehr geehrte Damen und Herren / Sehr geehrte Frau Dr. Müller).\n";
      }

      if (!hasExcuse) {
        aufgabeGrade = "C";
        feedback += "• Pastikan Anda menulis permohonan maaf/izin tidak hadir secara eksplisit.\n";
      }

      feedback += "\n[Evaluasi Simulasi B1]: E-Mail formal pendek ini ditulis dengan tingkat kesopanan yang baik.";
      beispiel = "Sehr geehrte Frau Dr. Müller,\nleider kann ich am nächsten Freitag nicht am Deutschkurs teilnehmen, da ich einen wichtigen Arzttermin habe. Ich bitte Sie höflich, meine Abwesenheit zu entschuldigen. Könnten Sie mir bitte die Hausaufgaben zusenden?\nMit freundlichen Grüßen\nThomas Schwab";
    }
  } else {
    // A2 Logic
    if (teil === 1) {
      // SMS Scenario (20-30 words)
      const hasThanks = textLower.includes("danke") || textLower.includes("vielen dank") || textLower.includes("freue");
      const hasReason = textLower.includes("weil") || textLower.includes("muss") || textLower.includes("kann nicht") || textLower.includes("krank");
      const hasProposal = textLower.includes("wie wäre") || textLower.includes("treffen") || textLower.includes("nächste") || textLower.includes("zeit");

      let missedPoints = [];
      if (!hasThanks) missedPoints.push("Mengucapkan terima kasih");
      if (!hasReason) missedPoints.push("Menjelaskan alasan berhalangan");
      if (!hasProposal) missedPoints.push("Mengusulkan waktu alternatif");

      if (wordCount < 20) {
        aufgabeGrade = "C";
        spracheGrade = "C";
        feedback += `• Jumlah kata (${wordCount}) terlalu sedikit. Aturan A2 meminta 20-30 kata.\n`;
      } else if (wordCount > 30) {
        aufgabeGrade = "C";
        feedback += `• Jumlah kata (${wordCount}) terlalu banyak. Usahakan ringkas dalam 20-30 kata.\n`;
      }

      if (missedPoints.length > 0) {
        aufgabeGrade = missedPoints.length === 1 ? "C" : "D";
        feedback += `• Poin berikut tampaknya belum terjawab dengan jelas: ${missedPoints.join(", ")}.\n`;
      } else {
        feedback += "• Bagus! Anda menjawab semua poin wajib dengan kalimat yang sesuai.\n";
      }

      // Grammar checks
      const hasDativeAccusativeErrors = textLower.includes("ich helfe mein mutter") || textLower.includes("hilft mein mutter");
      if (hasDativeAccusativeErrors) {
        spracheGrade = "C";
        feedback += "• Kesalahan tata bahasa: Kata kerja 'helfen' diikuti kasus Dativ. Seharusnya 'meiner Mutter helfen' (bukan 'mein Mutter').\n";
      }

      feedback += "\nSecara keseluruhan, tulisan Anda sudah cukup komunikatif dan dapat dipahami oleh pembaca Jerman.";
      beispiel = "Lieber Christian, vielen Dank für die Einladung! Ich kann am Samstag leider nicht kommen, weil ich meiner Mutter beim Umzug helfen muss. Wie wäre es, wenn wir uns am Sonntag um 15 Uhr treffen? Viele Grüße, [Nama]";
    } else {
      // Email Scenario (30-40 words)
      const hasFormalSalutation = textLower.includes("sehr geehrte") || textLower.includes("sehr geehrter");
      const hasFormalClosing = textLower.includes("mit freundlichen grüßen") || textLower.includes("freundliche grüße");
      const hasQuestion1 = textLower.includes("wann") || textLower.includes("beginnt") || textLower.includes("kurs");
      const hasQuestion2 = textLower.includes("einstufungstest") || textLower.includes("test");

      if (wordCount < 30) {
        aufgabeGrade = "C";
        spracheGrade = "C";
        feedback += `• Jumlah kata (${wordCount}) terlalu sedikit. Batas minimum email formal A2 adalah 30-40 kata.\n`;
      } else if (wordCount > 40) {
        aufgabeGrade = "C";
        feedback += `• Jumlah kata (${wordCount}) melampaui batas maksimum (30-40 kata). Persingkat kalimat Anda.\n`;
      }

      if (!hasFormalSalutation) {
        spracheGrade = "C";
        feedback += "• Untuk email formal kepada sekretariat/orang asing, gunakan salam pembuka formal seperti 'Sehr geehrte Damen und Herren,' atau 'Sehr geehrter Herr [Nama]'.\n";
      }

      if (!hasFormalClosing) {
        spracheGrade = "C";
        feedback += "• Gunakan penutup formal seperti 'Mit freundlichen Grüßen' di akhir email Anda.\n";
      }

      if (!hasQuestion1 || !hasQuestion2) {
        aufgabeGrade = "C";
        feedback += "• Pastikan Anda menanyakan detail biaya/mulai kursus serta tes penempatan (Einstufungstest) dengan jelas.\n";
      }

      feedback += "\n[Koreksi Simulasi]: Kalimat Anda dapat dipahami dengan baik. Berlatihlah menggunakan preposisi yang tepat.";
      beispiel = "Sehr geehrte Damen und Herren,\nich möchte mich für den B1-Deutschkurs anmelden. Wann beginnt der Kurs und wie viel kostet er? Gibt es auch einen Einstufungstest für mich?\nMit freundlichen Grüßen,\n[Nama]";
    }
  }

  return {
    aufgabe: aufgabeGrade,
    sprache: spracheGrade,
    feedback,
    beispiel
  };
}
