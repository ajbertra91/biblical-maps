// Site coordinates come from Wikidata (P625) unless a note says otherwise.
// Many biblical sites are debated. `confidence` records that. Scripture
// references are for each stop; verify against your translation before use.

export type FamilyId = 'nations' | 'pentecost' | 'abraham' | 'ministry' | 'movement' | 'military' | 'kings' | 'paul'
export type Confidence = 'identified' | 'traditional' | 'debated'
/** Who an army belongs to. The map gives each force its own color. */
export type Force = 'saul' | 'david' | 'foreign' | 'revolt' | 'abraham' | 'lot' | 'hagar' | 'angels'

export const FORCES: Record<Force, string> = {
  abraham: 'Abraham and his household',
  lot: 'Lot',
  hagar: 'Hagar and Ishmael',
  angels: 'The two angels',
  saul: 'House of Saul',
  david: 'House of David',
  foreign: 'Foreign army',
  revolt: 'Revolt against David',
}

/** One army movement. Every place on the path is a named place in Scripture. */
export interface Move {
  force: Force
  /** The commander or group that moves, as the text names it. */
  label: string
  path: string[]
  ref: string
}

export interface Place {
  id: string
  name: string
  lat: number
  lon: number
  confidence: Confidence
  /** True when the coordinates are a schematic point, not a known site. */
  schematic?: boolean
  note?: string
  /** Wikidata item the coordinates came from. */
  source?: string
  /** Puts the label on the left of the pin, away from a close neighbor. */
  labelLeft?: boolean
}

export interface Stop {
  place: string
  ref: string
  event: string
  /** Visible span in map units along the short screen side. */
  span?: number
  /** Army movements that show while this stop is current. */
  moves?: Move[]
  /** True when the person the route follows was not at this place. The route line skips it. */
  offRoute?: true
  /** The journey the stop belongs to, when a map has several. */
  journey?: string
  note?: string
}

export interface Family {
  id: FamilyId
  name: string
  sub: string
  stops: Stop[]
  /** Words for the stops when they are not battles. */
  terms?: { one: string; many: string; hint: string }
  /** False when the stops are separate events, not one journey. No line joins them. */
  route?: false
  /** Unlabeled bend points as [lat, lon], keyed by the leg index they bend. */
  bends?: Record<number, [number, number][]>
  /** Places the route passes through between stops, keyed by the leg index like `bends`. They are not stops. Each cites its own passage. */
  via?: Record<number, { place: string; ref: string }[]>
  zones?: { id: string; name: string; ref: string; places: string[]; radius: number }[]
  /** Peoples of great size that Deuteronomy names, with the land each held. */
  giants?: { id: string; name: string; ref: string; places: string[]; radius: number; note?: string }[]
}

export const PLACES: Record<string, Place> = {
  rameses: { id: 'rameses', name: 'Rameses', lat: 30.7994, lon: 31.8342, confidence: 'traditional', note: 'Often identified with Pi-Ramesses (Qantir).', source: 'Q937930' },
  succoth: { id: 'succoth', name: 'Succoth', lat: 30.5519, lon: 32.0986, confidence: 'debated', note: 'Often linked to Tell el-Maskhuta (Pithom).', source: 'Q1630019' },
  crossing: { id: 'crossing', name: 'Sea crossing', lat: 28.97, lon: 34.755, confidence: 'debated', schematic: true, note: 'Placed in the Gulf of Aqaba off Nuweiba Beach, which matches Mount Sinai in Midian. The Straits of Tiran, the Gulf of Suez and the Bitter Lakes are also proposed.' },
  marah: { id: 'marah', name: 'Marah', lat: 28.49, lon: 35.01, confidence: 'debated', schematic: true, note: 'Placed near al-Bad\' in Midian, where some writers put a bitter spring. Ain Hawarah in western Sinai is the traditional site.' },
  sinai: { id: 'sinai', name: 'Mount Sinai', lat: 28.6542, lon: 35.3058, confidence: 'debated', note: 'Placed at Jabal al-Lawz in Midian (Saudi Arabia). Some place it at nearby Jabal Maqla. Jebel Musa in the Sinai Peninsula is the traditional site.', source: 'Q4115817' },
  kadesh: { id: 'kadesh', name: 'Kadesh-barnea', lat: 30.6483, lon: 34.4222, confidence: 'traditional', source: 'Q954599' },
  ezion: { id: 'ezion', name: 'Ezion-geber', lat: 29.5472, lon: 34.9803, confidence: 'debated', note: 'Often linked to Tell el-Kheleifeh.', source: 'Q2402239' },
  nebo: { id: 'nebo', name: 'Mount Nebo', lat: 31.7678, lon: 35.7256, confidence: 'identified', source: 'Q680161' },

  nazareth: { id: 'nazareth', name: 'Nazareth', lat: 32.7021, lon: 35.2978, confidence: 'identified', source: 'Q430776' },
  baptism: { id: 'baptism', name: 'Jordan baptism site', lat: 31.8371, lon: 35.5465, confidence: 'traditional', note: 'Qasr al-Yahud is the traditional site.', source: 'Q1574073' },
  cana: { id: 'cana', name: 'Cana', lat: 32.75, lon: 35.35, confidence: 'traditional', note: 'Kafr Kanna is traditional. Khirbet Qana is also proposed.', source: 'Q2633158' },
  capernaum: { id: 'capernaum', name: 'Capernaum', lat: 32.8811, lon: 35.575, confidence: 'identified', source: 'Q59174' },
  tyre: { id: 'tyre', name: 'Tyre', lat: 33.2667, lon: 35.2, confidence: 'identified', source: 'Q82070' },
  caesarea: { id: 'caesarea', name: 'Caesarea Philippi', lat: 33.2472, lon: 35.6939, confidence: 'identified', note: 'Modern Banias.', source: 'Q606295' },
  sychar: { id: 'sychar', name: 'Sychar', lat: 32.2136, lon: 35.282, confidence: 'traditional', note: 'Placed at Tell Balata (Shechem), which is near the proposed site.', source: 'Q7697383' },
  bethany: { id: 'bethany', name: 'Bethany', lat: 31.77, lon: 35.2644, confidence: 'identified', note: 'Modern al-Eizariya.', source: 'Q2181579' },
  jerusalem: { id: 'jerusalem', name: 'Jerusalem', lat: 31.7767, lon: 35.2342, confidence: 'identified', source: 'Q1218' },

  jericho: { id: 'jericho', name: 'Jericho', lat: 31.8717, lon: 35.4446, confidence: 'identified', note: 'Tell es-Sultan.', source: 'Q2402267' },
  ai: { id: 'ai', name: 'Ai', lat: 31.9167, lon: 35.2883, confidence: 'debated', note: 'Et-Tell is traditional. Khirbet el-Maqatir is also proposed.', source: 'Q5402334' },
  gibeon: { id: 'gibeon', name: 'Gibeon', lat: 31.8475, lon: 35.1864, confidence: 'identified', source: 'Q889398' },
  azekah: { id: 'azekah', name: 'Azekah', lat: 31.7003, lon: 34.9358, confidence: 'identified', source: 'Q723564' },
  lachish: { id: 'lachish', name: 'Lachish', lat: 31.5653, lon: 34.8492, confidence: 'identified', source: 'Q848509' },
  hebron: { id: 'hebron', name: 'Hebron', lat: 31.535, lon: 35.0986, confidence: 'identified', source: 'Q168225' },
  hazor: { id: 'hazor', name: 'Hazor', lat: 33.0183, lon: 35.5692, confidence: 'identified', source: 'Q740138' },

  rephidim: { id: 'rephidim', name: 'Rephidim', lat: 28.6531, lon: 35.1707, confidence: 'debated', note: 'Placed at the split rock west of Jabal al-Lawz, which matches Mount Sinai in Midian. Wadi Feiran in Sinai is the traditional site.' },
  hormah: { id: 'hormah', name: 'Hormah', lat: 31.2131, lon: 34.9666, confidence: 'debated', note: 'Hormah is not identified. Tel Masos is one proposal.', source: 'Q3517239' },
  arad: { id: 'arad', name: 'Arad', lat: 31.2808, lon: 35.125, confidence: 'traditional', note: 'Tel Arad.', source: 'Q2063578' },
  heshbon: { id: 'heshbon', name: 'Heshbon', lat: 31.8186, lon: 35.7989, confidence: 'traditional', note: 'Tell Hesban. The battle with Sihon was at Jahaz. Jahaz is not identified, so the pin marks Heshbon, his city.', source: 'Q1615584' },
  jazer: { id: 'jazer', name: 'Jazer', lat: 31.9445, lon: 35.8301, confidence: 'debated', note: 'Khirbet es-Sar is one proposal.', source: 'Q86670632' },
  edrei: { id: 'edrei', name: 'Edrei', lat: 32.6253, lon: 36.1061, confidence: 'traditional', note: 'Modern Daraa.', source: 'Q238217' },
  kenath: { id: 'kenath', name: 'Kenath', lat: 32.7556, lon: 36.6167, confidence: 'traditional', note: 'Modern Qanawat.', source: 'Q763167' },
  shittim: { id: 'shittim', name: 'Abel-shittim', lat: 31.8497, lon: 35.6786, confidence: 'debated', note: 'Often linked to Khirbet el-Kafrayn. Tell el-Hammam is also proposed. The text does not name the battle site with Midian.', source: 'Q2236536' },
  gilgal: { id: 'gilgal', name: 'Gilgal', lat: 32.033, lon: 35.4757, confidence: 'debated', note: 'The site is not known. Several sites in the Jordan Valley are proposed.', source: 'Q2289734' },
  bethhoron: { id: 'bethhoron', name: 'Beth-horon', lat: 31.8767, lon: 35.1287, confidence: 'identified', source: 'Q1268514' },
  makkedah: { id: 'makkedah', name: 'Makkedah', lat: 31.5347, lon: 34.9666, confidence: 'debated', note: 'Khirbet el-Qom is one proposal.', source: 'Q4132286' },
  libnah: { id: 'libnah', name: 'Libnah', lat: 31.6299, lon: 34.8735, confidence: 'debated', note: 'Tel Burna is one proposal. Tel Zayit is also proposed.', source: 'Q7695565' },
  eglon: { id: 'eglon', name: 'Eglon', lat: 31.4903, lon: 34.9284, confidence: 'debated', note: 'Tel Eton is one proposal. Tell el-Hesi is also proposed.', source: 'Q12412091' },
  debir: { id: 'debir', name: 'Debir', lat: 31.4333, lon: 35.0167, confidence: 'debated', note: 'Khirbet Rabud is one proposal. Also called Kiriath-sepher.', source: 'Q7278816' },
  merom: { id: 'merom', name: 'Waters of Merom', lat: 33.1033, lon: 35.6092, confidence: 'debated', note: 'Placed at the former Lake Hula. Other sites are proposed.', source: 'Q3215195' },
  dan: { id: 'dan', name: 'Dan (Leshem)', lat: 33.249, lon: 35.652, confidence: 'identified', note: 'Tel Dan.', source: 'Q1346856' },

  ar: { id: 'ar', name: 'Ar', lat: 31.2667, lon: 35.7333, confidence: 'debated', note: 'Ar is not identified. The point is al-Rabba (Rabbath-Moab), one proposal.', source: 'Q847351' },
  rabbah: { id: 'rabbah', name: 'Rabbah', lat: 31.9547, lon: 35.9343, confidence: 'identified', note: 'Amman Citadel.', source: 'Q3157009' },
  ashtaroth: { id: 'ashtaroth', name: 'Ashtaroth', lat: 32.81, lon: 36.02, confidence: 'traditional', note: 'Tell Ashtara.', source: 'Q7697381' },
  salecah: { id: 'salecah', name: 'Salecah', lat: 32.4914, lon: 36.7106, confidence: 'traditional', note: 'Modern Salkhad.', source: 'Q24343' },

  // Saul and David
  gibeah: { id: 'gibeah', name: 'Gibeah', lat: 31.8233, lon: 35.2311, confidence: 'traditional', note: 'Tell el-Ful. Gibeah of Saul.', source: 'Q1021662' },
  bezek: { id: 'bezek', name: 'Bezek', lat: 32.3688, lon: 35.3974, confidence: 'traditional', note: 'Khirbet Ibziq.', source: 'Q49354325' },
  jabesh: { id: 'jabesh', name: 'Jabesh-gilead', lat: 32.399, lon: 35.5951, confidence: 'debated', note: 'Tell el-Maqlub and Tell Abu al-Kharaz are both proposed.', source: 'Q2905361' },
  geba: { id: 'geba', name: 'Geba', lat: 31.8575, lon: 35.2611, confidence: 'traditional', note: 'Modern Jaba.', source: 'Q6109776' },
  michmash: { id: 'michmash', name: 'Michmash', lat: 31.8719, lon: 35.2761, confidence: 'identified', note: 'Modern Mukhmas.', source: 'Q3809153' },
  ophrah: { id: 'ophrah', name: 'Ophrah', lat: 31.9544, lon: 35.3003, confidence: 'traditional', note: 'Modern Taybeh.', source: 'Q931667' },
  aijalon: { id: 'aijalon', name: 'Aijalon', lat: 31.8405, lon: 35.0226, confidence: 'traditional', note: 'Yalo.', source: 'Q11716708' },
  amalek: { id: 'amalek', name: 'City of Amalek', lat: 30.95, lon: 34.75, confidence: 'debated', schematic: true, note: 'Not identified. Saul struck Amalek from Havilah to Shur, east of Egypt (1 Sam 15:7). The point is schematic, in the Negev.' },
  carmel: { id: 'carmel', name: 'Carmel', lat: 31.4225, lon: 35.1311, confidence: 'traditional', note: 'Carmel in Judah, not Mount Carmel. Khirbet el-Kirmil.', source: 'Q2904870' },
  elah: { id: 'elah', name: 'Valley of Elah', lat: 31.6806, lon: 34.9891, confidence: 'identified', note: 'The Philistines camped between Socoh and Azekah (1 Sam 17:1).', source: 'Q862725' },
  gath: { id: 'gath', name: 'Gath', lat: 31.6997, lon: 34.8469, confidence: 'identified', note: 'Tell es-Safi.', source: 'Q1348441' },
  ekron: { id: 'ekron', name: 'Ekron', lat: 31.7789, lon: 34.8511, confidence: 'identified', note: 'Tel Miqne.', source: 'Q1323557' },
  keilah: { id: 'keilah', name: 'Keilah', lat: 31.6131, lon: 35.0006, confidence: 'identified', note: 'Khirbet Qila. Wikidata has no point for it. The point is approximate.', source: 'Q2076708' },
  ziph: { id: 'ziph', name: 'Ziph', lat: 31.4817, lon: 35.1356, confidence: 'traditional', note: 'Tell Zif. Wikidata has no point for it. The point is approximate.' },
  maon: { id: 'maon', name: 'Maon', lat: 31.4106, lon: 35.1203, confidence: 'traditional', note: 'Khirbet Main. Wikidata has no point for it. The point is approximate.' },
  engedi: { id: 'engedi', name: 'En-gedi', lat: 31.4681, lon: 35.3883, confidence: 'identified', source: 'Q25489001' },
  ziklag: { id: 'ziklag', name: 'Ziklag', lat: 31.39, lon: 34.68, confidence: 'debated', note: 'Placed at Tel Sera. Khirbet a-Rai is also proposed.', source: 'Q6127412' },
  besor: { id: 'besor', name: 'Brook Besor', lat: 31.28, lon: 34.49, confidence: 'debated', schematic: true, note: 'The text does not say where David crossed. The point is on the wadi near Tell el-Farah (South).', source: 'Q2668577' },
  aphek: { id: 'aphek', name: 'Aphek', lat: 32.105, lon: 34.9304, confidence: 'identified', note: 'Tel Afek (Antipatris).', source: 'Q682612' },
  shunem: { id: 'shunem', name: 'Shunem', lat: 32.6056, lon: 35.3343, confidence: 'traditional', note: 'Modern Sulam.', source: 'Q2916070' },
  gilboa: { id: 'gilboa', name: 'Mount Gilboa', lat: 32.4339, lon: 35.4144, confidence: 'identified', source: 'Q1161616' },
  bethshan: { id: 'bethshan', name: 'Beth-shan', lat: 32.5046, lon: 35.504, confidence: 'identified', note: 'Tel Beit Shean.', source: 'Q3517238' },
  mahanaim: { id: 'mahanaim', name: 'Mahanaim', lat: 32.1856, lon: 35.6866, confidence: 'debated', note: 'Tulul adh-Dhahab is one proposal.', source: 'Q656842' },
  rephaim: { id: 'rephaim', name: 'Valley of Rephaim', lat: 31.7632, lon: 35.2191, confidence: 'traditional', source: 'Q446380' },
  gezer: { id: 'gezer', name: 'Gezer', lat: 31.8599, lon: 34.9196, confidence: 'identified', source: 'Q1466687' },
  moab: { id: 'moab', name: 'Moab', lat: 31.4, lon: 35.85, confidence: 'debated', schematic: true, note: 'The text names no site. The point marks the land of Moab.' },
  damascus: { id: 'damascus', name: 'Damascus', lat: 33.5131, lon: 36.2919, confidence: 'identified', note: 'Zobah, the kingdom of Hadadezer, is north of this map.', source: 'Q3766' },
  salt: { id: 'salt', name: 'Valley of Salt', lat: 31.23, lon: 35.04, confidence: 'debated', schematic: true, note: 'Often linked to Wadi el-Milh, east of Beersheba. The Arabah south of the Dead Sea is also proposed.' },
  helam: { id: 'helam', name: 'Helam', lat: 32.7489, lon: 36.2397, confidence: 'debated', note: 'Placed at Alma in southern Syria, one proposal.', source: 'Q17004410' },
  olives: { id: 'olives', name: 'Mount of Olives', lat: 31.7779, lon: 35.2457, confidence: 'identified', source: 'Q205976' },
  ephraim: { id: 'ephraim', name: 'Forest of Ephraim', lat: 32.3, lon: 35.75, confidence: 'debated', schematic: true, note: 'Not identified. The text places it east of the Jordan, in Gilead (2 Sam 17:26; 18:6). The point is schematic.' },
  abel: { id: 'abel', name: 'Abel Beth-maacah', lat: 33.2581, lon: 35.581, confidence: 'identified', note: 'Tel Abel Beth Maacah.', source: 'Q2911724' },
  bethlehem: { id: 'bethlehem', name: 'Bethlehem', lat: 31.7044, lon: 35.2061, confidence: 'identified', source: 'Q5776' },
  adullam: { id: 'adullam', name: 'Adullam', lat: 31.6547, lon: 35.0031, confidence: 'traditional', source: 'Q2914860' },

  // Table of Nations. Many of these peoples are not placed with certainty.
  gomer: { id: 'gomer', name: 'Gomer', lat: 39.9, lon: 34.2, confidence: 'debated', schematic: true, note: 'Not identified. Many writers link Gomer to the Cimmerians, who lived in Anatolia. The point is schematic.' },
  magog: { id: 'magog', name: 'Magog', lat: 43.6, lon: 44.0, confidence: 'debated', schematic: true, note: 'Not identified. Ezek 38:2 puts Magog in the far north. The point is schematic, north of the Caucasus.' },
  madai: { id: 'madai', name: 'Madai', lat: 34.8065, lon: 48.5162, confidence: 'traditional', note: 'Madai is Media. Ecbatana, modern Hamadan, was its capital.', source: 'Q696193' },
  javan: { id: 'javan', name: 'Javan', lat: 37.5311, lon: 27.2756, confidence: 'traditional', note: 'Javan is Ionia, the Greek coast of Anatolia. Miletus is one Ionian city.', source: 'Q169460' },
  tubal: { id: 'tubal', name: 'Tubal', lat: 38.4, lon: 35.8, confidence: 'debated', schematic: true, note: 'Not identified. Many writers link Tubal to Tabal in central Anatolia. The point is schematic.' },
  meshech: { id: 'meshech', name: 'Meshech', lat: 38.4, lon: 33.2, confidence: 'debated', schematic: true, note: 'Not identified. Many writers link Meshech to the Mushki of Anatolia. The point is schematic.' },
  tiras: { id: 'tiras', name: 'Tiras', lat: 41.5, lon: 26.0, confidence: 'debated', schematic: true, note: 'Not identified. Some writers link Tiras to Thrace. The point is schematic.' },
  ashkenaz: { id: 'ashkenaz', name: 'Ashkenaz', lat: 38.3, lon: 44.8, confidence: 'debated', schematic: true, note: 'Not identified. Some writers link Ashkenaz to the Ishkuza near Armenia. Jer 51:27 names Ashkenaz with Ararat and Minni. The point is schematic.' },
  riphath: { id: 'riphath', name: 'Riphath', lat: 41.3, lon: 34.0, confidence: 'debated', schematic: true, note: 'Not identified. Some writers link Riphath to Paphlagonia. The point is schematic.' },
  togarmah: { id: 'togarmah', name: 'Togarmah', lat: 38.7211, lon: 37.2703, confidence: 'debated', note: 'Not identified. Many writers link Togarmah to Til-garimmu, near Gürün.', source: 'Q1011935' },
  kittim: { id: 'kittim', name: 'Kittim', lat: 34.9233, lon: 33.6305, confidence: 'traditional', note: 'Kittim is Kition on Cyprus. Many writers link Elishah to Alashiya, which is also Cyprus. Tarshish is often placed in Spain, west of this map.', source: 'Q1743884' , labelLeft: true },
  dodanim: { id: 'dodanim', name: 'Dodanim', lat: 36.2, lon: 28.0, confidence: 'debated', schematic: true, note: 'Some Hebrew copies read Rodanim (1 Chr 1:7). Rhodes is one proposal. The point is schematic.' },
  cush: { id: 'cush', name: 'Cush', lat: 20.5, lon: 31.5, confidence: 'debated', schematic: true, note: 'Cush is the land south of Egypt, Nubia. The point is schematic.' },
  put: { id: 'put', name: 'Put', lat: 31.0, lon: 22.0, confidence: 'debated', schematic: true, note: 'Put is usually linked to Libya. The point is schematic.' },
  seba: { id: 'seba', name: 'Seba', lat: 16.9351, lon: 33.7508, confidence: 'debated', note: 'Not identified. Many writers link Seba to Meroë in Nubia.', source: 'Q5780' },
  raamah: { id: 'raamah', name: 'Raamah', lat: 17.4917, lon: 44.1322, confidence: 'debated', note: 'Not identified. Najran in southwest Arabia is one proposal.', source: 'Q27174' },
  sheba: { id: 'sheba', name: 'Sheba', lat: 15.4625, lon: 45.3258, confidence: 'traditional', note: 'Marib was the capital of Saba, the kingdom of Sheba in southern Arabia.', source: 'Q335478' },
  dedan: { id: 'dedan', name: 'Dedan', lat: 26.6089, lon: 37.9236, confidence: 'debated', note: 'Not identified. Al-Ula in northwest Arabia is one proposal.', source: 'Q27242' },
  caphtor: { id: 'caphtor', name: 'Caphtor', lat: 35.298, lon: 25.1632, confidence: 'debated', note: 'Caphtor is usually linked to Crete (Amos 9:7; Jer 47:4). Knossos is its chief site.', source: 'Q173527' },
  sidon: { id: 'sidon', name: 'Sidon', lat: 33.5606, lon: 35.3758, confidence: 'identified', source: 'Q163490' },
  arvad: { id: 'arvad', name: 'Arvad', lat: 34.8561, lon: 35.8583, confidence: 'identified', note: 'The island of Arwad.', source: 'Q377802' },
  hamath: { id: 'hamath', name: 'Hamath', lat: 35.135, lon: 36.75, confidence: 'identified', note: 'Modern Hama.', source: 'Q173545' },
  gaza: { id: 'gaza', name: 'Gaza', lat: 31.5075, lon: 34.4597, confidence: 'identified', source: 'Q47492' },
  babel: { id: 'babel', name: 'Babylon', lat: 32.5425, lon: 44.4211, confidence: 'identified', note: 'The text calls the city Babel. Accad and Calneh, the other cities of Nimrod in Shinar, are not identified.', source: 'Q5684' },
  erech: { id: 'erech', name: 'Erech', lat: 31.3259, lon: 45.6374, confidence: 'identified', note: 'Uruk.', source: 'Q168518' },
  nineveh: { id: 'nineveh', name: 'Nineveh', lat: 36.3667, lon: 43.15, confidence: 'identified', note: 'Rehoboth-ir and Resen are not identified. Resen lay between Nineveh and Calah (Gen 10:12).', source: 'Q5680' },
  calah: { id: 'calah', name: 'Calah', lat: 36.098, lon: 43.3289, confidence: 'identified', note: 'Nimrud.', source: 'Q237614' },
  elam: { id: 'elam', name: 'Elam', lat: 32.1894, lon: 48.2561, confidence: 'traditional', note: 'Susa was the chief city of Elam.', source: 'Q180773' },
  asshur: { id: 'asshur', name: 'Asshur', lat: 35.4567, lon: 43.2625, confidence: 'identified', note: 'Ashur, the first capital of Assyria.', source: 'Q200200' },
  arpachshad: { id: 'arpachshad', name: 'Arpachshad', lat: 36.5, lon: 44.0, confidence: 'debated', schematic: true, note: 'The text names no place. Several are proposed. The point is schematic, in the highlands east of the Tigris.' },
  lud: { id: 'lud', name: 'Lud', lat: 38.4883, lon: 28.0403, confidence: 'debated', note: 'Not identified. Many writers link Lud to Lydia. Sardis was its capital.', source: 'Q232615' },
  joktan: { id: 'joktan', name: 'Joktan', lat: 16.3, lon: 48.0, confidence: 'debated', schematic: true, note: 'His sons lived from Mesha to Sephar, the eastern hill country (Gen 10:30). Neither is identified. The point is schematic, in southern Arabia.' },

  // Pentecost, Acts 2:9–11. Regions get a schematic point. Cities use a known site.
  parthia: { id: 'parthia', name: 'Parthia', lat: 37.0, lon: 56.0, confidence: 'debated', schematic: true, note: 'The Parthian empire ran from the Euphrates to the east of the Caspian Sea. The point is schematic, in its northeast.' },
  mesopotamia: { id: 'mesopotamia', name: 'Mesopotamia', lat: 35.8, lon: 40.5, confidence: 'debated', schematic: true, note: 'The land between the Tigris and the Euphrates. The point is schematic.' },
  judea: { id: 'judea', name: 'Judea', lat: 31.55, lon: 35.0, confidence: 'debated', schematic: true, note: 'The Roman province around Jerusalem. The point is schematic, in the hill country.' },
  cappadocia: { id: 'cappadocia', name: 'Cappadocia', lat: 38.7, lon: 35.5, confidence: 'debated', schematic: true, note: 'The Roman province in central Anatolia. The point is schematic.' },
  pontus: { id: 'pontus', name: 'Pontus', lat: 40.8, lon: 37.0, confidence: 'debated', schematic: true, note: 'The Roman province on the Black Sea coast. The point is schematic.' },
  asia: { id: 'asia', name: 'Asia', lat: 37.9411, lon: 27.3419, confidence: 'traditional', note: 'Asia is the Roman province in western Anatolia. Ephesus was its chief city. The coordinates are approximate.' },
  phrygia: { id: 'phrygia', name: 'Phrygia', lat: 38.7, lon: 30.0, confidence: 'debated', schematic: true, note: 'The region in west-central Anatolia. The point is schematic.' , labelLeft: true },
  pamphylia: { id: 'pamphylia', name: 'Pamphylia', lat: 36.9614, lon: 30.8536, confidence: 'traditional', note: 'The coast of southern Anatolia. Perga was its chief city. The coordinates are approximate.' },
  cyrene: { id: 'cyrene', name: 'Cyrene', lat: 32.825, lon: 21.8583, confidence: 'identified', note: 'Cyrene was the chief city of the part of Libya that Acts names. The coordinates are approximate.' },
  rome: { id: 'rome', name: 'Rome', lat: 41.9028, lon: 12.4964, confidence: 'identified', note: 'The coordinates are approximate.' },
  crete: { id: 'crete', name: 'Crete', lat: 35.2, lon: 24.9, confidence: 'identified', schematic: true, note: 'The island of Crete. The point is schematic, near its center.' , labelLeft: true },
  arabia: { id: 'arabia', name: 'Arabia', lat: 29.5, lon: 37.0, confidence: 'debated', schematic: true, note: 'The text names no place. The Nabatean kingdom lay south and east of Judea. The point is schematic.' },

  // Abraham
  ur: { id: 'ur', name: 'Ur', lat: 30.9617, lon: 46.1051, confidence: 'traditional', note: 'Tell el-Muqayyar in southern Iraq. Some writers place Ur of the Chaldeans near Urfa in southern Turkey.', source: 'Q5699' },
  haran: { id: 'haran', name: 'Haran', lat: 36.8708, lon: 39.025, confidence: 'identified', note: 'Harran in southeastern Turkey.', source: 'Q199547' },
  shechem: { id: 'shechem', name: 'Shechem', lat: 32.2136, lon: 35.282, confidence: 'identified', note: 'Tell Balata.', source: 'Q7951237' },
  bethel: { id: 'bethel', name: 'Bethel', lat: 31.9283, lon: 35.2383, confidence: 'traditional', note: 'Beitin is the traditional site. El-Bireh is also proposed.', source: 'Q2898916' },
  egypt: { id: 'egypt', name: 'Egypt', lat: 30.6, lon: 31.55, confidence: 'debated', schematic: true, note: 'The text names no city in Egypt. The point is schematic, in the eastern Nile Delta.' },
  mamre: { id: 'mamre', name: 'Mamre', lat: 31.5565, lon: 35.1053, confidence: 'traditional', note: 'Ramat el-Khalil, north of Hebron. The oaks of Mamre are at Hebron (Gen 13:18).', source: 'Q2143048' },
  machpelah: { id: 'machpelah', name: 'Cave of Machpelah', lat: 31.5247, lon: 35.1107, confidence: 'traditional', note: 'The Cave of the Patriarchs in Hebron.', source: 'Q204200' },
  sodom: { id: 'sodom', name: 'Sodom', lat: 31.2539, lon: 35.5342, confidence: 'debated', note: 'Not identified. Bab edh-Dhra, near the south end of the Dead Sea, is one proposal. Tall el-Hammam, northeast of the Dead Sea, is also proposed.', source: 'Q797529' },
  zoar: { id: 'zoar', name: 'Zoar', lat: 31.0369, lon: 35.4877, confidence: 'debated', note: 'Placed at Ghor es-Safi, south of the Dead Sea, one proposal.', source: 'Q27125336' },
  siddim: { id: 'siddim', name: 'Valley of Siddim', lat: 31.15, lon: 35.45, confidence: 'debated', schematic: true, note: 'The text says the valley is the Salt Sea (Gen 14:3). The point is schematic, at the south end of the Dead Sea.' },
  elparan: { id: 'elparan', name: 'El-paran', lat: 29.58, lon: 35.0, confidence: 'debated', schematic: true, note: 'On the border of the wilderness (Gen 14:6). Often linked to Elath, at the head of the Gulf of Aqaba. The point is schematic.' },
  lahairoi: { id: 'lahairoi', name: 'Beer-lahai-roi', lat: 30.8, lon: 34.55, confidence: 'debated', schematic: true, note: 'Not identified. The well is between Kadesh and Bered (Gen 16:14). The point is schematic.' },
  paran: { id: 'paran', name: 'Wilderness of Paran', lat: 30.3, lon: 34.15, confidence: 'debated', schematic: true, note: 'A wilderness south of Canaan. Kadesh is in it (Num 13:26). The point is schematic.' },
  salem: { id: 'salem', name: 'Salem', lat: 31.7736, lon: 35.2356, confidence: 'traditional', labelLeft: true, note: 'Ps 76:2 links Salem to Zion. The point is the City of David in Jerusalem.', source: 'Q1177750' },
  moriah: { id: 'moriah', name: 'Mount Moriah', lat: 31.7781, lon: 35.2358, confidence: 'traditional', note: 'The text names the land of Moriah (Gen 22:2). 2 Chr 3:1 places Mount Moriah at the temple site in Jerusalem. The point is the Temple Mount.', source: 'Q193163' },
  gerar: { id: 'gerar', name: 'Gerar', lat: 31.3821, lon: 34.6065, confidence: 'debated', note: 'Tel Haror is one proposal.', source: 'Q770842' },
  laodicea: { id: 'laodicea', name: 'Laodicea', lat: 37.8358, lon: 29.1075, confidence: 'identified', note: 'Laodicea on the Lycus.', source: 'Q849709' },
  philadelphia: { id: 'philadelphia', name: 'Philadelphia', lat: 38.35, lon: 28.5167, confidence: 'identified', note: 'Modern Alaşehir.', source: 'Q138280' },
  sardis: { id: 'sardis', name: 'Sardis', lat: 38.4883, lon: 28.0403, confidence: 'identified', source: 'Q232615' },
  smyrna: { id: 'smyrna', name: 'Smyrna', lat: 38.4127, lon: 27.1384, confidence: 'identified', note: 'Modern İzmir.', source: 'Q35997' },
  thyatira: { id: 'thyatira', name: 'Thyatira', lat: 38.9241, lon: 27.8402, confidence: 'identified', note: 'Modern Akhisar.', source: 'Q209905' },
  pergamum: { id: 'pergamum', name: 'Pergamum', lat: 39.1295, lon: 27.1841, confidence: 'identified', note: 'Pergamon.', source: 'Q18986' },
  beersheba: { id: 'beersheba', name: 'Beersheba', lat: 31.2447, lon: 34.8408, confidence: 'identified', note: 'Tel Be\'er Sheva.', source: 'Q534596' },

  // Paul. Coordinates are from Wikidata.
  antioch: { id: 'antioch', name: 'Antioch in Syria', lat: 36.2047, lon: 36.1817, confidence: 'identified', note: 'Modern Antakya.', source: 'Q200441' },
  seleucia: { id: 'seleucia', name: 'Seleucia', lat: 36.124, lon: 35.922, confidence: 'identified', note: 'Seleucia Pieria, the port of Antioch.', source: 'Q1605894' },
  salamis: { id: 'salamis', name: 'Salamis', lat: 35.1833, lon: 33.9, confidence: 'identified', note: 'On the east coast of Cyprus.', source: 'Q767089' },
  paphos: { id: 'paphos', name: 'Paphos', lat: 34.7761, lon: 32.4265, confidence: 'identified', source: 'Q180918' },
  perga: { id: 'perga', name: 'Perga', lat: 36.9604, lon: 30.8537, confidence: 'identified', note: 'Perge, in Pamphylia.', source: 'Q719815' },
  pisantioch: { id: 'pisantioch', name: 'Antioch in Pisidia', lat: 38.3061, lon: 31.1892, confidence: 'identified', note: 'Near modern Yalvaç.', source: 'Q579468' },
  iconium: { id: 'iconium', name: 'Iconium', lat: 37.8728, lon: 32.4921, confidence: 'identified', note: 'Modern Konya.', source: 'Q79857' },
  lystra: { id: 'lystra', name: 'Lystra', lat: 37.6641, lon: 32.2107, confidence: 'traditional', note: 'Near modern Hatunsaray.', source: 'Q535982' },
  derbe: { id: 'derbe', name: 'Derbe', lat: 37.3486, lon: 33.3615, confidence: 'traditional', note: 'Kerti Hüyük is one proposal.', source: 'Q20717624' },
  attalia: { id: 'attalia', name: 'Attalia', lat: 36.9081, lon: 30.6956, confidence: 'identified', note: 'Modern Antalya.', source: 'Q6487' },
  tarsus: { id: 'tarsus', name: 'Tarsus', lat: 36.9167, lon: 34.9, confidence: 'identified', note: 'Acts 15:41 names Cilicia. Tarsus was its chief city and the home of Paul (Acts 21:39).', source: 'Q134287' },
  troas: { id: 'troas', name: 'Troas', lat: 39.7519, lon: 26.1586, confidence: 'identified', note: 'Alexandria Troas.', source: 'Q1393407' },
  samothrace: { id: 'samothrace', name: 'Samothrace', lat: 40.45, lon: 25.5875, confidence: 'identified', note: 'An island in the north Aegean.', source: 'Q203175' },
  neapolis: { id: 'neapolis', name: 'Neapolis', lat: 40.9396, lon: 24.4069, confidence: 'identified', note: 'Modern Kavala.', source: 'Q187352' },
  philippi: { id: 'philippi', name: 'Philippi', lat: 41.0121, lon: 24.2846, confidence: 'identified', source: 'Q379652' },
  thessalonica: { id: 'thessalonica', name: 'Thessalonica', lat: 40.6403, lon: 22.9356, confidence: 'identified', note: 'Modern Thessaloniki.', source: 'Q17151' },
  berea: { id: 'berea', name: 'Berea', lat: 40.5203, lon: 22.2019, confidence: 'identified', note: 'Modern Veria.', source: 'Q201722' },
  athens: { id: 'athens', name: 'Athens', lat: 37.9842, lon: 23.7281, confidence: 'identified', source: 'Q1524' },
  corinth: { id: 'corinth', name: 'Corinth', lat: 37.9058, lon: 22.8787, confidence: 'identified', note: 'Ancient Corinth.', source: 'Q1363688' },
  cenchreae: { id: 'cenchreae', name: 'Cenchreae', lat: 37.8824, lon: 22.9925, confidence: 'identified', note: 'The eastern port of Corinth.', source: 'Q111565756' },
  ephesus: { id: 'ephesus', name: 'Ephesus', lat: 37.9406, lon: 27.3394, confidence: 'identified', source: 'Q47611' },
  caesareamar: { id: 'caesareamar', name: 'Caesarea', lat: 32.5011, lon: 34.8923, confidence: 'identified', note: 'Caesarea Maritima, on the coast. It is not Caesarea Philippi.', source: 'Q319242' },
  macedonia: { id: 'macedonia', name: 'Macedonia', lat: 40.7, lon: 22.6, confidence: 'debated', schematic: true, note: 'The text names the Roman province, not a city. The point lies between Thessalonica and Berea.' },
  assos: { id: 'assos', name: 'Assos', lat: 39.4906, lon: 26.3367, confidence: 'identified', source: 'Q744631' },
  miletus: { id: 'miletus', name: 'Miletus', lat: 37.5311, lon: 27.2756, confidence: 'identified', source: 'Q169460' },
  patara: { id: 'patara', name: 'Patara', lat: 36.2603, lon: 29.3142, confidence: 'identified', source: 'Q233121' },
  ptolemais: { id: 'ptolemais', name: 'Ptolemais', lat: 32.9261, lon: 35.0839, confidence: 'identified', note: 'Modern Acre.', source: 'Q126084' },
  myra: { id: 'myra', name: 'Myra', lat: 36.2592, lon: 29.9853, confidence: 'identified', source: 'Q652024' },
  cnidus: { id: 'cnidus', name: 'Cnidus', lat: 36.6858, lon: 27.375, confidence: 'identified', source: 'Q690575' },
  fairhavens: { id: 'fairhavens', name: 'Fair Havens', lat: 34.9297, lon: 24.8003, confidence: 'identified', note: 'Modern Kaloi Limenes, on the south coast of Crete.', source: 'Q11818846' },
  cauda: { id: 'cauda', name: 'Cauda', lat: 34.8333, lon: 24.0833, confidence: 'identified', note: 'Modern Gavdos. Acts 27:16 names the island.', source: 'Q213895' },
  malta: { id: 'malta', name: 'Malta', lat: 35.9483, lon: 14.4017, confidence: 'traditional', note: 'The text names the island Malta. St. Paul’s Bay is the traditional landing place.', source: 'Q39521' },
  syracuse: { id: 'syracuse', name: 'Syracuse', lat: 37.0833, lon: 15.2833, confidence: 'identified', source: 'Q4420718' },
  rhegium: { id: 'rhegium', name: 'Rhegium', lat: 38.1144, lon: 15.65, confidence: 'identified', note: 'Modern Reggio Calabria.', source: 'Q8471' },
  puteoli: { id: 'puteoli', name: 'Puteoli', lat: 40.8231, lon: 14.1222, confidence: 'identified', note: 'Modern Pozzuoli.', source: 'Q72425' },
}

export const FAMILIES: Family[] = [
  {
    id: 'nations',
    name: 'Nations',
    sub: 'The Table of Nations, Genesis 10',
    route: false,
    terms: { one: 'Place', many: 'places', hint: 'Scroll to follow the nations.' },
    stops: [
      // Japheth, Gen 10:2–5
      { place: 'gomer', ref: 'Gen 10:2–3', event: 'Gomer, a son of Japheth', span: 700 },
      { place: 'magog', ref: 'Gen 10:2', event: 'Magog, a son of Japheth', span: 700 },
      { place: 'madai', ref: 'Gen 10:2', event: 'Madai, a son of Japheth', span: 500 },
      { place: 'javan', ref: 'Gen 10:2, 4–5', event: 'Javan, a son of Japheth. His sons are Elishah, Tarshish, Kittim and Dodanim', span: 500 },
      { place: 'tubal', ref: 'Gen 10:2', event: 'Tubal, a son of Japheth', span: 500 },
      { place: 'meshech', ref: 'Gen 10:2', event: 'Meshech, a son of Japheth', span: 500 },
      { place: 'tiras', ref: 'Gen 10:2', event: 'Tiras, a son of Japheth', span: 700 },
      { place: 'ashkenaz', ref: 'Gen 10:3', event: 'Ashkenaz, a son of Gomer', span: 500 },
      { place: 'riphath', ref: 'Gen 10:3', event: 'Riphath, a son of Gomer', span: 600 },
      { place: 'togarmah', ref: 'Gen 10:3', event: 'Togarmah, a son of Gomer', span: 500 },
      { place: 'kittim', ref: 'Gen 10:4', event: 'Kittim, a son of Javan. Elishah is also his son', span: 400 },
      { place: 'dodanim', ref: 'Gen 10:4', event: 'Dodanim, a son of Javan', span: 500 },
      // Ham, Gen 10:6–20
      { place: 'cush', ref: 'Gen 10:6–8', event: 'Cush, a son of Ham. His sons are Seba, Havilah, Sabtah, Raamah and Sabteca. Nimrod is also his son', span: 900 },
      { place: 'egypt', ref: 'Gen 10:6, 13–14', event: 'Mizraim, a son of Ham. His sons are Ludim, Anamim, Lehabim, Naphtuhim, Pathrusim, Casluhim and Caphtorim', span: 700 },
      { place: 'put', ref: 'Gen 10:6', event: 'Put, a son of Ham', span: 800 },
      { place: 'seba', ref: 'Gen 10:7', event: 'Seba, a son of Cush', span: 600 },
      { place: 'raamah', ref: 'Gen 10:7', event: 'Raamah, a son of Cush. His sons are Sheba and Dedan', span: 600 },
      { place: 'sheba', ref: 'Gen 10:7', event: 'Sheba, a son of Raamah', span: 500 },
      { place: 'dedan', ref: 'Gen 10:7', event: 'Dedan, a son of Raamah', span: 500 },
      { place: 'caphtor', ref: 'Gen 10:14', event: 'The Philistines came from the Casluhim. The Caphtorim are also sons of Mizraim', span: 500 },
      { place: 'babel', ref: 'Gen 10:8–10', event: 'Nimrod, a son of Cush, is the first mighty man on earth. His kingdom begins with Babel, Erech, Accad and Calneh in Shinar', span: 400 },
      { place: 'erech', ref: 'Gen 10:10', event: 'Erech, a city in the kingdom of Nimrod', span: 300 },
      { place: 'nineveh', ref: 'Gen 10:11–12', event: 'Asshur goes out from that land and builds Nineveh, Rehoboth-ir, Calah and Resen', span: 300 },
      { place: 'calah', ref: 'Gen 10:11–12', event: 'Calah, a city built by Asshur', span: 250 },
      { place: 'sidon', ref: 'Gen 10:15', event: 'Canaan, a son of Ham. His firstborn is Sidon. Heth is also his son', span: 400 },
      { place: 'arvad', ref: 'Gen 10:17–18', event: 'The Arvadites and the Zemarites are sons of Canaan', span: 300 },
      { place: 'hamath', ref: 'Gen 10:18', event: 'The Hamathites are sons of Canaan', span: 300 },
      { place: 'gaza', ref: 'Gen 10:19', event: 'The border of the Canaanites runs from Sidon toward Gerar as far as Gaza', span: 400 },
      { place: 'sodom', ref: 'Gen 10:19', event: 'The border turns toward Sodom, Gomorrah, Admah and Zeboiim, as far as Lasha', span: 300 },
      // Shem, Gen 10:21–31
      { place: 'elam', ref: 'Gen 10:22', event: 'Elam, a son of Shem', span: 500 },
      { place: 'asshur', ref: 'Gen 10:22', event: 'Asshur, a son of Shem', span: 400 },
      { place: 'arpachshad', ref: 'Gen 10:22, 24', event: 'Arpachshad, a son of Shem. His son is Shelah. Shelah’s son is Eber', span: 600 },
      { place: 'lud', ref: 'Gen 10:22', event: 'Lud, a son of Shem', span: 500 },
      { place: 'damascus', ref: 'Gen 10:22–23', event: 'Aram, a son of Shem. His sons are Uz, Hul, Gether and Mash', span: 500, note: 'Aram is the land of the Arameans. Damascus was their chief city.' },
      { place: 'joktan', ref: 'Gen 10:25–30', event: 'Eber has two sons, Peleg and Joktan. The sons of Joktan live in the eastern hill country', span: 900 },
      { place: 'sheba', ref: 'Gen 10:28', event: 'Sheba, a son of Joktan', span: 500 },
    ],
  },
  {
    id: 'abraham',
    name: 'Abraham',
    sub: 'The life of Abraham, Genesis 11 to 25',
    stops: [
      { place: 'ur', ref: 'Gen 11:27–31', event: 'Terah takes Abram, Sarai and Lot from Ur to go to Canaan', span: 620, note: 'God brought Abram out from Ur (Gen 15:7). Acts 7:2–3 says God appeared to him in Mesopotamia, before he lived in Haran. Acts puts the call of Gen 12:1 there.' },
      { place: 'haran', ref: 'Gen 11:31–32', event: 'They settle in Haran. Terah dies there', span: 300 },
      { place: 'haran', ref: 'Gen 12:1–5', event: 'The LORD calls Abram. At 75 he leaves Haran with Sarai, Lot and their people', span: 300, note: 'Acts 7:4 says Abram left Haran after his father died. If Terah was 70 at the birth of Abram (Gen 11:26), Terah was still alive (Gen 11:32; 12:4). Many writers say Abram was not the first son.' },
      { place: 'shechem', ref: 'Gen 12:6–7', event: 'The LORD appears at the oak of Moreh and promises the land. Abram builds an altar', span: 140 },
      { place: 'bethel', ref: 'Gen 12:8', event: 'Abram pitches his tent between Bethel and Ai and builds an altar', span: 120 },
      { place: 'egypt', ref: 'Gen 12:10–20', event: 'Famine drives Abram to Egypt. Pharaoh takes Sarai, then sends them away', span: 320, note: 'Abram first journeys toward the Negev (Gen 12:9).' },
      { place: 'bethel', ref: 'Gen 13:1–4', event: 'Abram returns through the Negev to the altar at Bethel', span: 140 },
      { place: 'bethel', ref: 'Gen 13:5–13', event: 'Abram and Lot part. Lot moves his tent as far as Sodom', moves: [
        { force: 'lot', label: 'Lot', path: ['bethel', 'sodom'], ref: 'Gen 13:10–12' },
      ] },
      { place: 'mamre', ref: 'Gen 13:14–18', event: 'The LORD gives Abram all the land he sees. Abram settles by the oaks of Mamre', span: 120 },
      { place: 'siddim', ref: 'Gen 14:1–12', event: 'Four kings of the east defeat the kings of Sodom and Gomorrah and take Lot', offRoute: true, note: 'The kings came from Shinar, Ellasar, Elam and Goiim (Gen 14:1). The arrow places Ashteroth-karnaim at Ashtaroth. Hazazon-tamar is En-gedi (2 Chr 20:2).', moves: [
        { force: 'foreign', label: 'Chedorlaomer', path: ['ashtaroth', 'elparan', 'kadesh', 'engedi', 'siddim'], ref: 'Gen 14:5–9' },
      ] },
      { place: 'dan', ref: 'Gen 14:13–16', event: 'Abram pursues with 318 men, attacks by night and brings back Lot', note: 'The text calls the city Dan. Its earlier name was Laish (Judg 18:29). Hobah, north of Damascus, is not identified, so the arrow ends at Damascus.', moves: [
        { force: 'foreign', label: 'Four kings', path: ['siddim', 'dan'], ref: 'Gen 14:11–14' },
        { force: 'abraham', label: 'Abram', path: ['mamre', 'dan', 'damascus'], ref: 'Gen 14:13–15' },
      ] },
      { place: 'salem', ref: 'Gen 14:17–24', event: 'Melchizedek, king of Salem, blesses Abram. Abram gives him a tenth', moves: [
        { force: 'abraham', label: 'Abram', path: ['damascus', 'salem'], ref: 'Gen 14:16–17' },
      ] },
      { place: 'mamre', ref: 'Gen 15:1–21', event: 'The LORD makes a covenant with Abram. He promises the land from the river of Egypt to the Euphrates', span: 900, note: 'The text does not name the place. Abram lived by the oaks of Mamre (Gen 14:13). Acts 7:5 says God gave him no land, not even a foot, but promised it to him and his offspring when he had no child. Acts 7:6–7 quotes Gen 15:13–14: his offspring will be slaves for 400 years.' },
      { place: 'mamre', ref: 'Gen 16:1–16', event: 'Hagar flees from Sarai. The angel of the LORD sends her back. She bears Ishmael', note: 'Hagar was on the way to Shur (Gen 16:7).', moves: [
        { force: 'hagar', label: 'Hagar', path: ['mamre', 'lahairoi'], ref: 'Gen 16:6–14' },
      ] },
      { place: 'mamre', ref: 'Gen 17:1–27', event: 'God names Abram Abraham and Sarai Sarah. He gives the covenant of circumcision', span: 120, note: 'The text does not name the place. Abraham is 99 (Gen 17:1).' },
      { place: 'mamre', ref: 'Gen 18:1–33', event: 'Three men visit Abraham by the oaks of Mamre. Abraham pleads for Sodom', moves: [
        { force: 'angels', label: 'Two angels', path: ['mamre', 'sodom'], ref: 'Gen 18:16, 22; 19:1' },
      ] },
      { place: 'mamre', ref: 'Gen 19:24–29', event: 'The LORD destroys Sodom and Gomorrah. Abraham sees the smoke', moves: [
        { force: 'lot', label: 'Lot', path: ['sodom', 'zoar'], ref: 'Gen 19:15–23' },
      ] },
      { place: 'gerar', ref: 'Gen 20:1–18', event: 'Abraham lives in Gerar. Abimelech takes Sarah, then gives her back', span: 120 },
      { place: 'gerar', ref: 'Gen 21:1–7', event: 'Sarah bears Isaac. Abraham is 100', span: 120, note: 'The text does not name the place. Abraham lived in Gerar (Gen 20:1). Abraham circumcised Isaac on the eighth day (Gen 21:4; Acts 7:8).' },
      { place: 'gerar', ref: 'Gen 21:8–21', event: 'Abraham sends Hagar and Ishmael away', note: 'The text does not name the place.', moves: [
        { force: 'hagar', label: 'Hagar and Ishmael', path: ['gerar', 'beersheba', 'paran'], ref: 'Gen 21:14, 21' },
      ] },
      { place: 'beersheba', ref: 'Gen 21:22–34', event: 'Abraham and Abimelech make a covenant at the well. Abraham names the place Beersheba', span: 110 },
      { place: 'moriah', ref: 'Gen 22:1–14', event: 'God tests Abraham. Abraham binds Isaac. The LORD provides a ram', note: 'Abraham sees the place on the third day (Gen 22:4).', moves: [
        { force: 'abraham', label: 'Abraham and Isaac', path: ['beersheba', 'moriah'], ref: 'Gen 22:3–4' },
      ] },
      { place: 'beersheba', ref: 'Gen 22:15–19', event: 'The angel of the LORD repeats the promise. Abraham returns to Beersheba', span: 120 },
      { place: 'machpelah', ref: 'Gen 23:1–20', event: 'Sarah dies at Hebron. Abraham buys the cave of Machpelah and buries her', span: 100, note: 'Sarah died at Kiriath-arba, that is, Hebron (Gen 23:2). Acts 7:16 says Abraham bought a tomb in Shechem from the sons of Hamor. In Genesis, Abraham buys Machpelah from Ephron the Hittite (Gen 23:16), and Jacob buys land at Shechem from the sons of Hamor (Gen 33:19).' },
      { place: 'mamre', ref: 'Gen 24:1–67', event: 'Abraham sends his servant to the city of Nahor. The servant brings back Rebekah for Isaac', note: 'The text does not say where Abraham lived. The arrow starts at Mamre. Laban, the brother of Rebekah, lived in Haran (Gen 27:43).', moves: [
        { force: 'abraham', label: 'Servant', path: ['mamre', 'haran'], ref: 'Gen 24:10' },
        { force: 'abraham', label: 'Rebekah', path: ['haran', 'lahairoi'], ref: 'Gen 24:61–62' },
      ] },
      { place: 'machpelah', ref: 'Gen 25:7–10', event: 'Abraham dies at 175. Isaac and Ishmael bury him with Sarah', span: 100 },
    ],
    // Bend points are schematic. The text does not give the routes. The first
    // leg follows the Euphrates. The legs to and from Egypt pass the Negev.
    bends: {
      0: [[31.32, 45.27], [32.54, 44.42], [33.64, 42.83], [34.55, 40.89], [35.95, 39.01]],
      2: [[33.51, 36.29]],
      4: [[31.25, 34.84], [31.05, 33.8], [30.85, 32.6]],
      5: [[30.85, 32.6], [31.05, 33.8], [31.25, 34.84]],
    },
  },
  {
    id: 'movement',
    name: 'Exodus',
    sub: 'The Exodus and the wilderness',
    stops: [
      { place: 'rameses', ref: 'Exod 12:37', event: 'Israel leaves Rameses', span: 240 },
      { place: 'succoth', ref: 'Exod 12:37', event: 'Israel reaches Succoth', span: 240 },
      { place: 'crossing', ref: 'Exod 14:21–22', event: 'Israel crosses the sea', span: 260 },
      { place: 'marah', ref: 'Exod 15:23', event: 'Israel finds bitter water', span: 260 },
      { place: 'sinai', ref: 'Exod 19:1–2', event: 'Israel camps before the mountain', span: 300 },
      { place: 'kadesh', ref: 'Num 13:26', event: 'The spies return', span: 280 },
      { place: 'ezion', ref: 'Num 33:35–36', event: 'Israel camps at Ezion-geber', span: 260 },
      { place: 'nebo', ref: 'Deut 34:1', event: 'Moses views the land', span: 240 },
    ],
    // Bend points are schematic. They keep the route on land, except at the sea.
    bends: {
      1: [[30.48, 32.36], [29.93, 33.75], [29.2, 34.5], [28.98, 34.63]],
      2: [[28.97, 34.88]],
      4: [[29.6, 35.12]],
      6: [[30.35, 35.95]],
    },
  },
  {
    id: 'military',
    name: 'Conquest',
    sub: 'Battles from the Exodus to the conquest of Canaan',
    stops: [
      { place: 'crossing', ref: 'Exod 14:23–28', event: 'The sea covers the army of Pharaoh', span: 260 },
      { place: 'rephidim', ref: 'Exod 17:8–13', event: 'Joshua defeats Amalek', span: 240 },
      { place: 'hormah', ref: 'Num 14:40–45; Deut 1:41–44', event: 'Amalekites and Canaanites drive Israel back to Hormah', span: 200 },
      { place: 'kadesh', ref: 'Num 20:14–21', event: 'Edom comes out with an army and refuses passage', span: 220 },
      { place: 'arad', ref: 'Num 21:1–3', event: 'The king of Arad attacks. Israel destroys the cities', span: 160 },
      { place: 'heshbon', ref: 'Num 21:21–26; Deut 2:30–36', event: 'Israel defeats Sihon at Jahaz and takes Heshbon', span: 160 },
      { place: 'jazer', ref: 'Num 21:32', event: 'Israel takes the villages of Jazer', span: 120 },
      { place: 'edrei', ref: 'Num 21:33–35; Deut 3:1–3', event: 'Israel defeats Og, king of Bashan', span: 160 },
      { place: 'kenath', ref: 'Num 32:42', event: 'Nobah takes Kenath and its villages', span: 160 },
      { place: 'shittim', ref: 'Num 31:1–12; 33:49', event: 'The army returns to the camp from the war on Midian', span: 160 },
      { place: 'gilgal', ref: 'Josh 3:14–17; 4:19', event: 'Israel crosses the Jordan and camps at Gilgal', span: 110 },
      { place: 'jericho', ref: 'Josh 6:20–21', event: 'The wall falls. Israel takes the city', span: 90 },
      { place: 'ai', ref: 'Josh 7:2–5', event: 'The men of Ai drive Israel back', span: 90 },
      { place: 'ai', ref: 'Josh 8:1–29', event: 'Israel ambushes and burns Ai', span: 90 },
      { place: 'gibeon', ref: 'Josh 10:1–14', event: 'Israel defeats five Amorite kings. The sun stands still', span: 100 },
      { place: 'bethhoron', ref: 'Josh 10:10–11', event: 'Israel chases the enemy down the pass of Beth-horon', span: 100 },
      { place: 'azekah', ref: 'Josh 10:10–11', event: 'Hailstones fall on the enemy as far as Azekah', span: 100 },
      { place: 'makkedah', ref: 'Josh 10:16–28', event: 'The five kings are taken from the cave. Israel takes Makkedah', span: 100 },
      { place: 'libnah', ref: 'Josh 10:29–30', event: 'Israel takes Libnah', span: 100 },
      { place: 'lachish', ref: 'Josh 10:31–33', event: 'Israel takes Lachish and defeats Horam, king of Gezer', span: 100 },
      { place: 'eglon', ref: 'Josh 10:34–35', event: 'Israel takes Eglon', span: 100 },
      { place: 'hebron', ref: 'Josh 10:36–37', event: 'Israel takes Hebron', span: 100 },
      { place: 'debir', ref: 'Josh 10:38–39', event: 'Israel takes Debir', span: 100 },
      { place: 'gilgal', ref: 'Josh 10:43', event: 'Israel returns to the camp at Gilgal', span: 140 },
      { place: 'merom', ref: 'Josh 11:1–9', event: 'Israel defeats the kings with Jabin at the waters of Merom', span: 120 },
      { place: 'hazor', ref: 'Josh 11:10–11', event: 'Israel takes and burns Hazor', span: 120 },
      { place: 'hebron', ref: 'Josh 15:13–14', event: 'Caleb drives out the three sons of Anak', span: 110 },
      { place: 'debir', ref: 'Josh 15:15–17', event: 'Othniel takes Debir (Kiriath-sepher)', span: 100 },
      { place: 'dan', ref: 'Josh 19:47', event: 'The Danites take Leshem and name it Dan', span: 120 },
    ],
    // Israel goes around Edom (Num 21:4). Bend points are schematic. They keep
    // the route on land, except at the sea.
    bends: { 0: [[28.97, 34.88]], 4: [[29.57, 35.0], [30.35, 35.95]], 23: [[32.75, 35.49], [32.95, 35.52]] },
    zones: [
      { id: 'negev', name: 'Negev', ref: 'Num 14:45; 21:1–3', places: ['hormah', 'arad'], radius: 12 },
      { id: 'east', name: 'East of the Jordan', ref: 'Num 21; 31–32; Deut 2–3', places: ['heshbon', 'jazer', 'edrei', 'kenath', 'shittim'], radius: 12 },
      { id: 'central', name: 'Central campaign', ref: 'Josh 6–8', places: ['gilgal', 'jericho', 'ai'], radius: 9 },
      { id: 'south', name: 'Southern campaign', ref: 'Josh 10', places: ['gibeon', 'bethhoron', 'azekah', 'makkedah', 'libnah', 'lachish', 'eglon', 'hebron', 'debir'], radius: 9 },
      { id: 'north', name: 'Northern campaign', ref: 'Josh 11', places: ['merom', 'hazor'], radius: 12 },
    ],
    // Deuteronomy counts these peoples as Rephaim (Deut 2:11, 20; 3:11). Num 13:33 links the Anakim to the Nephilim.
    giants: [
      { id: 'anakim', name: 'Anakim', ref: 'Deut 1:24–28; 9:1–2', places: ['hebron'], radius: 16, note: 'Deut 1:24 names the valley of Eshcol. Num 13:22–23 places it at Hebron.' },
      { id: 'emim', name: 'Emim', ref: 'Deut 2:9–11', places: ['ar'], radius: 18, note: 'They lived in Moab. Ar is its named city.' },
      { id: 'zamzummim', name: 'Zamzummim', ref: 'Deut 2:19–21; 3:11', places: ['rabbah'], radius: 16, note: 'They lived in the land of Ammon. Rabbah is its named city.' },
      { id: 'rephaim', name: 'Rephaim of Bashan', ref: 'Deut 1:4; 3:1–13', places: ['ashtaroth', 'edrei', 'salecah'], radius: 12, note: 'Og, king of Bashan, was the last of the Rephaim. Bashan was called the land of the Rephaim.' },
    ],
  },
  {
    id: 'kings',
    name: 'Kings',
    sub: 'Battles of Saul and David, 1 Samuel 11 to 2 Samuel 23',
    route: false,
    stops: [
      // Saul
      { place: 'jabesh', ref: '1 Sam 11:1–11', event: 'Saul defeats Nahash and the Ammonites', moves: [
        { force: 'saul', label: 'Saul', path: ['bezek', 'jabesh'], ref: '1 Sam 11:8–11' },
      ] },
      { place: 'geba', ref: '1 Sam 13:2–3', event: 'Jonathan defeats the Philistine garrison at Geba', moves: [
        { force: 'saul', label: 'Jonathan', path: ['gibeah', 'geba'], ref: '1 Sam 13:2–3' },
      ] },
      { place: 'michmash', ref: '1 Sam 13:5–18', event: 'The Philistines camp at Michmash and send out raiders', moves: [
        { force: 'saul', label: 'Saul', path: ['michmash', 'gilgal', 'geba'], ref: '1 Sam 13:2–4, 15–16' },
        { force: 'foreign', label: 'Philistines', path: ['michmash', 'ophrah'], ref: '1 Sam 13:17' },
        { force: 'foreign', label: 'Philistines', path: ['michmash', 'bethhoron'], ref: '1 Sam 13:18' },
      ] },
      { place: 'michmash', ref: '1 Sam 14:1–23', event: 'Jonathan attacks the garrison. Israel routs the Philistines', moves: [
        { force: 'saul', label: 'Israel', path: ['michmash', 'aijalon'], ref: '1 Sam 14:31' },
      ] },
      { place: 'amalek', ref: '1 Sam 15:1–9', event: 'Saul defeats the Amalekites and spares Agag', moves: [
        { force: 'saul', label: 'Saul', path: ['amalek', 'carmel', 'gilgal'], ref: '1 Sam 15:12' },
      ] },
      { place: 'elah', ref: '1 Sam 17:1–51', event: 'David kills Goliath', moves: [
        { force: 'saul', label: 'Israel', path: ['elah', 'gath'], ref: '1 Sam 17:52' },
        { force: 'saul', label: 'Israel', path: ['elah', 'ekron'], ref: '1 Sam 17:52' },
      ] },
      { place: 'keilah', ref: '1 Sam 23:1–5', event: 'David saves Keilah from the Philistines', span: 90 },
      { place: 'maon', ref: '1 Sam 23:24–28', event: 'Saul closes in on David. A Philistine raid calls him away', moves: [
        { force: 'saul', label: 'Saul', path: ['gibeah', 'maon'], ref: '1 Sam 23:19–25' },
        { force: 'david', label: 'David', path: ['ziph', 'maon'], ref: '1 Sam 23:15, 24–25' },
      ] },
      { place: 'engedi', ref: '1 Sam 24:1–2', event: 'Saul takes 3,000 men to look for David', moves: [
        { force: 'david', label: 'David', path: ['maon', 'engedi'], ref: '1 Sam 23:29' },
      ] },
      { place: 'ziph', ref: '1 Sam 26:1–2', event: 'Saul takes 3,000 men to the wilderness of Ziph', moves: [
        { force: 'saul', label: 'Saul', path: ['gibeah', 'ziph'], ref: '1 Sam 26:1–2' },
      ] },
      { place: 'ziklag', ref: '1 Sam 27:6–9', event: 'David raids the Geshurites, Girzites and Amalekites', span: 130 },
      { place: 'aphek', ref: '1 Sam 29:1–11', event: 'The Philistines gather at Aphek. Their lords send David back', moves: [
        { force: 'david', label: 'David', path: ['aphek', 'ziklag'], ref: '1 Sam 29:11; 30:1' },
      ] },
      { place: 'ziklag', ref: '1 Sam 30:1–6', event: 'Amalekites burn Ziklag and take its people', span: 110 },
      { place: 'besor', ref: '1 Sam 30:9–20', event: 'David pursues the Amalekites and takes back all they took', moves: [
        { force: 'david', label: 'David', path: ['ziklag', 'besor'], ref: '1 Sam 30:9–10' },
      ] },
      { place: 'gilboa', ref: '1 Sam 31:1–6', event: 'The Philistines defeat Israel. Saul and his sons die', moves: [
        { force: 'foreign', label: 'Philistines', path: ['aphek', 'shunem', 'gilboa'], ref: '1 Sam 28:4; 29:1; 31:1' },
      ] },
      { place: 'bethshan', ref: '1 Sam 31:8–13', event: 'The Philistines hang Saul’s body on the wall. The men of Jabesh take it at night', moves: [
        { force: 'saul', label: 'Men of Jabesh', path: ['jabesh', 'bethshan'], ref: '1 Sam 31:11–12' },
      ] },
      // David
      { place: 'gibeon', ref: '2 Sam 2:12–17', event: 'Joab’s men defeat Abner’s men at the pool of Gibeon', moves: [
        { force: 'saul', label: 'Abner', path: ['mahanaim', 'gibeon'], ref: '2 Sam 2:12' },
        { force: 'david', label: 'Joab', path: ['hebron', 'gibeon'], ref: '2 Sam 2:11–13' },
      ] },
      { place: 'jerusalem', ref: '2 Sam 5:6–9', event: 'David takes the stronghold of Zion from the Jebusites', moves: [
        { force: 'david', label: 'David', path: ['hebron', 'jerusalem'], ref: '2 Sam 5:5–6' },
      ] },
      { place: 'rephaim', ref: '2 Sam 5:17–21', event: 'David defeats the Philistines at Baal-perazim', span: 70, note: 'Baal-perazim is not identified. The Philistines spread out in the Valley of Rephaim (2 Sam 5:18).' },
      { place: 'bethlehem', ref: '2 Sam 23:13–17', event: 'Three mighty men break through the Philistine camp for water', note: 'Scripture does not date this event. The setting matches 2 Sam 5:17–18.', moves: [
        { force: 'david', label: 'Three mighty men', path: ['adullam', 'bethlehem'], ref: '2 Sam 23:13–16' },
      ] },
      { place: 'rephaim', ref: '2 Sam 5:22–25', event: 'David strikes the Philistines from Geba to Gezer', moves: [
        { force: 'david', label: 'David', path: ['geba', 'gezer'], ref: '2 Sam 5:25' },
      ] },
      { place: 'moab', ref: '2 Sam 8:2', event: 'David defeats Moab', span: 160 },
      { place: 'damascus', ref: '2 Sam 8:3–8', event: 'David defeats Hadadezer and the Arameans of Damascus', span: 160 },
      { place: 'salt', ref: '2 Sam 8:13–14; 1 Kgs 11:15–16', event: 'David strikes 18,000 in the Valley of Salt and puts garrisons in Edom', span: 160 },
      { place: 'rabbah', ref: '2 Sam 10:6–14', event: 'Joab and Abishai defeat the Ammonites and the Arameans', note: 'The battle was at the gate of the Ammonite city (2 Sam 10:8, 14). The text does not name it.', moves: [
        { force: 'david', label: 'Joab', path: ['jerusalem', 'rabbah'], ref: '2 Sam 10:7–9' },
      ] },
      { place: 'helam', ref: '2 Sam 10:15–19', event: 'David defeats Shobach and the Arameans at Helam', moves: [
        { force: 'david', label: 'David', path: ['jerusalem', 'helam'], ref: '2 Sam 10:17' },
      ] },
      { place: 'rabbah', ref: '2 Sam 11:1, 14–17', event: 'Joab besieges Rabbah. Uriah dies at the wall', moves: [
        { force: 'david', label: 'Joab', path: ['jerusalem', 'rabbah'], ref: '2 Sam 11:1' },
      ] },
      { place: 'rabbah', ref: '2 Sam 12:26–31', event: 'David takes Rabbah', moves: [
        { force: 'david', label: 'David', path: ['jerusalem', 'rabbah'], ref: '2 Sam 12:29' },
      ] },
      { place: 'hebron', ref: '2 Sam 15:7–12', event: 'Absalom is made king at Hebron', moves: [
        { force: 'revolt', label: 'Absalom', path: ['jerusalem', 'hebron'], ref: '2 Sam 15:7–9' },
      ] },
      { place: 'mahanaim', ref: '2 Sam 15:14; 17:22–24', event: 'David leaves Jerusalem and crosses the Jordan to Mahanaim', moves: [
        { force: 'david', label: 'David', path: ['jerusalem', 'olives', 'mahanaim'], ref: '2 Sam 15:30; 17:22–24' },
        { force: 'revolt', label: 'Absalom', path: ['hebron', 'jerusalem'], ref: '2 Sam 15:37; 16:15' },
      ] },
      { place: 'ephraim', ref: '2 Sam 18:1–15', event: 'David’s men defeat Absalom’s army. Absalom dies', moves: [
        { force: 'david', label: 'Joab, Abishai, Ittai', path: ['mahanaim', 'ephraim'], ref: '2 Sam 18:1–6' },
        { force: 'revolt', label: 'Absalom', path: ['jerusalem', 'ephraim'], ref: '2 Sam 17:24–26; 18:6' },
      ] },
      { place: 'gibeon', ref: '2 Sam 20:8–10', event: 'Joab kills Amasa at the great stone in Gibeon', moves: [
        { force: 'david', label: 'Joab and Abishai', path: ['jerusalem', 'gibeon'], ref: '2 Sam 20:7–8' },
      ] },
      { place: 'abel', ref: '2 Sam 20:14–22', event: 'Joab besieges Abel Beth-maacah. The city gives up Sheba', moves: [
        { force: 'david', label: 'Joab', path: ['gibeon', 'abel'], ref: '2 Sam 20:10, 14–15' },
      ] },
      { place: 'gath', ref: '2 Sam 21:15–22', event: 'David’s men kill four descendants of the giant', span: 100, note: 'Two of the battles were at Gob (2 Sam 21:18–19), which is not identified. One was at Gath (2 Sam 21:20).' },
    ],
    giants: [
      { id: 'rapha', name: 'Sons of the giant', ref: '2 Sam 21:15–22', places: ['gath'], radius: 14, note: 'Goliath was from Gath (1 Sam 17:4). The four men were born to the giant in Gath (2 Sam 21:22).' },
    ],
  },
  {
    id: 'ministry',
    name: 'Jesus',
    sub: 'Selected stops in the ministry of Jesus',
    stops: [
      { place: 'nazareth', ref: 'Luke 4:16', event: 'Reads in the synagogue', span: 120 },
      { place: 'baptism', ref: 'Matt 3:13', event: 'Is baptized by John', span: 110 },
      { place: 'cana', ref: 'John 2:1–11', event: 'Turns water into wine', span: 90 },
      { place: 'capernaum', ref: 'Matt 4:13', event: 'Settles in the town', span: 90 },
      { place: 'tyre', ref: 'Matt 15:21', event: 'Withdraws to the region of Tyre', span: 130 },
      { place: 'caesarea', ref: 'Matt 16:13', event: 'Asks who people say he is', span: 90 },
      { place: 'capernaum', ref: 'Matt 17:24', event: 'Returns to the town', span: 90 },
      { place: 'sychar', ref: 'John 4:5', event: 'Speaks with a Samaritan woman', span: 130 },
      { place: 'bethany', ref: 'John 11:1', event: 'Raises Lazarus', span: 100 },
      { place: 'jerusalem', ref: 'Matt 21:1–11', event: 'Enters the city', span: 100 },
    ],
    // Bend points are schematic. They keep the route off the Sea of Galilee.
    bends: {
      2: [[32.86, 35.49], [32.885, 35.55]],
      3: [[32.9, 35.565], [33.25, 35.24]],
      4: [[33.28, 35.24]],
      5: [[32.9, 35.58]],
      6: [[32.885, 35.55], [32.84, 35.48]],
    },
  },
  {
    id: 'pentecost',
    name: 'Pentecost',
    sub: 'The nations at Pentecost, Acts 1 and 2',
    route: false,
    terms: { one: 'Place', many: 'places', hint: 'Scroll to follow the nations.' },
    stops: [
      { place: 'jerusalem', ref: 'Acts 1:4–8', event: 'Jesus tells the apostles to wait in Jerusalem for the promise of the Father. They will be his witnesses in Jerusalem, Judea, Samaria and to the end of the earth', span: 120 },
      { place: 'olives', ref: 'Acts 1:9–12', event: 'Jesus is lifted up and a cloud takes him from their sight. The apostles return to Jerusalem from the mount called Olivet', span: 100, note: 'Olivet is a Sabbath day’s journey from Jerusalem (Acts 1:12).' },
      { place: 'jerusalem', ref: 'Acts 1:13–14', event: 'The apostles go to the upper room. They devote themselves to prayer with the women, Mary the mother of Jesus and his brothers', span: 100 },
      { place: 'jerusalem', ref: 'Acts 1:15–26', event: 'About 120 believers are gathered. The lot falls on Matthias, who is added to the eleven apostles', span: 100 },
      { place: 'jerusalem', ref: 'Acts 2:1–4', event: 'On the day of Pentecost they are all together in one place. Tongues like fire rest on each of them. They are filled with the Holy Spirit and speak in other tongues', span: 100 },
      { place: 'jerusalem', ref: 'Acts 2:5–8', event: 'Devout Jews from every nation under heaven are living in Jerusalem. Each hears the disciples speak in his own language', span: 100 },
      { place: 'parthia', ref: 'Acts 2:9', event: 'Parthians are in the crowd', span: 1000 },
      { place: 'madai', ref: 'Acts 2:9', event: 'Medes are in the crowd', span: 700 },
      { place: 'elam', ref: 'Acts 2:9', event: 'Elamites are in the crowd', span: 600 },
      { place: 'mesopotamia', ref: 'Acts 2:9', event: 'Residents of Mesopotamia are in the crowd', span: 700 },
      { place: 'judea', ref: 'Acts 2:9', event: 'Residents of Judea are in the crowd', span: 300 },
      { place: 'cappadocia', ref: 'Acts 2:9', event: 'Residents of Cappadocia are in the crowd', span: 600 },
      { place: 'pontus', ref: 'Acts 2:9', event: 'Residents of Pontus are in the crowd', span: 600 },
      { place: 'asia', ref: 'Acts 2:9', event: 'Residents of Asia are in the crowd', span: 600 },
      { place: 'phrygia', ref: 'Acts 2:10', event: 'Residents of Phrygia are in the crowd', span: 600 },
      { place: 'pamphylia', ref: 'Acts 2:10', event: 'Residents of Pamphylia are in the crowd', span: 600 },
      { place: 'egypt', ref: 'Acts 2:10', event: 'Residents of Egypt are in the crowd', span: 700 },
      { place: 'cyrene', ref: 'Acts 2:10', event: 'Residents of the parts of Libya belonging to Cyrene are in the crowd', span: 700 },
      { place: 'rome', ref: 'Acts 2:10', event: 'Visitors from Rome are in the crowd, both Jews and proselytes', span: 800 },
      { place: 'crete', ref: 'Acts 2:11', event: 'Cretans are in the crowd', span: 500 },
      { place: 'arabia', ref: 'Acts 2:11', event: 'Arabians are in the crowd. All of them hear the mighty works of God in their own tongues', span: 800 },
      { place: 'jerusalem', ref: 'Acts 2:14–41', event: 'Peter stands with the eleven and speaks to the crowd. About 3,000 people receive his word and are baptized', span: 100 },
    ],
  },
  {
    id: 'paul',
    name: 'Paul',
    sub: 'The journeys of Paul in Acts, with the voyage to Rome',
    stops: [
      { place: 'antioch', ref: 'Acts 13:1–3', event: 'The church sets Barnabas and Saul apart. They go out with John Mark', span: 200, journey: 'First journey' },
      { place: 'seleucia', ref: 'Acts 13:4', event: 'They go down to Seleucia and sail to Cyprus', span: 250, journey: 'First journey' },
      { place: 'salamis', ref: 'Acts 13:5', event: 'They preach in the synagogues', span: 250, journey: 'First journey' },
      { place: 'paphos', ref: 'Acts 13:6–12', event: 'The proconsul Sergius Paulus believes. Elymas is struck blind', span: 250, journey: 'First journey' },
      { place: 'perga', ref: 'Acts 13:13', event: 'They sail to Perga. John Mark leaves them', span: 250, journey: 'First journey' },
      { place: 'pisantioch', ref: 'Acts 13:14–52', event: 'Paul preaches in the synagogue. The Jews drive them out', span: 250, journey: 'First journey' },
      { place: 'iconium', ref: 'Acts 13:51–14:6', event: 'A great number believe. They flee a plot to stone them', span: 250, journey: 'First journey' },
      { place: 'lystra', ref: 'Acts 14:6–20', event: 'Paul heals a man lame from birth. The crowd stones Paul', span: 200, journey: 'First journey' },
      { place: 'derbe', ref: 'Acts 14:20–21', event: 'They preach the gospel and make many disciples', span: 250, journey: 'First journey' },
      { place: 'pisantioch', ref: 'Acts 14:21–23', event: 'They return through Lystra, Iconium and Antioch. They appoint elders in every church', span: 250, journey: 'First journey' },
      { place: 'perga', ref: 'Acts 14:24–25', event: 'They pass through Pisidia and Pamphylia and speak the word in Perga', span: 250, journey: 'First journey' },
      { place: 'attalia', ref: 'Acts 14:25', event: 'They go down to Attalia', span: 250, journey: 'First journey' },
      { place: 'antioch', ref: 'Acts 14:26–28', event: 'They sail back to Antioch and report all that God had done', span: 200, journey: 'First journey' },
      { place: 'jerusalem', ref: 'Acts 15:1–29', event: 'Paul and Barnabas go up to Jerusalem. The apostles and elders decide that Gentiles need not be circumcised', span: 200, journey: 'Between journeys' },
      { place: 'antioch', ref: 'Acts 15:30–40', event: 'Paul and Barnabas part over John Mark. Paul chooses Silas', span: 200, journey: 'Second journey' },
      { place: 'tarsus', ref: 'Acts 15:41', event: 'Paul goes through Syria and Cilicia and strengthens the churches', span: 300, journey: 'Second journey' },
      { place: 'derbe', ref: 'Acts 16:1', event: 'Paul comes to Derbe and Lystra', span: 250, journey: 'Second journey' },
      { place: 'lystra', ref: 'Acts 16:1–5', event: 'Paul takes Timothy with him. The churches grow in number daily', span: 200, journey: 'Second journey' },
      { place: 'troas', ref: 'Acts 16:6–10', event: 'The Holy Spirit forbids them to speak in Asia. In a vision a man of Macedonia calls Paul', span: 300, journey: 'Second journey' },
      { place: 'samothrace', ref: 'Acts 16:11', event: 'They sail from Troas straight to Samothrace', span: 300, journey: 'Second journey' },
      { place: 'neapolis', ref: 'Acts 16:11', event: 'They come the next day to Neapolis', span: 200, journey: 'Second journey' },
      { place: 'philippi', ref: 'Acts 16:12–40', event: 'Lydia believes. Paul and Silas are beaten and jailed. The jailer believes', span: 200, journey: 'Second journey' },
      { place: 'thessalonica', ref: 'Acts 17:1–9', event: 'Paul reasons in the synagogue for three Sabbaths. A mob attacks the house of Jason', span: 250, journey: 'Second journey' },
      { place: 'berea', ref: 'Acts 17:10–14', event: 'The Jews of Berea examine the Scriptures daily. Jews from Thessalonica stir up the crowds', span: 200, journey: 'Second journey' },
      { place: 'athens', ref: 'Acts 17:15–34', event: 'Paul speaks to the Areopagus. Some men join him and believe', span: 250, journey: 'Second journey' },
      { place: 'corinth', ref: 'Acts 18:1–17', event: 'Paul stays a year and a half. He lives with Aquila and Priscilla', span: 250, journey: 'Second journey' },
      { place: 'cenchreae', ref: 'Acts 18:18', event: 'Paul cuts his hair at Cenchreae because of a vow', span: 200, journey: 'Second journey' },
      { place: 'ephesus', ref: 'Acts 18:19–21', event: 'Paul reasons in the synagogue. He promises to return', span: 250, journey: 'Second journey' },
      { place: 'caesareamar', ref: 'Acts 18:22', event: 'Paul lands at Caesarea', span: 300, journey: 'Second journey' },
      { place: 'jerusalem', ref: 'Acts 18:22', event: 'Paul goes up and greets the church', span: 250, journey: 'Second journey' },
      { place: 'antioch', ref: 'Acts 18:22', event: 'Paul goes down to Antioch', span: 300, journey: 'Second journey' },
      { place: 'antioch', ref: 'Acts 18:23', event: 'Paul spends some time in Antioch. He then goes through Galatia and Phrygia and strengthens the disciples', span: 350, journey: 'Third journey' },
      { place: 'ephesus', ref: 'Acts 19:1–41', event: 'Paul stays more than two years. All Asia hears the word. A riot fills the theater', span: 250, journey: 'Third journey' },
      { place: 'macedonia', ref: 'Acts 20:1–2', event: 'Paul says farewell and goes to Macedonia. He encourages the believers', span: 300, journey: 'Third journey' },
      { place: 'corinth', ref: 'Acts 20:2–3', event: 'Paul spends three months in Greece', span: 250, journey: 'Third journey' },
      { place: 'philippi', ref: 'Acts 20:3–6', event: 'Paul returns through Macedonia and sails from Philippi after the days of Unleavened Bread', span: 250, journey: 'Third journey' },
      { place: 'troas', ref: 'Acts 20:6–12', event: 'Paul speaks until midnight. Eutychus falls from the window and Paul raises him', span: 250, journey: 'Third journey' },
      { place: 'assos', ref: 'Acts 20:13–14', event: 'Paul goes on foot to Assos and joins the ship', span: 200, journey: 'Third journey' },
      { place: 'miletus', ref: 'Acts 20:15–38', event: 'Paul calls the Ephesian elders and bids them farewell', span: 250, journey: 'Third journey' },
      { place: 'patara', ref: 'Acts 21:1–2', event: 'They sail by Cos and Rhodes to Patara and board a ship for Phoenicia', span: 350, journey: 'Third journey' },
      { place: 'tyre', ref: 'Acts 21:3–6', event: 'The ship unloads at Tyre. The disciples there urge Paul not to go up to Jerusalem', span: 300, journey: 'Third journey' },
      { place: 'ptolemais', ref: 'Acts 21:7', event: 'They greet the brothers and stay one day', span: 200, journey: 'Third journey' },
      { place: 'caesareamar', ref: 'Acts 21:8–14', event: 'Paul stays with Philip the evangelist. Agabus foretells that Paul will be bound in Jerusalem', span: 200, journey: 'Third journey' },
      { place: 'jerusalem', ref: 'Acts 21:15–17', event: 'The brothers receive Paul gladly', span: 200, journey: 'Third journey' },
      { place: 'jerusalem', ref: 'Acts 21:27–23:30', event: 'A mob seizes Paul in the temple. The Roman tribune takes him into custody', span: 200, journey: 'Journey to Rome' },
      { place: 'caesareamar', ref: 'Acts 23:31–26:32', event: 'Paul is held two years. He appeals to Caesar', span: 250, journey: 'Journey to Rome' },
      { place: 'sidon', ref: 'Acts 27:1–3', event: 'The ship lands at Sidon. Julius lets Paul visit his friends', span: 300, journey: 'Journey to Rome' },
      { place: 'myra', ref: 'Acts 27:4–6', event: 'They sail under the lee of Cyprus. At Myra they board a ship of Alexandria bound for Italy', span: 400, journey: 'Journey to Rome' },
      { place: 'cnidus', ref: 'Acts 27:7', event: 'They sail slowly and reach Cnidus with difficulty', span: 350, journey: 'Journey to Rome' },
      { place: 'fairhavens', ref: 'Acts 27:8–12', event: 'They sail along Crete to Fair Havens. Paul warns against going on', span: 350, journey: 'Journey to Rome' },
      { place: 'cauda', ref: 'Acts 27:13–17', event: 'A northeaster seizes the ship. It runs under the lee of Cauda', span: 400, journey: 'Journey to Rome' },
      { place: 'malta', ref: 'Acts 27:18–28:10', event: 'After fourteen days the ship runs aground. All 276 reach land. They winter on the island', span: 350, journey: 'Journey to Rome' },
      { place: 'syracuse', ref: 'Acts 28:11–12', event: 'They sail in a ship of Alexandria and stay three days at Syracuse', span: 450, journey: 'Journey to Rome' },
      { place: 'rhegium', ref: 'Acts 28:13', event: 'They sail around to Rhegium', span: 350, journey: 'Journey to Rome' },
      { place: 'puteoli', ref: 'Acts 28:13–14', event: 'They find brothers at Puteoli and stay seven days', span: 300, journey: 'Journey to Rome' },
      { place: 'rome', ref: 'Acts 28:14–31', event: 'Paul lives two years in his own rented house. He welcomes all and preaches the kingdom of God', span: 250, journey: 'Journey to Rome' },
    ],
  },
]

// Paul crosses Asia between Lystra and Troas (Acts 16:6–8). The route runs through the seven churches
// of Revelation 2–3. Acts does not name them, so they are not stops.
const paul = FAMILIES.find((f) => f.id === 'paul')!
paul.via = {
  [paul.stops.findIndex((s, i) => s.place === 'lystra' && paul.stops[i + 1]?.place === 'troas')]: [
    { place: 'laodicea', ref: 'Rev 3:14–22' },
    { place: 'philadelphia', ref: 'Rev 3:7–13' },
    { place: 'ephesus', ref: 'Rev 2:1–7' },
    { place: 'smyrna', ref: 'Rev 2:8–11' },
    { place: 'sardis', ref: 'Rev 3:1–6' },
    { place: 'thyatira', ref: 'Rev 2:18–29' },
    { place: 'pergamum', ref: 'Rev 2:12–17' },
  ],
}

export const familyById = (id: FamilyId) => FAMILIES.find((f) => f.id === id)!
