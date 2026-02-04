
export interface ImageState {
  original: string | null;
  edited: string | null;
  loading: boolean;
  error: string | null;
}

export interface EditRequest {
  image: string; // base64
  prompt: string;
  mimeType: string;
}

export interface Singer {
  id: number;
  name: string;
  song: string;
  coverSong?: string;
  photo?: string; // Base64 encoded photo
}

// Key is evening number, then user username, then mapping singer ID to ratings/tokens
export type GlobalVotes = Record<number, Record<string, Record<number, number[]>>>;

// Tracks which users have cast votes for which evenings
export type VotersProgress = Record<string, Record<number, boolean>>;

export const SINGERS: Singer[] = [
  { id: 1, name: "Arisa", song: "Magica favola", coverSong: "Quello che le donne non dicono (feat. Coro del Teatro Regio di Parma)" },
  { id: 2, name: "Bambole di Pezza", song: "Resta con me", coverSong: "Occhi di gatto (feat. Cristina D’Avena)" },
  { id: 3, name: "Chiello", song: "Ti penso sempre", coverSong: "Mi sono innamorato di te (feat. Morgan)" },
  { id: 4, name: "Dargen D’Amico", song: "AI AI", coverSong: "Su di noi (feat. Pupo & Fabrizio Bosso)" },
  { id: 5, name: "Ditonellapiaga", song: "Che fastidio!", coverSong: "The Lady Is a Tramp (feat. TonyPitony)" },
  { id: 6, name: "Eddie Brock", song: "Avvoltoi", coverSong: "Portami via (feat. Fabrizio Moro)" },
  { id: 7, name: "Elettra Lamborghini", song: "Voilà", coverSong: "Aserejé (feat. Las Ketchup)" },
  { id: 8, name: "Enrico Nigiotti", song: "Ogni volta che non so volare", coverSong: "En e Xanax (feat. Alfa)" },
  { id: 9, name: "Ermal Meta", song: "Stella stellina", coverSong: "Golden Hour (feat. Dardust)" },
  { id: 10, name: "Fedez & M. Masini", song: "Male necessario", coverSong: "Meravigliosa creature (feat. Stjepan Hauser)" },
  { id: 11, name: "Francesco Renga", song: "Il meglio di me", coverSong: "Ragazzo solo, ragazza sola (feat. Giusy Ferreri)" },
  { id: 12, name: "Fulminacci", song: "Stupida sfortuna", coverSong: "Parole parole (feat. Francesca Fagnani)" },
  { id: 13, name: "J-Ax", song: "Italia Starter Pack", coverSong: "E la vita, la vita (feat. Ligera County Fam.)" },
  { id: 14, name: "LDA & Aka 7even", song: "Poesie clandestine", coverSong: "Andamento lento (feat. Tullio De Piscopo)" },
  { id: 15, name: "Leo Gassmann", song: "Naturale" , coverSong: "Era già tutto previsto (feat. Aiello)" },
  { id: 16, name: "Levante", song: "Sei tu", coverSong: "I maschi (feat. Gaia)" },
  { id: 17, name: "Luchè", song: "Labirinto", coverSong: "Falco a metà (feat. Gianluca Grignani)" },
  { id: 18, name: "Malika Ayane", song: "Animali notturni", coverSong: "Mi sei scoppiato di dentro al cuore (feat. Claudio Santamaria)" },
  { id: 19, name: "Mara Sattei", song: "Le cose che non sai di me", coverSong: "L’ultimo bacio (feat. Mecna)" },
  { id: 20, name: "M. Ant. & Colombre", song: "La felicità e basta", coverSong: "Il mondo (feat. Brunori Sas)" },
  { id: 21, name: "Michele Bravi", song: "Prima o poi", coverSong: "Domani è un altro giorno (feat. Fiorella Mannoia)" },
  { id: 22, name: "Nayt", song: "Prima che", coverSong: "La canzone dell’amore perduto (feat. Joan Thiele)" },
  { id: 23, name: "Patty Pravo", song: "Opera", coverSong: "Ti lascio una canzone (feat. Timofej Andrijashenko)" },
  { id: 24, name: "Raf", song: "Ora e per sempre", coverSong: "The Riddle (feat. The Kolors)" },
  { id: 25, name: "Sal Da Vinci", song: "Per sempre sì", coverSong: "Cinque giorni (feat. Michele Zarrillo)" },
  { id: 26, name: "Samurai Jay", song: "Ossessione", coverSong: "Baila morena (feat. Belén Rodríguez & Roy Paci)" },
  { id: 27, name: "Sayf", song: "Tu mi piaci tanto", coverSong: "Hit the road Jack (feat. Alex Britti & Mario Biondi)" },
  { id: 28, name: "Serena Brancale", song: "Qui con me", coverSong: "Besame mucho (feat. Gregory Porter & Delia)" },
  { id: 29, name: "Tommaso Paradiso", song: "I romantici", coverSong: "L’ultima luna (feat. Stadio)" },
  { id: 30, name: "Tredici Pietro", song: "Uomo che cade", coverSong: "Vita (feat. Galeffi, Fudasca & Band)" },
];

export const AUTHORIZED_OPERATORS: Record<string, string> = {
  "fcascone": "0303",
  "tberetta": "0707",
  "slevato": "6666",
  "dponticella": "7777",
  "lcolonnata": "7878",
  "cmattioni": "6325",
  "etaravacci": "1111",
  "ggalofaro": "4568",
  "lcattaneo": "5854",
  "cbarattelli": "2801",
  "cbonandi": "9999",
  "mriva": "5548",
  "cdicembre": "2911",
  "adurnwalder": "2424",
  "cmascolo": "3569",
  "isalvati": "7845",
  "lbusetti": "1591",
  "lgiannini": "7537",
  "vucchino": "4564",
  "lorenzov": "1671",
  "sceppodomo": "3493",
  "admin": "4545"
};

export const OPERATOR_DISPLAY_NAMES: Record<string, string> = {
  "fcascone": "Fra",
  "tberetta": "Tommi",
  "slevato": "LaPapessa",
  "dponticella": "Ponti",
  "lcolonnata": "Laura",
  "cmattioni": "Cristian",
  "etaravacci": "Elena",
  "ggalofaro": "Giovanni",
  "lcattaneo": "Lollo",
  "cbarattelli": "Chiara",
  "cbonandi": "Claudio",
  "mriva": "Marta",
  "cdicembre": "Cristiana",
  "adurnwalder": "Aaron",
  "cmascolo": "Carolina",
  "isalvati": "Ivan",
  "lbusetti": "Luca",
  "lgiannini": "Susy",
  "vucchino": "Virginia",
  "lorenzov": "Lorenzo",
  "sceppodomo": "Sceppodomo",
  "admin": "Administrator"
};
