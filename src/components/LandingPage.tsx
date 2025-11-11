import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Gamepad2,
  Film,
  Tv,
  Sparkles,
  Zap,
  Target,
  Clock,
  LogIn,
  UserPlus,
  Menu,
  X,
  Star,
  TrendingUp,
  Shield,
  Smartphone,
  Heart,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Play,
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onRegister,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const archiviusRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const archiviusInView = useInView(archiviusRef, { once: true, amount: 0.2 });

  const features = [
    {
      icon: BookOpen,
      title: "Biblioteca Unificada",
      description: "Organize livros, games, filmes, séries e animes em um só lugar",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Estatísticas Detalhadas",
      description: "Acompanhe seu progresso com gráficos e métricas personalizadas",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Star,
      title: "Sistema de Avaliação",
      description: "Avalie e organize suas mídias favoritas com notas e tags",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Sparkles,
      title: "Archivius IA",
      description: "Assistente inteligente que recomenda baseado no seu gosto",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: "Marcos e Conquistas",
      description: "Celebre suas conquistas e acompanhe marcos importantes",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Smartphone,
      title: "Multiplataforma",
      description: "Acesse de qualquer dispositivo, sempre sincronizado",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  const stats = [
    { value: "5+", label: "Tipos de Mídia", icon: Film },
    { value: "∞", label: "Itens na Biblioteca", icon: BookOpen },
    { value: "100%", label: "Gratuito", icon: Heart },
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Gamer & Leitor",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Finalmente um lugar para organizar TUDO! Antes usava 3 apps diferentes.",
      rating: 5,
    },
    {
      name: "Maria Santos",
      role: "Cinéfila",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "O Archivius me ajudou a descobrir filmes incríveis que combinam com meu gosto!",
      rating: 5,
    },
    {
      name: "Pedro Costa",
      role: "Otaku",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      text: "Melhor que Skoob, MyAnimeList e tudo mais. Interface linda e funcional!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden relative">
      {/* Floating Particles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo.png" 
              alt="GeekLogg" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              GeekLogg
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLogin}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl border-2 border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300"
            >
              <LogIn size={18} />
              <span className="font-medium">Entrar</span>
            </button>
            <button
              onClick={onRegister}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              <UserPlus size={18} />
              <span className="font-medium">Começar Grátis</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg border border-cyan-400/30 hover:border-cyan-400 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogin();
                }}
                className="flex w-full items-center justify-center space-x-2 px-6 py-3 rounded-xl border-2 border-cyan-500/30 hover:border-cyan-500 transition-all"
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRegister();
                }}
                className="flex w-full items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500"
              >
                <UserPlus size={18} />
                <span>Começar Grátis</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Pulsing Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/20"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">
                A plataforma nerd definitiva
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Organize Sua Vida
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Geek em Um Lugar
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Livros, games, filmes, séries e animes. Tudo sincronizado,
              organizado e com IA para recomendar o que você vai amar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onRegister}
                className="group flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
              >
                <span className="text-lg font-semibold">Começar Grátis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onLogin}
                className="flex items-center space-x-3 px-8 py-4 rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                <span className="text-lg font-semibold">Ver Demo</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30">
                  <stat.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Funcionalidades Incríveis
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Tudo que você precisa para organizar e aproveitar sua coleção nerd
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Archivius Showcase Section */}
      <section ref={archiviusRef} className="py-20 px-6 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={archiviusInView ? { opacity: 1, x: 0 } : {}}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  Powered by AI
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Conheça o Archivius
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Seu assistente pessoal de IA que analisa seus gostos e recomenda 
                exatamente o que você vai amar. Ele aprende com você e fica cada 
                vez mais inteligente!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Recomendações Personalizadas</h4>
                    <p className="text-slate-400">Baseadas no seu histórico e preferências reais</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Análise Profunda</h4>
                    <p className="text-slate-400">Entende padrões e descobre joias ocultas para você</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Sempre Aprendendo</h4>
                    <p className="text-slate-400">Quanto mais você usa, melhor ele fica</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Archivius Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={archiviusInView ? { opacity: 1, x: 0 } : {}}
              className="relative"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <img 
                  src="/assets/archivius.png" 
                  alt="Archivius" 
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </motion.div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Amado Pelos Usuários
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Veja o que a comunidade está dizendo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-purple-500/10 border border-cyan-500/20 text-center space-y-6 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  Pronto Para Começar?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Junte-se a milhares de nerds organizando suas coleções
              </p>
              <button
                onClick={onRegister}
                className="inline-flex items-center space-x-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 text-lg font-semibold"
              >
                <span>Criar Conta Grátis</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo.png" 
                alt="GeekLogg" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                GeekLogg
              </span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 GeekLogg. Feito com ❤️ para a comunidade nerd.
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
