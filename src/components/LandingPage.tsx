import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Gamepad2,
  Monitor,
  BarChart3,
  Sparkles,
  Zap,
  Target,
  Clock,
  LogIn,
  UserPlus,
  Menu,
  X,
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
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
            {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 px-6 py-4"
      >
        <nav className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundImage:
                  "url(https://cdn.builder.io/api/v1/image/assets%2F7ba5873022eb4101ad2e05f96b2ac3d8%2F085f9520579a491c9159bed1a5a044b9)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <span
              className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundColor: "#5192c0",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              GeekLog
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={onLogin}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-cyan-400/30 hover:border-cyan-400 transition-colors"
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button
              onClick={onRegister}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all"
            >
              <UserPlus size={18} />
              <span>Cadastre-se</span>
            </button>
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden p-2 rounded-lg border border-cyan-400/30 hover:border-cyan-400"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
                </nav>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden absolute top-full right-6 mt-2 w-40 bg-gray-800 rounded-xl border border-cyan-500/20 shadow-lg"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogin();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-t-xl"
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onRegister();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-b-xl"
            >
              <UserPlus size={18} />
              <span>Cadastre-se</span>
                        </button>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-transparent rounded-full blur-xl hidden sm:block"></div>
          <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-xl hidden sm:block"></div>

          {/* Polygonal Elements */}
          <div className="absolute top-32 right-32 w-16 h-16 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-30 transform rotate-45 hidden sm:block"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-purple-400 to-cyan-500 opacity-40 transform rotate-12 hidden sm:block"></div>
          <div className="absolute top-1/2 right-10 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 opacity-50 transform -rotate-45 hidden sm:block"></div>
        </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <div
              className="inline-block p-2 sm:p-3 rounded-2xl backdrop-blur-sm mb-4 sm:mb-6"
              style={{ border: "1px solid rgba(255, 255, 255, 0)" }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7ba5873022eb4101ad2e05f96b2ac3d8%2Fbd81ba3a237e40ffa01e2bae2f67765f"
                alt="GeekLog Logo"
                className="object-contain mx-auto w-full max-w-[300px] h-auto sm:max-w-[400px] md:max-w-[600px] lg:max-w-[827px]"
                style={{ maxHeight: "200px" }}
              />
            </div>
          </motion.div>

                    <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 200%" }}
            >
              Viva sua jornada geek
            </motion.span>
            <br />
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-white"
            >
              com estilo e inteligência
            </motion.span>
          </motion.h1>

                    <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            O diário definitivo para gamers, leitores e nerds. Registre suas
            aventuras, descubra novos mundos e deixe nossa IA guiar sua próxima
            missão épica.
          </motion.p>

                    <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <motion.button
              onClick={onRegister}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap size={18} className="sm:w-5 sm:h-5" />
                </motion.div>
                <span>Comece AGORA</span>
              </span>
            </motion.button>
            <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.02, borderColor: "#06b6d4" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 border border-cyan-400/50 rounded-lg font-semibold text-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
            >
              Já tenho conta
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
                    <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4"
            >
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Suas aventuras, organizadas
              </span>
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4"
            >
              Transforme suas experiências geek em uma jornada épica e bem
              documentada
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Biblioteca Pessoal",
                description:
                  "Organize livros, mangás, quadrinhos e sua lista de leitura",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: Gamepad2,
                title: "Gaming Journal",
                description:
                  "Acompanhe jogos, conquistas, tempo de jogo e reviews",
                color: "from-pink-400 to-purple-500",
              },
              {
                icon: Monitor,
                title: "Watchlist",
                description:
                  "Filmes, séries, animes - nunca mais esqueça o que assistir",
                color: "from-purple-400 to-indigo-500",
              },
              {
                icon: BarChart3,
                title: "Estatísticas",
                description:
                  "Veja seus padrões, evolução e marcos da sua jornada",
                color: "from-indigo-400 to-cyan-500",
              },
                        ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.1)"
                  }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}
                  >
                    <feature.icon
                      size={20}
                      className="sm:w-6 sm:h-6 text-white"
                    />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companion IA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        </div>

                        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              className="inline-block p-3 sm:p-4 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-cyan-400/30 mb-4 sm:mb-6"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400" />
              </motion.div>
            </motion.div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-4">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Conheça o Archivius IA
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Seu assistente pessoal que entende seus gostos, analisa seu perfil
              e cria missões personalizadas para expandir seus horizontes geek
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Target,
                title: "Missões Personalizadas",
                description:
                  "Baseado no seu histórico, receba desafios únicos: 'Leia 3 sci-fi este mês' ou 'Explore jogos indie'",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: Sparkles,
                title: "Recomendações Inteligentes",
                description:
                  "IA que aprende seus padrões e sugere o próximo livro, jogo ou série perfeito para você",
                color: "from-pink-400 to-purple-500",
              },
              {
                icon: Clock,
                title: "Narrativa da Jornada",
                description:
                  "Transforme seus dados em uma história épica da sua evolução como nerd/geek",
                color: "from-purple-400 to-indigo-500",
              },
                        ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0, rotateY: 90 }}
                whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.3
                }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(6, 182, 212, 0.15)"
                  }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-cyan-400/50 transition-all duration-500"
                >
                  <motion.div
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}
                  >
                    <feature.icon
                      size={24}
                      className="sm:w-7 sm:h-7 text-white"
                    />
                  </motion.div>
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                    className="text-gray-400 leading-relaxed text-base sm:text-lg"
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </div>

                    <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(6, 182, 212, 0.1)"
              }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto"
            >
              <motion.p
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg text-cyan-400 mb-3 sm:mb-4 font-semibold"
              >
                ✨ Exemplo de Archivius IA
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl text-gray-300 italic leading-relaxed"
              >
                "Notei que você adora RPGs e leu 3 livros de fantasia este mês.
                Que tal experimentar 'The Witcher 3' e depois ler os livros da
                saga? Criei uma missão especial: 'Jornada Completa do Bruxo' -
                jogue o game, leia os livros e assista a série!"
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="absolute top-10 left-5 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-cyan-500/30 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-5 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-pink-500/30 to-transparent rounded-full blur-xl"></div>

          {/* More Polygonal Elements */}
          <div className="absolute top-20 right-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-20 transform rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-cyan-500 opacity-25 transform -rotate-12"></div>
        </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Comece sua jornada épica
            </span>
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed px-4"
          >
            Junte-se a milhares de nerds que já transformaram suas experiências
            em aventuras organizadas
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
          >
            <motion.button
              onClick={onRegister}
              whileHover={{
                scale: 1.1,
                y: -5,
                boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl font-bold text-xl hover:from-cyan-600 hover:to-pink-600 transition-all shadow-2xl"
            >
              <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap size={20} className="sm:w-6 sm:h-6" />
                </motion.div>
                <span className="text-sm sm:text-base lg:text-lg">
                  COMECE AGORA - É GRÁTIS
                </span>
              </span>
            </motion.button>
          </motion.div>

          <p className="text-gray-500 mt-6 sm:mt-8 text-sm sm:text-base lg:text-lg px-4 leading-relaxed">
            ⚡ Cadastro em 30 segundos • 🎮 Sem cartão de crédito • 🚀 Comece a
            usar imediatamente
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              GeekLog
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-500">
            © 2025 GeekLog. Feito com ❤️ para a comunidade geek.
          </p>
        </div>
      </footer>
    </div>
  );
};