const fs = require('fs');

const regions = [
  {
    name: 'Yangon Region',
    townships: [
      'Ahlon', 'Bahan', 'Botataung', 'Dagon', 'Dagon Seikkan', 'Dawbon', 'East Dagon',
      'Hlaing', 'Hlaingthaya', 'Insein', 'Kamayut', 'Kyauktada', 'Kyimyindaing',
      'Lanmadaw', 'Latha', 'Mayangon', 'Mingaladon', 'Mingala Taungnyunt', 'North Dagon',
      'North Okkalapa', 'Pabedan', 'Pazundaung', 'Sanchaung', 'Seikkan', 'Shwepyitha',
      'South Dagon', 'South Okkalapa', 'Tamwe', 'Thaketa', 'Thingangyun', 'Yankin',
      'Hlegu', 'Hmawbi', 'Htantabin', 'Kayan', 'Kungyangon', 'Kyauktan', 'Taikkyi',
      'Thanlyin', 'Thongwa', 'Twante'
    ],
    price: 3000
  },
  {
    name: 'Mandalay Region',
    townships: [
      'Amarapura', 'Aungmyethazan', 'Chanayethazan', 'Chanmyathazi', 'Mahaaungmye',
      'Patheingyi', 'Pyigyidagun', 'Kyaukse', 'Myittha', 'Sintgaing', 'Tada-U',
      'Meiktila', 'Mahlaing', 'Thazi', 'Wundwin', 'Myingyan', 'Natogyi', 'Nganzun',
      'Thaungtha', 'Nyaung-U', 'Kyaukpadaung', 'Pyinoolwin', 'Madaya', 'Mogok',
      'Singu', 'Thabeikkyin', 'Yamethin', 'Pyawbwe'
    ],
    price: 4000
  },
  {
    name: 'Bago Region',
    townships: [
      'Bago', 'Daik-U', 'Kawa', 'Thanatpin', 'Waw', 'Nyaunglebin', 'Kyaukkyi', 'Shwegyin',
      'Taungoo', 'Oktwin', 'Pyu', 'Tantabin', 'Yedashe', 'Pyay', 'Paukkaung', 'Padaung',
      'Paungde', 'Shwedaung', 'Thegon', 'Tharrawaddy', 'Gyobingauk', 'Letpadan', 'Minhla',
      'Monyo', 'Nattalin', 'Okpho', 'Zigon'
    ],
    price: 4500
  },
  {
    name: 'Ayeyarwady Region',
    townships: [
      'Pathein', 'Kangyidaunt', 'Ngapudaw', 'Thabaung', 'Kyonpyaw', 'Yekyi', 'Kyaunggon',
      'Hinthada', 'Zalun', 'Lemyethna', 'Myanaung', 'Kyangin', 'Ingapu', 'Myaungmya',
      'Einme', 'Wakema', 'Maubin', 'Pantanaw', 'Nyaungdon', 'Danubyu', 'Pyapon',
      'Bogale', 'Kyaiklat', 'Dedaye', 'Labutta', 'Mawlamyinegyun'
    ],
    price: 4500
  },
  {
    name: 'Sagaing Region',
    townships: [
      'Sagaing', 'Myinmu', 'Myaung', 'Monywa', 'Ayadaw', 'Budalin', 'Chaung-U',
      'Shwebo', 'Khin-U', 'Wetlet', 'Kanbalu', 'Kyunhla', 'Ye-U', 'Taze', 'Tabayin',
      'Katha', 'Indaw', 'Kawkareik', 'Banmauk', 'Pinlebu', 'Kawlin', 'Wuntho',
      'Tamu', 'Kale', 'Kalewa', 'Mingin', 'Hkamti', 'Homalin', 'Leshi', 'Lahe', 'Nanyun'
    ],
    price: 5000
  },
  {
    name: 'Magway Region',
    townships: [
      'Magway', 'Chauk', 'Myothit', 'Natmauk', 'Taungdwingyi', 'Yenangyaung',
      'Minbu', 'Ngape', 'Pwintbyu', 'Salin', 'Sidoktaya',
      'Thayet', 'Aunglan', 'Kamma', 'Mindon', 'Minhla', 'Sinbaungwe',
      'Pakokku', 'Myaing', 'Pauk', 'Seikphyu', 'Yesagyo',
      'Gangaw', 'Saw', 'Tilin'
    ],
    price: 5000
  },
  {
    name: 'Tanintharyi Region',
    townships: [
      'Dawei', 'Launglon', 'Thayetchaung', 'Yebyu', 'Myeik', 'Kyunsu', 'Palaw', 'Tanintharyi',
      'Kawthaung', 'Bokpyin'
    ],
    price: 5500
  },
  {
    name: 'Kachin State',
    townships: [
      'Myitkyina', 'Bhamo', 'Hpakant', 'Mogaung', 'Mohnyin', 'Puta-O', 'Shwegu',
      'Waingmaw', 'Momauk', 'Khaunglanhpu', 'Machanbaw', 'Nawngmun'
    ],
    price: 6000
  },
  {
    name: 'Kayah State',
    townships: [
      'Loikaw', 'Bawlakhe', 'Demoso', 'Hpruso', 'Mese', 'Pasaung', 'Shadaw'
    ],
    price: 5500
  },
  {
    name: 'Kayin State',
    townships: [
      'Hpa-An', 'Hlaingbwe', 'Papun', 'Thandaunggyi', 'Myawaddy', 'Kawkareik', 'Kyain Seikgyi'
    ],
    price: 5000
  },
  {
    name: 'Chin State',
    townships: [
      'Hakha', 'Falam', 'Kanpetlet', 'Matupi', 'Mindat', 'Paletwa', 'Tedim', 'Thantlang', 'Tonzang'
    ],
    price: 6000
  },
  {
    name: 'Mon State',
    townships: [
      'Mawlamyine', 'Kyaikmaraw', 'Chaungzon', 'Thanbyuzayat', 'Mudon', 'Ye',
      'Thaton', 'Paung', 'Kyaikto', 'Bilin'
    ],
    price: 4500
  },
  {
    name: 'Rakhine State',
    townships: [
      'Sittwe', 'Ponnagyun', 'Mrauk-U', 'Kyauktaw', 'Minbya', 'Myebon', 'Pauktaw', 'Rathedaung',
      'Maungdaw', 'Buthidaung', 'Kyaukpyu', 'Munaung', 'Ramree', 'Ann', 'Thandwe', 'Toungup', 'Gwa'
    ],
    price: 6000
  },
  {
    name: 'Shan State',
    townships: [
      'Taunggyi', 'Kalaw', 'Nyaungshwe', 'Pekon', 'Ywangan', 'Pindaya', 'Hopong', 'Hsihseng', 'Pinlaung',
      'Loilen', 'Langkho', 'Mawkmai', 'Mongpan', 'Mongnai',
      'Lashio', 'Hseni', 'Mongyai', 'Tangyan', 'Pangwaun', 'Mongmao',
      'Kengtung', 'Mongkhet', 'Mongyang', 'Mongla', 'Tachileik', 'Monghsat'
    ],
    price: 5500
  },
  {
    name: 'Naypyidaw Union Territory',
    townships: [
      'Zeyarthiri', 'Pobbathiri', 'Tatkon', 'Ottarathiri', 'Dekkhinathiri', 'Pyinmana', 'Lewe', 'Zabuthiri'
    ],
    price: 4000
  }
];

function generateId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

let fileContent = `export interface MyanmarTownshipRate {
  id: string;
  nameEn: string;
  nameMm: string;
  wepoztFeeMMK: number;
  estimatedDays: string;
  wepoztBranchCode?: string;
  zone?: string;
}

export interface MyanmarRegion {
  id: string;
  nameEn: string;
  nameMm: string;
  townships: MyanmarTownshipRate[];
}

export const MYANMAR_DELIVERY_REGIONS: MyanmarRegion[] = [
`;

regions.forEach(region => {
  const rId = generateId(region.name);
  fileContent += `  {
    id: '${rId}',
    nameEn: '${region.name}',
    nameMm: '${region.name}',
    townships: [
`;
  region.townships.sort().forEach(township => {
    const tId = generateId(region.name) + '-' + generateId(township);
    fileContent += `      { id: '${tId}', nameEn: '${township}', nameMm: '${township}', wepoztFeeMMK: ${region.price}, estimatedDays: '2-4 Days' },\n`;
  });
  fileContent += `    ]
  },\n`;
});

fileContent += `];

export const calculateWepoztDeliveryFee = (regionId: string, townshipId: string, weightKg: number, isExpress: boolean, regions: MyanmarRegion[]): any => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return { feeMMK: 0 };
  
  const township = region.townships.find(t => t.id === townshipId);
  if (!township) return { feeMMK: 0 };

  let baseFee = township.wepoztFeeMMK;
  if (weightKg > 1) {
    baseFee += Math.ceil(weightKg - 1) * 1000;
  }
  if (isExpress) {
    baseFee += 2000;
  }

  return {
    townshipName: township.nameEn,
    regionName: region.nameEn,
    branchCode: township.wepoztBranchCode || '',
    estimatedDays: township.estimatedDays,
    codAvailable: true,
    feeMMK: baseFee
  };
};

export const getTownshipRate = (regionId: string, townshipId: string, regions: MyanmarRegion[]): any => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return undefined;
  return region.townships.find(t => t.id === townshipId);
};
`;

fs.writeFileSync('src/data/myanmarDeliveryRates.ts', fileContent);
