import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, scenarioId, history, scheduleB } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Use local rule-based partner when ANTHROPIC_API_KEY is missing
      const result = generateMockDialogPartner(message, scenarioId, history, scheduleB);
      return NextResponse.json(result);
    }

    // Prepare system prompt for Claude
    const systemPrompt = `Anda adalah "Kandidat B", rekan bicara dalam modul Sprechen Teil 3 ujian Goethe-Zertifikat A2.
Topik dan situasi: Membuat janji pertemuan.
Jadwal Anda (Kandidat B):
${JSON.stringify(scheduleB, null, 2)}

Petunjuk Peran:
1. Anda HARUS membalas dalam bahasa Jerman dengan karakter pembelajar bahasa Jerman level A2/B1 (ramah, menggunakan kalimat sederhana tapi benar).
2. Periksa jadwal Anda. Jika Kandidat A menawarkan waktu di mana Anda sibuk (Busy/ada kegiatan), Anda HARUS menolak dengan sopan menyebutkan alasannya, lalu menawarkan waktu lain di mana Anda bebas (FREE).
3. Overlap waktu kosong bersama adalah SATU-SATUNYA waktu di mana kedua kandidat sama-sama kosong (FREE). Ketika Kandidat A mengusulkan slot waktu itu, Anda harus menyetujuinya ("Ja, das passt mir gut!", "Einverstanden!", dll.).
4. Setelah janji temu disepakati secara eksplisit (kedua pihak setuju waktu yang sama), tandai status "agreed" = true.
5. Evaluasilah masukan Jerman dari Kandidat A. Tunjukkan kesalahan gramatikalnya (jika ada) dan berikan saran perbaikan singkat.

Kembalikan keluaran dalam format JSON murni:
{
  "response": "Balasan Anda sebagai Kandidat B dalam bahasa Jerman.",
  "corrections": ["Daftar koreksi gramatikal kalimat Kandidat A jika ada kesalahan. Kosongkan jika sudah benar."],
  "agreed": true_jika_sudah_sepakat_waktu_yang_sama_dan_percakapan_selesai_jika_belum_maka_false,
  "score_update": 1_sampai_25_berdasarkan_kemampuan_Jerman_Kandidat_A,
  "feedback": "Ulasan singkat kinerja Kandidat A dalam Bahasa Indonesia."
}
Jangan sertakan teks lain di luar blok JSON.`;

    const userPrompt = `Percakapan Sejauh Ini:
${JSON.stringify(history)}
Pesan Baru dari Kandidat A: "${message}"`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      console.warn("Claude API error in Sprechen, using mock partner");
      return NextResponse.json(generateMockDialogPartner(message, scenarioId, history, scheduleB));
    }

    const resData = await response.json();
    const contentText = resData.content[0]?.text || "";

    try {
      const jsonStart = contentText.indexOf("{");
      const jsonEnd = contentText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanedJson = contentText.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleanedJson);
        return NextResponse.json(parsed);
      }
      throw new Error("No JSON found");
    } catch (e) {
      console.error("Failed to parse JSON response from Claude: ", contentText);
      return NextResponse.json(generateMockDialogPartner(message, scenarioId, history, scheduleB));
    }

  } catch (error) {
    console.error("Sprechen dialog endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Rule-based Mock Sprechen Partner for Offline / Zero-Key mode
function generateMockDialogPartner(message: string, scenarioId: string, history: any[], scheduleB: { [time: string]: string }) {
  const msgLower = message.toLowerCase();
  
  let response = "";
  let corrections: string[] = [];
  let agreed = false;
  let score_update = 18;
  let feedback = "Bagus! Anda mengajukan janji temu dengan struktur kalimat yang baik.";

  // Simple grammar checks
  if (msgLower.includes("hast du am") && !msgLower.includes("zeit")) {
    corrections.push("Kalimat tanya 'Hast du am [Hari]...' kurang kata benda 'Zeit'. Seharusnya: 'Hast du am [Hari] Zeit?'");
    score_update -= 2;
  }
  if (msgLower.includes("ich kann am") && msgLower.includes("kommen") && !msgLower.includes("nicht") && msgLower.includes("leider")) {
    // maybe minor typo
  }

  // Find overlap slots
  // Scenario 1: Saturday. Overlap = "11:00 - 13:00"
  // Scenario 2: Friday. Overlap = "16:00 - 18:00"
  // Scenario 3: Sunday. Overlap = "14:00 - 16:00"
  let targetSlot = "";
  let busySlots: { [key: string]: string } = {};

  if (scenarioId === "sp3-s1") {
    targetSlot = "11:00 - 13:00";
    busySlots = {
      "13:00 - 15:00": "Einkaufen im Supermarkt",
      "15:00 - 17:00": "Fußball spielen"
    };
  } else if (scenarioId === "sp3-s2") {
    targetSlot = "16:00 - 18:00";
    busySlots = {
      "14:00 - 16:00": "Sport machen",
      "18:00 - 20:00": "Arbeiten im Café"
    };
  } else {
    targetSlot = "14:00 - 16:00";
    busySlots = {
      "08:00 - 10:00": "Lange schlafen",
      "12:00 - 14:00": "Hausputz"
    };
  }

  // Check which slot the user is proposing
  const proposedSlot = Object.keys(scheduleB).find(slot => {
    const parts = slot.split("-");
    const hrStart = parts[0].trim().split(":")[0]; // e.g. "11" or "09"
    return msgLower.includes(hrStart) || msgLower.includes(slot.replace(" ", ""));
  });

  if (proposedSlot) {
    if (proposedSlot === targetSlot) {
      // User proposed the correct overlap slot!
      response = "Ja, das passt mir sehr gut! Da habe ich Zeit. Wir können uns gerne treffen. Bis Samstag/Sonntag!";
      agreed = true;
      score_update = 24;
      feedback = "Luar biasa! Anda berhasil menegosiasikan jadwal dan menyepakati slot kosong yang sama pada pukul " + targetSlot + ".";
    } else if (busySlots[proposedSlot]) {
      // User proposed a slot where B is busy
      const activity = busySlots[proposedSlot];
      response = `Nein, da kann ich leider nicht, weil ich da ${activity} muss. Wie wäre es stattdessen um ${targetSlot} Uhr?`;
      feedback = "Anda menawarkan slot waktu, tetapi partner sedang sibuk. Partner Anda menawarkan waktu alternatif.";
    } else {
      // Free slot for B, but wait, is it busy for A?
      // In scenario 1: "09:00 - 11:00" -> B is free, but A has Zahnarzt.
      // If user proposed this, they made a mistake because they are busy!
      response = `An sich habe ich da Zeit, aber hast du nicht geschrieben, dass du da beschäftigt bist? Ich dachte, du musst da etwas anderes tun. Lass uns lieber um ${targetSlot} Uhr treffen.`;
      corrections.push("Hati-hati! Anda menawarkan slot waktu di mana jadwal Anda sendiri sedang sibuk (Zahnarzt/Kirche/dll.). Selalu periksa jadwal Anda sebelum menawarkan.");
      score_update -= 3;
      feedback = "Anda mengajukan slot waktu, tetapi slot tersebut bertabrakan dengan jadwal sibuk Anda sendiri. Pahami batasan Anda.";
    }
  } else {
    // General chat
    if (msgLower.includes("hallo") || msgLower.includes("hi") || msgLower.includes("guten tag")) {
      response = "Hallo! Lass uns einen Termin für das Treffen vereinbaren. Wann hast du am Samstag/Sonntag Zeit?";
    } else if (msgLower.includes("ja") || msgLower.includes("einverstanden") || msgLower.includes("passt")) {
      response = `Super! Dann vereinbaren wir ${targetSlot} Uhr. Ich freue mich!`;
      agreed = true;
      score_update = 22;
    } else {
      response = `Ich bin am Nachmittag frei, zum Beispiel um ${targetSlot} Uhr. Passt dir das?`;
    }
  }

  return {
    response,
    corrections,
    agreed,
    score_update,
    feedback
  };
}
