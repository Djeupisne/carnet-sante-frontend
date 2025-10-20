import React, { createContext, useContext, useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
}

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void
  hideNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const handleShowNotification = (event: CustomEvent) => {
      const { message, type = 'info' } = event.detail
      showNotification(message, type)
    }

    window.addEventListener('showNotification', handleShowNotification as EventListener)

    return () => {
      window.removeEventListener('showNotification', handleShowNotification as EventListener)
    }
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
    }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 5000)
  }

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const value: NotificationContextType = {
    showNotification,
    hideNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Notification Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-sm ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-700'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-700'
                : notification.type === 'warning'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  {notification.type === 'success' && (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'error' && (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{notification.message}</span>
                </div>
              </div>
              <button
                onClick={() => hideNotification(notification.id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}