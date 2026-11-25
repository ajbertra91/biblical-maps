// The early church, from the apostles to about 500 CE.
// Site coordinates come from Wikidata (P625) unless a note says otherwise.
// Stops after Acts cite early writers. `basis` records how each stop is known:
// Scripture, an early record, or a later tradition. Most accounts of where
// the Twelve went come from later tradition. Dates are often approximate.
import type { Family, Place, Stop } from './places'

export const CHURCH_PLACES: Record<string, Place> = {
  patmos: { id: 'patmos', name: 'Patmos', lat: 37.325, lon: 26.5417, confidence: 'identified', source: 'Q190053' },
  patras: { id: 'patras', name: 'Patrae', lat: 38.2464, lon: 21.7349, confidence: 'identified', note: 'Modern Patras.', source: 'Q133123' },
  edessa: { id: 'edessa', name: 'Edessa', lat: 37.15, lon: 38.7825, confidence: 'identified', note: 'Modern Şanlıurfa.', source: 'Q1190403' },
  mylapore: { id: 'mylapore', name: 'Mylapore', lat: 13.0368, lon: 80.2676, confidence: 'traditional', note: 'Now part of Chennai. The traditional tomb of Thomas is at San Thome.', source: 'Q1646915' },
  muziris: { id: 'muziris', name: 'Muziris', lat: 10.22, lon: 76.22, confidence: 'traditional', note: 'The Roman trade port on the Malabar coast. The point is Kodungallur, near the proposed site at Pattanam.', source: 'Q1006282' },
  taxila: { id: 'taxila', name: 'Taxila', lat: 33.7458, lon: 72.7875, confidence: 'identified', note: 'A city of the Indo-Parthian king Gondophares, whom the Acts of Thomas name.', source: 'Q156093' },
  hierapolis: { id: 'hierapolis', name: 'Hierapolis', lat: 37.925, lon: 29.1258, confidence: 'identified', note: 'Near modern Pamukkale. Col 4:13 names a church there.', source: 'Q7428276' },
  alexandria: { id: 'alexandria', name: 'Alexandria', lat: 31.1975, lon: 29.8925, confidence: 'identified', source: 'Q87' },
  lyon: { id: 'lyon', name: 'Lugdunum', lat: 45.7675, lon: 4.835, confidence: 'identified', note: 'Modern Lyon.', source: 'Q456' },
  carthage: { id: 'carthage', name: 'Carthage', lat: 36.8526, lon: 10.3235, confidence: 'identified', source: 'Q6343' },
  pella: { id: 'pella', name: 'Pella', lat: 32.45, lon: 35.6167, confidence: 'identified', note: 'Pella of the Decapolis, modern Tabaqat Fahl in Jordan.', source: 'Q167993' },
  flavia: { id: 'flavia', name: 'Flavia Neapolis', lat: 32.2211, lon: 35.2608, confidence: 'identified', note: 'Modern Nablus, near ancient Shechem.', source: 'Q214178', labelLeft: true },
  neocaesarea: { id: 'neocaesarea', name: 'Neocaesarea', lat: 40.5833, lon: 36.9667, confidence: 'identified', note: 'Modern Niksar.', source: 'Q513980' },
  colzim: { id: 'colzim', name: 'Mount Colzim', lat: 28.9239, lon: 32.35, confidence: 'traditional', note: 'The Monastery of Saint Anthony stands below the cave where he lived.', source: 'Q2088356' },
  vagharshapat: { id: 'vagharshapat', name: 'Vagharshapat', lat: 40.1728, lon: 44.2925, confidence: 'identified', note: 'Etchmiadzin. The Armenian royal city.', source: 'Q183394' },
  nicaea: { id: 'nicaea', name: 'Nicaea', lat: 40.4289, lon: 29.7194, confidence: 'identified', note: 'Modern İznik.', source: 'Q217125' },
  trier: { id: 'trier', name: 'Augusta Treverorum', lat: 49.7557, lon: 6.6394, confidence: 'identified', note: 'Modern Trier. An imperial city on the Moselle.', source: 'Q3138' },
  aksum: { id: 'aksum', name: 'Aksum', lat: 14.1167, lon: 38.7333, confidence: 'identified', note: 'The royal city of the kingdom of Aksum.', source: 'Q5832' },
  nisibis: { id: 'nisibis', name: 'Nisibis', lat: 37.0833, lon: 41.2167, confidence: 'identified', note: 'Modern Nusaybin.', source: 'Q1553052' },
  tabennisi: { id: 'tabennisi', name: 'Tabennisi', lat: 26.0997, lon: 32.3802, confidence: 'traditional', note: 'In Upper Egypt, near Dendera.', source: 'Q2478752' },
  mazaca: { id: 'mazaca', name: 'Caesarea in Cappadocia', lat: 38.7225, lon: 35.4875, confidence: 'identified', note: 'Mazaca, modern Kayseri.', source: 'Q48338' },
  nazianzus: { id: 'nazianzus', name: 'Nazianzus', lat: 38.3944, lon: 34.3814, confidence: 'identified', source: 'Q1336978' },
  constantinople: { id: 'constantinople', name: 'Constantinople', lat: 41.0122, lon: 28.976, confidence: 'identified', note: 'Byzantium, refounded by Constantine in 330. Modern Istanbul.', source: 'Q16869' },
  milan: { id: 'milan', name: 'Mediolanum', lat: 45.4669, lon: 9.19, confidence: 'identified', note: 'Modern Milan. An imperial city in the 4th century.', source: 'Q490' },
  tours: { id: 'tours', name: 'Tours', lat: 47.3928, lon: 0.6883, confidence: 'identified', source: 'Q288' },
  comana: { id: 'comana', name: 'Comana', lat: 40.3574, lon: 36.6386, confidence: 'identified', note: 'Comana Pontica, near modern Tokat.', source: 'Q2140586' },
  thagaste: { id: 'thagaste', name: 'Thagaste', lat: 36.2864, lon: 7.9511, confidence: 'identified', note: 'Modern Souk Ahras, Algeria.', source: 'Q1324444' },
  hippo: { id: 'hippo', name: 'Hippo Regius', lat: 36.8825, lon: 7.75, confidence: 'identified', note: 'Modern Annaba, Algeria.', source: 'Q858024' },
  armagh: { id: 'armagh', name: 'Armagh', lat: 54.3494, lon: -6.6544, confidence: 'traditional', note: 'Tradition makes Armagh the church of Patrick. His own writings name no place in Ireland.', source: 'Q193452' },
  chalcedon: { id: 'chalcedon', name: 'Chalcedon', lat: 40.9833, lon: 29.0333, confidence: 'identified', note: 'Modern Kadıköy, across the Bosporus from Constantinople.', source: 'Q337381', labelLeft: true },
  telanissos: { id: 'telanissos', name: 'Telanissos', lat: 36.3342, lon: 36.8442, confidence: 'identified', note: 'The pillar stood where the Church of Saint Simeon, Qal\'at Sim\'an, was later built.', source: 'Q1112125' },
  mtskheta: { id: 'mtskheta', name: 'Mtskheta', lat: 41.8431, lon: 44.7194, confidence: 'identified', note: 'The royal city of Iberia, in modern Georgia.', source: 'Q180810' },
  nicopolis: { id: 'nicopolis', name: 'Nicopolis ad Istrum', lat: 43.2172, lon: 25.6111, confidence: 'identified', note: 'In modern Bulgaria.', source: 'Q1987323' },
  reims: { id: 'reims', name: 'Reims', lat: 49.2653, lon: 4.0286, confidence: 'identified', source: 'Q41876' },
  subiaco: { id: 'subiaco', name: 'Subiaco', lat: 41.9333, lon: 13.1, confidence: 'identified', source: 'Q243467' },
  scythia: { id: 'scythia', name: 'Scythia', lat: 44.6, lon: 28.4, confidence: 'debated', schematic: true, note: 'Origen names Scythia. Romanian tradition puts Andrew in Scythia Minor, the Dobruja, near Tomis. Others place Scythia on the steppe north of the Black Sea. The point is schematic.' },
  albanopolis: { id: 'albanopolis', name: 'Albanopolis', lat: 38.145, lon: 44.2101, confidence: 'debated', note: 'The site of Albanopolis is not known. The point is the Monastery of Saint Bartholomew near Başkale, which Armenian tradition built over his tomb. Other traditions place Albanopolis near Derbent.', source: 'Q3119445' },
  persia: { id: 'persia', name: 'Persia', lat: 32.0, lon: 52.5, confidence: 'debated', schematic: true, note: 'Western tradition names Suanir in Persia. The place is not known. The point is schematic.' },
  ostrakine: { id: 'ostrakine', name: 'Ostrakine', lat: 31.1174, lon: 33.4317, confidence: 'traditional', note: 'A town on the coast of northern Sinai.', source: 'Q783975' },
  apsaros: { id: 'apsaros', name: 'Apsaros', lat: 41.573, lon: 41.573, confidence: 'traditional', note: 'The Roman fort at Gonio, Georgia. A grave in the fort is shown as the tomb of Matthias. The coordinates are approximate.' },
  dura: { id: 'dura', name: 'Dura-Europos', lat: 34.747, lon: 40.73, confidence: 'identified', note: 'A Roman frontier town on the Euphrates.', source: 'Q464266' },
  ctesiphon: { id: 'ctesiphon', name: 'Seleucia-Ctesiphon', lat: 33.0936, lon: 44.5808, confidence: 'identified', note: 'The Persian royal city on the Tigris.', source: 'Q192541' },
}

/** Eras on the time bar. Each stop takes the era of its year. */
const ERAS = [
  { name: 'The apostles', from: 30, to: 100 },
  { name: 'Apostolic fathers', from: 100, to: 155 },
  { name: 'Apologists and teachers', from: 155, to: 250 },
  { name: 'Persecution and growth', from: 250, to: 313 },
  { name: 'The Nicene age', from: 313, to: 381 },
  { name: 'The great fathers', from: 381, to: 451 },
  { name: 'After Chalcedon', from: 451, to: 500 },
]

const STOPS: Stop[] = [
  // The apostles
  { place: 'jerusalem', year: 30, when: 'c. 30', basis: 'scripture', ref: 'Acts 2:1-41', event: 'Pentecost. The Holy Spirit comes on the apostles. Peter preaches and about three thousand are baptized. The church begins in Jerusalem', span: 250, note: 'The Twelve are Peter, Andrew, James and John, Philip, Bartholomew, Thomas, Matthew, James son of Alphaeus, Thaddaeus (Jude), Simon the Zealot, and Matthias, who takes the place of Judas (Acts 1:13, 26).' },
  { place: 'edessa', year: 33, when: 'c. 30s', basis: 'tradition', ref: 'Eusebius, Church History 1.13', event: 'Thaddaeus (Addai) heals King Abgar of Edessa and preaches in the city', span: 300, moves: [{ force: 'tradition', label: 'Thaddaeus', path: ['jerusalem', 'edessa'], ref: 'Eusebius, Church History 1.13' }], note: 'Eusebius says that he translated the letters of Abgar and Jesus from the archives of Edessa. Most scholars think the story is a legend. Armenian tradition also sends Thaddaeus to Armenia.' },
  { place: 'jerusalem', year: 44, when: 'c. 44', basis: 'scripture', ref: 'Acts 12:1-2', event: 'Herod Agrippa I kills James son of Zebedee with the sword. He is the first of the Twelve to die', span: 250, note: 'A tradition that James preached in Spain is first clear in the 7th century. His shrine is at Santiago de Compostela.' },
  { place: 'antioch', year: 47, when: 'c. 40s', basis: 'scripture', ref: 'Acts 11:19-26; Gal 2:11', event: 'Barnabas and Saul teach a great number at Antioch. The disciples are first called Christians there. Peter comes to Antioch', span: 250 },
  { place: 'jerusalem', year: 49, when: 'c. 49', basis: 'scripture', ref: 'Acts 15:1-29; Gal 2:9', event: 'The council at Jerusalem. James, Peter and John, the pillars, receive Paul and Barnabas. Gentile believers need not be circumcised', span: 250 },
  { place: 'alexandria', year: 55, when: 'c. 50s', basis: 'record', ref: 'Eusebius, Church History 2.16, 2.24', event: 'Mark preaches the gospel in Egypt and founds the church at Alexandria', span: 300, moves: [{ force: 'record', label: 'Mark', path: ['jerusalem', 'alexandria'], ref: 'Eusebius, Church History 2.16' }], note: 'Eusebius says that Annianus took Mark\'s place in the eighth year of Nero, about 62.' },
  { place: 'judea', year: 58, when: 'c. 60', basis: 'record', ref: 'Papias, in Eusebius, Church History 3.39.16; 3.24.6', event: 'Matthew preaches first to the Hebrews. He sets down the sayings of Jesus in the Hebrew language', span: 300, note: 'Later writers send Matthew to "Ethiopia" (Rufinus, Socrates) or to Parthia. Each name may mean a land south of the Caspian Sea, not Africa.' },
  { place: 'jerusalem', year: 62, when: '62', basis: 'record', ref: 'Josephus, Antiquities 20.200', event: 'The high priest Ananus has James, the brother of Jesus, stoned. James led the church in Jerusalem', span: 250, note: 'Josephus calls him "the brother of Jesus who was called Christ". Hegesippus (in Eusebius, Church History 2.23) tells a longer story.' },
  { place: 'rome', year: 64, when: 'c. 64-67', basis: 'record', ref: '1 Clement 5; Eusebius, Church History 2.25', event: 'Peter dies as a martyr in Rome under Nero. Later tradition says that he was crucified upside down', span: 300, moves: [{ force: 'record', label: 'Peter', path: ['jerusalem', 'antioch', 'rome'], ref: 'Gal 2:11; 1 Pet 5:13; 1 Clement 5' }], note: 'In 1 Pet 5:13, "Babylon" is often read as Rome. Tradition puts his tomb under St. Peter\'s Basilica.' },
  { place: 'rome', year: 65, when: 'c. 64-67', basis: 'record', ref: '1 Clement 5.5-7; Eusebius, Church History 2.25', event: 'Paul is beheaded in Rome under Nero. Clement says that he taught as far as the limit of the west', span: 300, moves: [{ force: 'record', label: 'Paul', path: ['caesareamar', 'malta', 'rome'], ref: 'Acts 27-28' }], note: 'In Rom 15:24 Paul plans to go to Spain. "The limit of the west" in 1 Clement may mean Spain.' },
  { place: 'pella', year: 66, when: 'c. 66', basis: 'record', ref: 'Eusebius, Church History 3.5.3', event: 'Before the war with Rome, the church of Jerusalem leaves the city for Pella, east of the Jordan', span: 250 },
  { place: 'patras', year: 60, when: 'c. 60s', basis: 'tradition', ref: 'Origen, in Eusebius, Church History 3.1.1; Acts of Andrew', event: 'Andrew preaches in Scythia and Greece. Tradition says that he is crucified at Patrae', span: 450, moves: [{ force: 'tradition', label: 'Andrew', path: ['jerusalem', 'scythia', 'patras'], ref: 'Eusebius, Church History 3.1.1' }], note: 'Origen gives Scythia. The Acts of Andrew, from the late 2nd century, give Patrae. The X-shaped cross is a medieval tradition.' },
  { place: 'albanopolis', year: 68, when: '1st century', basis: 'tradition', ref: 'Eusebius, Church History 5.10.3; Armenian tradition', event: 'Bartholomew preaches in India, then in Armenia. Tradition says that he dies as a martyr at Albanopolis', span: 400, moves: [{ force: 'tradition', label: 'Bartholomew', path: ['jerusalem', 'edessa', 'albanopolis'], ref: 'Armenian tradition' }], note: 'Pantaenus found in "India" a Gospel of Matthew in Hebrew that Bartholomew had left there (Eusebius, Church History 5.10.3). "India" may mean Arabia or Ethiopia here.' },
  { place: 'persia', year: 65, when: '1st century', basis: 'tradition', ref: 'Pseudo-Abdias, Passion of Simon and Jude', event: 'Simon the Zealot and Jude preach in Persia. Western tradition says that both die as martyrs there', span: 600, moves: [{ force: 'tradition', label: 'Simon and Jude', path: ['jerusalem', 'edessa', 'persia'], ref: 'Pseudo-Abdias' }], note: 'Other traditions send Simon to Egypt, to Africa or to Britain.' },
  { place: 'ostrakine', year: 62, when: '1st century', basis: 'tradition', ref: 'Greek tradition (Menologion)', event: 'Greek tradition says that James son of Alphaeus preaches in Egypt and dies at Ostrakine', span: 350, note: 'Little is known of him. Some writers take him to be James the Less (Mark 15:40). Others confuse him with James the brother of Jesus.' },
  { place: 'apsaros', year: 80, when: '1st century', basis: 'tradition', ref: 'Acts 1:26; Georgian tradition', event: 'Matthias preaches in Cappadocia and Colchis. Georgian tradition shows his tomb at Apsaros', span: 400, moves: [{ force: 'tradition', label: 'Matthias', path: ['jerusalem', 'cappadocia', 'apsaros'], ref: 'Byzantine tradition' }], note: 'Other traditions say that he dies in Jerusalem or in "Ethiopia".' },
  { place: 'hierapolis', year: 80, when: 'c. 80', basis: 'record', ref: 'Polycrates, in Eusebius, Church History 3.31.3; 5.24.2', event: 'Philip lives and dies at Hierapolis with his daughters. Polycrates of Ephesus calls him one of the twelve apostles', span: 300, note: 'Some writers think that Polycrates mixed Philip the apostle with Philip the evangelist, who had four daughters (Acts 21:8-9).' },
  { place: 'mylapore', year: 72, when: 'c. 52-72', basis: 'tradition', ref: 'Origen, in Eusebius, Church History 3.1.1; Acts of Thomas', event: 'Thomas preaches in Parthia and India. The Saint Thomas Christians of India say that he lands at Muziris in 52 and dies at Mylapore in 72', span: 900, moves: [
    { force: 'record', label: 'Thomas', path: ['jerusalem', 'parthia'], ref: 'Eusebius, Church History 3.1.1' },
    { force: 'tradition', label: 'Thomas', path: ['parthia', 'taxila', 'muziris', 'mylapore'], ref: 'Acts of Thomas; Indian tradition' },
  ], note: 'Origen names Parthia. The Acts of Thomas, from the 3rd century, name India and King Gondophares, who ruled near Taxila. Relics of Thomas were in Edessa by the 4th century.' },
  { place: 'patmos', year: 95, when: 'c. 95', basis: 'scripture', ref: 'Rev 1:9; Irenaeus, Against Heresies 5.30.3', event: 'John is on the island of Patmos for the word of God. He sees the Revelation', span: 300, note: 'Irenaeus dates the vision to the end of the reign of Domitian.' },
  { place: 'ephesus', year: 98, when: 'c. 100', basis: 'record', ref: 'Irenaeus, Against Heresies 3.3.4; 2.22.5', event: 'John lives at Ephesus until the time of Trajan. He is the last of the apostles', span: 300, moves: [{ force: 'record', label: 'John', path: ['jerusalem', 'ephesus', 'patmos'], ref: 'Irenaeus, Against Heresies 3.3.4' }] },

  // Apostolic fathers
  { place: 'rome', year: 96, when: 'c. 96', basis: 'record', ref: '1 Clement; Irenaeus, Against Heresies 3.3.3', event: 'Clement, a leader of the church in Rome, writes to the church at Corinth', span: 300, moves: [{ force: 'record', label: 'Letter', path: ['rome', 'corinth'], ref: '1 Clement' }] },
  { place: 'antioch', year: 110, when: 'c. 110', basis: 'record', ref: 'Ignatius, Letters; Eusebius, Church History 3.36', event: 'Ignatius, bishop of Antioch, goes under guard to Rome to die. On the way he writes seven letters to the churches', span: 300, moves: [{ force: 'record', label: 'Ignatius', path: ['antioch', 'smyrna', 'troas', 'philippi', 'rome'], ref: 'Ignatius, Letters; Polycarp, Philippians 9, 13' }] },
  { place: 'hierapolis', year: 125, when: 'c. 125', basis: 'record', ref: 'Eusebius, Church History 3.39', event: 'Papias, bishop of Hierapolis, collects what the elders say about the apostles and the Gospels', span: 300 },
  { place: 'smyrna', year: 155, when: 'c. 155', basis: 'record', ref: 'Martyrdom of Polycarp 9-16', event: 'Polycarp, bishop of Smyrna, is burned in the stadium. He says: "Eighty-six years I have served him"', span: 300, note: 'Irenaeus says that Polycarp was taught by John (Against Heresies 3.3.4).' },

  // Apologists and teachers
  { place: 'rome', year: 165, when: 'c. 165', basis: 'record', ref: 'Justin, Dialogue 1-8; Acts of Justin', event: 'Justin, a philosopher from Flavia Neapolis, teaches in Rome. He defends the faith before the emperors. He is beheaded', span: 450, moves: [{ force: 'record', label: 'Justin', path: ['flavia', 'ephesus', 'rome'], ref: 'Justin, 1 Apology 1; Eusebius, Church History 4.18' }] },
  { place: 'sardis', year: 170, when: 'c. 170', basis: 'record', ref: 'Eusebius, Church History 4.26', event: 'Melito, bishop of Sardis, preaches his homily On the Passover', span: 300 },
  { place: 'lyon', year: 180, when: '177-c. 200', basis: 'record', ref: 'Eusebius, Church History 5.1-5; Irenaeus, Against Heresies', event: 'Martyrs die at Lugdunum in 177. Irenaeus, who heard Polycarp as a boy, becomes bishop. He writes Against Heresies', span: 400, moves: [{ force: 'record', label: 'Irenaeus', path: ['smyrna', 'rome', 'lyon'], ref: 'Eusebius, Church History 5.4, 5.20' }] },
  { place: 'alexandria', year: 190, when: 'c. 190', basis: 'record', ref: 'Eusebius, Church History 5.10-11; 6.6', event: 'Pantaenus and then Clement lead the school of teaching at Alexandria', span: 300, moves: [{ force: 'tradition', label: 'Pantaenus', path: ['alexandria', 'aksum', 'muziris'], ref: 'Eusebius, Church History 5.10' }], note: 'Eusebius says that Pantaenus went as far as "India". The arrow is schematic, because the land he means is not certain.' },
  { place: 'carthage', year: 200, when: 'c. 200', basis: 'record', ref: 'Tertullian, Apology 50; Jerome, Illustrious Men 53', event: 'Tertullian writes in Latin at Carthage. He says: "The blood of Christians is seed"', span: 300 },
  { place: 'caesareamar', year: 232, when: 'c. 232-253', basis: 'record', ref: 'Eusebius, Church History 6.19, 6.26, 6.39; Jerome, Illustrious Men 54', event: 'Origen leaves Alexandria and teaches at Caesarea. He is tortured in the persecution of Decius and dies at Tyre', span: 350, moves: [{ force: 'record', label: 'Origen', path: ['alexandria', 'caesareamar', 'tyre'], ref: 'Eusebius, Church History 6.26; Jerome, Illustrious Men 54' }] },
  { place: 'dura', year: 240, when: 'c. 240', basis: 'record', ref: 'Excavations at Dura-Europos', event: 'A house at Dura-Europos is made into a church, with a room for baptism. It is the oldest known church building', span: 300, note: 'The Persians destroyed the town in 256. The paintings from the baptism room are in Yale University Art Gallery.' },
  { place: 'neocaesarea', year: 240, when: 'c. 240-270', basis: 'record', ref: 'Eusebius, Church History 6.30; 7.14', event: 'Gregory the Wonderworker, a student of Origen, is bishop of Neocaesarea in Pontus', span: 300 },

  // Persecution and growth
  { place: 'carthage', year: 258, when: '258', basis: 'record', ref: 'Acts of Cyprian; Pontius, Life of Cyprian', event: 'Cyprian, bishop of Carthage, is beheaded under Valerian', span: 300 },
  { place: 'colzim', year: 285, when: 'c. 270-356', basis: 'record', ref: 'Athanasius, Life of Antony', event: 'Antony goes into the desert of Egypt to pray. Many follow him, and monks fill the desert', span: 350, note: 'He moved to the "inner mountain" near the Red Sea about 313 and lived to about 105.' },
  { place: 'vagharshapat', year: 301, when: 'c. 301', basis: 'tradition', ref: 'Agathangelos, History of the Armenians', event: 'Gregory the Illuminator baptizes King Tiridates III. Armenia becomes the first Christian kingdom', span: 350, moves: [{ force: 'record', label: 'Gregory', path: ['mazaca', 'vagharshapat'], ref: 'Agathangelos' }], note: 'The date is debated. Some scholars give 314. The account of Agathangelos was written in the 5th century.' },
  { place: 'milan', year: 313, when: '313', basis: 'record', ref: 'Lactantius, On the Deaths of the Persecutors 48', event: 'Constantine and Licinius meet at Milan. They give Christians freedom to worship', span: 400 },
  { place: 'caesareamar', year: 314, when: 'c. 313-339', basis: 'record', ref: 'Eusebius, Church History 1.1', event: 'Eusebius, bishop of Caesarea, writes the first history of the church', span: 350 },

  // The Nicene age
  { place: 'tabennisi', year: 320, when: 'c. 320', basis: 'record', ref: 'Life of Pachomius', event: 'Pachomius founds a monastery at Tabennisi. The monks live, work and pray under one rule', span: 350 },
  { place: 'nicaea', year: 325, when: '325', basis: 'record', ref: 'Eusebius, Life of Constantine 3.6-14', event: 'The Council of Nicaea. About 250 to 300 bishops say that the Son is of one being with the Father. They write the Nicene Creed', span: 350, note: 'Alexander of Alexandria and his deacon Athanasius oppose Arius. Hosius of Córdoba is there for the West.' },
  { place: 'mtskheta', year: 330, when: 'c. 330s', basis: 'record', ref: 'Rufinus, Church History 10.11', event: 'Nino, a captive woman, brings the gospel to Iberia. King Mirian III and his household are baptized', span: 350, note: 'Rufinus heard the story from Bacurius, a prince of Iberia. Georgian tradition calls her Nino.' },
  { place: 'trier', year: 336, when: '335-337', basis: 'record', ref: 'Athanasius, Apology against the Arians 87', event: 'Athanasius, bishop of Alexandria, is in exile at Trier. It is the first of five exiles', span: 500, moves: [{ force: 'record', label: 'Athanasius', path: ['alexandria', 'constantinople', 'trier'], ref: 'Athanasius, Apology against the Arians 87' }] },
  { place: 'aksum', year: 340, when: 'c. 340', basis: 'record', ref: 'Rufinus, Church History 10.9-10; Athanasius, Apology to Constantius 31', event: 'Athanasius makes Frumentius bishop of Aksum. King Ezana takes the cross on his coins', span: 400, moves: [{ force: 'record', label: 'Frumentius', path: ['tyre', 'aksum', 'alexandria', 'aksum'], ref: 'Rufinus, Church History 10.9-10' }] },
  { place: 'nicopolis', year: 348, when: '341-383', basis: 'record', ref: 'Philostorgius, Church History 2.5; Auxentius, Letter on Ulfilas', event: 'Ulfilas, bishop of the Goths, settles his people near Nicopolis. He makes an alphabet and puts the Bible into Gothic', span: 400, note: 'Ulfilas held Arian views, so many Goths took the Arian form of the faith.' },
  { place: 'edessa', year: 363, when: '363-373', basis: 'record', ref: 'Sozomen, Church History 3.16', event: 'Ephrem the Syrian leaves Nisibis when Rome gives it to Persia. He teaches and writes hymns at Edessa', span: 350, moves: [{ force: 'record', label: 'Ephrem', path: ['nisibis', 'edessa'], ref: 'Sozomen, Church History 3.16' }] },
  { place: 'mazaca', year: 370, when: '370-379', basis: 'record', ref: 'Gregory of Nazianzus, Oration 43', event: 'Basil the Great is bishop of Caesarea. He builds a large house to care for the sick and poor', span: 350, note: 'Basil, his brother Gregory of Nyssa, and Gregory of Nazianzus are the Cappadocian Fathers.' },
  { place: 'tours', year: 371, when: '371-397', basis: 'record', ref: 'Sulpicius Severus, Life of Martin 9-10', event: 'Martin, a former soldier, is bishop of Tours. He founds a monastery at Marmoutier and preaches in the villages of Gaul', span: 400 },
  { place: 'milan', year: 374, when: '374-397', basis: 'record', ref: 'Paulinus, Life of Ambrose 6-9', event: 'Ambrose, the governor, is made bishop of Milan by the people before he is baptized', span: 400 },
  { place: 'constantinople', year: 381, when: '381', basis: 'record', ref: 'Socrates, Church History 5.8', event: 'The Council of Constantinople. Gregory of Nazianzus leads it for a time. The council completes the Nicene Creed', span: 350 },

  // The great fathers
  { place: 'milan', year: 386, when: '386-387', basis: 'record', ref: 'Augustine, Confessions 8.12; 9.6', event: 'In a garden at Milan, Augustine hears "Take up and read". Ambrose baptizes him at Easter 387', span: 400 },
  { place: 'bethlehem', year: 386, when: '386-420', basis: 'record', ref: 'Jerome, Illustrious Men 135; Letter 108', event: 'Jerome settles at Bethlehem with Paula. He puts the Bible into Latin. This version is later called the Vulgate', span: 450, moves: [{ force: 'record', label: 'Jerome', path: ['rome', 'antioch', 'bethlehem'], ref: 'Jerome, Letter 45; Letter 108' }] },
  { place: 'constantinople', year: 398, when: '398-407', basis: 'record', ref: 'Palladius, Dialogue on the Life of Chrysostom', event: 'John Chrysostom, the preacher of Antioch, is bishop of Constantinople. He is sent into exile and dies at Comana', span: 400, moves: [{ force: 'record', label: 'Chrysostom', path: ['antioch', 'constantinople', 'comana'], ref: 'Palladius, Dialogue' }] },
  { place: 'ctesiphon', year: 410, when: '410', basis: 'record', ref: 'Synodicon Orientale, Synod of Isaac', event: 'The bishops of the Persian Empire meet at Seleucia-Ctesiphon under Isaac. The Church of the East takes its own order', span: 400 },
  { place: 'telanissos', year: 423, when: 'c. 423-459', basis: 'record', ref: 'Theodoret, Religious History 26', event: 'Simeon the Stylite lives on top of a pillar for more than thirty years. Crowds come to hear him', span: 300 },
  { place: 'hippo', year: 430, when: '395-430', basis: 'record', ref: 'Possidius, Life of Augustine 28-31', event: 'Augustine is bishop of Hippo for 35 years. He writes The City of God. He dies while the Vandals besiege the city', span: 450, moves: [{ force: 'record', label: 'Augustine', path: ['thagaste', 'carthage', 'rome', 'milan', 'thagaste', 'hippo'], ref: 'Augustine, Confessions 2-9; Possidius 3' }] },
  { place: 'ephesus', year: 431, when: '431', basis: 'record', ref: 'Acts of the Council of Ephesus', event: 'The Council of Ephesus. Cyril of Alexandria leads it. The council removes Nestorius and calls Mary the God-bearer', span: 350 },
  { place: 'armagh', year: 440, when: 'c. 432-461', basis: 'record', ref: 'Patrick, Confession', event: 'Patrick, once a slave in Ireland, returns from Britain as a bishop. He baptizes thousands', span: 450, note: 'Patrick wrote his Confession himself. His dates are debated. The year 432 comes from later annals.' },
  { place: 'chalcedon', year: 451, when: '451', basis: 'record', ref: 'Acts of the Council of Chalcedon', event: 'The Council of Chalcedon. The bishops receive the Tome of Leo of Rome. Christ is one person in two natures', span: 350, note: 'The churches of Egypt, Ethiopia, Armenia and Syria that did not receive Chalcedon became the Oriental Orthodox churches. Leo met Attila in 452.' },

  // After Chalcedon
  { place: 'reims', year: 496, when: 'c. 496', basis: 'record', ref: 'Gregory of Tours, History of the Franks 2.31', event: 'Bishop Remigius baptizes Clovis, king of the Franks, at Reims', span: 400, note: 'The year is debated. Some scholars give 508.' },
  { place: 'subiaco', year: 500, when: 'c. 500', basis: 'record', ref: 'Gregory the Great, Dialogues 2.1', event: 'Young Benedict of Nursia leaves Rome to live alone in a cave at Subiaco. Later he writes his Rule for monks', span: 300 },
]

export const CHURCH: Family = {
  id: 'church',
  name: 'Early church',
  sub: 'The apostles and the leaders after them, from Pentecost to about 500 CE',
  route: false,
  terms: { one: 'Leader or event', many: 'leaders and events', hint: 'Scroll to move through time.' },
  timeline: { from: 30, to: 500, eras: ERAS },
  // Stops follow the time bar. Stops with the same year keep their order.
  stops: STOPS.map((s, i) => ({ s, i }))
    .sort((a, b) => a.s.year! - b.s.year! || a.i - b.i)
    .map(({ s }) => ({ ...s, journey: ERAS.find((e) => s.year! >= e.from && s.year! < e.to)?.name ?? ERAS[ERAS.length - 1].name })),
}
