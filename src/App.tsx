function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 px-6 relative overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border bg-surface text-xs tracking-wide text-gray-400 backdrop-blur-sm animate-[fadeInUp_0.5s_ease_both]">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse shrink-0" />В разработке
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tighter text-center animate-[fadeInUp_0.5s_ease_0.1s_both]">
          Life Expenses
          <br />
          <span className="bg-gradient-to-r from-accent via-accent-light to-teal bg-clip-text text-transparent">
            as a Service
          </span>
        </h1>

        <p className="text-base text-gray-500 max-w-sm text-center leading-relaxed animate-[fadeInUp_0.5s_ease_0.2s_both]">
          Финансовый рентген: узнай реальную стоимость своей жизни.
        </p>
      </div>
    </div>
  )
}

export default App
