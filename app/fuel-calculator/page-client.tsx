"use client"

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Search } from 'lucide-react'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'
import { trackEvent } from '@/lib/ga4'

type MileageMode = 'manual' | 'motorcycle'

export default function FuelCalculatorPageClient() {
  const [mileageMode, setMileageMode] = useState<MileageMode>('motorcycle')
  const [mileage, setMileage] = useState<string>('')
  const [fuelPrice, setFuelPrice] = useState<string>('')
  const [dailyDistance, setDailyDistance] = useState<string>('')
  const [daysPerMonth, setDaysPerMonth] = useState<string>('')
  const [results, setResults] = useState<{
    dailyFuel: number
    dailyCost: number
    weeklyCost: number
    monthlyCost: number
  } | null>(null)

  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [loadingBikes, setLoadingBikes] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null)
  const [recentBikes, setRecentBikes] = useState<MotorcycleFormData[]>([])

  useEffect(() => {
    if (mileageMode !== 'motorcycle' || motorcycles.length > 0 || loadingBikes) return

    const load = async () => {
      setLoadingBikes(true)
      try {
        const data = await getAllMotorcycles(undefined, 100)
        setMotorcycles(data)
      } catch (err) {
        console.error('Error loading motorcycles for fuel calculator', err)
      } finally {
        setLoadingBikes(false)
      }
    }

    void load()
  }, [mileageMode, motorcycles.length, loadingBikes])

  const filteredBikes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return motorcycles
    return motorcycles.filter((m) => {
      const text = `${m.brand} ${m.modelName} ${m.variantName} ${m.modelYear}`.toLowerCase()
      return text.includes(q)
    })
  }, [motorcycles, searchQuery])

  const handleSelectBike = (bike: MotorcycleFormData) => {
    setSelectedBikeId(bike.id || null)

    const numericMileage = bike.mileage
      ? parseFloat(bike.mileage.replace(/[^0-9.]/g, ''))
      : NaN

    if (!isNaN(numericMileage) && numericMileage > 0) {
      setMileage(numericMileage.toString())
    }

    setRecentBikes((prev) => {
      const existing = prev.filter((b) => b.id !== bike.id)
      return [bike, ...existing].slice(0, 5)
    })

    setSearchOpen(false)
  }

  const handleCalculate = () => {
    const mileageNum = parseFloat(mileage)
    const fuelPriceNum = parseFloat(fuelPrice)
    const dailyDistanceNum = parseFloat(dailyDistance)
    const daysPerMonthNum = parseFloat(daysPerMonth)

    if (
      !isFinite(mileageNum) ||
      !isFinite(fuelPriceNum) ||
      !isFinite(dailyDistanceNum) ||
      !isFinite(daysPerMonthNum) ||
      mileageNum <= 0 ||
      fuelPriceNum <= 0 ||
      dailyDistanceNum <= 0 ||
      daysPerMonthNum <= 0
    ) {
      setResults(null)
      return
    }

    const dailyFuel = dailyDistanceNum / mileageNum
    const dailyCost = dailyFuel * fuelPriceNum
    const weeklyCost = dailyCost * 7
    const monthlyCost = dailyCost * daysPerMonthNum

    setResults({
      dailyFuel,
      dailyCost,
      weeklyCost,
      monthlyCost,
    })

    trackEvent('fuel_calculator_calculated', {
      mileage: mileageNum,
      fuel_price: fuelPriceNum,
      daily_distance: dailyDistanceNum,
      days_per_month: daysPerMonthNum,
      mode: mileageMode,
      has_selected_motorcycle: Boolean(selectedBikeId),
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatLiters = (amount: number) => {
    return `${amount.toFixed(2)} L`
  }

  const isDisabled = !mileage || !fuelPrice || !dailyDistance || !daysPerMonth

  const selectedBike =
    selectedBikeId && motorcycles.find((m) => m.id === selectedBikeId)

  return (
    <div className="container py-8 max-w-2xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fuel Cost Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Estimate your daily, weekly, and monthly fuel expenses based on your
          ride usage.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="mileage">Mileage (km/l)</Label>
                <div className="w-48">
                  <Select
                    value={mileageMode}
                    onValueChange={(value: MileageMode) => {
                      setMileageMode(value)
                      if (value === 'manual') {
                        setSelectedBikeId(null)
                      } else {
                        setSearchOpen(true)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Input mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motorcycle">Select Motorcycle</SelectItem>
                      <SelectItem value="manual">Manual Input</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {mileageMode === 'manual' ? (
                <Input
                  id="mileage"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 45"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              ) : selectedBike ? (
                <div className="flex flex-col gap-2">
                  <Input
                    id="mileage"
                    type="number"
                    step="0.1"
                    value={mileage}
                    readOnly
                    placeholder="Select a motorcycle to auto-fill mileage"
                    className="bg-muted/40"
                  />
                  <div className="flex justify-between items-center gap-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {selectedBike.brand} {selectedBike.modelName} ({selectedBike.modelYear}) – {selectedBike.mileage}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMileageMode('motorcycle')
                        setSearchOpen(true)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel-price">Fuel Price per Liter (BDT)</Label>
              <Input
                id="fuel-price"
                type="number"
                step="0.1"
                placeholder="e.g. 135"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily-distance">Daily Distance (km)</Label>
              <Input
                id="daily-distance"
                type="number"
                step="0.1"
                placeholder="e.g. 30"
                value={dailyDistance}
                onChange={(e) => setDailyDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days-per-month">Days per Month</Label>
              <Input
                id="days-per-month"
                type="number"
                placeholder="e.g. 22"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(e.target.value)}
              />
            </div>
          </div>

          <Card className="mt-4 bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fuel Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {results ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Daily Fuel Consumption
                    </span>
                    <span className="font-semibold">
                      {formatLiters(results.dailyFuel)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Daily Cost
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(results.dailyCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Weekly Cost
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(results.weeklyCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly Cost
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(results.monthlyCost)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your details and tap Calculate to see your fuel usage
                  and costs.
                </p>
              )}
            </CardContent>
          </Card>

          <Button
            className="w-full mt-4 bg-red-600 hover:bg-red-700"
            onClick={handleCalculate}
            disabled={isDisabled}
          >
            Calculate
          </Button>
        </CardContent>
      </Card>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select Motorcycle</DialogTitle>
            <DialogDescription>
              Search for your motorcycle to auto-fill its mileage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search motorcycles..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loadingBikes ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading motorcycles...
              </div>
            ) : (
              <>
                {recentBikes.length > 0 && !searchQuery && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase">
                      Recent searches
                    </div>
                    <div className="flex flex-col gap-1">
                      {recentBikes.map((bike) => (
                        <button
                          key={bike.id}
                          type="button"
                          className="flex justify-between items-center rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => handleSelectBike(bike)}
                        >
                          <div className="text-left">
                            <div className="font-medium">
                              {bike.brand} {bike.modelName} ({bike.modelYear})
                            </div>
                            <div className="text-xs text-gray-500">
                              Mileage: {bike.mileage || 'N/A'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredBikes.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center">
                      No motorcycles found.
                    </div>
                  ) : (
                    filteredBikes.map((bike) => (
                      <button
                        key={bike.id}
                        type="button"
                        className="w-full flex justify-between items-center rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                        onClick={() => handleSelectBike(bike)}
                      >
                        <div>
                          <div className="font-medium">
                            {bike.brand} {bike.modelName} ({bike.modelYear})
                          </div>
                          <div className="text-xs text-gray-500">
                            Mileage: {bike.mileage || 'N/A'}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
