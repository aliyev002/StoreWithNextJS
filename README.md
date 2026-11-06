# Mağaza — Müasir E-Ticarət Platforması (Next.js 15)

Azərbaycan dilində hazırlanmış, yüksək performanslı, tam funksional və müasir minimalist dizayna malik onlayn mağaza tətbiqi.

---

## Əlaqə Məlumatları

- Telefon / WhatsApp: +994 55 333 92 20 (055 333 92 20)
- Instagram: [@aliyevt_02](https://instagram.com/aliyevt_02)
- Dəstək saatları: Həftənin hər günü 09:00 - 21:00

---

## Texnoloji Stack

- Framework: Next.js 15 (App Router, Server Actions, Route Handlers)
- Kitabxana: React 19
- Verilənlər Bazası: SQLite + Prisma ORM
- Dizayn və Stil: Tailwind CSS v4
- İkon Paketi: Lucide React (Vektorial və təmiz SVG ikonlar)
- Data Fetching: SWR
- Təhlükəsizlik: JWT (JSON Web Tokens) + Bcrypt (Şifrə hashləmə) + HttpOnly Cookies

---

## Əsas Funksionallıqlar

Platforma real elektron ticarət tələblərinə cavab verən imkanlarla təchiz edilmişdir:

### 1. Məhsul Kataloqu və Təkmil Axtarış
- Kateqoriyalar: Ayaqqabılar (shoes), Geyim (clothing), Elektronika (electronics) və "Hamısı" filtri.
- Canlı Axtarış: Məhsul adına və təsvirinə görə anlıq axtarış.
- Sıralama: Ən yenilər, Qiymət: Ucuzdan bahaya, Qiymət: Bahadan ucuza.
- Təkmil Filtrləmə: Minimum və maksimum qiymət aralığı seçimi, yalnız stokda olan məhsulları göstərmə filtri.
- Orta Reytinq Göstəricisi: Məhsul kartında ulduzlar və rəy sayı.

### 2. Məhsul Detalı Səhifəsi
- Çoxşəkilli Qalereya: Əsas şəkil və altındakı miniatürlər (thumbnails) vasitəsilə məhsula fərqli bucaqlardan baxış.
- Çeşidlər / Ölçülər (Variants): Ayaqqabı üçün razmerlər (41, 42, 43), geyim üçün ölçülər (S, M, L, XL), elektronika üçün rəng və yaddaş variantları.
- Anbar Qalığı İzləməsi: Məhsulun real stok miqdarı göstərilir. Stok bitdikdə "Tükənib" nişanı çıxır və səbətə atılması bloklanır.
- WhatsApp ilə Sürətli Sifariş: Tək kliklə WhatsApp açılır və məhsulun adı, seçilmiş variantı, qiyməti və birbaşa linki 055 333 92 20 nömrəsinə hazır mesaj kimi yönləndirilir.

### 3. 5 Ulduzlu Müştəri Rəyləri
- İstifadəçilər məhsul səhifəsində 1-dən 5-ə qədər ulduz seçərək təcrübələrini və şərhlərini paylaşa bilirlər.
- Hər məhsul üçün orta reytinq avtomatik hesablanır və həm kataloqda, həm də detalda əks olunur.

### 4. Bəyəndiklərim / İstək Siyahısı (Wishlist)
- Məhsul kartındakı ürək ikonu ilə bəyənilənlərə əlavə etmə və ya çıxarma.
- /wishlist səhifəsində bütün seçilmiş məhsullara baxış və tək kliklə səbətə köçürmə imkanı.

### 5. Alış-veriş Səbəti
- Məhsulun seçilmiş variantı (razmeri) ilə birlikdə səbətə yığılması.
- Miqdarı artırıb-azaltma (+ / -) və tam silmə düymələri.
- Navbar üzərində real vaxtda yenilənən dinamik səbət sayğac rozeti (Badge).

### 6. Sifarişin Rəsmiləşdirilməsi (Checkout)
- Promokod / Kupon Sistemi: Kupon kodu daxil edildikdə endirim anında hesablanır və yekun məbləğdən çıxılır.
- Ödəniş Üsulu Seçimi:
  - Qapıda Nağd Ödəniş
  - Onlayn Bank Kartı ilə Ödəniş (Kart nömrəsi, MM/YY, CVV xanaları).
- Sifariş tamamlandıqda avtomatik olaraq hər bir məhsulun anbar stoku azaldılır.

### 7. Sifarişlərim və PDF İnvoys Çapı
- İstifadəçinin bütün cari və keçmiş sifarişlərinin statusu (Gözləmədə, Təsdiqləndi, Yoldadır, Təhvil verildi, Ləğv edildi).
- PDF İnvoys / Çap Etmə: Rəsmi qəbz formatında printerdən çıxarmaq və ya PDF olaraq saxlamaq imkanı.

### 8. Tam İdarəetmə Paneli (Admin Dashboard)
- Yalnız admin istifadəçilər üçün /admin paneli:
  - Statistika: Ümumi gəlir, toplam sifariş sayı, müştəri sayı, ən son sifarişlər və stoku tükənmək üzrə olan məhsullar.
  - Məhsul İdarəetməsi (/admin/products): Yeni məhsul əlavə etmək (qalereya şəkilləri, çeşidlər, stok), cədvəl üzərindən qiymət və stoku anında redaktə etmək və silmək.
  - Sifariş İdarəetməsi (/admin/orders): Bütün müştəri sifarişlərinin statusunu birbaşa dropdown ilə dəyişmək.

---

## Giriş Məlumatları və Promokodlar

### Admin Giriş Məlumatları:
Admin panelinə daxil olmaq üçün sistemdə hazır admin hesabı mövcuddur:
- Giriş Səhifəsi: http://localhost:3000/signin
- Elektron Poçt (Email): admin@magaza.az
- Şifrə (Password): admin123
- Qeyd: Admin kimi daxil olduqdan sonra yuxarı naviqasiya menyusunda xüsusi "Admin Panel" düyməsi aktivləşir.

---

### Aktiv Promokodlar (Kuponlar):
Səbət və Checkout səhifəsində endirim qazanmaq üçün aşağıdakı kodlardan istifadə edə bilərsiniz:

| Kupon Kodu | Endirim Növü | Minimum Sifariş | Açıqlama |
|---|---|---|---|
| BAHAR20 | 20% Endirim | 50 AZN | Bütün sifariş məbləğindən 20% faiz çıxılır |
| START10 | 10 AZN Endirim | 30 AZN | Sifarişdən birbaşa 10 AZN sabit endirim |
| VIP50 | 50% Endirim | 100 AZN | VIP müştərilər üçün böyük endirim |

---

## Quraşdırma və İşə Salma

Layihəni lokal mühitdə işə salmaq üçün addımlar:

1. Asılılıqları quraşdırın:
```bash
npm install
```

2. Verilənlər bazasını sinxronlaşdırın:
```bash
npx prisma db push
```

3. Nümunə məlumatları və admini bazaya yükləyin:
```bash
npx tsx prisma/seed.ts
```

4. Tətbiqi inkişaf (Development) rejimində başladın:
```bash
npm run dev
```

Brauzerdə http://localhost:3000 ünvanına daxil olun.

---

## Qovluq Strukturu

```
my-app/
├── app/
│   ├── page.js                    <-- Ana səhifə (Hero, kateqoriyalar, seçilmişlər)
│   ├── layout.js                  <-- Əsas Layout (Sticky Navbar, CartBadge, Footer, Toast)
│   ├── globals.css                <-- Qlobal stillər və tipoqrafiya
│   │
│   ├── components/                <-- UI Komponentləri (CartBadge, Toast bildirişləri)
│   ├── products/                  <-- Məhsul kataloqu, axtarış və filtrlər
│   │   └── [id]/                  <-- Məhsul detalı, qalereya, variantlar, WhatsApp və rəylər
│   │
│   ├── cart/                      <-- Səbət səhifəsi (ədəd idarəsi, silmə)
│   ├── checkout/                  <-- Sifariş formu (Kupon tətbiqi, Kart/Nağd seçimi)
│   ├── wishlist/                  <-- Bəyəndiklərim (İstək siyahısı)
│   ├── orders/                    <-- Sifarişlər siyahısı
│   │   └── [id]/                  <-- Fərdi sifariş detalı və PDF İnvoys çapı
│   │
│   ├── profile/                   <-- İstifadəçi profili və statistikası
│   ├── signin/ & signup/          <-- Giriş və Qeydiyyat səhifələri
│   │
│   ├── admin/                     <-- Admin Dashboard
│   ├── admin/products/            <-- Admin: Məhsul CRUD və stok idarəsi
│   └── admin/orders/              <-- Admin: Sifariş statuslarının dəyişdirilməsi
│   │
│   └── api/                       <-- Backend API Route Handlers
│       ├── products/              <-- Məhsul axtarışı və filtrləmə API
│       ├── checkout/              <-- Sifariş və stok azaldılması API
│       ├── coupons/apply/         <-- Promokod yoxlanılması API
│       ├── wishlist/              <-- İstək siyahısı əməliyyatları API
│       ├── reviews/               <-- 5 ulduzlu rəy bildirmə API
│       ├── orders-list/           <-- Sifarişlərin gətirilməsi və ləğv API
│       └── admin/                 <-- Admin statistika, məhsul və sifariş API-ləri
│
├── prisma/
│   ├── schema.prisma              <-- Verilənlər bazası sxemi
│   └── seed.ts                    <-- 36 məhsul, kuponlar və admin istifadəçisi
│
├── utils/
│   └── cart.js                    <-- LocalStorage səbət idarəetməsi və eventlər
└── lib/
    ├── prisma.js                  <-- Prisma Client singleton
    └── auth.js                    <-- JWT cookie autentifikasiyası
```

---

## Lisenziya
Bu layihə fərdi və kommersiya məqsədli istifadə üçün açıqdır.
