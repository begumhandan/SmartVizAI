SmartVizAI

Youtube Demo Video Link:https://youtu.be/26qW_9sGw_k

SmartVizAI, Antigravity + React + Vite + Vega-Lite kullanılarak geliştirilmiş otonom bir veri görselleştirme motorudur.
Kullanıcı sadece bir CSV/Excel dosyası yüklediğinde, sistem veriyi analiz eder ve Chartifier benzeri şekilde otomatik grafik önerileri sunar.

🔮 Proje Hakkında

Bu proje, Antigravity AI ile tasarladığım özel bir frontend mimarisi ve arayüz promptu kullanılarak oluşturuldu.
Amaç, Chartifier AI görünümünde çalışan, tamamen tarayıcı içinde işleyen “akıllı grafik öneri sistemi” geliştirmekti.

Antigravity’e verdiğim prompt, şu özelliklerde bir sistem üretmesini sağladı:

Dark tema + Glassmorphism premium UI

Orta kısımda komut/yükleme alanı

Sol tarafta Chatifier tarzı navigation

Yüklenen Excel/CSV → JSON dönüşümü

Kolon türü algılama

10’dan fazla grafik önerisi

Her önerinin altında Draw Chart butonu ile Vega-Lite çizimi

Bu README, geliştirme sürecinin tamamını ve dosya mimarisini belgelemek için hazırlandı.

✨ Özellikler

📁 Dosya Yükleme
CSV ve Excel (.xlsx) formatlarını destekler.

🧠 Otomatik Veri Analizi
Kolon tiplerini algılar:

Numeric

Categorical

Datetime

📊 Akıllı Görselleştirme Önerileri
Sistem otomatik olarak 10+ farklı grafik tipi önerir:
Line, Bar, Scatter, Bubble, Heatmap, Histogram, Boxplot, Density, Donut, Stacked Bar…

🎨 Premium UI

Glassmorphism

Tailwind CSS

Minimal Chatifier AI görünümü

Yumuşak animasyonlar

📈 Vega-Lite Entegrasyonu
Tüm grafikler otomatik üretilen Vega-Lite JSON ile çizilir.

🚀 Başlangıç

Bağımlılıkları yükle:

npm install


Geliştirme sunucusunu başlat:

npm run dev


Tarayıcıdan aç:
http://localhost:5173

🧩 Mimari
Dosya	Açıklama
src/lib/analyzer.ts	Yüklenen veriyi analiz edip grafik önerilerini oluşturan çekirdek motor.
src/components/FileUpload.tsx	Excel/CSV dosyalarını okur ve JSON’a dönüştürür.
src/components/ChartGrid.tsx	AI’ın önerdiği grafiklerin listesini ve Vega-Lite görsellerini gösterir.
src/components/ChartCard.tsx	Her bir grafik önerisinin kart tasarımı ve Draw Chart tetikleyicisi.
src/lib/vegaGenerator.ts	Önerilere göre Vega-Lite kodunu üreten modül.
🤖 Antigravity Prompt Stratejisi (Özet)

Bu proje Antigravity içinde özel bir prompt kullanılarak geliştirildi.
Prompta şunlar istendi:

Chartifier/NotebookLM tarzı arayüz

Frontend-only bir sistem

Veri yükleme + otomatik kolon tanıma

10+ grafik önerisi üretme

Vega-Lite JSON döndürme

Sadece JSON formatında çıktı verme

UI: dark theme + glassmorphism + shadowed cards

Bu sayede uygulama tamamen otomasyonlu bir veri analiz aracı haline getirildi.