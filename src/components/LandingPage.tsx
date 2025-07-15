import React from "react";
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
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onRegister,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundImage:
                  "url(https://cdn.builder.io/api/v1/image/assets%2F7ba5873022eb4101ad2e05f96b2ac3d8%2F085f9520579a491c9159bed1a5a044b9)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <BookOpen size={20} className="text-white" />
            </div>
            <span
              className="text-2xl font-bold bg-clip-text text-transparent"
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
          <div className="flex items-center space-x-4">
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
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Background Elements */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ color: "rgba(139, 87, 42, 1)" }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-xl"></div>

          {/* Polygonal Elements */}
          <div className="absolute top-32 right-32 w-16 h-16 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-30 transform rotate-45"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-purple-400 to-cyan-500 opacity-40 transform rotate-12"></div>
          <div className="absolute top-1/2 right-10 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 opacity-50 transform -rotate-45"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-cyan-400/30 mb-6">
              <img
                src="https://cdn.builder.io/o/assets%2F53fb85410bed4449b8639be5961d64c4%2F87a559e7397a49c2a8d7403d3327a3c9?alt=media&token=75dd028d-c0cb-4b4d-96e1-b31a097ab25d&apiKey=53fb85410bed4449b8639be5961d64c4"
                alt="GeekLog Logo"
                className="w-24 h-24 object-contain mx-auto"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Viva sua jornada geek
            </span>
            <br />
            <span className="text-white">com estilo e inteligência</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            O diário definitivo para gamers, leitores e nerds. Registre suas
            aventuras, descubra novos mundos e deixe nossa IA guiar sua próxima
            missão épica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onRegister}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="flex items-center space-x-2">
                <Zap size={20} />
                <span>Comece AGORA</span>
              </span>
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 border border-cyan-400/50 rounded-lg font-semibold text-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
            >
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Suas aventuras, organizadas
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transforme suas experiências geek em uma jornada épica e bem
              documentada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companion IA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-cyan-400/30 mb-6">
              <Sparkles className="w-16 h-16 text-cyan-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Conheça o Archivius IA
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Seu assistente pessoal que entende seus gostos, analisa seu perfil
              e cria missões personalizadas para expandir seus horizontes geek
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
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
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-3xl p-8 max-w-4xl mx-auto">
              <p className="text-lg text-cyan-400 mb-4 font-semibold">
                ✨ Exemplo de Archivius IA
              </p>
              <p className="text-xl text-gray-300 italic leading-relaxed">
                "Notei que você adora RPGs e leu 3 livros de fantasia este mês.
                Que tal experimentar 'The Witcher 3' e depois ler os livros da
                saga? Criei uma missão especial: 'Jornada Completa do Bruxo' -
                jogue o game, leia os livros e assista a série!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-cyan-500/30 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-pink-500/30 to-transparent rounded-full blur-xl"></div>

          {/* More Polygonal Elements */}
          <div className="absolute top-20 right-1/4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-20 transform rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-500 opacity-25 transform -rotate-12"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Comece sua jornada épica
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Junte-se a milhares de nerds que já transformaram suas experiências
            em aventuras organizadas
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onRegister}
              className="group px-12 py-5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl font-bold text-xl hover:from-cyan-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/30"
            >
              <span className="flex items-center space-x-3">
                <Zap size={24} />
                <span>COMECE AGORA - É GRÁTIS</span>
              </span>
            </button>
          </div>

          <p className="text-gray-500 mt-8 text-lg">
            ⚡ Cadastro em 30 segundos • 🎮 Sem cartão de crédito • 🚀 Comece a
            usar imediatamente
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              GeekLog
            </span>
          </div>
          <p className="text-gray-500">
            © 2025 GeekLog. Feito com ❤️ para a comunidade geek.
          </p>
        </div>
      </footer>
    </div>
  );
};
