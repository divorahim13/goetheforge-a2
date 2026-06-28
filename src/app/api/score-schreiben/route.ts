import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { teil, text, situation, points } = await req.json();

    if (!text || text.length < 5) {
      return NextResponse.json({ error: "Text too short" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return robust Mock Response when ANTHROPIC_API_KEY is not configured
      const mockResult = generateMockEvaluation(teil, text, situation, points);
      return NextResponse.json(mockResult);
    }

    // Call Anthropic Claude API
    const systemPrompt = `Anda adalah penguji bahasa Jerman resmi dari Goethe-Institut untuk ujian Goethe-Zertifikat A2. Tugas Anda adalah menilai tulisan kandidat dengan kriteria penilaian resmi A2.
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
      return NextResponse.json(generateMockEvaluation(teil, text, situation, points));
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
      return NextResponse.json(generateMockEvaluation(teil, text, situation, points));
    }

  } catch (error) {
    console.error("Schreiben scoring endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Robust Mock Evaluator when API Key is missing or Anthropic is offline
function generateMockEvaluation(teil: number, text: string, situation: string, points: string[]) {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Basic heuristic scoring
  let aufgabeGrade = "B";
  let spracheGrade = "B";
  let feedback = "";
  let beispiel = "";

  const textLower = text.toLowerCase();

  if (teil === 1) {
    // SMS Scenario (20-30 words)
    // Heuristic checks
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
    beispiel = "Lieber Christian, vielen Dank für die Einladung! Ich kann am Samstag leider tidak kommen, weil ich meiner Mutter beim Umzug helfen muss. Wie wäre es, wenn wir uns am Sonntag um 15 Uhr treffen? Viele Grüße, [Nama]";
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

  return {
    aufgabe: aufgabeGrade,
    sprache: spracheGrade,
    feedback,
    beispiel
  };
}
