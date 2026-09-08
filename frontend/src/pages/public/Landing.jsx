import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ContactModal from "@/components/ContactModal";
import hero from '@/assets/images/hero-img.webp';
import fitur1 from '@/assets/images/fitur-img-1.webp';
import fitur2 from '@/assets/images/fitur-img-2.webp';
import cta from '@/assets/images/cta-img.webp';

const Landing = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <div className="inline-flex bg-orange-50 border border-orange-400 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Platform Belajar Adaptif
                </div>
                
                <h1 className="font-bold text-5xl md:text-6xl text-gray-900 leading-tight mb-6">
                Belajar Dengan<br />
                <span className="text-primary">Cara Kamu</span><br />
                Sendiri
                </h1>
                
                <p className="text-gray-600 text-lg mb-8 max-w-md">
                AdaptLearn mengenali gaya belajarmu lewat kuis singkat, lalu merekomendasikan materi dalam format yang paling cocok untukmu
                </p>
                
                <Link to="/register">
                    <Button className="bg-primary hover:bg-orange-600 text-white px-8 py-6 rounded-full font-semibold shadow-lg text-lg">
                    Mulai Gratis Sekarang 
                    </Button>
                </Link>
            </div>
            
            {/* Foto Hero Section */}
            <div className="relative flex items-center justify-center min-h-[500px]">
                <div className="absolute top-5 right-5 w-56 h-56 bg-orange-200 rounded-full opacity-40"></div>
                <div className="absolute bottom-5 left-5 w-48 h-48 bg-yellow-200 rounded-full opacity-40"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-orange-100 rounded-full opacity-30"></div>
                
                <div className="absolute top-16 left-8 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-orange-400 opacity-80"></div>
                <div className="absolute bottom-24 right-16 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-yellow-400 opacity-70"></div>
                <div className="absolute top-1/2 left-2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-orange-300 opacity-60"></div>
                <div className="absolute bottom-1/3 right-8 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-yellow-300 opacity-50"></div>
                
                <div className="absolute top-1/4 left-1/4 w-24 h-24 border-4 border-orange-300 rounded-full opacity-30"></div>
                
                <div className="relative z-10 rounded-full overflow-hidden shadow-2xl w-[400px] h-[400px] transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src={hero} 
                    alt="Students learning together"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute top-10 right-1/3 w-3 h-3 bg-orange-400 rounded-full"></div>
                <div className="absolute bottom-16 left-1/4 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute top-2/3 right-12 w-2 h-2 bg-orange-300 rounded-full"></div>
            </div>
            </div>
        </section>

        <section className="bg-primary py-20">
            <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-12">
                Kamu Pernah Ngerasain Ini?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/50">
                <CardContent className="p-8">
                    <div className="text-6xl mb-4">😴</div>
                    <p className="text-gray-900 font-medium">
                    Banyak materi tapi gak cocok sama gaya belajarmu
                    </p>
                </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
                <CardContent className="p-8">
                    <div className="text-6xl mb-4">😵</div>
                    <p className="text-gray-900 font-medium">
                    Bingung mulai dari mana karena terlalu banyak pilihan
                    </p>
                </CardContent>
                </Card>
                
                <Card className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
                <CardContent className="p-8">
                    <div className="text-6xl mb-4">😤</div>
                    <p className="text-gray-900 font-medium">
                    Susah fokus karena format belajar yang monoton
                    </p>
                </CardContent>
                </Card>
            </div>
            </div>
        </section>

        {/* Fitur Unggulan */}
        <section className="bg-muted py-16" id="fitur">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <div className="inline-flex bg-orange-50 border border-orange-400 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Fitur Unggulan
                </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                <span className="font-bold text-gray-900">
                  Adapt<span className="text-primary">Learn </span>
                </span> 
                 Punya Semua yang Kamu Butuhkan untuk Belajar
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Platform ini dirancang agar proses belajarmu terasa personal, menyenangkan, dan efektif.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Card 1 */}
            <Card className="md:col-span-2 bg-white rounded-3xl shadow-md border-none hover:shadow-xl hover:bg-primary transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 flex flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                    <img 
                        src={fitur1} 
                        alt="Learning Together"
                        className="rounded-2xl w-24 h-32 md:w-48 md:h-64 object-cover"
                    />
                    </div>

                    <div className="flex-1">
                    <div className="w-12 h-12 bg-orange-200 group-hover:bg-white rounded-xl flex items-center justify-center mb-4 transition-colors">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-white mb-2 md:mb-3 transition-colors">
                        Materi yang Pas Untukmu
                    </h3>
                    <p className="text-gray-600 group-hover:text-white leading-relaxed text-xs md:text-sm transition-colors">
                        Sistem otomatis merekomendasikan video atau teks interaktif sesuai gaya belajarmu.
                    </p>
                    </div>
                </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white rounded-3xl shadow-md border-none hover:shadow-xl hover:bg-primary transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-200 group-hover:bg-white rounded-xl flex items-center justify-center my-2 transition-colors">
                    <span className="text-2xl">🔎</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">
                    Kenali Gaya Belajarmu
                  </h3>
                  <p className="text-gray-600 group-hover:text-white leading-relaxed text-sm transition-colors">
                    Isi kuis dan sistem langsung mendeteksi tipe belajar terbaikmu
                  </p>
                </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white rounded-3xl shadow-md border-none hover:shadow-xl hover:bg-primary transition-all duration-300 group">
                <CardContent className="p-8">
                    <div className="w-12 h-12 bg-orange-200 group-hover:bg-white rounded-xl flex items-center justify-center mb-4 transition-colors">
                        <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">
                        Pantau Progress Belajarmu
                    </h3>
                    <p className="text-gray-600 group-hover:text-white leading-relaxed text-sm transition-colors">
                        Dashboard interaktif menampilkan level, topik selesai, dan progress belajar secara real-time.
                    </p>
                </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="md:col-span-2 bg-white rounded-3xl shadow-md border-none hover:shadow-xl hover:bg-primary transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 relative">
                    <div className="w-12 h-12 bg-orange-200 group-hover:bg-white rounded-xl flex items-center justify-center mb-4 transition-colors">
                        <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">
                        Berkembang di Level yang Tepat
                    </h3>
                    <p className="text-gray-600 group-hover:text-white leading-relaxed text-sm mb-4 transition-colors">
                        Sistem secara otomatis menyesuaikan tingkat kesulitan materi seiring perkembanganmu. Dari pemula hingga mahir, tanpa perlu mengatur apapun secara manual.
                    </p>
                    <div className="mt-4">
                        <img 
                        src={fitur2}
                        alt="Collaboration"
                        className="rounded-xl w-full h-32 object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
            </div>
          </div>
        </section>

        {/* Mulai Dalam 3 Langkah Praktis */}
        <section id="langkah-mulai" className="bg-gradient-to-b from-muted-50 via-muted-100 to-orange-300 py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
              Mulai Dalam 3 Langkah Praktis
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto mb-16">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Daftar Gratis</h3>
                <div className="bg-white px-6 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-md">
                  30 Detik
                </div>
              </div>

              <div className="hidden md:block w-24 h-1 bg-orange-400"></div>

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white border-4 border-orange-400 rounded-full flex items-center justify-center text-orange-400 text-4xl font-bold mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Isi Kuis Gaya Belajar</h3>
                <div className="bg-white px-6 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-md">
                  2 Menit
                </div>
              </div>

              <div className="hidden md:block w-24 h-1 bg-orange-400"></div>

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mulai Belajar</h3>
                <div className="bg-white px-6 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-md">
                  Kapanpun
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hasil yang Sesuai Gaya Belajarmu */}
        <section id="gaya-belajar" className="bg-orange-300 pb-24">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto bg-primary border-2 border-white/50 shadow-2xl">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                  Hasil yang Sesuai Gaya Belajarmu
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white rounded-2xl shadow-lg border-none hover:scale-105 transition-transform">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Learner</h3>
                      <p className="text-gray-600 text-sm">Belajar dengan video dan gambar</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-2xl shadow-lg border-none hover:scale-105 transition-transform">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Text Enjoyer</h3>
                      <p className="text-gray-600 text-sm">Belajar dengan membaca artikel</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-18 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={cta}
              alt="Happy students"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-orange-600/90"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Memulai Perjalanan Belajarmu?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan kami untuk merasakan cara belajar yang lebih efektif dan menyenangkan
            </p>
            <Link to="/login">
                <Button className="bg-white text-orange-500 hover:bg-gray-100 px-10 py-6 text-lg font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
                Cari Tahu Gaya Belajarmu Sekarang!
                </Button>
            </Link>
          </div>
        </section>

        {/* Button Modal Contact */}
        <button
          onClick={() => setIsContactOpen(true)}
          className="group fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl z-50 transition-all duration-300 flex items-center gap-2 overflow-hidden"
        >
          <div className="p-4 pr-2">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 whitespace-nowrap pr-0 group-hover:pr-4 font-semibold">
            Butuh Bantuan?
          </span>
        </button>

        {/* Contact Modal */}
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};

export default Landing;