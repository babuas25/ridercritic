'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Mic, MicOff, GitCompare, Calculator, CreditCard, Users, ArrowRight, ArrowLeft, Loader2, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getAllBrands } from '@/lib/brands-types'
import { Brand } from '@/lib/brands-types'
import { cn } from '@/lib/utils'

type SpeechRecognitionAlternativeLike = { transcript: string; confidence?: number }
type SpeechRecognitionResultLike = { length: number; [index: number]: SpeechRecognitionAlternativeLike }
type SpeechRecognitionResultListLike = { length: number; [index: number]: SpeechRecognitionResultLike }
interface ISpeechRecognitionEvent extends Event { results: SpeechRecognitionResultListLike }
interface ISpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: ((ev: Event) => void) | null
  start: () => void
  stop: () => void
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => ISpeechRecognition
    SpeechRecognition?: new () => ISpeechRecognition
  }
}

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [suggestions, setSuggestions] = useState<Array<{id:string;title:string;subtitle?:string;image?:string;href:string;type:'motorcycle'|'brand'|'review'}>>([])
  const [showSuggest, setShowSuggest] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const containerRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/motorcycle?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/motorcycle')
    }
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getAllBrands()
        setBrands(brandsData)
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoadingBrands(false)
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }
    setLoadingSuggest(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json()
        setSuggestions(data.suggestions || [])
        setShowSuggest(true)
        setActiveIndex(-1)
      } catch {
        setSuggestions([])
      } finally {
        setLoadingSuggest(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setShowSuggest(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const scrollBrands = (direction: 'left' | 'right') => {
    const container = document.getElementById('brands-scroll-container')
    if (container) {
      const scrollAmount = 300
      const currentScroll = container.scrollLeft
      const newPosition = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleBrandsScroll = () => {
    const container = document.getElementById('brands-scroll-container')
    if (container) {
      const scrollLeft = container.scrollLeft
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth
      
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = document.getElementById('brands-scroll-container')
    if (container && brands.length > 0) {
      // Check scroll state after a brief delay to ensure container is rendered
      setTimeout(() => {
        handleBrandsScroll()
      }, 100)
    }
  }, [brands])

  return (
    <div className="flex flex-col items-center justify-start px-4 pt-8 pb-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo/Title Section */}
        <div className="text-center space-y-2">
          <h1 className={cn("text-4xl md:text-5xl font-nordique font-bold tracking-tight")}>
            <span className="text-foreground">rider</span>
            <span className="text-red-600">critic</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Search motorcycles, reviews, and more
          </p>
        </div>

        {/* Google-style Search Bar */}
        <form onSubmit={handleSearch} className="w-full" ref={containerRef}>
          <div className="relative group">
            <div
              className={cn(
                "flex items-center w-full rounded-full border border-input",
                "bg-background shadow-sm hover:shadow-md transition-shadow duration-200",
                "focus-within:shadow-lg focus-within:border-ring",
                "px-4 py-3 md:px-6 md:py-4"
              )}
            >
              <Search className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground mr-3 md:mr-4 flex-shrink-0" />
              <Input
                ref={inputRef}
                type="text"
                id="home-search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length && setShowSuggest(true)}
                onKeyDown={(e) => {
                  if (!showSuggest) return
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActiveIndex((i) => Math.max(i - 1, 0))
                  } else if (e.key === 'Enter' && activeIndex >= 0) {
                    e.preventDefault()
                    const item = suggestions[activeIndex]
                    router.push(item.href)
                    setShowSuggest(false)
                  } else if (e.key === 'Escape') {
                    setShowSuggest(false)
                  }
                }}
                placeholder="Search motorcycles..."
                className={cn(
                  "flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                  "text-base md:text-lg placeholder:text-muted-foreground",
                  "px-0"
                )}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className={cn("ml-2 md:ml-4 p-2 rounded-full transition-colors", listening ? 'bg-muted text-foreground' : 'hover:bg-muted')}
                aria-label="Voice search"
                title="Voice search"
                onClick={() => {
                  setVoiceError(null)
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                  if (!SpeechRecognition) {
                    setVoiceError('Voice search not supported in this browser')
                    return
                  }
                  if (!recognitionRef.current) {
                    recognitionRef.current = new SpeechRecognition()
                    recognitionRef.current.lang = 'en-US'
                    recognitionRef.current.continuous = false
                    recognitionRef.current.interimResults = false
                    recognitionRef.current.onresult = (event: ISpeechRecognitionEvent) => {
                      const transcript = event.results?.[0]?.[0]?.transcript
                      if (transcript) {
                        setSearchQuery(transcript)
                        setShowSuggest(true)
                        inputRef.current?.focus()
                      }
                    }
                    recognitionRef.current.onstart = () => {
                      setListening(true)
                      setVoiceOpen(true)
                      setIsMuted(false)
                    }
                    recognitionRef.current.onend = () => {
                      setListening(false)
                      setVoiceOpen(false)
                    }
                    recognitionRef.current.onerror = (ev: Event) => {
                      const err = (ev as unknown as { error?: string }).error
                      if (err === 'not-allowed') setVoiceError('Microphone permission blocked')
                      else if (err === 'no-speech') setVoiceError('No speech detected')
                      else if (err === 'audio-capture') setVoiceError('Microphone not found')
                      else setVoiceError('Voice search error')
                      setListening(false)
                      setVoiceOpen(false)
                    }
                  }
                  if (!listening) {
                    // Optimistically show the listening UI immediately
                    setVoiceOpen(true)
                    setListening(true)
                    setIsMuted(false)
                    const startRecognition = async () => {
                      try {
                        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                          stream.getTracks().forEach(t => t.stop())
                        }
                        recognitionRef.current?.start()
                      } catch {
                        setVoiceError('Microphone permission denied')
                        setListening(false)
                        setVoiceOpen(false)
                        setIsMuted(false)
                      }
                    }
                    void startRecognition()
                  } else {
                    recognitionRef.current.stop()
                    setListening(false)
                    setVoiceOpen(false)
                    setIsMuted(false)
                  }
                }}
              >
                {listening ? (
                  <MicOff className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Mic className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                )}
              </button>
            </div>

            {showSuggest && (suggestions.length > 0 || loadingSuggest) && (
              <div className="absolute z-50 left-0 right-0 mt-2 rounded-xl border bg-popover text-popover-foreground shadow-xl overflow-hidden">
                {loadingSuggest && (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                  </div>
                )}
                {!loadingSuggest && suggestions.map((s, idx) => (
                  <button
                    type="button"
                    key={s.href}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      router.push(s.href)
                      setShowSuggest(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 hover:bg-accent transition-colors text-left",
                      idx === activeIndex && 'bg-accent'
                    )}
                  >
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt={s.title} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">{s.type}</div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{s.title}</div>
                      {s.subtitle ? (
                        <div className="text-xs text-muted-foreground truncate">{s.subtitle}</div>
                      ) : null}
                    </div>
                    <div className={cn("text-[10px] px-2 py-1 rounded-full border", s.type === 'motorcycle' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900' : s.type === 'brand' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900' : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900')}>{s.type}</div>
                  </button>
                ))}
              </div>
            )}
            {voiceError && (
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                {voiceError}
              </div>
            )}
          </div>

          {/* Voice listening modal */}
          <Dialog open={voiceOpen} onOpenChange={(open) => {
            setVoiceOpen(open)
            if (!open && listening) {
              recognitionRef.current?.stop()
              setListening(false)
              setIsMuted(false)
            }
          }}>
            <DialogContent className="sm:max-w-[720px] border-0 bg-black text-white p-0 overflow-hidden" aria-describedby="voice-desc">
              <DialogTitle className="sr-only">Voice Search</DialogTitle>
              <DialogDescription id="voice-desc" className="sr-only">Speak your query. Use pause to mute, and the red button to stop.</DialogDescription>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: saying indicator */}
                <div className="relative p-8 flex flex-col gap-6">
                  <div className="text-sm opacity-70">Saying</div>
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-10 rounded-full bg-white/15" />
                    <span className="h-7 w-10 rounded-full bg-white/15" />
                    <span className="h-7 w-10 rounded-full bg-white/15" />
                    <span className="h-7 w-10 rounded-full bg-white/15" />
                  </div>
                  <div className="mt-auto text-xs opacity-60">You can change this later</div>
                </div>

                {/* Right: listening bubble + controls */}
                <div className="relative p-8 flex flex-col items-center justify-center bg-black/95">
                  <div className="relative w-44 h-44">
                    <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                    <div className="absolute inset-6 rounded-full bg-white/10 animate-[pulse_2s_ease-in-out_infinite]" />
                    <div className="absolute inset-12 rounded-full bg-white/10 animate-[pulse_3s_ease-in-out_infinite]" />
                  </div>
                  <div className="mt-6 text-sm opacity-80">{isMuted ? 'Muted' : 'Listening'}</div>

                  <div className="mt-8 flex items-center gap-6">
                    {/* Mute/Unmute toggle */}
                    <button
                      type="button"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                      onClick={() => {
                        if (isMuted) {
                          setIsMuted(false)
                          const restart = async () => {
                            try {
                              recognitionRef.current?.start()
                            } catch {
                              /* noop */
                            }
                          }
                          void restart()
                        } else {
                          recognitionRef.current?.stop()
                          setIsMuted(true)
                          setListening(false)
                        }
                      }}
                    >
                      {isMuted ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </button>

                    {/* Stop */}
                    <button
                      type="button"
                      onClick={() => {
                        recognitionRef.current?.stop()
                        setListening(false)
                        setVoiceOpen(false)
                        setIsMuted(false)
                      }}
                      className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <span className="sr-only">Stop</span>
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M8 8h8v8H8z"/></svg>
                    </button>
                  </div>

                  <div className="mt-3 text-xs opacity-60">Tap to {isMuted ? 'resume' : 'stop'}</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2 rounded-full"
              onClick={() => router.push('/motorcycle')}
            >
              Browse All
            </Button>
          </div>
        </form>

        {/* Toolbox Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add compare functionality
              router.push('/motorcycle?compare=true')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <GitCompare className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">Compare</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add EMI calculator functionality
              router.push('/emi-calculator')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <Calculator className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">EMI Calculator</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add loan available functionality
              router.push('/loan')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <CreditCard className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">Loan Available</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add join community functionality
              router.push('/community')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">Join Community</h3>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Brands Section - Full Width */}
      <div className="w-full mt-8">
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="px-6 py-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Official Brands
                </h2>
              </div>
              <Link href="/brands">
                <Button variant="ghost" className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loadingBrands ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : brands.length > 0 ? (
              <div className="relative">
                {/* Left Arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollBrands('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                )}

                {/* Scrollable Brands Container */}
                <div
                  id="brands-scroll-container"
                  onScroll={handleBrandsScroll}
                  className="flex gap-3 overflow-x-auto scroll-smooth pb-1 px-1 scrollbar-hide"
                >
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${encodeURIComponent(brand.name.toLowerCase())}`}
                      className="flex-shrink-0"
                    >
                      <div className="group p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-900 w-24 md:w-28">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-red-600/10 dark:group-hover:bg-red-500/10 transition-colors overflow-hidden">
                            {brand.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={brand.logoUrl}
                                alt={`${brand.name} logo`}
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <span className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                {brand.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white capitalize group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2">
                            {brand.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollBrands('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No brands available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
