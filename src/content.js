// A szöveg szó szerint a landing.txt fájlból származik – ne fogalmazd át.

export const hero = {
  icon: "⚡",
  title: "Varázslóútmutató a Bátorságpróbához",
  subtitle:
    "Olvasd el figyelmesen, mielőtt elindulsz a Rákóczi kert titkos ösvényein!",
};

export const sections = [
  {
    icon: "📱",
    title: "Mielőtt elkezded (Készülék és Böngésző)",
    items: [
      {
        label: "Okostelefon és Internet:",
        text: "A játékhoz egy mobilinternet-kapcsolattal rendelkező okostelefonra lesz szükséged.",
      },
      {
        label: "Használj gyári kamerát vagy klasszikus böngészőt:",
        children: [
          {
            text: "A helyszíni QR-kódokat a telefonod saját kamerájával beolvasva nyisd meg!",
          },
          {
            text: "Ha külön letöltött QR-kód olvasó appot használsz, a játék nem fog rendesen működni.",
          },
          {
            label: "Ha mégis elakadnál:",
            text: "A rendszer azonnal figyelmeztet, és megjelenít egy gombot, amivel másolhatod a hivatkozást. Ezt csak be kell illesztened a kedvenc böngésződbe (pl. Chrome, Safari), és már folytathatod is a kalandot!",
          },
        ],
      },
      {
        label: "Engedélyezd a kamerát:",
        text: "Amikor a böngésző megkérdezi, nyomj az „Engedélyezés” gombra, hogy be tudd olvasni a kódokat!",
      },
    ],
  },
  {
    icon: "🗺️",
    title: "A játék menete – Így haladj az ösvényen!",
    items: [
      {
        label: "Kövesd a térképet:",
        text: "A képernyőn látható térkép mindig megmutatja, hol találod a következő QR-kódot.",
      },
      {
        label: "Szigorú sorrend:",
        text: "Csak a térképen éppen megjelölt QR-kódot tudod beolvasni! Ha kihagysz egy állomást vagy rossz kódot olvasol be, a rendszer nem enged tovább.",
      },
      {
        label: "Feladatok és varázslatok:",
        text: "A jó QR-kód beolvasása után megjelenik a feladvány. Ha sikeresen megoldod, a térképen automatikusan felbukkan a következő állomás helyszíne.",
      },
    ],
  },
  {
    icon: "💡",
    title: "Az okos alkalmazás mindig segít!",
    items: [
      {
        label: "Sosem tévedsz el:",
        text: "Ha rossz QR-kódot olvasol be, vagy hibás választ adsz egy feladatra, a képernyőn azonnal megjelenik egy üzenet, ami pontosan elmagyarázza, mi a teendő.",
      },
      {
        label: "Ügyelj az akkumulátorra:",
        text: "Győződj meg róla, hogy a telefonod megfelelően fel van töltve a próbatétel előtt!",
      },
    ],
  },
];

export const closing =
  "Felkészültél? Fogd a varázspálcádat (és a telefonodat), majd indulhat a bátorságpróba!";

export const consentLabel = "Elolvastam és megértettem";
export const enterLabel = "Belépés";
