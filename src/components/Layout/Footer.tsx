import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2024 Carnet de Santé. Tous droits réservés.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              Confidentialité
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              Conditions
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer