# 🚀 SmartVizAI

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vega-Lite](https://img.shields.io/badge/Vega--Lite-20232A?style=for-the-badge&logo=vega&logoColor=white)](https://vega.github.io/vega-lite/)

**SmartVizAI**, Antigravity + React + Vite + Vega-Lite teknolojileri kullanılarak geliştirilmiş, **otonom bir veri görselleştirme motorudur**. Kullanıcı sadece bir CSV veya Excel dosyası yükler, sistem veriyi analiz eder ve en uygun grafik önerilerini otomatik olarak sunar.

📺 [**Youtube Demo Video**](https://youtu.be/26qW_9sGw_k)

---

## 🔮 Proje Hakkında

Bu proje, modern veri analitik araçlarının (Chartifier, NotebookLM vb.) kullanıcı deneyimini tarayıcı tabanlı bir mimariyle sunmayı hedefler. **Antigravity AI** ile tasarlanan özel frontend mimarisi sayesinde, sunucu tarafı işlemeye ihtiyaç duymadan, tamamen **client-side** çalışan akıllı bir sistemdir.

**Temel Hedef:** Veri yükle -> Otomatik Analiz -> Anında Görselleştirme.

### Antigravity Prompt Stratejisi
Proje, Antigravity'e verilen özel bir prompt ile şu özellikleri kazanmıştır:
- **Dark Theme & Glassmorphism:** Premium ve modern bir arayüz.
- **Frontend-Only:** Sunucu maliyeti olmadan çalışan mimari.
- **Otomatik Kolon Tanıma:** Sayısal, kategorik ve tarihsel verileri ayırt etme.
- **Akıllı Öneriler:** Veri setine uygun 10+ farklı grafik türü (Line, Bar, Scatter, Heatmap vb.).

---

## ✨ Özellikler

### 📁 Çoklu Format Desteği
- **CSV** ve **Excel (.xlsx)** dosyalarını sürükleyip bırakarak yükleyin.
- Otomatik JSON dönüşümü ile anında işleme.

### 🧠 Akıllı Veri Analizi
Sistem, yüklenen verinin yapısını otomatik olarak algılar:
- **Numeric:** Satış sayıları, sıcaklık değerleri vb.
- **Categorical:** Ürün kategorileri, şehir isimleri vb.
- **Datetime:** Gün, ay, yıl bilgileri.

### 📊 Dinamik Grafik Önerileri
Veri setinize en uygun grafikleri otomatik olarak belirler ve **Vega-Lite** spesifikasyonu üretir:
- 📈 Line Chart
- 📊 Bar & Stacked Bar Chart
- 🔘 Scatter & Bubble Plot
- 🔥 Heatmap
- 📉 Histogram & Density Plot
- 🍩 Donut Chart
- 📦 Boxplot

### 🎨 Premium UI/UX
- **Glassmorphism:** Buzlu cam efektleri ve yumuşak gölgeler.
- **Tailwind CSS:** Hızlı ve duyarlı tasarım.
- **Animasyonlar:** Akıcı geçişler ve hover efektleri.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1. **Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/begumhandan/SmartVizAI.git
   cd SmartVizAI
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda Açın:**
   `http://localhost:5173` adresine gidin.

---

## 🧩 Proje Mimarisi

| Dosya | Açıklama |
|---|---|
| `src/lib/analyzer.ts` | **Çekirdek Motor:** Veriyi analiz eder ve grafik önerilerini oluşturur. |
| `src/components/FileUpload.tsx` | Dosya yükleme, okuma ve JSON dönüşüm işlemlerini yönetir. |
| `src/components/ChartGrid.tsx` | Önerilen grafikleri grid yapısında listeler. |
| `src/components/ChartCard.tsx` | Tekil grafik kartı bileşeni. Vega-Lite çizimini tetikler. |
| `src/lib/vegaGenerator.ts` | Analiz sonuçlarına göre Vega-Lite JSON kodunu üreten modül. |
| `src/lib/utils.ts` | Yardımcı fonksiyonlar ve tip tanımları. |

---

## 📸 Ekran Görüntüleri

*(Buraya projenin ekran görüntülerini ekleyebilirsiniz)*

---

## 🤝 Katkıda Bulunma

1. Forklayın
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Commit atın (`git commit -m 'Yeni özellik eklendi'`)
4. Pushlayın (`git push origin feature/YeniOzellik`)
5. Pull Request açın

---

**Geliştirici:** Begüm Handan