export interface MyanmarTownshipRate {
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
  {
    id: 'yangon-region',
    nameEn: 'Yangon Region',
    nameMm: 'Yangon Region',
    townships: [
      { id: 'yangon-region-ahlon', nameEn: 'Ahlon', nameMm: 'Ahlon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-bahan', nameEn: 'Bahan', nameMm: 'Bahan', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-botataung', nameEn: 'Botataung', nameMm: 'Botataung', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-dagon', nameEn: 'Dagon', nameMm: 'Dagon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-dagon-seikkan', nameEn: 'Dagon Seikkan', nameMm: 'Dagon Seikkan', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-dawbon', nameEn: 'Dawbon', nameMm: 'Dawbon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-east-dagon', nameEn: 'East Dagon', nameMm: 'East Dagon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-hlaing', nameEn: 'Hlaing', nameMm: 'Hlaing', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-hlaingthaya', nameEn: 'Hlaingthaya', nameMm: 'Hlaingthaya', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-hlegu', nameEn: 'Hlegu', nameMm: 'Hlegu', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-hmawbi', nameEn: 'Hmawbi', nameMm: 'Hmawbi', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-htantabin', nameEn: 'Htantabin', nameMm: 'Htantabin', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-insein', nameEn: 'Insein', nameMm: 'Insein', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-kamayut', nameEn: 'Kamayut', nameMm: 'Kamayut', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-kayan', nameEn: 'Kayan', nameMm: 'Kayan', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-kungyangon', nameEn: 'Kungyangon', nameMm: 'Kungyangon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-kyauktada', nameEn: 'Kyauktada', nameMm: 'Kyauktada', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-kyauktan', nameEn: 'Kyauktan', nameMm: 'Kyauktan', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-kyimyindaing', nameEn: 'Kyimyindaing', nameMm: 'Kyimyindaing', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-lanmadaw', nameEn: 'Lanmadaw', nameMm: 'Lanmadaw', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-latha', nameEn: 'Latha', nameMm: 'Latha', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-mayangon', nameEn: 'Mayangon', nameMm: 'Mayangon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-mingala-taungnyunt', nameEn: 'Mingala Taungnyunt', nameMm: 'Mingala Taungnyunt', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-mingaladon', nameEn: 'Mingaladon', nameMm: 'Mingaladon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-north-dagon', nameEn: 'North Dagon', nameMm: 'North Dagon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-north-okkalapa', nameEn: 'North Okkalapa', nameMm: 'North Okkalapa', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-pabedan', nameEn: 'Pabedan', nameMm: 'Pabedan', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-pazundaung', nameEn: 'Pazundaung', nameMm: 'Pazundaung', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-sanchaung', nameEn: 'Sanchaung', nameMm: 'Sanchaung', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-seikkan', nameEn: 'Seikkan', nameMm: 'Seikkan', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-shwepyitha', nameEn: 'Shwepyitha', nameMm: 'Shwepyitha', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-south-dagon', nameEn: 'South Dagon', nameMm: 'South Dagon', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-south-okkalapa', nameEn: 'South Okkalapa', nameMm: 'South Okkalapa', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-taikkyi', nameEn: 'Taikkyi', nameMm: 'Taikkyi', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-tamwe', nameEn: 'Tamwe', nameMm: 'Tamwe', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-thaketa', nameEn: 'Thaketa', nameMm: 'Thaketa', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-thanlyin', nameEn: 'Thanlyin', nameMm: 'Thanlyin', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-thingangyun', nameEn: 'Thingangyun', nameMm: 'Thingangyun', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-thongwa', nameEn: 'Thongwa', nameMm: 'Thongwa', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-twante', nameEn: 'Twante', nameMm: 'Twante', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
      { id: 'yangon-region-yankin', nameEn: 'Yankin', nameMm: 'Yankin', wepoztFeeMMK: 3000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'mandalay-region',
    nameEn: 'Mandalay Region',
    nameMm: 'Mandalay Region',
    townships: [
      { id: 'mandalay-region-amarapura', nameEn: 'Amarapura', nameMm: 'Amarapura', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-aungmyethazan', nameEn: 'Aungmyethazan', nameMm: 'Aungmyethazan', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-chanayethazan', nameEn: 'Chanayethazan', nameMm: 'Chanayethazan', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-chanmyathazi', nameEn: 'Chanmyathazi', nameMm: 'Chanmyathazi', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-kyaukpadaung', nameEn: 'Kyaukpadaung', nameMm: 'Kyaukpadaung', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-kyaukse', nameEn: 'Kyaukse', nameMm: 'Kyaukse', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-madaya', nameEn: 'Madaya', nameMm: 'Madaya', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-mahaaungmye', nameEn: 'Mahaaungmye', nameMm: 'Mahaaungmye', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-mahlaing', nameEn: 'Mahlaing', nameMm: 'Mahlaing', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-meiktila', nameEn: 'Meiktila', nameMm: 'Meiktila', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-mogok', nameEn: 'Mogok', nameMm: 'Mogok', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-myingyan', nameEn: 'Myingyan', nameMm: 'Myingyan', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-myittha', nameEn: 'Myittha', nameMm: 'Myittha', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-natogyi', nameEn: 'Natogyi', nameMm: 'Natogyi', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-nganzun', nameEn: 'Nganzun', nameMm: 'Nganzun', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-nyaung-u', nameEn: 'Nyaung-U', nameMm: 'Nyaung-U', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-patheingyi', nameEn: 'Patheingyi', nameMm: 'Patheingyi', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-pyawbwe', nameEn: 'Pyawbwe', nameMm: 'Pyawbwe', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-pyigyidagun', nameEn: 'Pyigyidagun', nameMm: 'Pyigyidagun', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-pyinoolwin', nameEn: 'Pyinoolwin', nameMm: 'Pyinoolwin', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-singu', nameEn: 'Singu', nameMm: 'Singu', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-sintgaing', nameEn: 'Sintgaing', nameMm: 'Sintgaing', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-tada-u', nameEn: 'Tada-U', nameMm: 'Tada-U', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-thabeikkyin', nameEn: 'Thabeikkyin', nameMm: 'Thabeikkyin', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-thaungtha', nameEn: 'Thaungtha', nameMm: 'Thaungtha', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-thazi', nameEn: 'Thazi', nameMm: 'Thazi', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-wundwin', nameEn: 'Wundwin', nameMm: 'Wundwin', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'mandalay-region-yamethin', nameEn: 'Yamethin', nameMm: 'Yamethin', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'bago-region',
    nameEn: 'Bago Region',
    nameMm: 'Bago Region',
    townships: [
      { id: 'bago-region-bago', nameEn: 'Bago', nameMm: 'Bago', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-daik-u', nameEn: 'Daik-U', nameMm: 'Daik-U', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-gyobingauk', nameEn: 'Gyobingauk', nameMm: 'Gyobingauk', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-kawa', nameEn: 'Kawa', nameMm: 'Kawa', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-kyaukkyi', nameEn: 'Kyaukkyi', nameMm: 'Kyaukkyi', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-letpadan', nameEn: 'Letpadan', nameMm: 'Letpadan', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-minhla', nameEn: 'Minhla', nameMm: 'Minhla', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-monyo', nameEn: 'Monyo', nameMm: 'Monyo', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-nattalin', nameEn: 'Nattalin', nameMm: 'Nattalin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-nyaunglebin', nameEn: 'Nyaunglebin', nameMm: 'Nyaunglebin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-okpho', nameEn: 'Okpho', nameMm: 'Okpho', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-oktwin', nameEn: 'Oktwin', nameMm: 'Oktwin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-padaung', nameEn: 'Padaung', nameMm: 'Padaung', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-paukkaung', nameEn: 'Paukkaung', nameMm: 'Paukkaung', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-paungde', nameEn: 'Paungde', nameMm: 'Paungde', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-pyay', nameEn: 'Pyay', nameMm: 'Pyay', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-pyu', nameEn: 'Pyu', nameMm: 'Pyu', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-shwedaung', nameEn: 'Shwedaung', nameMm: 'Shwedaung', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-shwegyin', nameEn: 'Shwegyin', nameMm: 'Shwegyin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-tantabin', nameEn: 'Tantabin', nameMm: 'Tantabin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-taungoo', nameEn: 'Taungoo', nameMm: 'Taungoo', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-thanatpin', nameEn: 'Thanatpin', nameMm: 'Thanatpin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-tharrawaddy', nameEn: 'Tharrawaddy', nameMm: 'Tharrawaddy', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-thegon', nameEn: 'Thegon', nameMm: 'Thegon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-waw', nameEn: 'Waw', nameMm: 'Waw', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-yedashe', nameEn: 'Yedashe', nameMm: 'Yedashe', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'bago-region-zigon', nameEn: 'Zigon', nameMm: 'Zigon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'ayeyarwady-region',
    nameEn: 'Ayeyarwady Region',
    nameMm: 'Ayeyarwady Region',
    townships: [
      { id: 'ayeyarwady-region-bogale', nameEn: 'Bogale', nameMm: 'Bogale', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-danubyu', nameEn: 'Danubyu', nameMm: 'Danubyu', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-dedaye', nameEn: 'Dedaye', nameMm: 'Dedaye', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-einme', nameEn: 'Einme', nameMm: 'Einme', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-hinthada', nameEn: 'Hinthada', nameMm: 'Hinthada', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-ingapu', nameEn: 'Ingapu', nameMm: 'Ingapu', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-kangyidaunt', nameEn: 'Kangyidaunt', nameMm: 'Kangyidaunt', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-kyaiklat', nameEn: 'Kyaiklat', nameMm: 'Kyaiklat', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-kyangin', nameEn: 'Kyangin', nameMm: 'Kyangin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-kyaunggon', nameEn: 'Kyaunggon', nameMm: 'Kyaunggon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-kyonpyaw', nameEn: 'Kyonpyaw', nameMm: 'Kyonpyaw', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-labutta', nameEn: 'Labutta', nameMm: 'Labutta', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-lemyethna', nameEn: 'Lemyethna', nameMm: 'Lemyethna', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-maubin', nameEn: 'Maubin', nameMm: 'Maubin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-mawlamyinegyun', nameEn: 'Mawlamyinegyun', nameMm: 'Mawlamyinegyun', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-myanaung', nameEn: 'Myanaung', nameMm: 'Myanaung', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-myaungmya', nameEn: 'Myaungmya', nameMm: 'Myaungmya', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-ngapudaw', nameEn: 'Ngapudaw', nameMm: 'Ngapudaw', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-nyaungdon', nameEn: 'Nyaungdon', nameMm: 'Nyaungdon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-pantanaw', nameEn: 'Pantanaw', nameMm: 'Pantanaw', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-pathein', nameEn: 'Pathein', nameMm: 'Pathein', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-pyapon', nameEn: 'Pyapon', nameMm: 'Pyapon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-thabaung', nameEn: 'Thabaung', nameMm: 'Thabaung', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-wakema', nameEn: 'Wakema', nameMm: 'Wakema', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-yekyi', nameEn: 'Yekyi', nameMm: 'Yekyi', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'ayeyarwady-region-zalun', nameEn: 'Zalun', nameMm: 'Zalun', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'sagaing-region',
    nameEn: 'Sagaing Region',
    nameMm: 'Sagaing Region',
    townships: [
      { id: 'sagaing-region-ayadaw', nameEn: 'Ayadaw', nameMm: 'Ayadaw', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-banmauk', nameEn: 'Banmauk', nameMm: 'Banmauk', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-budalin', nameEn: 'Budalin', nameMm: 'Budalin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-chaung-u', nameEn: 'Chaung-U', nameMm: 'Chaung-U', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-hkamti', nameEn: 'Hkamti', nameMm: 'Hkamti', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-homalin', nameEn: 'Homalin', nameMm: 'Homalin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-indaw', nameEn: 'Indaw', nameMm: 'Indaw', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-kale', nameEn: 'Kale', nameMm: 'Kale', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-kalewa', nameEn: 'Kalewa', nameMm: 'Kalewa', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-kanbalu', nameEn: 'Kanbalu', nameMm: 'Kanbalu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-katha', nameEn: 'Katha', nameMm: 'Katha', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-kawkareik', nameEn: 'Kawkareik', nameMm: 'Kawkareik', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-kawlin', nameEn: 'Kawlin', nameMm: 'Kawlin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-khin-u', nameEn: 'Khin-U', nameMm: 'Khin-U', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-kyunhla', nameEn: 'Kyunhla', nameMm: 'Kyunhla', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-lahe', nameEn: 'Lahe', nameMm: 'Lahe', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-leshi', nameEn: 'Leshi', nameMm: 'Leshi', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-mingin', nameEn: 'Mingin', nameMm: 'Mingin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-monywa', nameEn: 'Monywa', nameMm: 'Monywa', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-myaung', nameEn: 'Myaung', nameMm: 'Myaung', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-myinmu', nameEn: 'Myinmu', nameMm: 'Myinmu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-nanyun', nameEn: 'Nanyun', nameMm: 'Nanyun', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-pinlebu', nameEn: 'Pinlebu', nameMm: 'Pinlebu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-sagaing', nameEn: 'Sagaing', nameMm: 'Sagaing', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-shwebo', nameEn: 'Shwebo', nameMm: 'Shwebo', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-tabayin', nameEn: 'Tabayin', nameMm: 'Tabayin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-tamu', nameEn: 'Tamu', nameMm: 'Tamu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-taze', nameEn: 'Taze', nameMm: 'Taze', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-wetlet', nameEn: 'Wetlet', nameMm: 'Wetlet', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-wuntho', nameEn: 'Wuntho', nameMm: 'Wuntho', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'sagaing-region-ye-u', nameEn: 'Ye-U', nameMm: 'Ye-U', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'magway-region',
    nameEn: 'Magway Region',
    nameMm: 'Magway Region',
    townships: [
      { id: 'magway-region-aunglan', nameEn: 'Aunglan', nameMm: 'Aunglan', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-chauk', nameEn: 'Chauk', nameMm: 'Chauk', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-gangaw', nameEn: 'Gangaw', nameMm: 'Gangaw', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-kamma', nameEn: 'Kamma', nameMm: 'Kamma', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-magway', nameEn: 'Magway', nameMm: 'Magway', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-minbu', nameEn: 'Minbu', nameMm: 'Minbu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-mindon', nameEn: 'Mindon', nameMm: 'Mindon', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-minhla', nameEn: 'Minhla', nameMm: 'Minhla', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-myaing', nameEn: 'Myaing', nameMm: 'Myaing', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-myothit', nameEn: 'Myothit', nameMm: 'Myothit', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-natmauk', nameEn: 'Natmauk', nameMm: 'Natmauk', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-ngape', nameEn: 'Ngape', nameMm: 'Ngape', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-pakokku', nameEn: 'Pakokku', nameMm: 'Pakokku', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-pauk', nameEn: 'Pauk', nameMm: 'Pauk', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-pwintbyu', nameEn: 'Pwintbyu', nameMm: 'Pwintbyu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-salin', nameEn: 'Salin', nameMm: 'Salin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-saw', nameEn: 'Saw', nameMm: 'Saw', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-seikphyu', nameEn: 'Seikphyu', nameMm: 'Seikphyu', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-sidoktaya', nameEn: 'Sidoktaya', nameMm: 'Sidoktaya', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-sinbaungwe', nameEn: 'Sinbaungwe', nameMm: 'Sinbaungwe', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-taungdwingyi', nameEn: 'Taungdwingyi', nameMm: 'Taungdwingyi', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-thayet', nameEn: 'Thayet', nameMm: 'Thayet', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-tilin', nameEn: 'Tilin', nameMm: 'Tilin', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-yenangyaung', nameEn: 'Yenangyaung', nameMm: 'Yenangyaung', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'magway-region-yesagyo', nameEn: 'Yesagyo', nameMm: 'Yesagyo', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'tanintharyi-region',
    nameEn: 'Tanintharyi Region',
    nameMm: 'Tanintharyi Region',
    townships: [
      { id: 'tanintharyi-region-bokpyin', nameEn: 'Bokpyin', nameMm: 'Bokpyin', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-dawei', nameEn: 'Dawei', nameMm: 'Dawei', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-kawthaung', nameEn: 'Kawthaung', nameMm: 'Kawthaung', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-kyunsu', nameEn: 'Kyunsu', nameMm: 'Kyunsu', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-launglon', nameEn: 'Launglon', nameMm: 'Launglon', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-myeik', nameEn: 'Myeik', nameMm: 'Myeik', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-palaw', nameEn: 'Palaw', nameMm: 'Palaw', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-tanintharyi', nameEn: 'Tanintharyi', nameMm: 'Tanintharyi', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-thayetchaung', nameEn: 'Thayetchaung', nameMm: 'Thayetchaung', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'tanintharyi-region-yebyu', nameEn: 'Yebyu', nameMm: 'Yebyu', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'kachin-state',
    nameEn: 'Kachin State',
    nameMm: 'Kachin State',
    townships: [
      { id: 'kachin-state-bhamo', nameEn: 'Bhamo', nameMm: 'Bhamo', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-hpakant', nameEn: 'Hpakant', nameMm: 'Hpakant', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-khaunglanhpu', nameEn: 'Khaunglanhpu', nameMm: 'Khaunglanhpu', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-machanbaw', nameEn: 'Machanbaw', nameMm: 'Machanbaw', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-mogaung', nameEn: 'Mogaung', nameMm: 'Mogaung', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-mohnyin', nameEn: 'Mohnyin', nameMm: 'Mohnyin', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-momauk', nameEn: 'Momauk', nameMm: 'Momauk', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-myitkyina', nameEn: 'Myitkyina', nameMm: 'Myitkyina', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-nawngmun', nameEn: 'Nawngmun', nameMm: 'Nawngmun', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-puta-o', nameEn: 'Puta-O', nameMm: 'Puta-O', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-shwegu', nameEn: 'Shwegu', nameMm: 'Shwegu', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'kachin-state-waingmaw', nameEn: 'Waingmaw', nameMm: 'Waingmaw', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'kayah-state',
    nameEn: 'Kayah State',
    nameMm: 'Kayah State',
    townships: [
      { id: 'kayah-state-bawlakhe', nameEn: 'Bawlakhe', nameMm: 'Bawlakhe', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'kayah-state-demoso', nameEn: 'Demoso', nameMm: 'Demoso', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'kayah-state-hpruso', nameEn: 'Hpruso', nameMm: 'Hpruso', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'kayah-state-loikaw', nameEn: 'Loikaw', nameMm: 'Loikaw', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'kayah-state-mese', nameEn: 'Mese', nameMm: 'Mese', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'kayah-state-pasaung', nameEn: 'Pasaung', nameMm: 'Pasaung', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'kayah-state-shadaw', nameEn: 'Shadaw', nameMm: 'Shadaw', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'kayin-state',
    nameEn: 'Kayin State',
    nameMm: 'Kayin State',
    townships: [
      { id: 'kayin-state-hlaingbwe', nameEn: 'Hlaingbwe', nameMm: 'Hlaingbwe', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'kayin-state-hpa-an', nameEn: 'Hpa-An', nameMm: 'Hpa-An', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'kayin-state-kawkareik', nameEn: 'Kawkareik', nameMm: 'Kawkareik', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'kayin-state-kyain-seikgyi', nameEn: 'Kyain Seikgyi', nameMm: 'Kyain Seikgyi', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'kayin-state-myawaddy', nameEn: 'Myawaddy', nameMm: 'Myawaddy', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'kayin-state-papun', nameEn: 'Papun', nameMm: 'Papun', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
      { id: 'kayin-state-thandaunggyi', nameEn: 'Thandaunggyi', nameMm: 'Thandaunggyi', wepoztFeeMMK: 5000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'chin-state',
    nameEn: 'Chin State',
    nameMm: 'Chin State',
    townships: [
      { id: 'chin-state-falam', nameEn: 'Falam', nameMm: 'Falam', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-hakha', nameEn: 'Hakha', nameMm: 'Hakha', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-kanpetlet', nameEn: 'Kanpetlet', nameMm: 'Kanpetlet', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-matupi', nameEn: 'Matupi', nameMm: 'Matupi', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-mindat', nameEn: 'Mindat', nameMm: 'Mindat', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-paletwa', nameEn: 'Paletwa', nameMm: 'Paletwa', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-tedim', nameEn: 'Tedim', nameMm: 'Tedim', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-thantlang', nameEn: 'Thantlang', nameMm: 'Thantlang', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'chin-state-tonzang', nameEn: 'Tonzang', nameMm: 'Tonzang', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'mon-state',
    nameEn: 'Mon State',
    nameMm: 'Mon State',
    townships: [
      { id: 'mon-state-bilin', nameEn: 'Bilin', nameMm: 'Bilin', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-chaungzon', nameEn: 'Chaungzon', nameMm: 'Chaungzon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-kyaikmaraw', nameEn: 'Kyaikmaraw', nameMm: 'Kyaikmaraw', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-kyaikto', nameEn: 'Kyaikto', nameMm: 'Kyaikto', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-mawlamyine', nameEn: 'Mawlamyine', nameMm: 'Mawlamyine', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-mudon', nameEn: 'Mudon', nameMm: 'Mudon', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-paung', nameEn: 'Paung', nameMm: 'Paung', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-thanbyuzayat', nameEn: 'Thanbyuzayat', nameMm: 'Thanbyuzayat', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-thaton', nameEn: 'Thaton', nameMm: 'Thaton', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
      { id: 'mon-state-ye', nameEn: 'Ye', nameMm: 'Ye', wepoztFeeMMK: 4500, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'rakhine-state',
    nameEn: 'Rakhine State',
    nameMm: 'Rakhine State',
    townships: [
      { id: 'rakhine-state-ann', nameEn: 'Ann', nameMm: 'Ann', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-buthidaung', nameEn: 'Buthidaung', nameMm: 'Buthidaung', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-gwa', nameEn: 'Gwa', nameMm: 'Gwa', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-kyaukpyu', nameEn: 'Kyaukpyu', nameMm: 'Kyaukpyu', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-kyauktaw', nameEn: 'Kyauktaw', nameMm: 'Kyauktaw', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-maungdaw', nameEn: 'Maungdaw', nameMm: 'Maungdaw', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-minbya', nameEn: 'Minbya', nameMm: 'Minbya', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-mrauk-u', nameEn: 'Mrauk-U', nameMm: 'Mrauk-U', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-munaung', nameEn: 'Munaung', nameMm: 'Munaung', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-myebon', nameEn: 'Myebon', nameMm: 'Myebon', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-pauktaw', nameEn: 'Pauktaw', nameMm: 'Pauktaw', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-ponnagyun', nameEn: 'Ponnagyun', nameMm: 'Ponnagyun', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-ramree', nameEn: 'Ramree', nameMm: 'Ramree', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-rathedaung', nameEn: 'Rathedaung', nameMm: 'Rathedaung', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-sittwe', nameEn: 'Sittwe', nameMm: 'Sittwe', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-thandwe', nameEn: 'Thandwe', nameMm: 'Thandwe', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
      { id: 'rakhine-state-toungup', nameEn: 'Toungup', nameMm: 'Toungup', wepoztFeeMMK: 6000, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'shan-state',
    nameEn: 'Shan State',
    nameMm: 'Shan State',
    townships: [
      { id: 'shan-state-hopong', nameEn: 'Hopong', nameMm: 'Hopong', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-hseni', nameEn: 'Hseni', nameMm: 'Hseni', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-hsihseng', nameEn: 'Hsihseng', nameMm: 'Hsihseng', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-kalaw', nameEn: 'Kalaw', nameMm: 'Kalaw', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-kengtung', nameEn: 'Kengtung', nameMm: 'Kengtung', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-langkho', nameEn: 'Langkho', nameMm: 'Langkho', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-lashio', nameEn: 'Lashio', nameMm: 'Lashio', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-loilen', nameEn: 'Loilen', nameMm: 'Loilen', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mawkmai', nameEn: 'Mawkmai', nameMm: 'Mawkmai', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-monghsat', nameEn: 'Monghsat', nameMm: 'Monghsat', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongkhet', nameEn: 'Mongkhet', nameMm: 'Mongkhet', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongla', nameEn: 'Mongla', nameMm: 'Mongla', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongmao', nameEn: 'Mongmao', nameMm: 'Mongmao', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongnai', nameEn: 'Mongnai', nameMm: 'Mongnai', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongpan', nameEn: 'Mongpan', nameMm: 'Mongpan', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongyai', nameEn: 'Mongyai', nameMm: 'Mongyai', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-mongyang', nameEn: 'Mongyang', nameMm: 'Mongyang', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-nyaungshwe', nameEn: 'Nyaungshwe', nameMm: 'Nyaungshwe', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-pangwaun', nameEn: 'Pangwaun', nameMm: 'Pangwaun', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-pekon', nameEn: 'Pekon', nameMm: 'Pekon', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-pindaya', nameEn: 'Pindaya', nameMm: 'Pindaya', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-pinlaung', nameEn: 'Pinlaung', nameMm: 'Pinlaung', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-tachileik', nameEn: 'Tachileik', nameMm: 'Tachileik', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-tangyan', nameEn: 'Tangyan', nameMm: 'Tangyan', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-taunggyi', nameEn: 'Taunggyi', nameMm: 'Taunggyi', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
      { id: 'shan-state-ywangan', nameEn: 'Ywangan', nameMm: 'Ywangan', wepoztFeeMMK: 5500, estimatedDays: '2-4 Days' },
    ]
  },
  {
    id: 'naypyidaw-union-territory',
    nameEn: 'Naypyidaw Union Territory',
    nameMm: 'Naypyidaw Union Territory',
    townships: [
      { id: 'naypyidaw-union-territory-dekkhinathiri', nameEn: 'Dekkhinathiri', nameMm: 'Dekkhinathiri', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-lewe', nameEn: 'Lewe', nameMm: 'Lewe', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-ottarathiri', nameEn: 'Ottarathiri', nameMm: 'Ottarathiri', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-pobbathiri', nameEn: 'Pobbathiri', nameMm: 'Pobbathiri', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-pyinmana', nameEn: 'Pyinmana', nameMm: 'Pyinmana', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-tatkon', nameEn: 'Tatkon', nameMm: 'Tatkon', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-zabuthiri', nameEn: 'Zabuthiri', nameMm: 'Zabuthiri', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
      { id: 'naypyidaw-union-territory-zeyarthiri', nameEn: 'Zeyarthiri', nameMm: 'Zeyarthiri', wepoztFeeMMK: 4000, estimatedDays: '2-4 Days' },
    ]
  },
];

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
