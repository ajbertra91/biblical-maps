// Site coordinates come from Wikidata (P625) unless a note says otherwise.
// Many biblical sites are debated. `confidence` records that. Scripture
// references are for each stop; verify against your translation before use.

export type FamilyId = 'abraham' | 'ministry' | 'movement' | 'military' | 'kings'
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
  note?: string
}

export interface Family {
  id: FamilyId
  name: string
  sub: string
  stops: Stop[]
  /** False when the stops are separate events, not one journey. No line joins them. */
  route?: false
  /** Unlabeled bend points as [lat, lon], keyed by the leg index they bend. */
  bends?: Record<number, [number, number][]>
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
  beersheba: { id: 'beersheba', name: 'Beersheba', lat: 31.2447, lon: 34.8408, confidence: 'identified', note: 'Tel Be\'er Sheva.', source: 'Q534596' },
}

export const FAMILIES: Family[] = [
  {
    id: 'abraham',
    name: 'Abraham',
    sub: 'The life of Abraham, Genesis 11 to 25',
    stops: [
      { place: 'ur', ref: 'Gen 11:27–31', event: 'Terah takes Abram, Sarai and Lot from Ur to go to Canaan', span: 620, note: 'God brought Abram out from Ur (Gen 15:7). Acts 7:2–4 says God appeared to him in Mesopotamia, before he lived in Haran.' },
      { place: 'haran', ref: 'Gen 11:31–32', event: 'They settle in Haran. Terah dies there', span: 300 },
      { place: 'haran', ref: 'Gen 12:1–5', event: 'The LORD calls Abram. At 75 he leaves Haran with Sarai, Lot and their people', span: 300 },
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
      { place: 'mamre', ref: 'Gen 15:1–21', event: 'The LORD makes a covenant with Abram. He promises the land from the river of Egypt to the Euphrates', span: 900, note: 'The text does not name the place. Abram lived by the oaks of Mamre (Gen 14:13).' },
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
      { place: 'gerar', ref: 'Gen 21:1–7', event: 'Sarah bears Isaac. Abraham is 100', span: 120, note: 'The text does not name the place. Abraham lived in Gerar (Gen 20:1).' },
      { place: 'gerar', ref: 'Gen 21:8–21', event: 'Abraham sends Hagar and Ishmael away', note: 'The text does not name the place.', moves: [
        { force: 'hagar', label: 'Hagar and Ishmael', path: ['gerar', 'beersheba', 'paran'], ref: 'Gen 21:14, 21' },
      ] },
      { place: 'beersheba', ref: 'Gen 21:22–34', event: 'Abraham and Abimelech make a covenant at the well. Abraham names the place Beersheba', span: 110 },
      { place: 'moriah', ref: 'Gen 22:1–14', event: 'God tests Abraham. Abraham binds Isaac. The LORD provides a ram', note: 'Abraham sees the place on the third day (Gen 22:4).', moves: [
        { force: 'abraham', label: 'Abraham and Isaac', path: ['beersheba', 'moriah'], ref: 'Gen 22:3–4' },
      ] },
      { place: 'beersheba', ref: 'Gen 22:15–19', event: 'The angel of the LORD repeats the promise. Abraham returns to Beersheba', span: 120 },
      { place: 'machpelah', ref: 'Gen 23:1–20', event: 'Sarah dies at Hebron. Abraham buys the cave of Machpelah and buries her', span: 100, note: 'Sarah died at Kiriath-arba, that is, Hebron (Gen 23:2).' },
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
    name: 'Ministry',
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
]

export const familyById = (id: FamilyId) => FAMILIES.find((f) => f.id === id)!
