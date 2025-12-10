import React, { useEffect, useMemo, useState } from 'react'

const buddies = [
  {
    id: 'nova',
    name: 'Nova',
    label: 'Curious Explorer',
    icon: '✨',
    tone: 'gentle and encouraging',
  },
  {
    id: 'river',
    name: 'River',
    label: 'Calm Listener',
    icon: '🌊',
    tone: 'soothing and steady',
  },
  {
    id: 'kai',
    name: 'Kai',
    label: 'Brave Player',
    icon: '🎮',
    tone: 'adventurous and upbeat',
  },
  {
    id: 'sky',
    name: 'Sky',
    label: 'Lightfoot Friend',
    icon: '☁️',
    tone: 'light and playful',
  },
]

const emotions = [
  { id: 'calm', label: 'Calm', icon: '🙂' },
  { id: 'wiggly', label: 'Wiggly', icon: '🤸' },
  { id: 'tired', label: 'Tired', icon: '😴' },
  { id: 'excited', label: 'Excited', icon: '🤩' },
]

const tensionAreas = [
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'bow-hand', label: 'Bow Hand' },
  { id: 'neck-jaw', label: 'Neck / Jaw' },
  { id: 'all-good', label: 'All good' },
]

const activitiesLibrary = [
  {
    id: 'bow-ready-goes',
    title: 'Bow Ready Goes',
    durationMinutes: 2,
    icon: '🎻',
    helperText: 'Violin under your chin, quiet feet, soft shoulders. Start and stop your bow together.',
  },
  {
    id: 'finger-taps-a',
    title: 'Finger Taps on A',
    durationMinutes: 2,
    icon: '🖐️',
    helperText: 'On the A string, tap your fingers down and lift them gently like tiny dancers.',
  },
  {
    id: 'tiny-bows-middle',
    title: 'Tiny Bows in Middle',
    durationMinutes: 2,
    icon: '📏',
    helperText: 'Use the middle of your bow. Make short, quiet bows that feel smooth.',
  },
  {
    id: 'listen-air-bow',
    title: 'Listen & Air-Bow',
    durationMinutes: 3,
    icon: '🎧',
    helperText: 'Imagine your song in your head and move your bow in the air while you listen inside.',
  },
]

const reframePhrases = {
  calm: {
    header: 'Sometimes violin feels calm and slow.',
    positive: 'Calm practice helps your sound grow strong and steady.',
  },
  wiggly: {
    header: 'Sometimes our bodies feel wiggly.',
    positive: 'Tiny focused games help wiggles turn into music energy.',
  },
  tired: {
    header: 'Sometimes we feel tired.',
    positive: 'Even a tiny bit of gentle practice still grows your violin skills.',
  },
  excited: {
    header: 'Sometimes we feel super excited.',
    positive: 'We can use that excitement to try fun, short practice adventures.',
  },
  default: {
    header: 'Sometimes violin can feel a little tricky.',
    positive: 'Trying small steps is brave. Every little try helps.',
  },
}

const reflectionOptions = [
  { id: 'good', label: 'Good', icon: '👍', aria: 'Felt good' },
  { id: 'okay', label: 'Okay', icon: '😐', aria: 'Felt okay' },
  { id: 'tricky', label: 'Tricky', icon: '👎', aria: 'Felt tricky' },
]

function App() {
  const [step, setStep] = useState('buddy') // buddy | checkin | reframe | practice | summary
  const [selectedBuddyId, setSelectedBuddyId] = useState(null)
  const [selectedEmotionId, setSelectedEmotionId] = useState(null)
  const [selectedTensionIds, setSelectedTensionIds] = useState([])

  const [sessionActivities, setSessionActivities] = useState([])
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)

  const [activityTimeLeft, setActivityTimeLeft] = useState(null) // in seconds
  const [timerRunning, setTimerRunning] = useState(false)

  const [activityReflections, setActivityReflections] = useState({}) // { [activityId]: 'good' | 'okay' | 'tricky' }
  const [showReflection, setShowReflection] = useState(false)

  const buddy = useMemo(
    () => buddies.find((b) => b.id === selectedBuddyId) || null,
    [selectedBuddyId],
  )

  const currentActivity = useMemo(
    () => sessionActivities[currentActivityIndex] || null,
    [sessionActivities, currentActivityIndex],
  )

  useEffect(() => {
    let intervalId
    if (timerRunning && activityTimeLeft != null && activityTimeLeft > 0) {
      intervalId = window.setInterval(() => {
        setActivityTimeLeft((prev) => {
          if (prev == null) return prev
          if (prev <= 1) {
            setTimerRunning(false)
            setShowReflection(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [timerRunning, activityTimeLeft])

  function handleSelectBuddy(id) {
    setSelectedBuddyId(id)
  }

  function handleContinueFromBuddy() {
    if (!selectedBuddyId) return
    setStep('checkin')
  }

  function toggleTension(id) {
    if (id === 'all-good') {
      setSelectedTensionIds(['all-good'])
      return
    }
    setSelectedTensionIds((prev) => {
      const withoutAllGood = prev.filter((t) => t !== 'all-good')
      if (withoutAllGood.includes(id)) {
        return withoutAllGood.filter((t) => t !== id)
      }
      return [...withoutAllGood, id]
    })
  }

  function handleContinueFromCheckin() {
    if (!selectedEmotionId) return
    setStep('reframe')
  }

  function getReframe() {
    if (!selectedEmotionId) return reframePhrases.default
    return reframePhrases[selectedEmotionId] || reframePhrases.default
  }

  function startPracticeMenu() {
    const shuffled = [...activitiesLibrary].sort(() => Math.random() - 0.5)
    const count = 3
    const chosen = shuffled.slice(0, count)
    setSessionActivities(chosen)
    setCurrentActivityIndex(0)
    setActivityReflections({})
    setShowReflection(false)
    if (chosen[0]) {
      setActivityTimeLeft(chosen[0].durationMinutes * 60)
      setTimerRunning(false)
    }
    setStep('practice')
  }

  function handleStartTimer() {
    if (!currentActivity) return
    if (activityTimeLeft == null || activityTimeLeft === 0) {
      setActivityTimeLeft(currentActivity.durationMinutes * 60)
    }
    setShowReflection(false)
    setTimerRunning(true)
  }

  function handleReflection(optionId) {
    if (!currentActivity) return
    setActivityReflections((prev) => ({ ...prev, [currentActivity.id]: optionId }))
    setShowReflection(false)

    const isLast = currentActivityIndex === sessionActivities.length - 1
    if (isLast) {
      setStep('summary')
      setTimerRunning(false)
      setActivityTimeLeft(null)
    } else {
      const nextIndex = currentActivityIndex + 1
      setCurrentActivityIndex(nextIndex)
      const next = sessionActivities[nextIndex]
      setActivityTimeLeft(next.durationMinutes * 60)
      setTimerRunning(false)
    }
  }

  function activityReflectionLabel(activityId) {
    const val = activityReflections[activityId]
    if (!val) return 'Not yet reflected'
    const opt = reflectionOptions.find((o) => o.id === val)
    return opt ? opt.label : 'Not yet reflected'
  }

  function deriveOverallMood() {
    const values = Object.values(activityReflections)
    if (!values.length) return 'We noticed how practice felt today.'

    const counts = values.reduce(
      (acc, val) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
      },
      {},
    )

    let top = 'good'
    let max = -1
    for (const key of Object.keys(counts)) {
      if (counts[key] > max) {
        max = counts[key]
        top = key
      }
    }

    switch (top) {
      case 'good':
        return 'Most of today felt good. Your practice superpowers grew!'
      case 'okay':
        return 'A lot of today felt okay. Steady steps still count.'
      case 'tricky':
        return 'Today felt a bit tricky. That means your brain was learning new paths.'
      default:
        return 'We noticed how practice felt today.'
    }
  }

  const reframe = getReframe()

  return (
    <main>
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-4 sm:mb-6 flex flex-col gap-2 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 mx-auto mb-2">
            <span role="img" aria-hidden="true">
              🎻
            </span>
            <span>Violin Practice Pals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            Tiny practice adventures, one buddy at a time.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            A calm, playful companion for short violin practice sessions — made for wiggly brains,
            big feelings, and growing musicians.
          </p>
        </header>

        {step === 'buddy' && (
          <section className="section-shell" aria-label="Choose practice buddy">
            <div className="section-body">
              <div className="flex flex-col gap-2">
                <h2 className="section-title">Choose your practice pal</h2>
                <p className="section-subtitle">
                  Pick a buddy to adventure with. They&apos;ll cheer you on while you practice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {buddies.map((b) => {
                  const isSelected = b.id === selectedBuddyId
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBuddy(b.id)}
                      className={`flex flex-col items-start gap-2 rounded-3xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                        isSelected
                          ? 'border-accent bg-accentMuted/60 shadow-soft'
                          : 'border-slate-700 bg-slate-900/60 hover:bg-slate-900'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {b.icon}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-base sm:text-lg font-semibold text-slate-50">
                          {b.name}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-300">{b.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                  You can change your buddy next time. Right now, just pick the one that feels fun.
                </p>
                <button
                  type="button"
                  className="button-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={handleContinueFromBuddy}
                  disabled={!selectedBuddyId}
                >
                  Let&apos;s check in
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'checkin' && (
          <section className="section-shell" aria-label="Check in before practice">
            <div className="section-body">
              <div className="flex flex-col gap-2">
                <h2 className="section-title">How are you feeling?</h2>
                <p className="section-subtitle">
                  {buddy
                    ? `${buddy.name} says: Before we play, let&apos;s notice how your body and feelings are doing.`
                    : 'Before we play, let’s notice how your body and feelings are doing.'}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="chip" aria-label="Choose your feeling">
                    <span role="img" aria-hidden="true">
                      💭
                    </span>
                    <span>Pick one feeling</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {emotions.map((emotion) => {
                      const isSelected = emotion.id === selectedEmotionId
                      return (
                        <button
                          key={emotion.id}
                          type="button"
                          onClick={() => setSelectedEmotionId(emotion.id)}
                          className={`flex flex-col items-center gap-1 rounded-3xl border px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                            isSelected
                              ? 'border-accent bg-accentMuted/60 shadow-soft'
                              : 'border-slate-700 bg-slate-900/60 hover:bg-slate-900'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span className="text-2xl" aria-hidden="true">
                            {emotion.icon}
                          </span>
                          <span className="text-sm font-medium text-slate-50">{emotion.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="chip" aria-label="Check your body tension">
                    <span role="img" aria-hidden="true">
                      🧘
                    </span>
                    <span>Any tight spots?</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tensionAreas.map((area) => {
                      const isSelected = selectedTensionIds.includes(area.id)
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => toggleTension(area.id)}
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs sm:text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                            isSelected
                              ? 'border-accent bg-accentMuted/60 shadow-soft text-slate-50'
                              : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <span>{area.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                    Noticing is already practice. You don&apos;t have to change anything; we just listen.
                  </p>
                  <button
                    type="button"
                    className="button-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={!selectedEmotionId}
                    onClick={handleContinueFromCheckin}
                  >
                    {buddy ? `${buddy.name} says: Next` : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'reframe' && (
          <section className="section-shell" aria-label="Practice mindset">
            <div className="section-body">
              <div className="flex flex-col gap-2">
                <h2 className="section-title">Tiny mindset shift</h2>
                <p className="section-subtitle">
                  {buddy
                    ? `${buddy.name} says: Sometimes our thoughts feel heavy. Let’s try a lighter one.`
                    : 'Sometimes our thoughts feel heavy. Let’s try a lighter one.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="card-surface border border-dashed border-slate-700 px-4 py-3 rounded-3xl flex flex-col gap-2 bg-slate-950/30">
                  <p className="text-xs uppercase tracking-wide text-slate-400">A common thought</p>
                  <p className="text-sm md:text-base text-slate-300">{reframe.header}</p>
                </div>
                <div className="card-surface px-4 py-3 rounded-3xl flex flex-col gap-2 bg-gradient-to-br from-accentMuted/70 to-slate-900/90 border border-accent/60">
                  <p className="text-xs uppercase tracking-wide text-slate-200 flex items-center gap-1">
                    <span role="img" aria-hidden="true">
                      🌱
                    </span>
                    <span>A new thought to try</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-50 font-medium">{reframe.positive}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                  You don&apos;t have to believe it all the way. Just trying a new thought is enough.
                </p>
                <button
                  type="button"
                  className="button-primary"
                  onClick={startPracticeMenu}
                >
                  Start my practice adventure
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'practice' && currentActivity && (
          <section className="section-shell" aria-label="Practice menu">
            <div className="section-body">
              <div className="flex flex-col gap-2">
                <h2 className="section-title">Practice adventure</h2>
                <p className="section-subtitle">
                  {buddy
                    ? `${buddy.name} says: We picked a few tiny practice games. Let’s try them one at a time.`
                    : 'We picked a few tiny practice games. Let’s try them one at a time.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_minmax(0,1fr)] gap-4 md:gap-6">
                <div className="flex flex-col gap-3">
                  <div className="card-surface px-4 py-4 rounded-3xl flex flex-col gap-3 border border-slate-700/80">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl">
                          <span aria-hidden="true">{currentActivity.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-base md:text-lg font-semibold text-slate-50">
                            {currentActivity.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            Step {currentActivityIndex + 1} of {sessionActivities.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs uppercase tracking-wide text-slate-400">Timer</span>
                        <p className="text-lg font-mono text-slate-50">
                          {formatTime(activityTimeLeft ?? currentActivity.durationMinutes * 60)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200 leading-snug">
                      {currentActivity.helperText}
                    </p>

                    <div className="flex items-center justify-between gap-3 mt-2">
                      <button
                        type="button"
                        className="button-primary flex-1"
                        onClick={handleStartTimer}
                      >
                        {timerRunning ? 'Timer running…' : 'Start this step'}
                      </button>
                      <p className="text-[11px] sm:text-xs text-slate-400 max-w-[9rem] text-right">
                        When the timer ends, we&apos;ll check how it felt.
                      </p>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-slate-900/90 overflow-hidden">
                      <div
                        className="h-full bg-accentSoft transition-all duration-500"
                        style={{
                          width: `${
                            activityTimeLeft == null
                              ? 0
                              : (activityTimeLeft / (currentActivity.durationMinutes * 60)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {showReflection && (
                    <div className="card-surface px-4 py-3 rounded-3xl border border-slate-700/80 flex flex-col gap-3" aria-label="How did this feel?">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-slate-50">How did that feel?</p>
                          <p className="text-xs text-slate-400">
                            There&apos;s no wrong answer. We&apos;re just noticing.
                          </p>
                        </div>
                        {buddy && (
                          <p className="text-[11px] text-slate-400 text-right">
                            {buddy.name} says: Thanks for checking in.
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {reflectionOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleReflection(opt.id)}
                            className="flex-1 min-w-[5rem] inline-flex flex-col items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-center hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                            aria-label={opt.aria}
                          >
                            <span className="text-xl" aria-hidden="true">
                              {opt.icon}
                            </span>
                            <span className="text-xs font-medium text-slate-50">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <aside className="card-surface px-4 py-4 rounded-3xl border border-slate-800/80 flex flex-col gap-3 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Today&apos;s steps</p>
                  <ol className="space-y-2">
                    {sessionActivities.map((act, idx) => {
                      const isCurrent = idx === currentActivityIndex
                      return (
                        <li
                          key={act.id}
                          className={`flex items-center justify-between gap-2 rounded-2xl px-3 py-2 ${
                            isCurrent
                              ? 'bg-slate-900/80 border border-accent/60'
                              : 'bg-slate-900/40 border border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-6">{idx + 1}.</span>
                            <span className="text-base" aria-hidden="true">
                              {act.icon}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-100">{act.title}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] text-slate-400">{act.durationMinutes} min</span>
                            <span className="text-[11px] text-slate-300">
                              {activityReflectionLabel(act.id)}
                            </span>
                          </div>
                        </li>
                      )
                    })}
                  </ol>

                  <div className="mt-2 rounded-2xl bg-slate-900/60 border border-slate-800 px-3 py-3 flex gap-3 items-start">
                    <div className="h-8 w-8 rounded-2xl bg-slate-950 flex items-center justify-center text-lg">
                      <span aria-hidden="true">🌍</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-slate-300">
                      <p className="font-medium text-slate-100">You&apos;re not alone</p>
                      <p>
                        Other kids are practicing violin somewhere in the world right now. You&apos;re on the
                        same path.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Today&apos;s practice adventures: ★ {7 + (Object.keys(activityReflections).length || 0)}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        )}

        {step === 'summary' && (
          <section className="section-shell" aria-label="Practice summary">
            <div className="section-body">
              <div className="flex flex-col gap-2">
                <h2 className="section-title">Today&apos;s practice story</h2>
                <p className="section-subtitle">
                  {buddy
                    ? `${buddy.name} says: Thanks for playing today. Let’s see what you did.`
                    : 'Thanks for playing today. Let’s see what you did.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_minmax(0,1fr)] gap-4 md:gap-6">
                <div className="card-surface px-4 py-4 rounded-3xl border border-slate-700/80 flex flex-col gap-3">
                  <p className="text-sm font-medium text-slate-50 mb-1">Steps you tried</p>
                  <ol className="space-y-2">
                    {sessionActivities.map((act, idx) => (
                      <li
                        key={act.id}
                        className="flex items-center justify-between gap-2 rounded-2xl bg-slate-900/60 border border-slate-800 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-6">{idx + 1}.</span>
                          <span className="text-base" aria-hidden="true">
                            {act.icon}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-100">{act.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-300">
                          {activityReflectionLabel(act.id)}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-3 rounded-2xl bg-slate-900/70 border border-slate-800 px-3 py-3 flex gap-3 items-start">
                    <div className="h-9 w-9 rounded-2xl bg-slate-950 flex items-center justify-center text-xl">
                      <span aria-hidden="true">💡</span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-200">
                      <p className="font-medium text-slate-50">How today felt</p>
                      <p className="text-xs sm:text-sm text-slate-200">{deriveOverallMood()}</p>
                    </div>
                  </div>
                </div>

                <aside className="card-surface px-4 py-4 rounded-3xl border border-slate-800/80 flex flex-col gap-3 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-wide text-slate-400">You&apos;re part of a crowd</p>
                  <p>
                    Other violin players around the world are practicing pieces, bow holds, and tiny steps just
                    like you. Even when you can&apos;t see them, you&aposre in good company.
                  </p>
                  <p className="text-xs text-slate-400">
                    Coming soon: a short music track you can listen to while you rest after practicing.
                  </p>

                  {buddy && (
                    <div className="mt-2 rounded-2xl bg-slate-900/70 border border-slate-800 px-3 py-3 flex gap-3 items-start">
                      <div className="h-9 w-9 rounded-2xl bg-slate-950 flex items-center justify-center text-xl">
                        <span aria-hidden="true">{buddy.icon}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-200">
                        <p className="font-medium text-slate-50">{buddy.name} says:</p>
                        <p>
                          Thank you for practicing today. Every tiny bit grows your music. We can try again
                          another day.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      className="button-primary w-full"
                      onClick={() => {
                        setStep('buddy')
                        setSelectedBuddyId(null)
                        setSelectedEmotionId(null)
                        setSelectedTensionIds([])
                        setSessionActivities([])
                        setCurrentActivityIndex(0)
                        setActivityTimeLeft(null)
                        setTimerRunning(false)
                        setActivityReflections({})
                        setShowReflection(false)
                      }}
                    >
                      Start a new practice adventure
                    </button>
                    <button
                      type="button"
                      className="button-ghost w-full"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Scroll to the top
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
function formatTime(seconds) {
  if (seconds == null) return '00:00'
  const s = Math.max(0, seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export default App
