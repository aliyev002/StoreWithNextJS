import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clear tables
  await prisma.review.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.product.deleteMany()

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@magaza.az' },
    update: { role: 'admin' },
    create: {
      email: 'admin@magaza.az',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Create test coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'BAHAR20',
        discountPercent: 20,
        minOrderAmount: 50,
        isActive: true,
      },
      {
        code: 'START10',
        discountAmount: 10,
        minOrderAmount: 30,
        isActive: true,
      },
      {
        code: 'VIP50',
        discountPercent: 50,
        minOrderAmount: 100,
        isActive: true,
      },
    ],
  })

  // 36 verified products
  const products = [
  {
    "name": "Nike Dunk Low Retro",
    "desc": "İdman və gündəlik istifadə üçün əfsanəvi dəri ayaqqabı.",
    "price": 149.99,
    "category": "shoes",
    "stock": 16,
    "imageUrl": "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png",
    "images": "[\"https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png\",\"https://cdn.media.amplience.net/i/scvl/158324_356741_1?fmt=auto&w=640\",\"https://cdn-images.farfetch-contents.com/21/78/99/05/21789905_51674354_600.jpg\"]",
    "variants": "[\"40\",\"41\",\"42\",\"43\",\"44\"]"
  },
  {
    "name": "Adidas Premium Hoodie",
    "desc": "İsti, yumşaq pambıq materialdan hazırlanmış dəbli hudi.",
    "price": 89.99,
    "category": "clothing",
    "stock": 12,
    "imageUrl": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"S\",\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "Apple Watch Series 9",
    "desc": "Qabaqcıl sağlamlıq sensorları və parlaq Retina ekran ilə ağıllı saat.",
    "price": 399,
    "category": "electronics",
    "stock": 8,
    "imageUrl": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41mm - Qara\",\"45mm - Gümüşü\"]"
  },
  {
    "name": "Sony WH-1000XM5",
    "desc": "Sənayenin ən qabaqcıl səsboğma (Noise Cancelling) texnologiyasına malik qulaqlıq.",
    "price": 349.99,
    "category": "electronics",
    "stock": 14,
    "imageUrl": "https://i5.walmartimages.com/seo/Sony-WH-1000XM5-The-Best-Wireless-Noise-Canceling-Headphones-Silver_0de627ff-c101-463c-8958-fa565fb0e50a.8b05d95380294e43026de4071a873971.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    "images": "[\"https://i5.walmartimages.com/seo/Sony-WH-1000XM5-The-Best-Wireless-Noise-Canceling-Headphones-Silver_0de627ff-c101-463c-8958-fa565fb0e50a.8b05d95380294e43026de4071a873971.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF\",\"https://i5.walmartimages.com/asr/61f9e0aa-b519-4ad1-95f5-8a8265f388f7.3430280295f34ec3d87cc41fb9d73657.jpeg\"]",
    "variants": "[\"Qara\",\"Gümüşü\"]"
  },
  {
    "name": "New Balance 574 Core",
    "desc": "Hər gün üçün rahat və ikonik retro üslublu ayaqqabı.",
    "price": 119.5,
    "category": "shoes",
    "stock": 18,
    "imageUrl": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41\",\"42\",\"43\",\"44\"]"
  },
  {
    "name": "North Face Waterproof Jacket",
    "desc": "Külək və yağışa davamlı xüsusi qoruyucu gödəkçə.",
    "price": 219,
    "category": "clothing",
    "stock": 6,
    "imageUrl": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80\"]",
    "variants": null
  },
  {
    "name": "Nike Air Jordan 1 High",
    "desc": "Əfsanəvi basketbol klassikası, yüksək keyfiyyətli təbii dəri və rahat altlıq.",
    "price": 249,
    "category": "shoes",
    "stock": 14,
    "imageUrl": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41\",\"42\",\"43\",\"44\",\"45\"]"
  },
  {
    "name": "Adidas Ultraboost Light",
    "desc": "Maksimum enerji geri qaytarışı və yüngül qaçış təcrübəsi üçün Boost texnologiyası.",
    "price": 189.5,
    "category": "shoes",
    "stock": 22,
    "imageUrl": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"40\",\"41\",\"42\",\"43\",\"44\"]"
  },
  {
    "name": "Puma RS-X Efekt",
    "desc": "Futuristik dizayn və qalın altlıqlı retro küçə üslubu ayaqqabısı.",
    "price": 129.99,
    "category": "shoes",
    "stock": 11,
    "imageUrl": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41\",\"42\",\"43\",\"44\"]"
  },
  {
    "name": "Converse Chuck 70 Classic",
    "desc": "Hər dövrün dəbi olan kətan parça, dözümlü rezin burunlu klassik qara keta.",
    "price": 85,
    "category": "shoes",
    "stock": 30,
    "imageUrl": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"38\",\"39\",\"40\",\"41\",\"42\",\"43\"]"
  },
  {
    "name": "Vans Sk8-Hi Black",
    "desc": "Skeytbordçular və küçə dəbi həvəskarları üçün topuq qoruyuculu xüsusi keta.",
    "price": 95,
    "category": "shoes",
    "stock": 18,
    "imageUrl": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"40\",\"41\",\"42\",\"43\"]"
  },
  {
    "name": "Timberland 6-Inch Premium Boot",
    "desc": "Su keçirməyən təbii nubuk dəri, qış və dağ yürüşləri üçün etibarlı çəkmə.",
    "price": 279,
    "category": "shoes",
    "stock": 9,
    "imageUrl": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41\",\"42\",\"43\",\"44\",\"45\"]"
  },
  {
    "name": "New Balance 990v5 Made in USA",
    "desc": "ABŞ istehsalı premium zamşa və ENCAP orta altlıqla qüsursuz ortopedik rahatlıq.",
    "price": 230,
    "category": "shoes",
    "stock": 7,
    "imageUrl": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"40\",\"41\",\"42\",\"43\"]"
  },
  {
    "name": "Asics Gel-Kayano 30",
    "desc": "Uzun məsafə qaçışları üçün 4D GUIDANCE stabillik sistemi və Gel yumşaldıcı.",
    "price": 175,
    "category": "shoes",
    "stock": 16,
    "imageUrl": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41\",\"42\",\"43\",\"44\"]"
  },
  {
    "name": "Salomon XT-6 Gore-Tex",
    "desc": "Həm şəhər dəbi, həm də çətin cığırlar üçün sukeçirməz membranlı krossovka.",
    "price": 210,
    "category": "shoes",
    "stock": 12,
    "imageUrl": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"41\",\"42\",\"43\",\"44\"]"
  },
  {
    "name": "Dr. Martens 1460 Smooth",
    "desc": "Sarı tikişləri və davamlı Smooth dərisi ilə 8 gözlü əfsanəvi dəri çəkmə.",
    "price": 195,
    "category": "shoes",
    "stock": 15,
    "imageUrl": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"39\",\"40\",\"41\",\"42\",\"43\"]"
  },
  {
    "name": "Zara Slim Fit Qara Kostyum",
    "desc": "Klassik və rəsmi tədbirlər üçün zərif kəsimli, yüksək keyfiyyətli yun qarışıqlı pencək və şalvar.",
    "price": 169,
    "category": "clothing",
    "stock": 10,
    "imageUrl": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"48 (M)\",\"50 (L)\",\"52 (XL)\"]"
  },
  {
    "name": "Levi's 501 Original Fit Jeans",
    "desc": "1873-cü ildən bəri dəyişməz qalan əfsanəvi düz kəsimli denim cins şalvar.",
    "price": 89,
    "category": "clothing",
    "stock": 25,
    "imageUrl": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"30/32\",\"31/32\",\"32/32\",\"33/32\",\"34/32\"]"
  },
  {
    "name": "Nike Tech Fleece Fermuarlı İdman Dəsti",
    "desc": "Həm yüngül, həm də isti saxlayan innovativ fleece parça idman geyimi.",
    "price": 145,
    "category": "clothing",
    "stock": 14,
    "imageUrl": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"S\",\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "Tommy Hilfiger Klassik Polo Köynək",
    "desc": "%100 orqanik pambıqdan hazırlanmış qısaqol dəbli polo köynək.",
    "price": 65,
    "category": "clothing",
    "stock": 20,
    "imageUrl": "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"S\",\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "Patagonia Down Sweater Qaz Tükü Jilet",
    "desc": "Külək keçirməyən 800-fill gücündə təkrar emal edilmiş qaz tükü dolğulu yüngül jilet.",
    "price": 180,
    "category": "clothing",
    "stock": 8,
    "imageUrl": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "Calvin Klein Minimalist Ağ T-Shirt (3-lü Paket)",
    "desc": "Hər gün üçün nəfəsalan premium pambıq t-shirt dəsti.",
    "price": 49.9,
    "category": "clothing",
    "stock": 35,
    "imageUrl": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"S\",\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "Massimo Dutti Kaşmir Sviter",
    "desc": "100% təmiz kaşmirdən toxunmuş yumşaq, isti və dəbdəbəli kişi sviteri.",
    "price": 139,
    "category": "clothing",
    "stock": 12,
    "imageUrl": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "Columbia Omni-Heat Qış Gödəkçəsi",
    "desc": "İstilik əks etdirən daxili termal texnologiya və su keçirməyən üst qat.",
    "price": 220,
    "category": "clothing",
    "stock": 9,
    "imageUrl": "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"M\",\"L\",\"XL\",\"XXL\"]"
  },
  {
    "name": "Carhartt WIP Cargo Şalvar",
    "desc": "Möhkəm ripstop parçadan geniş cibli, rahat və dözümlü kargo şalvar.",
    "price": 98,
    "category": "clothing",
    "stock": 18,
    "imageUrl": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"30\",\"32\",\"34\",\"36\"]"
  },
  {
    "name": "Lacoste Təmiz Kətan Yay Köynəyi",
    "desc": "İsti yay günləri üçün təravətli saxlayan nəfəsalan kətan uzunqol köynək.",
    "price": 110,
    "category": "clothing",
    "stock": 15,
    "imageUrl": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"S\",\"M\",\"L\",\"XL\"]"
  },
  {
    "name": "iPhone 15 Pro Max 256GB",
    "desc": "Titan gövdə, A17 Pro çipi, 5x optik zumlu peşəkar kamera və USB-C dəstəyi.",
    "price": 2399,
    "category": "electronics",
    "stock": 6,
    "imageUrl": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"Təbii Titan\",\"Qara Titan\",\"Mavi Titan\"]"
  },
  {
    "name": "MacBook Air 15\" M3 Çip",
    "desc": "İncə və səssiz alüminium korpus, 18 saata qədər batareya ömrü və Liquid Retina ekran.",
    "price": 2450,
    "category": "electronics",
    "stock": 5,
    "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"8GB / 256GB\",\"16GB / 512GB\"]"
  },
  {
    "name": "Sony PlayStation 5 Slim",
    "desc": "Ultra-sürətli SSD, DualSense haptik kontrolçu və 4K 120Hz oyun qrafikası.",
    "price": 1149,
    "category": "electronics",
    "stock": 10,
    "imageUrl": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"Disk Edition (1TB)\",\"Digital Edition (1TB)\"]"
  },
  {
    "name": "Apple AirPods Max",
    "desc": "Hi-Fi səs dəqiqliyi, fərdi aktiv küyboğma və dinamik baş izləmə ilə məkan səsi.",
    "price": 999,
    "category": "electronics",
    "stock": 8,
    "imageUrl": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"Gümüşü\",\"Kosmik Boz\",\"Göy\"]"
  },
  {
    "name": "Samsung Galaxy S24 Ultra",
    "desc": "Galaxy AI süni intellekt imkanları, daxili S-Pen qələmi və 200MP əsas sensor.",
    "price": 2199,
    "category": "electronics",
    "stock": 6,
    "imageUrl": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"Titan Qara\",\"Titan Boz\",\"Titan Sarı\"]"
  },
  {
    "name": "JBL Charge 5 Portativ Dinamik",
    "desc": "Güclü bas səsi, IP67 su və toz keçirməzliyi və 20 saat fasiləsiz ifa.",
    "price": 249,
    "category": "electronics",
    "stock": 20,
    "imageUrl": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"Qara\",\"Mavi\",\"Qırmızı\"]"
  },
  {
    "name": "DJI Mini 4 Pro PUA (Dron)",
    "desc": "4K/60fps HDR şaquli çəkiliş, çoxistiqamətli maneə aşkarlama və 34 dəqiqə uçuş.",
    "price": 1599,
    "category": "electronics",
    "stock": 4,
    "imageUrl": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"Standart RC-N2\",\"Fly More Combo (RC 2)\"]"
  },
  {
    "name": "iPad Air 11\" M2 Çip (2024)",
    "desc": "Liquid Retina ekran, Apple Pencil Pro dəstəyi və günboyu davam edən enerji.",
    "price": 1290,
    "category": "electronics",
    "stock": 11,
    "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"128GB Wi-Fi\",\"256GB Wi-Fi\"]"
  },
  {
    "name": "Fujifilm X-T5 Fotoaparat Gövdəsi",
    "desc": "40.2 MP X-Trans CMOS 5 HR sensoru və 5 oxlu daxili təsvir sabitləşdirməsi (IBIS).",
    "price": 2850,
    "category": "electronics",
    "stock": 4,
    "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    "images": null,
    "variants": null
  },
  {
    "name": "Kindle Paperwhite 16GB Elektron Kitab",
    "desc": "6.8 düymlük parıltısız ekran, tənzimlənən isti işıq və 10 həftəlik batareya ömrü.",
    "price": 239,
    "category": "electronics",
    "stock": 19,
    "imageUrl": "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80",
    "images": "[\"https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80\"]",
    "variants": "[\"16GB Qara\",\"32GB Signature Edition\"]"
  }
]

  for (const item of products) {
    await prisma.product.create({ data: item })
  }

  console.log('Seed completed successfully with ' + products.length + ' products!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
