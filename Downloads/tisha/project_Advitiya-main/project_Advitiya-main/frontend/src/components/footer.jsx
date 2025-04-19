export default function Footer() {
    return (
      <footer className="bg-gray-800 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-white text-lg mb-8 max-w-3xl">
            Saving food, Feeding Lives!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Solutions Column */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Solutions</h3>
              <ul className="space-y-3">
                {['Marketing', 'Analytics', 'Automation', 'Commerce', 'Insights'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white hover:text-gray-900 text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Support Column */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
              <ul className="space-y-3">
                {['Submit ticket', 'Documentation', 'Guides'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white hover:text-gray-900 text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Company Column */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                {['About', 'Blog', 'Jobs', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white hover:text-gray-900 text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Legal Column */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                {['Terms of service', 'Privacy policy', 'License'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white hover:text-gray-900 text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }