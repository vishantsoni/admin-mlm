import Button from '@/components/ui/button/Button'
import React from 'react'

const QuickShortcuts = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button className="w-full h-14" variant="outline">Withdraw</Button>
        <Button className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">Transfer</Button>

        <Button className="w-full h-14" variant="outline">View History</Button>
      </div>
    </div>
  )
}

export default QuickShortcuts
